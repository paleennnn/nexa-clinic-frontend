// Mirrors backend enums in prisma/schema.prisma — keep in sync.

export const PAYMENT_TYPE_LABELS = {
  UMUM: "Umum",
  BPJS: "BPJS",
  ASURANSI: "Asuransi",
};

// Order matters: used to enforce "status can't move backward" in the UI,
// mirroring STATUS_ORDER in backend registration.service.js.
export const REGISTRATION_STATUS_ORDER = ["MENUNGGU", "CHECK_IN", "PEMERIKSAAN", "SELESAI"];

export const REGISTRATION_STATUS_META = {
  MENUNGGU: { label: "Menunggu", tone: "amber" },
  CHECK_IN: { label: "Check In", tone: "brand" },
  PEMERIKSAAN: { label: "Pemeriksaan", tone: "brand" },
  SELESAI: { label: "Selesai", tone: "neutral" },
};

export const QUEUE_STATUS_META = {
  WAITING: { label: "Menunggu", tone: "amber" },
  CALLED: { label: "Dipanggil", tone: "brand" },
  IN_PROGRESS: { label: "Diperiksa", tone: "brand" },
  DONE: { label: "Selesai", tone: "neutral" },
  SKIPPED: { label: "Dilewati", tone: "rust" },
};
