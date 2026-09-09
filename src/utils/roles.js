// Mirrors backend `enum Role` in prisma/schema.prisma exactly — keep in sync.
export const ROLES = {
  ADMIN: "ADMIN",
  DOKTER: "DOKTER",
  PETUGAS_PENDAFTARAN: "PETUGAS_PENDAFTARAN",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrator",
  [ROLES.DOKTER]: "Dokter",
  [ROLES.PETUGAS_PENDAFTARAN]: "Petugas Pendaftaran",
};

export const getDefaultPathForRole = () => {
  return "/dashboard";
};
