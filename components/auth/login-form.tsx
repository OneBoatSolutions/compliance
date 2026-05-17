"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { ApiClientError } from "@/lib/api-client";
import { loginSchema } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = loginSchema.extend({
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const getRoleHomePath = useAuthStore((state) => state.getRoleHomePath);
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const user = await login({
        email: data.email,
        password: data.password,
      });

      router.push(getRoleHomePath(user.role));
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.code === "UNAUTHORIZED") {
          toast.error("Invalid email or password");
          return;
        }

        if (error.code === "SERVER_ERROR") {
          toast.error("Server error. Please try again shortly.");
          return;
        }

        toast.error(error.message || "Unable to sign in. Please try again.");
        return;
      }

      toast.error("Unable to sign in. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* EMAIL */}
      <div>
        <label className="text-sm font-medium text-slate-700">Email address</label>

        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />

          <Input
            {...register("email")}
            placeholder="name@company.com"
            className="pl-10 h-11 text-slate-900"
          />
        </div>

        {errors.email && <p className="text-xs text-red-500 mt-1">Invalid email</p>}
      </div>

      {/* PASSWORD */}
      <div>
        <label className="text-sm font-medium text-slate-700">Password</label>

        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />

          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10 h-11 text-slate-900"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-slate-400 hover:text-[#6d18ff] transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* REMEMBER + FORGOT */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-600">
          <input type="checkbox" {...register("remember")} />
          Remember me
        </label>

        <Link
          href="/forgot-password"
          className="text-[#6d18ff] hover:text-[#5412cc] transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* SIGN IN BUTTON */}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-[#6d18ff] hover:bg-[#5412cc] text-white font-semibold rounded-md flex items-center justify-center transition-all duration-200 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#6d18ff] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
        ) : (
          "Sign in"
        )}
      </Button>

      {/* DIVIDER */}
      <div className="flex items-center gap-4">
        <div className="flex-1 border-t border-slate-200"></div>
        <span className="text-xs text-slate-400">OR</span>
        <div className="flex-1 border-t border-slate-200"></div>
      </div>

      {/* GOOGLE */}
      <button
        type="button"
        disabled
        title="Google OAuth currently unavailable"
        className="w-full border rounded-md py-2.5 flex items-center justify-center gap-2 border-slate-200 shadow-sm text-slate-400 bg-slate-50 cursor-not-allowed opacity-60"
      >
        <svg className="w-5 h-5 grayscale opacity-70" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.7 1.22 9.2 3.6l6.9-6.9C35.9 2.3 30.3 0 24 0 14.6 0 6.4 5.4 2.5 13.3l8.1 6.3C12.4 13.5 17.7 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.5 24.5c0-1.6-.1-2.8-.4-4H24v7.6h12.7c-.3 2-1.6 5-4.4 7l6.8 5.3c4-3.7 7.4-9.1 7.4-15.9z"
          />
          <path
            fill="#FBBC05"
            d="M10.6 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-8.1-6.3C1 16.4 0 20.1 0 24s1 7.6 2.5 10.9l8.1-6.3z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-6.8-5.3c-1.9 1.3-4.5 2.2-9.1 2.2-6.3 0-11.6-4-13.5-9.9l-8.1 6.3C6.4 42.6 14.6 48 24 48z"
          />
        </svg>
        Google OAuth (Unavailable)
      </button>
    </form>
  );
}
