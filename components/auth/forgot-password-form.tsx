"use client";

import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      setSent(true);

      toast.success(data.message || "Reset email sent");
    } catch {
      toast.error("Unable to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-[#e9ddff] p-5">
          <h3 className="font-semibold text-[#5412cc]">Check your inbox</h3>

          <p className="mt-2 text-sm text-slate-600">
            If an account exists with that email address, password reset instructions have been
            sent.
          </p>
        </div>

        <Link href="/login" className="inline-flex items-center gap-2 text-[#6d18ff]">
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm font-medium text-slate-700">Email Address</label>

        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />

          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="pl-10 h-11"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-[#6d18ff] hover:bg-[#5412cc]"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>

      <Link href="/login" className="block text-center text-sm text-slate-500">
        Back to Login
      </Link>
    </form>
  );
}
