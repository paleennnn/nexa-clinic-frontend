import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { usePatientsList, useDeletePatient } from "../../hooks/usePatients";
import { GENDER_LABELS, formatDate } from "../../utils/formatters";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import PatientFormModal from "./PatientFormModal";
import PatientDetailModal from "./PatientDetailModal";

const LIMIT = 10;

export default function PatientsListPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [detailPatient, setDetailPatient] = useState(null);
  const [deletingPatient, setDeletingPatient] = useState(null);

  const { data, isLoading, isError, error } = usePatientsList({ search, page, limit: LIMIT });
  const deletePatient = useDeletePatient();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const openCreate = () => {
    setEditingPatient(null);
    setFormOpen(true);
  };

  const openEdit = (patient) => {
    setEditingPatient(patient);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePatient.mutateAsync(deletingPatient.id);
      toast.success("Pasien berhasil dihapus");
      setDeletingPatient(null);
    } catch (err) {
      toast.error(err.message || "Gagal menghapus pasien");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">Data Pasien</h2>
          <p className="text-sm text-ink-soft">Kelola data induk pasien klinik.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tambah Pasien
        </Button>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex max-w-sm gap-2">
        <Input
          id="search"
          placeholder="Cari nama, NIK, atau No. RM"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button type="submit" variant="secondary">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <div className="rounded-xl border border-border bg-white">
        {isLoading && <Spinner label="Memuat data pasien..." />}

        {isError && (
          <EmptyState
            title="Gagal memuat data"
            description={error?.message || "Terjadi kesalahan saat mengambil data pasien."}
          />
        )}

        {!isLoading && !isError && data?.items?.length === 0 && (
          <EmptyState
            title={search ? "Tidak ada hasil" : "Belum ada data pasien"}
            description={
              search
                ? `Tidak ditemukan pasien yang cocok dengan "${search}".`
                : "Mulai dengan menambahkan pasien pertama."
            }
            action={
              !search && (
                <Button onClick={openCreate} size="sm">
                  <Plus className="h-4 w-4" />
                  Tambah Pasien
                </Button>
              )
            }
          />
        )}

        {!isLoading && !isError && data?.items?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-soft">
                  <th className="px-4 py-3 font-medium">No. RM</th>
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">NIK</th>
                  <th className="px-4 py-3 font-medium">Jenis Kelamin</th>
                  <th className="px-4 py-3 font-medium">Tanggal Lahir</th>
                  <th className="px-4 py-3 font-medium">Telepon</th>
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((patient) => (
                  <tr key={patient.id} className="border-b border-border last:border-0 hover:bg-bg/60">
                    <td className="px-4 py-3 font-mono text-ink">{patient.noRm}</td>
                    <td className="px-4 py-3 font-medium text-ink">{patient.name}</td>
                    <td className="px-4 py-3 font-mono text-ink-soft">{patient.nik}</td>
                    <td className="px-4 py-3 text-ink-soft">{GENDER_LABELS[patient.gender]}</td>
                    <td className="px-4 py-3 text-ink-soft">{formatDate(patient.birthDate)}</td>
                    <td className="px-4 py-3 text-ink-soft">{patient.phone}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setDetailPatient(patient)}
                          title="Lihat detail"
                          className="rounded-md p-1.5 text-ink-soft hover:bg-bg hover:text-ink cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEdit(patient)}
                          title="Ubah data"
                          className="rounded-md p-1.5 text-ink-soft hover:bg-bg hover:text-brand cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingPatient(patient)}
                          title="Hapus data"
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
            <div className="px-4 pb-2">
              <Pagination pagination={data.pagination} onPageChange={setPage} />
            </div>
          </div>
        )}
      </div>

      <PatientFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        patient={editingPatient}
      />

      <PatientDetailModal
        open={Boolean(detailPatient)}
        onClose={() => setDetailPatient(null)}
        patient={detailPatient}
      />

      <ConfirmDialog
        open={Boolean(deletingPatient)}
        onClose={() => setDeletingPatient(null)}
        onConfirm={confirmDelete}
        loading={deletePatient.isPending}
        title="Hapus Data Pasien"
        description={`Yakin ingin menghapus data pasien "${deletingPatient?.name}"? Riwayat kunjungan yang sudah ada tetap tersimpan.`}
        confirmLabel="Ya, Hapus"
      />
    </div>
  );
}
