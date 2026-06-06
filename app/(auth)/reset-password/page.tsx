import ResetPasswordForm from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-md shadow-xl p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Reset Password</h1>

        <p className="mt-2 text-slate-500">Create a new password for your account.</p>
      </div>

      <ResetPasswordForm />
    </div>
  );
}
