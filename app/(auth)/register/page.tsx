"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full max-w-md bg-foreground rounded-xl shadow-md backdrop-blur-md p-6 space-y-6 mt-4">
      <div className="text-left align space-y-1 mb-6">
         <h2 className="text-2xl font-bold tracking-tight text-accent foreground">
               Get started with Cipherion
         </h2>
         <p className="mt-2 text-muted-foreground">
         Create your account to continue
         </p>
         </div>
         
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
              <FormLabel className="text-sm font-medium text-accent foreground">Company Name</FormLabel>
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
              <FormLabel className="text-sm font-medium text-accent foreground">Work Email</FormLabel>
              <FormControl>
                <Input type="email" {...field}  className="pr-10 text-muted-foreground" placeholder="Enter work email" 
                
                />
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
              <FormLabel className="text-sm font-medium text-accent foreground">Password</FormLabel>

              <FormControl>
                <div className="relative">
                <Input
            type={showPassword ? "text" : "password"}
            {...field}
            onChange={(e) => {
              field.onChange(e);
              handlePasswordChange(e.target.value); // ONLY HERE
            }}
            className="pr-10 text-muted-foreground caret-muted-foreground bg-background border border-border focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Eg. Abc@123"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
                </div>
              </FormControl>

              {password.length>0 &&
              <PasswordStrength strength={strength} />}

              {password.length>0 &&
              getPasswordStrength(password).suggestions.map((s) => (
                <p key={s} className="text-xs text-accent foreground">
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
              <FormLabel className="text-sm font-medium text-accent foreground">Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                  type={showConfirmPassword ? "text" : "password"}
                       {...field}
                   className="text-muted-foreground caret-muted-foreground"    
                  />

                   {/* Toggle Button */}
                  <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground "
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
            <FormItem className="flex items-center space-x-2 color-accent foreground">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="bg-muted-foreground"
                  
                />
              </FormControl>

              <FormLabel className="text-sm font-medium text-accent foreground">
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
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button
        type="submit"
         className="w-full h-11 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
         //disabled={loading || !form.formState.isValid}
>
         Create Account
          </Button>

        {/* Login */}
        <p className="text-center text-sm text-accent foreground mt-4">
          Already have an account?{" "}
          <Link href="/login" className="underline text-primary">
            Sign in
          </Link>
        </p>

      </form>
    </Form>
    <p className="mt-6 text-center text-xs text-accent foreground-400">
        © 2026 Cipherion. All rights reserved.
      </p>
    </div>
  );
}
