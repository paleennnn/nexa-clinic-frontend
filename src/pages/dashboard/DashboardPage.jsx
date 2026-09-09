import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserPlus,
  ListOrdered,
  Hourglass,
  CheckCircle2,
  RefreshCw,
  Calendar,
  ArrowRight,
  ClipboardList,
  Stethoscope,
  Radio,
  HeartPulse,
  History,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useDashboardSummary } from "../../hooks/useDashboard";
import { useQueuesList } from "../../hooks/useQueues";
import { usePoliList } from "../../hooks/usePoli";
import { useDoctorsList } from "../../hooks/useDoctors";
import { useAuth } from "../../hooks/useAuth";
import { ROLES, ROLE_LABELS } from "../../utils/roles";
import { QUEUE_STATUS_META } from "../../utils/statusMeta";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

const todayDateStr = () => new Date().toISOString().slice(0, 10);

export default function DashboardPage() {
  const { user } = useAuth();
  const today = todayDateStr();

  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryErr,
    isFetching: summaryFetching,
    refetch: refetchSummary,
  } = useDashboardSummary();

  const { data: queues, isLoading: queuesLoading } = useQueuesList({ date: today });
  const { data: poliList, isLoading: poliLoading } = usePoliList();
  const { data: doctorsList } = useDoctorsList();

  const todayFormatted = useMemo(() => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  }, []);

  const isDoctor = user?.role === ROLES.DOKTER;
  const doctorPoli = useMemo(
    () => (poliList || []).find((p) => p.id === user?.doctor?.poliId),
    [poliList, user]
  );

  // For doctors, filter active queues monitor to their own poli so they only see their patients
  const displayedQueues = useMemo(() => {
    if (!queues) return [];
    if (isDoctor && user?.doctor?.poliId) {
      return queues.filter((q) => q.registration?.poliId === user.doctor.poliId);
    }
    return queues;
  }, [queues, isDoctor, user]);

  // Compute active queues overview (scoped to doctor's poli if doctor is logged in)
  const calledOrInProgressQueue = useMemo(() => {
    return displayedQueues.find((q) => q.status === "CALLED" || q.status === "IN_PROGRESS");
  }, [displayedQueues]);

  // Distribution of queues by poli (clinic-wide overview)
  const queuesByPoli = useMemo(() => {
    if (!queues || !poliList) return [];
    return poliList.map((poli) => {
      const poliQueues = queues.filter((q) => q.registration?.poliId === poli.id);
      const doctorsInPoli = doctorsList?.filter((d) => d.poliId === poli.id) || [];
      return {
        ...poli,
        totalQueue: poliQueues.length,
        waiting: poliQueues.filter((q) => q.status === "WAITING").length,
        inProgress: poliQueues.filter((q) => q.status === "CALLED" || q.status === "IN_PROGRESS").length,
        done: poliQueues.filter((q) => q.status === "DONE").length,
        doctorsCount: doctorsInPoli.length,
      };
    });
  }, [queues, poliList, doctorsList]);

  if (summaryError) {
    return (
      <div className="py-6">
        <EmptyState
          title="Gagal memuat dashboard"
          description={summaryErr?.message || "Tidak dapat mengambil data ringkasan dashboard"}
          action={
            <Button variant="secondary" onClick={() => refetchSummary()}>
              Coba Lagi
            </Button>
          }
        />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Pasien Terdaftar",
      value: summary?.totalPatients,
      icon: Users,
      tone: "brand",
      description: "Seluruh pasien aktif di sistem",
    },
    {
      label: "Pasien Baru Hari Ini",
      value: summary?.newPatientsToday,
      icon: UserPlus,
      tone: "emerald",
      description: "Registrasi pasien baru",
    },
    {
      label: "Total Antrean Hari Ini",
      value: summary?.totalQueuesToday,
      icon: ListOrdered,
      tone: "neutral",
      description: "Kunjungan & nomor antrean",
    },
    {
      label: "Pasien Menunggu",
      value: summary?.waitingToday,
      icon: Hourglass,
      tone: "amber",
      description: "Menunggu dipanggil dokter",
    },
    {
      label: "Selesai Dilayani",
      value: summary?.doneToday,
      icon: CheckCircle2,
      tone: "brand",
      description: "Pemeriksaan medis tuntas",
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Top Welcome & Context Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-r from-white via-white to-brand-soft/20 p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand-dark">
              <Sparkles className="h-3.5 w-3.5" />
              {ROLE_LABELS[user?.role] || user?.role}
            </span>
            <span className="flex items-center gap-1 text-xs text-ink-soft">
              <Calendar className="h-3.5 w-3.5" />
              {todayFormatted}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Selamat datang, {user?.name || "Pengguna"}
          </h1>
          <p className="text-sm text-ink-soft">
            Pantau status operasional dan ringkasan pelayanan klinik hari ini secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetchSummary()}
            loading={summaryFetching}
            className="shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${summaryFetching ? "animate-spin" : ""}`} />
            Segarkan Data
          </Button>
        </div>
      </div>

      {/* 5 Primary Stat Cards */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
            Ringkasan Hari Ini
          </h2>
          {summaryFetching && (
            <span className="text-xs font-medium text-brand animate-pulse">
              Memperbarui data...
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} loading={summaryLoading} />
          ))}
        </div>
      </div>

      {/* Quick Action Shortcuts based on Role */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-soft">
          Pintasan Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(user?.role === ROLES.ADMIN || user?.role === ROLES.PETUGAS_PENDAFTARAN) && (
            <>
              <Link
                to="/registrations"
                className="group flex items-center justify-between rounded-xl border border-border bg-white p-4 transition hover:border-brand/50 hover:bg-brand-soft/10 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand-dark transition group-hover:scale-105">
                    <ClipboardList className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink group-hover:text-brand">
                      Pendaftaran Pasien
                    </p>
                    <p className="text-xs text-ink-soft">Buat kunjungan baru & antrean poli</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-ink-soft transition group-hover:translate-x-1 group-hover:text-brand" />
              </Link>

              <Link
                to="/patients"
                className="group flex items-center justify-between rounded-xl border border-border bg-white p-4 transition hover:border-brand/50 hover:bg-brand-soft/10 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition group-hover:scale-105">
                    <Users className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink group-hover:text-brand">
                      Data Pasien
                    </p>
                    <p className="text-xs text-ink-soft">Kelola data rekam medis dan demografi</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-ink-soft transition group-hover:translate-x-1 group-hover:text-brand" />
              </Link>
            </>
          )}

          {user?.role === ROLES.DOKTER && (
            <>
              <Link
                to="/exams"
                className="group flex items-center justify-between rounded-xl border border-brand/40 bg-brand-soft/20 p-4 transition hover:border-brand hover:bg-brand-soft/30 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white transition group-hover:scale-105">
                    <HeartPulse className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink group-hover:text-brand">
                      Ruang Pemeriksaan
                    </p>
                    <p className="text-xs text-ink-soft">Periksa pasien & buat rekam medis SOAP</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-brand transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/activity-history"
                className="group flex items-center justify-between rounded-xl border border-border bg-white p-4 transition hover:border-brand/50 hover:bg-brand-soft/10 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition group-hover:scale-105">
                    <History className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink group-hover:text-brand">
                      Riwayat Rekam Medis
                    </p>
                    <p className="text-xs text-ink-soft">Histori kunjungan & catatan diagnosa</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-ink-soft transition group-hover:translate-x-1 group-hover:text-brand" />
              </Link>
            </>
          )}

          <Link
            to="/queue"
            className="group flex items-center justify-between rounded-xl border border-border bg-white p-4 transition hover:border-brand/50 hover:bg-brand-soft/10 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-soft text-amber transition group-hover:scale-105">
                <Radio className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink group-hover:text-brand">
                  Papan Antrean Langsung
                </p>
                <p className="text-xs text-ink-soft">Pemanggilan suara & status antrean realtime</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-ink-soft transition group-hover:translate-x-1 group-hover:text-brand" />
          </Link>

          {user?.role === ROLES.ADMIN && (
            <Link
              to="/master-data"
              className="group flex items-center justify-between rounded-xl border border-border bg-white p-4 transition hover:border-brand/50 hover:bg-brand-soft/10 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition group-hover:scale-105">
                  <Stethoscope className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink group-hover:text-brand">
                    Poli & Dokter
                  </p>
                  <p className="text-xs text-ink-soft">Kelola unit poli dan penugasan dokter</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-soft transition group-hover:translate-x-1 group-hover:text-brand" />
            </Link>
          )}
        </div>
      </div>

      {/* Two-Column Section: Live Queues & Poli Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Today's Live Queue Overview (7 Cols) */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-white p-5 shadow-xs lg:col-span-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand" />
              <h3 className="text-sm font-semibold text-ink">
                {isDoctor ? `Antrean Hari Ini • ${doctorPoli?.name || "Poli Anda"}` : "Antrean Hari Ini"}
              </h3>
            </div>
            <Link
              to="/queue"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
            >
              Buka Layar Antrean
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Active Call Highlight if any */}
          {calledOrInProgressQueue && (
            <div className="flex items-center justify-between rounded-lg border border-brand/30 bg-brand-soft/30 p-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand font-mono text-sm font-bold text-white shadow-xs">
                  {calledOrInProgressQueue.queueNumber}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">
                      {calledOrInProgressQueue.registration?.patient?.name}
                    </span>
                    <Badge tone="brand">
                      {calledOrInProgressQueue.status === "CALLED" ? "Dipanggil" : "Diperiksa"}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-soft">
                    {calledOrInProgressQueue.registration?.poli?.name} •{" "}
                    {calledOrInProgressQueue.registration?.doctor?.user?.name}
                  </p>
                </div>
              </div>
              <Link to="/queue">
                <Button size="sm" variant="secondary">
                  Pantau
                </Button>
              </Link>
            </div>
          )}

          {/* Queue List Table */}
          {queuesLoading ? (
            <div className="py-8">
              <Spinner label="Memuat data antrean..." />
            </div>
          ) : !displayedQueues || displayedQueues.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-ink-soft">
                Belum ada antrean {isDoctor ? "di poli Anda" : "terdaftar"} hari ini.
              </p>
              <p className="text-xs text-ink-soft/70">
                Antrean akan tampil di sini begitu pasien baru didaftarkan.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-wider text-ink-soft">
                    <th className="pb-2.5 font-medium">No.</th>
                    <th className="pb-2.5 font-medium">Pasien</th>
                    <th className="pb-2.5 font-medium">Poli</th>
                    <th className="pb-2.5 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {displayedQueues.slice(0, 5).map((q) => {
                    const meta = QUEUE_STATUS_META[q.status] || {
                      label: q.status,
                      tone: "neutral",
                    };
                    return (
                      <tr key={q.id} className="hover:bg-bg/50">
                        <td className="py-2.5 font-mono font-semibold text-ink">
                          {q.queueNumber}
                        </td>
                        <td className="py-2.5 font-medium text-ink">
                          {q.registration?.patient?.name || "—"}
                        </td>
                        <td className="py-2.5 text-xs text-ink-soft">
                          {q.registration?.poli?.name || "—"}
                        </td>
                        <td className="py-2.5 text-right">
                          <Badge tone={meta.tone}>{meta.label}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {displayedQueues.length > 5 && (
                <div className="mt-3 border-t border-border pt-2 text-center">
                  <Link
                    to="/queue"
                    className="text-xs font-medium text-brand hover:underline"
                  >
                    Lihat {displayedQueues.length - 5} antrean lainnya di Papan Antrean →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Poli & Doctor Operational Status (5 Cols) */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-white p-5 shadow-xs lg:col-span-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-brand" />
              <h3 className="text-sm font-semibold text-ink">Layanan & Unit Poli</h3>
            </div>
            {user?.role === ROLES.ADMIN && (
              <Link
                to="/master-data"
                className="text-xs font-medium text-brand hover:underline"
              >
                Kelola
              </Link>
            )}
          </div>

          {poliLoading ? (
            <div className="py-8">
              <Spinner label="Memuat poli..." />
            </div>
          ) : !queuesByPoli || queuesByPoli.length === 0 ? (
            <div className="py-6 text-center text-sm text-ink-soft">
              Belum ada data poli tersedia.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {queuesByPoli.map((poli) => (
                <div
                  key={poli.id}
                  className="flex flex-col gap-1.5 rounded-lg border border-border/80 bg-bg/40 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-ink text-sm">{poli.name}</span>
                    <span className="font-mono text-xs rounded bg-white px-2 py-0.5 border border-border text-ink-soft">
                      {poli.code}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-ink-soft">
                    <span>{poli.doctorsCount} Dokter Tersedia</span>
                    <span>
                      <strong className="text-ink">{poli.totalQueue}</strong> Antrean Hari Ini
                    </span>
                  </div>
                  {poli.totalQueue > 0 && (
                    <div className="mt-1 flex gap-2 text-[11px]">
                      <span className="text-amber">Menunggu: {poli.waiting}</span>
                      <span>•</span>
                      <span className="text-brand">Selesai: {poli.done}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
