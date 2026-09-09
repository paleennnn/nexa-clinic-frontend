import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { usePoliList, useDeletePoli } from "../../hooks/usePoli";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import PoliFormModal from "./PoliFormModal";

export default function PoliTab() {
  const { data, isLoading, isError, error } = usePoliList();
  const deletePoli = useDeletePoli();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPoli, setEditingPoli] = useState(null);
  const [deletingPoli, setDeletingPoli] = useState(null);

  const openCreate = () => {
    setEditingPoli(null);
    setFormOpen(true);
  };

  const openEdit = (poli) => {
    setEditingPoli(poli);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePoli.mutateAsync(deletingPoli.id);
      toast.success("Poli berhasil dihapus");
      setDeletingPoli(null);
    } catch (err) {
      // e.g. 409 kalau masih ada dokter/registrasi yang terkait — pesan sudah jelas dari backend
      toast.error(err.message || "Gagal menghapus poli");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft">Daftar poli yang tersedia di klinik.</p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tambah Poli
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-white">
        {isLoading && <Spinner label="Memuat data poli..." />}

        {isError && (
          <EmptyState title="Gagal memuat data" description={error?.message} />
        )}

        {!isLoading && !isError && data?.length === 0 && (
          <EmptyState
            title="Belum ada poli"
            description="Tambahkan poli pertama supaya bisa dipakai saat menambah dokter."
            action={
              <Button size="sm" onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Tambah Poli
              </Button>
            }
          />
        )}

        {!isLoading && !isError && data?.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-3 font-medium">Nama Poli</th>
                <th className="px-4 py-3 font-medium">Kode</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((poli) => (
                <tr key={poli.id} className="border-b border-border last:border-0 hover:bg-bg/60">
                  <td className="px-4 py-3 font-medium text-ink">{poli.name}</td>
                  <td className="px-4 py-3 font-mono text-ink-soft">{poli.code}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(poli)}
                        title="Ubah"
                        className="rounded-md p-1.5 text-ink-soft hover:bg-bg hover:text-brand cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingPoli(poli)}
                        title="Hapus"
                        className="rounded-md p-1.5 text-ink-soft hover:bg-rust-soft hover:text-rust cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <PoliFormModal open={formOpen} onClose={() => setFormOpen(false)} poli={editingPoli} />

      <ConfirmDialog
        open={Boolean(deletingPoli)}
        onClose={() => setDeletingPoli(null)}
        onConfirm={confirmDelete}
        loading={deletePoli.isPending}
        title="Hapus Poli"
        description={`Yakin ingin menghapus poli "${deletingPoli?.name}"? Poli dengan dokter atau registrasi terkait tidak bisa dihapus.`}
        confirmLabel="Ya, Hapus"
      />
    </div>
  );
}
