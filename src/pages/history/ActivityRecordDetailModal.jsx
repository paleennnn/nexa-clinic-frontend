import { Stethoscope, Pill, Activity, User, Calendar, FileText } from "lucide-react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { formatDate } from "../../utils/formatters";
import { PAYMENT_TYPE_LABELS } from "../../utils/statusMeta";

export default function ActivityRecordDetailModal({ open, onClose, record }) {
  if (!record) return null;

  const { patient, doctor, registration, actions = [], prescription } = record;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Detail Rekam Medis — ${patient?.name || ""}`}
      size="xl"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Tutup
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Info Header Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-border bg-bg/50 p-4">
          <div>
            <span className="flex items-center gap-1.5 text-xs text-ink-soft">
              <User className="h-3.5 w-3.5" /> Pasien
            </span>
            <p className="mt-0.5 text-sm font-semibold text-ink">{patient?.name}</p>
            <p className="text-xs font-mono text-ink-soft">{patient?.noRm}</p>
          </div>

          <div>
            <span className="flex items-center gap-1.5 text-xs text-ink-soft">
              <Calendar className="h-3.5 w-3.5" /> Tanggal Periksa
            </span>
            <p className="mt-0.5 text-sm font-semibold text-ink">
              {formatDate(record.createdAt || registration?.visitDate)}
            </p>
            <p className="text-xs text-ink-soft">Antrean: {registration?.queue?.queueNumber || "-"}</p>
          </div>

          <div>
            <span className="flex items-center gap-1.5 text-xs text-ink-soft">
              <Stethoscope className="h-3.5 w-3.5" /> Dokter Pemeriksa
            </span>
            <p className="mt-0.5 text-sm font-semibold text-ink">{doctor?.user?.name || "-"}</p>
            <p className="text-xs text-ink-soft">{doctor?.poli?.name || registration?.poli?.name || "-"}</p>
          </div>

          <div>
            <span className="flex items-center gap-1.5 text-xs text-ink-soft">
              <FileText className="h-3.5 w-3.5" /> Pembayaran
            </span>
            <p className="mt-0.5 text-sm font-semibold text-ink">
              {PAYMENT_TYPE_LABELS[registration?.paymentType] || "-"}
            </p>
            <Badge tone="neutral" className="mt-1">
              Selesai Diperiksa
            </Badge>
          </div>
        </div>

        {/* Tanda-tanda Vital */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink">
              Tanda-Tanda Vital (Objective)
            </h4>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="rounded-lg border border-border bg-white p-3 text-center">
              <p className="text-xs text-ink-soft">Tekanan Darah</p>
              <p className="mt-1 text-base font-semibold text-ink">{record.bloodPressure || "-"} mmHg</p>
            </div>
            <div className="rounded-lg border border-border bg-white p-3 text-center">
              <p className="text-xs text-ink-soft">Suhu Tubuh</p>
              <p className="mt-1 text-base font-semibold text-ink">{record.temperature ? `${record.temperature} °C` : "-"}</p>
            </div>
            <div className="rounded-lg border border-border bg-white p-3 text-center">
              <p className="text-xs text-ink-soft">Berat Badan</p>
              <p className="mt-1 text-base font-semibold text-ink">{record.weight ? `${record.weight} kg` : "-"}</p>
            </div>
            <div className="rounded-lg border border-border bg-white p-3 text-center">
              <p className="text-xs text-ink-soft">Tinggi Badan</p>
              <p className="mt-1 text-base font-semibold text-ink">{record.height ? `${record.height} cm` : "-"}</p>
            </div>
          </div>
        </div>

        {/* Catatan SOAP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
              Keluhan Pasien (Subjective)
            </p>
            <p className="text-sm text-ink">{record.subjective || registration?.chiefComplaint || "-"}</p>
          </div>

          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
              Diagnosa Medis (Assessment)
            </p>
            <p className="text-sm font-medium text-ink">{record.diagnosis || "-"}</p>
          </div>

          <div className="col-span-1 md:col-span-2 rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
              Rencana Terapi / Edukasi (Plan)
            </p>
            <p className="text-sm text-ink">{record.therapyPlan || "-"}</p>
          </div>
        </div>

        {/* Tindakan Medis */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink mb-2">
            Tindakan Medis ({actions.length})
          </h4>
          {actions.length === 0 ? (
            <p className="text-xs text-ink-soft italic">Tidak ada tindakan khusus yang dicatat.</p>
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border bg-white">
              {actions.map((act) => (
                <div key={act.id} className="flex items-center justify-between p-3 text-sm">
                  <span className="font-medium text-ink">{act.actionName}</span>
                  {act.notes && <span className="text-xs text-ink-soft">{act.notes}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resep Obat */}
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <Pill className="h-4 w-4 text-brand" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink">
              Resep Obat ({prescription?.items?.length || 0})
            </h4>
          </div>
          {!prescription || !prescription.items || prescription.items.length === 0 ? (
            <p className="text-xs text-ink-soft italic">Tidak ada resep obat pada kunjungan ini.</p>
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border bg-white">
              {prescription.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 text-sm">
                  <div>
                    <p className="font-medium text-ink">{item.medicineName}</p>
                    {item.instructions && (
                      <p className="text-xs text-ink-soft">{item.instructions}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-md bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand-dark">
                      {item.dosage}
                    </span>
                    <p className="text-xs text-ink-soft mt-0.5">{item.quantity} unit</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
