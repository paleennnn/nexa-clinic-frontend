import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { usePoliList } from "../../hooks/usePoli";
import { useCreateDoctor, useUpdateDoctor } from "../../hooks/useDoctors";

// Mirrors backend src/validators/doctor.validator.js — create needs email+password
// (it provisions the User account), update does not accept either field.
const createSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  poliId: z.string().min(1, "Pilih poli"),
  sipNumber: z.string().optional(),
  specialization: z.string().optional(),
});

const updateSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  poliId: z.string().min(1, "Pilih poli"),
  sipNumber: z.string().optional(),
  specialization: z.string().optional(),
});

const emptyValues = { name: "", email: "", password: "", poliId: "", sipNumber: "", specialization: "" };

export default function DoctorFormModal({ open, onClose, doctor }) {
  const isEdit = Boolean(doctor);
  const { data: poliList } = usePoliList();
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const saving = createDoctor.isPending || updateDoctor.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? updateSchema : createSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      doctor
        ? {
            name: doctor.user.name,
            email: doctor.user.email,
            password: "",
            poliId: doctor.poliId,
            sipNumber: doctor.sipNumber || "",
            specialization: doctor.specialization || "",
          }
        : emptyValues
    );
  }, [open, doctor, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        const { name, poliId, sipNumber, specialization } = values;
        await updateDoctor.mutateAsync({
          id: doctor.id,
          payload: { name, poliId, sipNumber, specialization },
        });
        toast.success("Data dokter berhasil diperbarui");
      } else {
        await createDoctor.mutateAsync(values);
        toast.success("Dokter berhasil ditambahkan");
      }
      onClose();
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan data dokter");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Ubah Data Dokter" : "Tambah Dokter"}
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
        <Input
          id="doctor-name"
          label="Nama Dokter"
          placeholder="Dr. Nama Lengkap"
          error={errors.name?.message}
          {...register("name")}
        />
        <Select
          id="doctor-poli"
          label="Poli"
          error={errors.poliId?.message}
          {...register("poliId")}
        >
          <option value="">Pilih poli</option>
          {poliList?.map((poli) => (
            <option key={poli.id} value={poli.id}>
              {poli.name}
            </option>
          ))}
        </Select>

        {isEdit ? (
          <div className="col-span-2">
            <Input
              id="doctor-email"
              label="Email"
              value={doctor.user.email}
              disabled
              hint="Email tidak bisa diubah dari sini."
            />
          </div>
        ) : (
          <>
            <Input
              id="doctor-email"
              type="email"
              label="Email"
              placeholder="dokter@clinic.test"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              id="doctor-password"
              type="password"
              label="Password"
              placeholder="Minimal 6 karakter"
              error={errors.password?.message}
              {...register("password")}
            />
          </>
        )}

        <Input
          id="doctor-sip"
          label="Nomor SIP (opsional)"
          placeholder="Nomor Surat Izin Praktik"
          error={errors.sipNumber?.message}
          {...register("sipNumber")}
        />
        <Input
          id="doctor-specialization"
          label="Spesialisasi (opsional)"
          placeholder="Dokter Umum"
          error={errors.specialization?.message}
          {...register("specialization")}
        />
      </form>
    </Modal>
  );
}
