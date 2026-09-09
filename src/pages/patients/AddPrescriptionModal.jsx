import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useCreatePrescription } from "../../hooks/usePrescriptions";

const itemSchema = z.object({
  medicineName: z.string().min(1, "Nama obat wajib diisi"),
  dosage: z.string().min(1, "Dosis wajib diisi"),
  quantity: z.coerce.number().int().positive("Jumlah harus lebih dari 0"),
  instructions: z.string().optional(),
});

const schema = z.object({
  items: z.array(itemSchema).min(1, "Minimal 1 item resep"),
});

const emptyValues = { items: [{ medicineName: "", dosage: "", quantity: "", instructions: "" }] };

export default function AddPrescriptionModal({ open, onClose, medicalRecordId }) {
  const createPrescription = useCreatePrescription();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: emptyValues });
  const itemsArray = useFieldArray({ control, name: "items" });

  useEffect(() => {
    if (open) reset(emptyValues);
  }, [open, reset]);

  const onSubmit = async (values) => {
    try {
      await createPrescription.mutateAsync({ medicalRecordId, items: values.items });
      toast.success("Resep berhasil ditambahkan");
      onClose();
    } catch (err) {
      toast.error(err.message || "Gagal menambahkan resep");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tambah Resep"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={createPrescription.isPending}>
            Batal
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={createPrescription.isPending}>
            Simpan Resep
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {itemsArray.fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[2fr_1.2fr_1fr_2fr_auto] gap-3 rounded-lg border border-border p-3">
            <Input
              label="Nama Obat"
              error={errors.items?.[index]?.medicineName?.message}
              {...register(`items.${index}.medicineName`)}
            />
            <Input
              label="Dosis"
              placeholder="3x1"
              error={errors.items?.[index]?.dosage?.message}
              {...register(`items.${index}.dosage`)}
            />
            <Input
              type="number"
              label="Jumlah"
              error={errors.items?.[index]?.quantity?.message}
              {...register(`items.${index}.quantity`)}
            />
            <Input label="Instruksi (opsional)" {...register(`items.${index}.instructions`)} />
            <button
              type="button"
              onClick={() => itemsArray.remove(index)}
              disabled={itemsArray.fields.length === 1}
              className="mt-6 h-fit rounded-md p-2 text-ink-soft hover:bg-rust-soft hover:text-rust disabled:opacity-30 cursor-pointer"
              title="Hapus item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="self-start"
          onClick={() => itemsArray.append({ medicineName: "", dosage: "", quantity: "", instructions: "" })}
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Item
        </Button>
      </form>
    </Modal>
  );
}
