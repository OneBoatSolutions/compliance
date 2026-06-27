import { z } from "zod";

/**
 * ReDoS guard: .max() is placed BEFORE .email() / .regex() so Zod
 * short-circuits on oversized input before the regex engine ever runs.
 * Without this, an attacker can POST a megabyte-long string and freeze
 * the Node.js event loop.
 *
 * Limits chosen:
 *   email    → 254 chars  (RFC 5321 maximum)
 *   password → 72 chars   ← CRITICAL: bcrypt silently truncates input at 72 bytes.
 *                            Allowing >72 chars means two passwords that share the
 *                            same first 72 bytes will hash identically — an attacker
 *                            only needs to brute-force 72 chars, not the full length.
 *                            Cap MUST match the bcrypt truncation boundary.
 *   name     → 100 chars  (business requirement)
 *   token    → 512 chars  (reset tokens are ~64–128 hex chars; 512 is safe)
 */

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  companyName: z.string().trim().min(2, "Company name is required").max(100),
  email: z.string().max(254).email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    // bcrypt hard-truncates at 72 bytes; cap here closes the equivalence-class attack.
    .max(72, "Password must be at most 72 characters")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Must include at least one special character"),
});

export const loginSchema = z.object({
  email: z.string().max(254).email(),
  password: z
    .string()
    .min(1, "Password is required")
    // Tune limit to accommodate legacy password strings exceeding 72 characters,
    // which are automatically truncated by bcrypt to 72 bytes under the hood,
    // while preventing high-capacity payload delivery attacks (capped at 256).
    .max(256, "Password must be at most 256 characters")
    .min(8, "Password must be at least 8 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().max(254).email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10).max(512),
  password: registerSchema.shape.password,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
