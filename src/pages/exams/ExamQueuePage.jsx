import { useMemo, useState } from "react";
import { Stethoscope } from "lucide-react";
import { useRegistrationsList } from "../../hooks/useRegistrations";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../utils/formatters";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ExamFormModal from "./ExamFormModal";

export default function ExamQueuePage() {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useRegistrationsList({ status: "PEMERIKSAAN", page: 1, limit: 100 });
  const [examining, setExamining] = useState(null);

  const myQueue = useMemo(
    () => (data?.items || []).filter((reg) => reg.doctorId === user?.doctor?.id),
    [data, user]
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-base font-semibold text-ink">Antrean Pemeriksaan</h2>
        <p className="text-sm text-ink-soft">
          Pasien yang sudah ditandai siap diperiksa oleh Petugas Pendaftaran.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white">
        {isLoading && <Spinner label="Memuat antrean pemeriksaan..." />}

        {isError && <EmptyState title="Gagal memuat data" description={error?.message} />}

        {!isLoading && !isError && myQueue.length === 0 && (
          <EmptyState
            title="Belum ada pasien untuk diperiksa"
            description='Registrasi akan muncul di sini setelah Petugas Pendaftaran mengubah statusnya menjadi "Pemeriksaan".'
          />
        )}

        {!isLoading && !isError && myQueue.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-3 font-medium">No. Antrean</th>
                <th className="px-4 py-3 font-medium">Pasien</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Keluhan Awal</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {myQueue.map((reg) => (
                <tr key={reg.id} className="border-b border-border last:border-0 hover:bg-bg/60">
                  <td className="px-4 py-3 font-mono text-ink">{reg.queue?.queueNumber || "-"}</td>
                  <td className="px-4 py-3 font-medium text-ink">{reg.patient.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{formatDate(reg.visitDate)}</td>
                  <td className="px-4 py-3 text-ink-soft">{reg.chiefComplaint}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" onClick={() => setExamining(reg)}>
                      <Stethoscope className="h-3.5 w-3.5" />
                      Periksa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ExamFormModal open={Boolean(examining)} onClose={() => setExamining(null)} registration={examining} />
    </div>
  );
}
