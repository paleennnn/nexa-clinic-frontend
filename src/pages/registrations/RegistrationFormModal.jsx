import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Combobox from "../../components/ui/Combobox";
import Button from "../../components/ui/Button";
import { usePatientsList } from "../../hooks/usePatients";
import { usePoliList } from "../../hooks/usePoli";
import { useDoctorsList } from "../../hooks/useDoctors";
import { useCreateRegistration, useUpdateRegistration } from "../../hooks/useRegistrations";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/roles";
import {
  PAYMENT_TYPE_LABELS,
  REGISTRATION_STATUS_META,
  REGISTRATION_STATUS_ORDER,
} from "../../utils/statusMeta";
import { toDateInputValue } from "../../utils/formatters";

// Mirrors backend src/validators/registration.validator.js
const baseFields = {
  doctorId: z.string().min(1, "Pilih dokter"),
  poliId: z.string().min(1, "Pilih poli"),
  visitDate: z.string().min(1, "Tanggal kunjungan wajib diisi"),
  paymentType: z.enum(["UMUM", "BPJS", "ASURANSI"], { error: "Pilih jenis pembayaran" }),
  chiefComplaint: z.string().min(1, "Keluhan awal wajib diisi"),
};

const createSchema = z.object({
  patientId: z.string().min(1, "Pilih pasien"),
  ...baseFields,
});

const updateSchema = z.object({
  ...baseFields,
  status: z.enum(["MENUNGGU", "CHECK_IN", "PEMERIKSAAN", "SELESAI"]).optional(),
});

const todayInputValue = () => new Date().toISOString().slice(0, 10);

const emptyValues = {
  patientId: "",
  doctorId: "",
  poliId: "",
  visitDate: todayInputValue(),
  paymentType: "",
  chiefComplaint: "",
};

export default function RegistrationFormModal({ open, onClose, registration }) {
  const isEdit = Boolean(registration);
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;

  const { data: poliList } = usePoliList();
  const { data: doctorsList } = useDoctorsList();
  const createRegistration = useCreateRegistration();
  const updateRegistration = useUpdateRegistration();
  const saving = createRegistration.isPending || updateRegistration.isPending;

  // Patient combobox: server-side search, only relevant when creating (patient is locked on edit).
  const [patientQuery, setPatientQuery] = useState("");
  const debouncedPatientQuery = useDebouncedValue(patientQuery, 300);
  const { data: patientResults, isFetching: patientsLoading } = usePatientsList({
    search: debouncedPatientQuery,
    page: 1,
    limit: 10,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? updateSchema : createSchema),
    defaultValues: emptyValues,
  });

  const selectedPoliId = watch("poliId");
  const doctorsInPoli = useMemo(
    () => (doctorsList || []).filter((d) => d.poliId === selectedPoliId),
    [doctorsList, selectedPoliId]
  );

  useEffect(() => {
    if (!open) return;
    if (registration) {
      reset({
        doctorId: registration.doctorId,
        poliId: registration.poliId,
        visitDate: toDateInputValue(registration.visitDate),
        paymentType: registration.paymentType,
        chiefComplaint: registration.chiefComplaint,
        status: registration.status,
      });
      setPatientQuery("");
    } else {
      reset(emptyValues);
      setPatientQuery("");
    }
  }, [open, registration, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        // patientId is intentionally excluded — backend doesn't accept changing it after creation.
        const { patientId: _omit, ...payload } = values;
        await updateRegistration.mutateAsync({ id: registration.id, payload });
        toast.success("Registrasi berhasil diperbarui");
      } else {
        await createRegistration.mutateAsync(values);
        toast.success("Registrasi berhasil dibuat, antrean otomatis dibuat");
      }
      onClose();
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan registrasi");
    }
  };

  // Non-admin can't move status backward — grey out earlier options rather than
  // letting them pick it and then bounce off a 400 from the backend.
  const currentStatusIdx = registration ? REGISTRATION_STATUS_ORDER.indexOf(registration.status) : -1;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Ubah Registrasi" : "Pendaftaran Pasien Baru"}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Batal
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={saving}>
            Simpan
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        {isEdit ? (
          <div className="col-span-2">
            <p className="text-xs text-ink-soft">Pasien</p>
            <p className="text-sm font-medium text-ink">
              {registration.patient.name} · {registration.patient.noRm}
            </p>
          </div>
        ) : (
          <div className="col-span-2">
            <Controller
              name="patientId"
              control={control}
              render={({ field }) => (
                <Combobox
                  id="registration-patient"
                  label="Pasien"
                  placeholder="Cari nama, NIK, atau No. RM"
                  query={patientQuery}
                  onQueryChange={setPatientQuery}
                  loading={patientsLoading}
                  options={(patientResults?.items || []).map((p) => ({
                    id: p.id,
                    label: p.name,
                    sublabel: `${p.noRm} · ${p.nik}`,
                  }))}
                  onSelect={(option) => {
                    field.onChange(option.id);
                    setPatientQuery(option.label);
                  }}
                  error={errors.patientId?.message}
                />
              )}
            />
          </div>
        )}

        <Select id="registration-poli" label="Poli" error={errors.poliId?.message} {...register("poliId")}>
          <option value="">Pilih poli</option>
          {poliList?.map((poli) => (
            <option key={poli.id} value={poli.id}>
              {poli.name}
            </option>
          ))}
        </Select>

        <Select
          id="registration-doctor"
          label="Dokter"
          disabled={!selectedPoliId}
          error={errors.doctorId?.message}
          {...register("doctorId")}
        >
          <option value="">{selectedPoliId ? "Pilih dokter" : "Pilih poli dulu"}</option>
          {doctorsInPoli.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.user.name}
            </option>
          ))}
        </Select>

        <Input
          id="registration-visit-date"
          type="date"
          label="Tanggal Kunjungan"
          error={errors.visitDate?.message}
          {...register("visitDate")}
        />

        <Select
          id="registration-payment"
          label="Jenis Pembayaran"
          error={errors.paymentType?.message}
          {...register("paymentType")}
        >
          <option value="">Pilih jenis pembayaran</option>
          {Object.entries(PAYMENT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        {isEdit && (
          <Select id="registration-status" label="Status" error={errors.status?.message} {...register("status")}>
            {REGISTRATION_STATUS_ORDER.map((status, idx) => (
              <option key={status} value={status} disabled={!isAdmin && idx < currentStatusIdx}>
                {REGISTRATION_STATUS_META[status].label}
              </option>
            ))}
          </Select>
        )}

        <div className="col-span-2 flex flex-col gap-1.5">
          <label htmlFor="registration-complaint" className="text-sm font-medium text-ink">
            Keluhan Awal
          </label>
          <textarea
            id="registration-complaint"
            rows={3}
            placeholder="Keluhan yang disampaikan pasien saat mendaftar"
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-1"
            {...register("chiefComplaint")}
          />
          {errors.chiefComplaint?.message && (
            <p className="text-xs text-rust">{errors.chiefComplaint.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
