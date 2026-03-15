import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-md shadow-xl p-10 ">
      {/* Header */}
      <div className="mb-10 ">
        <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>

        <p className="mt-2 text-slate-500">Enter your credentials to access your account</p>
      </div>

      <LoginForm />

      <p className="mt-8 text-center text-sm text-slate-600">
        Don&#39;t have an account?{" "}
        <a href="#" className="font-semibold text-[#6d18ff] hover:text-[#5412cc]">
          Sign up
        </a>
      </p>

      <p className="mt-6 text-center text-xs text-gray-400">
        © 2026 Cipherion. All rights reserved.
      </p>
    </div>
  );
}
