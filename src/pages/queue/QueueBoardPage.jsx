import { useEffect, useState } from "react";
import { PhoneCall, Play, CheckCheck, SkipForward } from "lucide-react";
import toast from "react-hot-toast";
import { useQueuesList, useCallQueue, useUpdateQueueStatus } from "../../hooks/useQueues";
import { usePoliList } from "../../hooks/usePoli";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/roles";
import { QUEUE_STATUS_META } from "../../utils/statusMeta";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

const todayInputValue = () => new Date().toISOString().slice(0, 10);

export default function QueueBoardPage() {
  const { user } = useAuth();
  const { data: poliList } = usePoliList();

  const [date, setDate] = useState(todayInputValue());
  const [poliId, setPoliId] = useState("");

  // A doctor only cares about their own poli — default the filter to it once
  // their profile loads, but leave it changeable in case they need to check another.
  useEffect(() => {
    if (user?.role === ROLES.DOKTER && user.doctor?.poliId && !poliId) {
      setPoliId(user.doctor.poliId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const { data: queues, isLoading, isError, error, isFetching } = useQueuesList({ date, poliId });
  const callQueue = useCallQueue();
  const updateStatus = useUpdateQueueStatus();

  const handleCall = async (queue) => {
    try {
      await callQueue.mutateAsync(queue.id);
      toast.success(`Antrean ${queue.queueNumber} dipanggil`);
    } catch (err) {
      toast.error(err.message || "Gagal memanggil antrean");
    }
  };

  const handleStatus = async (queue, status) => {
    try {
      await updateStatus.mutateAsync({ id: queue.id, status });
    } catch (err) {
      toast.error(err.message || "Gagal memperbarui status antrean");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">Antrean</h2>
          <p className="text-sm text-ink-soft">
            Diperbarui otomatis tiap beberapa detik.{" "}
            {isFetching && <span className="text-brand">Menyegarkan...</span>}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          id="queue-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="max-w-[180px]"
        />
        <Select
          id="queue-poli"
          value={poliId}
          onChange={(e) => setPoliId(e.target.value)}
          className="max-w-[200px]"
        >
          <option value="">Semua poli</option>
          {poliList?.map((poli) => (
            <option key={poli.id} value={poli.id}>
              {poli.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-white">
        {isLoading && <Spinner label="Memuat antrean..." />}

        {isError && <EmptyState title="Gagal memuat antrean" description={error?.message} />}

        {!isLoading && !isError && queues?.length === 0 && (
          <EmptyState
            title="Belum ada antrean"
            description="Antrean akan muncul otomatis setelah ada pendaftaran pasien baru untuk tanggal ini."
          />
        )}

        {!isLoading && !isError && queues?.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-3 font-medium">No.</th>
                <th className="px-4 py-3 font-medium">Pasien</th>
                <th className="px-4 py-3 font-medium">Dokter / Poli</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {queues.map((queue) => {
                const meta = QUEUE_STATUS_META[queue.status];
                const reg = queue.registration;
                return (
                  <tr key={queue.id} className="border-b border-border last:border-0 hover:bg-bg/60">
                    <td className="px-4 py-3 font-mono text-base font-semibold text-ink">
                      {queue.queueNumber}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{reg.patient.name}</td>
                    <td className="px-4 py-3 text-ink-soft">
                      {reg.doctor.user.name}
                      <span className="block text-xs">{reg.poli.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {queue.status === "WAITING" && (
                          <Button size="sm" variant="secondary" onClick={() => handleCall(queue)} loading={callQueue.isPending}>
                            <PhoneCall className="h-3.5 w-3.5" />
                            Panggil
                          </Button>
                        )}
                        {queue.status === "CALLED" && (
                          <>
                            <Button size="sm" variant="secondary" onClick={() => handleStatus(queue, "IN_PROGRESS")}>
                              <Play className="h-3.5 w-3.5" />
                              Mulai Periksa
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleStatus(queue, "SKIPPED")}>
                              <SkipForward className="h-3.5 w-3.5" />
                              Lewati
                            </Button>
                          </>
                        )}
                        {queue.status === "IN_PROGRESS" && (
                          <Button size="sm" variant="secondary" onClick={() => handleStatus(queue, "DONE")}>
                            <CheckCheck className="h-3.5 w-3.5" />
                            Selesai
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
