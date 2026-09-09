import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { useCreatePatient, useUpdatePatient } from "../../hooks/usePatients";
import { toDateInputValue } from "../../utils/formatters";

// Mirrors backend src/validators/patient.validator.js exactly so the user
// sees the same validation client-side before it ever reaches the API.
const patientSchema = z.object({
  nik: z
    .string()
    .regex(/^\d{16}$/, "NIK harus berupa 16 digit angka"),
  name: z.string().min(1, "Nama wajib diisi"),
  gender: z.enum(["L", "P"], { error: "Pilih jenis kelamin" }),
  birthDate: z.string().min(1, "Tanggal lahir wajib diisi"),
  phone: z
    .string()
    .min(6, "Nomor telepon tidak valid")
    .max(20, "Nomor telepon tidak valid"),
  address: z.string().min(1, "Alamat wajib diisi"),
});

const emptyValues = { nik: "", name: "", gender: "", birthDate: "", phone: "", address: "" };

export default function PatientFormModal({ open, onClose, patient }) {
  const isEdit = Boolean(patient);
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const saving = createPatient.isPending || updatePatient.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(patientSchema), defaultValues: emptyValues });

  // Re-seed the form whenever a different patient is opened for edit,
  // and clear it when switching to "add new".
  useEffect(() => {
    if (open) {
      reset(
        patient
          ? { ...patient, birthDate: toDateInputValue(patient.birthDate) }
          : emptyValues
      );
    }
  }, [open, patient, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updatePatient.mutateAsync({ id: patient.id, payload: values });
        toast.success("Data pasien berhasil diperbarui");
      } else {
        await createPatient.mutateAsync(values);
        toast.success("Pasien berhasil ditambahkan");
      }
      onClose();
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan data pasien");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Ubah Data Pasien" : "Tambah Pasien"}
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
          id="nik"
          label="NIK"
          placeholder="16 digit angka"
          inputMode="numeric"
          maxLength={16}
          error={errors.nik?.message}
          {...register("nik")}
        />
        <Input
          id="name"
          label="Nama Pasien"
          placeholder="Nama lengkap"
          error={errors.name?.message}
          {...register("name")}
        />
        <Select id="gender" label="Jenis Kelamin" error={errors.gender?.message} {...register("gender")}>
          <option value="">Pilih jenis kelamin</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </Select>
        <Input
          id="birthDate"
          type="date"
          label="Tanggal Lahir"
          error={errors.birthDate?.message}
          {...register("birthDate")}
        />
        <Input
          id="phone"
          label="Nomor Telepon"
          placeholder="08xxxxxxxxxx"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <div className="col-span-2">
          <Input
            id="address"
            label="Alamat"
            placeholder="Alamat lengkap"
            error={errors.address?.message}
            {...register("address")}
          />
        </div>
      </form>
    </Modal>
  );
}
