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
      toast.success("Signed in successfully");
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
    <form aria-label="Login form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* EMAIL */}
      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email address
        </label>

        <div className="relative mt-1">
          <Mail
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
          />

          <Input
            id="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
            placeholder="name@company.com"
            className="pl-10 h-11 text-slate-900"
          />
        </div>

        {errors.email && (
          <p id="email-error" role="alert" className="text-xs text-red-500 mt-1">
            Invalid email
          </p>
        )}
      </div>

      {/* PASSWORD */}
      <div>
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Password
        </label>

        <div className="relative mt-1">
          <Lock
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
          />

          <Input
            id="password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pl-10 pr-10 h-11 text-slate-900"
          />

          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-slate-400 hover:text-[#6d18ff] transition-colors "
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" size={18} />
            ) : (
              <Eye aria-hidden="true" size={18} />
            )}
          </button>
        </div>

        {errors.password && (
          <p id="password-error" role="alert" className="text-xs text-red-500 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* REMEMBER + FORGOT */}
      <div className="flex items-center justify-between text-sm">
        <label htmlFor="remember" className="flex items-center gap-2 text-slate-600">
          <input
            id="remember"
            className="h-4 w-4 accent-[#6d18ff]"
            type="checkbox"
            {...register("remember")}
          />
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
          <>
            <span
              aria-hidden="true"
              className="
        animate-spin
        h-5
        w-5
        border-2
        border-white
        border-t-transparent
        rounded-full
      "
            />
            <span className="sr-only">Signing in...</span>
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
