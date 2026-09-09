import { useState } from "react";
import { Plus, Pencil, Eye, UserCheck, Stethoscope } from "lucide-react";
import toast from "react-hot-toast";
import { useRegistrationsList, useUpdateRegistration } from "../../hooks/useRegistrations";
import { PAYMENT_TYPE_LABELS, REGISTRATION_STATUS_META } from "../../utils/statusMeta";
import { formatDate } from "../../utils/formatters";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import RegistrationFormModal from "./RegistrationFormModal";
import RegistrationDetailModal from "./RegistrationDetailModal";

const LIMIT = 10;

export default function RegistrationsListPage() {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [detailRegistration, setDetailRegistration] = useState(null);

  const { data, isLoading, isError, error } = useRegistrationsList({ date, status, page, limit: LIMIT });
  const updateRegistration = useUpdateRegistration();

  const handleQuickStatus = async (registration, nextStatus) => {
    try {
      await updateRegistration.mutateAsync({
        id: registration.id,
        payload: { status: nextStatus },
      });
      const label = REGISTRATION_STATUS_META[nextStatus]?.label || nextStatus;
      toast.success(`Status pasien diubah menjadi ${label}`);
    } catch (err) {
      toast.error(err.message || "Gagal memperbarui status");
    }
  };

  const openCreate = () => {
    setEditingRegistration(null);
    setFormOpen(true);
  };

  const openEdit = (registration) => {
    setEditingRegistration(registration);
    setFormOpen(true);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">Pendaftaran Pasien</h2>
          <p className="text-sm text-ink-soft">Kelola kunjungan pasien dan buat antrean otomatis.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Daftar Kunjungan Baru
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          id="filter-date"
          type="date"
          value={date}
          onChange={(e) => {
            setPage(1);
            setDate(e.target.value);
          }}
          className="max-w-[180px]"
        />
        <Select
          id="filter-status"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="max-w-[180px]"
        >
          <option value="">Semua status</option>
          {Object.entries(REGISTRATION_STATUS_META).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </Select>
        {(date || status) && (
          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              setDate("");
              setStatus("");
              setPage(1);
            }}
          >
            Reset filter
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-border bg-white">
        {isLoading && <Spinner label="Memuat data registrasi..." />}

        {isError && <EmptyState title="Gagal memuat data" description={error?.message} />}

        {!isLoading && !isError && data?.items?.length === 0 && (
          <EmptyState
            title="Belum ada registrasi"
            description="Belum ada kunjungan yang cocok dengan filter saat ini."
            action={
              <Button size="sm" onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Daftar Kunjungan Baru
              </Button>
            }
          />
        )}

        {!isLoading && !isError && data?.items?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-soft">
                  <th className="px-4 py-3 font-medium">No. Antrean</th>
                  <th className="px-4 py-3 font-medium">Pasien</th>
                  <th className="px-4 py-3 font-medium">Dokter / Poli</th>
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 font-medium">Pembayaran</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((reg) => {
                  const statusMeta = REGISTRATION_STATUS_META[reg.status];
                  return (
                    <tr key={reg.id} className="border-b border-border last:border-0 hover:bg-bg/60">
                      <td className="px-4 py-3 font-mono text-ink">{reg.queue?.queueNumber || "-"}</td>
                      <td className="px-4 py-3 font-medium text-ink">{reg.patient.name}</td>
                      <td className="px-4 py-3 text-ink-soft">
                        {reg.doctor.user.name}
                        <span className="block text-xs">{reg.poli.name}</span>
                      </td>
                      <td className="px-4 py-3 text-ink-soft">{formatDate(reg.visitDate)}</td>
                      <td className="px-4 py-3 text-ink-soft">{PAYMENT_TYPE_LABELS[reg.paymentType]}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                          {reg.status === "MENUNGGU" && (
                            <Button
                              size="xs"
                              variant="secondary"
                              onClick={() => handleQuickStatus(reg, "CHECK_IN")}
                              disabled={updateRegistration.isPending}
                              title="Tandai pasien sudah check-in"
                            >
                              <UserCheck className="h-3 w-3 text-brand" />
                              Check In
                            </Button>
                          )}
                          {reg.status === "CHECK_IN" && (
                            <Button
                              size="xs"
                              variant="secondary"
                              onClick={() => handleQuickStatus(reg, "PEMERIKSAAN")}
                              disabled={updateRegistration.isPending}
                              title="Kirim ke dokter untuk diperiksa"
                            >
                              <Stethoscope className="h-3 w-3 text-brand" />
                              Siap Periksa
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setDetailRegistration(reg)}
                            title="Lihat detail"
                            className="rounded-md p-1.5 text-ink-soft hover:bg-bg hover:text-ink cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEdit(reg)}
                            title="Ubah"
                            className="rounded-md p-1.5 text-ink-soft hover:bg-bg hover:text-brand cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-4 pb-2">
              <Pagination pagination={data.pagination} onPageChange={setPage} />
            </div>
          </div>
        )}
      </div>

      <RegistrationFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        registration={editingRegistration}
      />

      <RegistrationDetailModal
        open={Boolean(detailRegistration)}
        onClose={() => setDetailRegistration(null)}
        registration={detailRegistration}
      />
    </div>
  );
}
