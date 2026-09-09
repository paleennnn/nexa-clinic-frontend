import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate } from "react-router-dom";
import { Cross, KeyRound, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const loginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

const DEMO_ACCOUNTS = [
  {
    role: "Administrator",
    email: "admin@clinic.test",
    password: "Admin123!",
    roleBadgeClass: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    role: "Dokter",
    email: "dokter@clinic.test",
    password: "Dokter123!",
    roleBadgeClass: "bg-brand-soft text-brand-dark border-brand/30",
  },
  {
    role: "Petugas Pendaftaran",
    email: "petugas@clinic.test",
    password: "Petugas123!",
    roleBadgeClass: "bg-amber-soft text-amber border-amber/30",
  },
];

export default function LoginPage() {
  const { login, status } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  if (status === "authenticated") {
    return <Navigate to="/patients" replace />;
  }

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success("Login berhasil");
    } catch (err) {
      toast.error(err.message || "Email atau password salah");
    } finally {
      setSubmitting(false);
    }
  };

  const fillAccount = (account) => {
    setValue("email", account.email, { shouldValidate: true });
    setValue("password", account.password, { shouldValidate: true });
    toast.success(`Akun ${account.role} diterapkan`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
            <Cross className="h-5.5 w-5.5" strokeWidth={2.5} />
          </span>
          <h1 className="text-xl font-semibold text-ink">Nexa Clinic</h1>
          <p className="text-sm text-ink-soft">Masuk untuk mengakses Sistem Informasi Klinik</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 rounded-xl border border-border bg-white p-6 shadow-xs"
        >
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="nama@clinic.test"
            autoComplete="username"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" loading={submitting} className="mt-2 w-full">
            Masuk
          </Button>
        </form>

        {/* Demo Accounts Card */}
        <div className="mt-6 rounded-xl border border-border bg-white p-5 shadow-xs">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-brand" />
              <span className="text-xs font-semibold uppercase tracking-wider text-ink">
                Akun Demo
              </span>
            </div>
            <span className="text-xs text-ink-soft">Klik untuk isi otomatis</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => fillAccount(account)}
                className="group flex flex-col rounded-lg border border-border/80 bg-bg/50 p-3 text-left transition hover:border-brand/50 hover:bg-brand-soft/20 focus-visible:border-brand focus-visible:outline-none"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${account.roleBadgeClass}`}
                  >
                    {account.role}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-brand opacity-0 transition group-hover:opacity-100">
                    <UserCheck className="h-3.5 w-3.5" />
                    Gunakan
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-ink-soft">Email: </span>
                    <span className="font-mono text-ink font-medium select-all">
                      {account.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-ink-soft">Password: </span>
                    <span className="font-mono text-ink font-medium select-all">
                      {account.password}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

