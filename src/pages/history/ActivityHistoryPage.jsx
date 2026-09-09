import { useState } from "react";
import { Eye, Search, Stethoscope, UserCheck, Calendar } from "lucide-react";
import { useMedicalRecordsList } from "../../hooks/useMedicalRecords";
import { usePoliList } from "../../hooks/usePoli";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/roles";
import { formatDate } from "../../utils/formatters";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import ActivityRecordDetailModal from "./ActivityRecordDetailModal";

const LIMIT = 10;

export default function ActivityHistoryPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === ROLES.DOKTER;

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 350);
  const [date, setDate] = useState("");
  const [poliId, setPoliId] = useState("");
  const [page, setPage] = useState(1);

  const [selectedRecord, setSelectedRecord] = useState(null);

  const { data: poliList } = usePoliList();
  const { data, isLoading, isError, error } = useMedicalRecordsList({
    search: debouncedSearch,
    date,
    poliId: isDoctor ? undefined : poliId,
    page,
    limit: LIMIT,
  });

  const resetFilter = () => {
    setSearchInput("");
    setDate("");
    setPoliId("");
    setPage(1);
  };

  const hasFilter = Boolean(searchInput || date || poliId);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-ink">Riwayat Aktivitas Pasien</h2>
            {isDoctor && (
              <span className="inline-flex items-center rounded-md border border-brand/30 bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand-dark">
                Pasien Saya
              </span>
            )}
          </div>
          <p className="text-sm text-ink-soft">
            {isDoctor
              ? "Menampilkan catatan rekam medis dari seluruh pasien yang Anda periksa."
              : "Daftar riwayat kunjungan, pemeriksaan medis, dan tindakan seluruh pasien di klinik."}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <Input
            id="history-search"
            placeholder="Cari pasien, No. RM, diagnosa..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Input
          id="history-date"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setPage(1);
          }}
          className="max-w-[170px]"
        />

        {!isDoctor && (
          <Select
            id="history-poli"
            value={poliId}
            onChange={(e) => {
              setPoliId(e.target.value);
              setPage(1);
            }}
            className="max-w-[180px]"
          >
            <option value="">Semua Poli</option>
            {poliList?.map((poli) => (
              <option key={poli.id} value={poli.id}>
                {poli.name}
              </option>
            ))}
          </Select>
        )}

        {hasFilter && (
          <Button variant="ghost" size="md" onClick={resetFilter}>
            Reset filter
          </Button>
        )}
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-border bg-white shadow-xs">
        {isLoading && <Spinner label="Memuat riwayat aktivitas..." />}

        {isError && <EmptyState title="Gagal memuat data" description={error?.message} />}

        {!isLoading && !isError && data?.items?.length === 0 && (
          <EmptyState
            title="Belum ada riwayat aktivitas"
            description={
              hasFilter
                ? "Tidak ada data riwayat yang cocok dengan filter yang Anda masukkan."
                : isDoctor
                ? "Belum ada pasien yang selesai Anda periksa. Pasien yang telah selesai diperiksa akan tercatat di sini."
                : "Belum ada riwayat kunjungan pasien yang selesai diperiksa."
            }
          />
        )}

        {!isLoading && !isError && data?.items?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-soft">
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 font-medium">Pasien</th>
                  <th className="px-4 py-3 font-medium">Poli / Dokter</th>
                  <th className="px-4 py-3 font-medium">Keluhan & Diagnosa</th>
                  <th className="px-4 py-3 font-medium">Tanda Vital</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((record) => (
                  <tr key={record.id} className="border-b border-border last:border-0 hover:bg-bg/60">
                    <td className="px-4 py-3 text-ink">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-ink-soft" />
                        <span className="font-medium text-xs">
                          {formatDate(record.createdAt || record.registration?.visitDate)}
                        </span>
                      </div>
                      {record.registration?.queue?.queueNumber && (
                        <span className="font-mono text-[11px] text-ink-soft block mt-0.5">
                          Antrean: {record.registration.queue.queueNumber}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 font-medium text-ink">
                      <div className="font-semibold">{record.patient.name}</div>
                      <span className="text-xs font-mono text-ink-soft">{record.patient.noRm}</span>
                    </td>

                    <td className="px-4 py-3 text-ink-soft">
                      <div className="text-xs font-medium text-ink">
                        {record.doctor?.user?.name || "-"}
                      </div>
                      <span className="text-xs text-ink-soft">
                        {record.doctor?.poli?.name || record.registration?.poli?.name || "-"}
                      </span>
                    </td>

                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-xs text-ink line-clamp-1 font-medium">
                        {record.diagnosis || "-"}
                      </p>
                      <p className="text-[11px] text-ink-soft line-clamp-1">
                        {record.subjective || record.registration?.chiefComplaint || "-"}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-xs text-ink-soft">
                      <span className="font-mono text-ink">
                        {record.bloodPressure || "-"} mmHg
                      </span>
                      <span className="block text-[11px]">{record.temperature ? `${record.temperature}°C` : "-"}</span>
                    </td>

                    <td className="px-4 py-3">
                      <Badge tone="neutral">Selesai</Badge>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => setSelectedRecord(record)}
                        title="Lihat rekam medis lengkap"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Detail
                      </Button>
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

      {/* Modal Detail Rekam Medis */}
      <ActivityRecordDetailModal
        open={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
      />
    </div>
  );
}
