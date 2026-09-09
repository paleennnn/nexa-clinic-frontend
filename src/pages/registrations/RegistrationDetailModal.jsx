import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { formatDate } from "../../utils/formatters";
import { PAYMENT_TYPE_LABELS, REGISTRATION_STATUS_META, QUEUE_STATUS_META } from "../../utils/statusMeta";

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="text-sm font-medium text-ink">{value || "-"}</p>
    </div>
  );
}

export default function RegistrationDetailModal({ open, onClose, registration }) {
  if (!registration) return null;
  const statusMeta = REGISTRATION_STATUS_META[registration.status];
  const queueMeta = registration.queue ? QUEUE_STATUS_META[registration.queue.status] : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Detail Registrasi"
      footer={<Button variant="secondary" onClick={onClose}>Tutup</Button>}
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="Pasien" value={`${registration.patient.name} (${registration.patient.noRm})`} />
        <Field label="No. Antrean" value={registration.queue?.queueNumber} />
        <Field label="Dokter" value={registration.doctor.user.name} />
        <Field label="Poli" value={registration.poli.name} />
        <Field label="Tanggal Kunjungan" value={formatDate(registration.visitDate)} />
        <Field label="Jenis Pembayaran" value={PAYMENT_TYPE_LABELS[registration.paymentType]} />
        <div>
          <p className="text-xs text-ink-soft">Status Registrasi</p>
          <Badge tone={statusMeta.tone} className="mt-0.5">{statusMeta.label}</Badge>
        </div>
        {queueMeta && (
          <div>
            <p className="text-xs text-ink-soft">Status Antrean</p>
            <Badge tone={queueMeta.tone} className="mt-0.5">{queueMeta.label}</Badge>
          </div>
        )}
        <div className="col-span-2">
          <Field label="Keluhan Awal" value={registration.chiefComplaint} />
        </div>
      </div>
    </Modal>
  );
}
