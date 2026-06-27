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

      {/* Decorative Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground font-medium">Or continue with</span>
        </div>
      </div>

      {/* Placeholder OAuth Block */}
      <div className="relative group">
        <button
          type="button"
          disabled
          className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-input bg-muted/40 text-muted-foreground opacity-60 cursor-not-allowed text-sm font-medium transition-colors"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </button>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary/10 text-primary text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded pointer-events-none">
          Soon
        </span>
      </div>
    </form>
  );
}
