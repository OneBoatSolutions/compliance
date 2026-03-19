"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

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
import { getPasswordStrength } from "@/lib/passwordStrength";


//  Zod Schema
const registerSchema = z
  .object({
    companyName: z.string().min(2, "Company name is required"),

    email: z.string().email("Enter a valid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include uppercase letter")
      .regex(/[a-z]/, "Must include lowercase letter")
      .regex(/[0-9]/, "Must include a number")
      .regex(/[^A-Za-z0-9]/, "Must include special character"),

    confirmPassword: z.string(),

    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept Terms & Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


//  Type from Zod
type RegisterFormValues = z.infer<typeof registerSchema>;


export default function RegisterPage() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });
  
  //const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [strength, setStrength] =
    useState<"weak" | "medium" | "strong">("weak");

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const result = getPasswordStrength(value);
    setStrength(result.strength);
  };

   
  const onSubmit = (data: RegisterFormValues) => {
    console.log("Signup Data:", data);
  };

  return (
    <Form {...form}>
      <form
        
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-md mx-auto"
      >

        {/* Company Name */}
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
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
              <FormLabel>Work Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
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
              <FormLabel>Password</FormLabel>

              <FormControl>
                <Input
                  type="password"
                  {...field}
                  value={password}
                  onChange={(e) => {
                    field.onChange(e);
                    handlePasswordChange(e.target.value);
                  }}
                />
              </FormControl>

              <PasswordStrength strength={strength} />
              {getPasswordStrength(password).suggestions.map((s) => (
                <p key={s} className="text-xs text-muted-foreground">
               {s}
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
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
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
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>

              <FormLabel className="text-sm font-normal">
                I agree to the{" "}
                <Link href="/terms" className="underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
              </FormLabel>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          Create Account
        </Button>

        {/* Login */}
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </p>

      </form>
    </Form>
  );
}
