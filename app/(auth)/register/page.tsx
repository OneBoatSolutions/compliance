"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import PasswordStrength from "@/components/auth/PasswordStrength";
import { ApiClientError } from "@/lib/api-client";
import { getPasswordStrength } from "@/lib/passwordStrength";
import { registerSchema } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth-store";

const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirm your password"),
    terms: z.boolean().refine((val) => val, {
      message: "You must accept Terms & Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const registerAuth = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<"weak" | "medium" | "strong">("weak");

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const result = getPasswordStrength(value);
    setStrength(result.strength);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerAuth({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success("Account created successfully");
      router.push("/login");
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.code === "SERVER_ERROR") {
          toast.error("Server error. Please try again shortly.");
          return;
        }

        toast.error(error.message || "Unable to create account. Please try again.");
        return;
      }

      toast.error("Unable to create account. Please try again.");
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-md shadow-xl p-8 auth-route-enter">
      <div className="mb-8 text-left">
        <h2 className="text-3xl font-bold text-slate-900">Create your account</h2>
        <p className="mt-2 text-sm text-slate-600">Start your compliance journey with Cipherion</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">Full Name</FormLabel>
                <FormControl>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      placeholder="Enter your full name"
                      className="pl-10 pr-3 py-3 text-slate-900 border-slate-200 focus-visible:ring-2 focus-visible:ring-[#6d18ff]/40 focus-visible:border-[#6d18ff]"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">Work Email</FormLabel>
                <FormControl>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      type="email"
                      className="pl-10 pr-3 py-3 text-slate-900 border-slate-200 focus-visible:ring-2 focus-visible:ring-[#6d18ff]/40 focus-visible:border-[#6d18ff]"
                      placeholder="you@company.com"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">Password</FormLabel>

                <FormControl>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />

                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handlePasswordChange(e.target.value);
                      }}
                      className="pl-10 pr-10 py-3 text-slate-900 border-slate-200 focus-visible:ring-2 focus-visible:ring-[#6d18ff]/40 focus-visible:border-[#6d18ff]"
                      placeholder="Enter your password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#6d18ff] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>

                {password.length > 0 && <PasswordStrength strength={strength} />}

                {password.length > 0 &&
                  getPasswordStrength(password).suggestions.map((suggestion) => (
                    <p key={suggestion} className="text-xs text-slate-500">
                      {suggestion}
                    </p>
                  ))}

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                      className="pl-10 pr-10 py-3 text-slate-900 border-slate-200 focus-visible:ring-2 focus-visible:ring-[#6d18ff]/40 focus-visible:border-[#6d18ff]"
                      placeholder="Confirm your password"
                    />

                    {/* Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#6d18ff] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Terms */}
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                </FormControl>

                <div>
                  <FormLabel className="text-sm font-medium text-slate-600">
                    I agree to the{" "}
                    <Link href="/terms" className="underline text-primary">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline text-primary">
                      Privacy Policy
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Create account"
            )}
          </Button>

          {/* Login */}
          <p className="text-center text-sm text-slate-600 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="underline text-primary">
              Sign in
            </Link>
          </p>
        </form>
      </Form>
      <p className="mt-6 text-center text-xs text-slate-400">
        © 2026 Cipherion. All rights reserved.
      </p>
    </div>
  );
}
