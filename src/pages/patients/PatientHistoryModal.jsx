import { useState } from "react";
import { Pill, Plus } from "lucide-react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { usePatientMedicalHistory } from "../../hooks/useMedicalRecords";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/roles";
import { formatDate } from "../../utils/formatters";
import AddPrescriptionModal from "./AddPrescriptionModal";

export default function PatientHistoryModal({ open, onClose, patient }) {
  const { user } = useAuth();
  const { data: records, isLoading, isError, error } = usePatientMedicalHistory(patient?.id);
  const [addingPrescriptionFor, setAddingPrescriptionFor] = useState(null);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Riwayat Pemeriksaan — ${patient?.name || ""}`}
      size="xl"
      footer={<Button variant="secondary" onClick={onClose}>Tutup</Button>}
    >
      {isLoading && <Spinner label="Memuat riwayat..." />}

      {isError && <EmptyState title="Gagal memuat riwayat" description={error?.message} />}

      {!isLoading && !isError && records?.length === 0 && (
        <EmptyState title="Belum ada riwayat pemeriksaan" description="Pasien ini belum pernah diperiksa." />
      )}

      {!isLoading && !isError && records?.length > 0 && (
        <div className="flex flex-col gap-4">
          {records.map((record) => (
            <div key={record.id} className="rounded-xl border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{formatDate(record.registration.visitDate)}</p>
                  <p className="text-xs text-ink-soft">dr. {record.doctor.user.name}</p>
                </div>
                <Badge tone="brand">
                  {record.bloodPressure} · {record.temperature}°C · {record.weight}kg · {record.height}cm
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-ink-soft">Keluhan (Subjective)</p>
                  <p className="text-ink">{record.subjective}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft">Diagnosa (Assessment)</p>
                  <p className="text-ink">{record.diagnosis}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-ink-soft">Rencana Terapi (Plan)</p>
                  <p className="text-ink">{record.therapyPlan}</p>
                </div>
              </div>

              {record.actions.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-ink-soft">Tindakan Medis</p>
                  <ul className="mt-1 list-inside list-disc text-sm text-ink">
                    {record.actions.map((action) => (
                      <li key={action.id}>
                        {action.actionName}
                        {action.notes && <span className="text-ink-soft"> — {action.notes}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-ink-soft">Resep Obat</p>
                  {!record.prescription && user?.role === ROLES.DOKTER && (
                    <button
                      onClick={() => setAddingPrescriptionFor(record.id)}
                      className="flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-dark cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      Tambah Resep
                    </button>
                  )}
                </div>
                {record.prescription ? (
                  <ul className="mt-1 flex flex-col gap-1 text-sm text-ink">
                    {record.prescription.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-1.5">
                        <Pill className="h-3.5 w-3.5 text-brand" />
                        {item.medicineName} — {item.dosage} × {item.quantity}
                        {item.instructions && <span className="text-ink-soft">({item.instructions})</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-ink-soft">Tidak ada resep untuk kunjungan ini.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddPrescriptionModal
        open={Boolean(addingPrescriptionFor)}
        onClose={() => setAddingPrescriptionFor(null)}
        medicalRecordId={addingPrescriptionFor}
      />
    </Modal>
  );
}
