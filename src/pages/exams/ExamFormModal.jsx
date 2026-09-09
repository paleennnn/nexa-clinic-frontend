import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useCreateMedicalRecord } from "../../hooks/useMedicalRecords";

const actionSchema = z.object({
  actionName: z.string().min(1, "Nama tindakan wajib diisi"),
  notes: z.string().optional(),
});

const prescriptionItemSchema = z.object({
  medicineName: z.string().min(1, "Nama obat wajib diisi"),
  dosage: z.string().min(1, "Dosis wajib diisi"),
  quantity: z.coerce.number().int().positive("Jumlah harus lebih dari 0"),
  instructions: z.string().optional(),
});

const examSchema = z.object({
  subjective: z.string().min(1, "Keluhan pasien wajib diisi"),
  bloodPressure: z.string().min(1, "Tekanan darah wajib diisi"),
  temperature: z.coerce.number().positive("Suhu tubuh tidak valid"),
  weight: z.coerce.number().positive("Berat badan tidak valid"),
  height: z.coerce.number().positive("Tinggi badan tidak valid"),
  diagnosis: z.string().min(1, "Diagnosa wajib diisi"),
  therapyPlan: z.string().min(1, "Rencana terapi wajib diisi"),
  actions: z.array(actionSchema),
  prescriptionItems: z.array(prescriptionItemSchema),
});

const emptyValues = {
  subjective: "",
  bloodPressure: "",
  temperature: "",
  weight: "",
  height: "",
  diagnosis: "",
  therapyPlan: "",
  actions: [],
  prescriptionItems: [],
};

export default function ExamFormModal({ open, onClose, registration }) {
  const createMedicalRecord = useCreateMedicalRecord();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(examSchema), defaultValues: emptyValues });

  const actionsArray = useFieldArray({ control, name: "actions" });
  const itemsArray = useFieldArray({ control, name: "prescriptionItems" });

  useEffect(() => {
    if (open) reset(emptyValues);
  }, [open, registration, reset]);

  const onSubmit = async (values) => {
    try {
      await createMedicalRecord.mutateAsync({ registrationId: registration.id, ...values });
      toast.success("Pemeriksaan berhasil disimpan");
      onClose();
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan pemeriksaan");
    }
  };

  if (!registration) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Pemeriksaan — ${registration.patient.name}`}
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={createMedicalRecord.isPending}>
            Batal
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={createMedicalRecord.isPending}>
            Simpan Pemeriksaan
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-ink">Subjective</h3>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="exam-subjective" className="text-sm font-medium text-ink">
              Keluhan Pasien
            </label>
            <textarea
              id="exam-subjective"
              rows={2}
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-1"
              {...register("subjective")}
            />
            {errors.subjective?.message && <p className="text-xs text-rust">{errors.subjective.message}</p>}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-ink">Objective</h3>
          <div className="grid grid-cols-4 gap-4">
            <Input
              id="exam-bp"
              label="Tekanan Darah"
              placeholder="120/80"
              error={errors.bloodPressure?.message}
              {...register("bloodPressure")}
            />
            <Input
              id="exam-temp"
              type="number"
              step="0.1"
              label="Suhu Tubuh (°C)"
              error={errors.temperature?.message}
              {...register("temperature")}
            />
            <Input
              id="exam-weight"
              type="number"
              step="0.1"
              label="Berat Badan (kg)"
              error={errors.weight?.message}
              {...register("weight")}
            />
            <Input
              id="exam-height"
              type="number"
              step="0.1"
              label="Tinggi Badan (cm)"
              error={errors.height?.message}
              {...register("height")}
            />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-ink">Assessment</h3>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="exam-diagnosis" className="text-sm font-medium text-ink">
              Diagnosa
            </label>
            <textarea
              id="exam-diagnosis"
              rows={2}
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-1"
              {...register("diagnosis")}
            />
            {errors.diagnosis?.message && <p className="text-xs text-rust">{errors.diagnosis.message}</p>}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-ink">Plan</h3>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="exam-therapy" className="text-sm font-medium text-ink">
              Rencana Terapi
            </label>
            <textarea
              id="exam-therapy"
              rows={2}
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-1"
              {...register("therapyPlan")}
            />
            {errors.therapyPlan?.message && <p className="text-xs text-rust">{errors.therapyPlan.message}</p>}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Tindakan Medis (opsional)</h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => actionsArray.append({ actionName: "", notes: "" })}
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Tindakan
            </Button>
          </div>
          {actionsArray.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[2fr_2fr_auto] gap-3 rounded-lg border border-border p-3">
              <Input
                label="Nama Tindakan"
                error={errors.actions?.[index]?.actionName?.message}
                {...register(`actions.${index}.actionName`)}
              />
              <Input label="Catatan (opsional)" {...register(`actions.${index}.notes`)} />
              <button
                type="button"
                onClick={() => actionsArray.remove(index)}
                className="mt-6 h-fit rounded-md p-2 text-ink-soft hover:bg-rust-soft hover:text-rust cursor-pointer"
                title="Hapus tindakan"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Resep Obat (opsional)</h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => itemsArray.append({ medicineName: "", dosage: "", quantity: "", instructions: "" })}
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Obat
            </Button>
          </div>
          {itemsArray.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[2fr_1.2fr_1fr_2fr_auto] gap-3 rounded-lg border border-border p-3">
              <Input
                label="Nama Obat"
                error={errors.prescriptionItems?.[index]?.medicineName?.message}
                {...register(`prescriptionItems.${index}.medicineName`)}
              />
              <Input
                label="Dosis"
                placeholder="3x1"
                error={errors.prescriptionItems?.[index]?.dosage?.message}
                {...register(`prescriptionItems.${index}.dosage`)}
              />
              <Input
                type="number"
                label="Jumlah"
                error={errors.prescriptionItems?.[index]?.quantity?.message}
                {...register(`prescriptionItems.${index}.quantity`)}
              />
              <Input label="Instruksi (opsional)" {...register(`prescriptionItems.${index}.instructions`)} />
              <button
                type="button"
                onClick={() => itemsArray.remove(index)}
                className="mt-6 h-fit rounded-md p-2 text-ink-soft hover:bg-rust-soft hover:text-rust cursor-pointer"
                title="Hapus obat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </section>
      </form>
    </Modal>
  );
}
