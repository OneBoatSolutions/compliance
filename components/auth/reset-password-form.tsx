"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-red-600 font-medium">Invalid password reset link.</p>
      </div>
    );
  }

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!isPasswordValid) {
      const message = "Password does not meet all requirements.";
      setError(message);
      toast.error(message);
      return;
    }

    if (password !== confirmPassword) {
      const message = "Passwords do not match.";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Unable to reset password");
      }

      toast.success("Password updated successfully");

      router.push("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Password reset failed";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const requirementClass = (valid: boolean) =>
    `flex items-center gap-2 text-xs ${valid ? "text-green-600" : "text-slate-500"}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Password */}
      <div>
        <label className="text-sm font-medium text-slate-700">New Password</label>

        <div className="relative mt-1">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 h-11"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-slate-400 hover:text-[#6d18ff]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Password Requirements */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-700 mb-3">Password Requirements</p>

        <div className="space-y-2">
          <div className={requirementClass(passwordChecks.length)}>
            <CheckCircle2 size={14} />
            At least 8 characters
          </div>

          <div className={requirementClass(passwordChecks.uppercase)}>
            <CheckCircle2 size={14} />
            One uppercase letter
          </div>

          <div className={requirementClass(passwordChecks.lowercase)}>
            <CheckCircle2 size={14} />
            One lowercase letter
          </div>

          <div className={requirementClass(passwordChecks.number)}>
            <CheckCircle2 size={14} />
            One number
          </div>

          <div className={requirementClass(passwordChecks.special)}>
            <CheckCircle2 size={14} />
            One special character
          </div>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="text-sm font-medium text-slate-700">Confirm Password</label>

        <div className="relative mt-1">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 pr-10 h-11"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-slate-400 hover:text-[#6d18ff]"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {confirmPassword && password !== confirmPassword && (
          <p className="mt-2 text-xs text-red-500">Passwords do not match</p>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="
            w-full
            h-12
            bg-[#6d18ff]
            hover:bg-[#5412cc]
            text-white
            font-semibold
            shadow-md
            hover:shadow-lg
            transition-all
          "
      >
        {loading ? "Updating Password..." : "Reset Password"}
      </Button>

      {/* Back */}
      <Link
        href="/login"
        className="block text-center text-sm text-slate-500 hover:text-[#6d18ff] transition-colors"
      >
        Back to Login
      </Link>
    </form>
  );
}
