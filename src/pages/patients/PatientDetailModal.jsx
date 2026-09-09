import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { GENDER_LABELS, formatDate } from "../../utils/formatters";

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="text-sm font-medium text-ink">{value || "-"}</p>
    </div>
  );
}

export default function PatientDetailModal({ open, onClose, patient }) {
  if (!patient) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Detail Pasien"
      footer={<Button variant="secondary" onClick={onClose}>Tutup</Button>}
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="No. Rekam Medis" value={<span className="font-mono">{patient.noRm}</span>} />
        <Field label="NIK" value={<span className="font-mono">{patient.nik}</span>} />
        <Field label="Nama Pasien" value={patient.name} />
        <Field label="Jenis Kelamin" value={GENDER_LABELS[patient.gender]} />
        <Field label="Tanggal Lahir" value={formatDate(patient.birthDate)} />
        <Field label="Nomor Telepon" value={patient.phone} />
        <div className="col-span-2">
          <Field label="Alamat" value={patient.address} />
        </div>
      </div>
    </Modal>
  );
}
