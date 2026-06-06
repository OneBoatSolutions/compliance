import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-md shadow-xl p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Forgot Password</h1>

        <p className="mt-2 text-slate-500">
          Enter your email address and we&apos;ll send you a secure password reset link.
        </p>
      </div>

      <ForgotPasswordForm />
    </div>
  );
}
