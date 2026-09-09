import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useCreatePoli, useUpdatePoli } from "../../hooks/usePoli";

// Mirrors backend src/validators/poli.validator.js
const poliSchema = z.object({
  name: z.string().min(1, "Nama poli wajib diisi"),
  code: z.string().min(1, "Kode poli wajib diisi").max(20, "Kode poli maksimal 20 karakter"),
});

const emptyValues = { name: "", code: "" };

export default function PoliFormModal({ open, onClose, poli }) {
  const isEdit = Boolean(poli);
  const createPoli = useCreatePoli();
  const updatePoli = useUpdatePoli();
  const saving = createPoli.isPending || updatePoli.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(poliSchema), defaultValues: emptyValues });

  useEffect(() => {
    if (open) reset(poli ? { name: poli.name, code: poli.code } : emptyValues);
  }, [open, poli, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updatePoli.mutateAsync({ id: poli.id, payload: values });
        toast.success("Poli berhasil diperbarui");
      } else {
        await createPoli.mutateAsync(values);
        toast.success("Poli berhasil ditambahkan");
      }
      onClose();
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan data poli");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Ubah Poli" : "Tambah Poli"}
      size="sm"
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="poli-name"
          label="Nama Poli"
          placeholder="Poli Umum"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          id="poli-code"
          label="Kode Poli"
          placeholder="UMUM"
          error={errors.code?.message}
          {...register("code")}
        />
      </form>
    </Modal>
  );
}
