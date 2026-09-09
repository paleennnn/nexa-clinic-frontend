import { useState } from "react";
import { Plus, Pencil, UserX } from "lucide-react";
import toast from "react-hot-toast";
import { useDoctorsList, useDeactivateDoctor } from "../../hooks/useDoctors";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import DoctorFormModal from "./DoctorFormModal";

export default function DoctorTab() {
  const { data, isLoading, isError, error } = useDoctorsList();
  const deactivateDoctor = useDeactivateDoctor();

  const [formOpen, setFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [deactivatingDoctor, setDeactivatingDoctor] = useState(null);

  const openCreate = () => {
    setEditingDoctor(null);
    setFormOpen(true);
  };

  const openEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormOpen(true);
  };

  const confirmDeactivate = async () => {
    try {
      await deactivateDoctor.mutateAsync(deactivatingDoctor.id);
      toast.success("Dokter berhasil dinonaktifkan");
      setDeactivatingDoctor(null);
    } catch (err) {
      toast.error(err.message || "Gagal menonaktifkan dokter");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft">Daftar dokter beserta poli tempat praktik.</p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tambah Dokter
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-white">
        {isLoading && <Spinner label="Memuat data dokter..." />}

        {isError && (
          <EmptyState title="Gagal memuat data" description={error?.message} />
        )}

        {!isLoading && !isError && data?.length === 0 && (
          <EmptyState
            title="Belum ada dokter"
            description="Tambahkan dokter pertama supaya bisa dipilih saat pendaftaran pasien."
            action={
              <Button size="sm" onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Tambah Dokter
              </Button>
            }
          />
        )}

        {!isLoading && !isError && data?.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Poli</th>
                <th className="px-4 py-3 font-medium">Spesialisasi</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((doctor) => (
                <tr key={doctor.id} className="border-b border-border last:border-0 hover:bg-bg/60">
                  <td className="px-4 py-3 font-medium text-ink">{doctor.user.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{doctor.user.email}</td>
                  <td className="px-4 py-3">
                    <Badge tone="brand">{doctor.poli.name}</Badge>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{doctor.specialization || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(doctor)}
                        title="Ubah"
                        className="rounded-md p-1.5 text-ink-soft hover:bg-bg hover:text-brand cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeactivatingDoctor(doctor)}
                        title="Nonaktifkan"
                        className="rounded-md p-1.5 text-ink-soft hover:bg-rust-soft hover:text-rust cursor-pointer"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <DoctorFormModal open={formOpen} onClose={() => setFormOpen(false)} doctor={editingDoctor} />

      <ConfirmDialog
        open={Boolean(deactivatingDoctor)}
        onClose={() => setDeactivatingDoctor(null)}
        onConfirm={confirmDeactivate}
        loading={deactivateDoctor.isPending}
        title="Nonaktifkan Dokter"
        description={`Akun "${deactivatingDoctor?.user.name}" akan dinonaktifkan dan tidak bisa login lagi. Riwayat kunjungan/rekam medis yang sudah ada tetap tersimpan.`}
        confirmLabel="Ya, Nonaktifkan"
      />
    </div>
  );
}
