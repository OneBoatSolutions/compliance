export type PasswordStrength = "weak" | "medium" | "strong";

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number;
  suggestions: string[];
}

export function getPasswordStrength(password: string): PasswordStrengthResult {
  let score = 0;
  const suggestions: string[] = [];

  if (!password) {
    return {
      strength: "weak",
      score: 0,
      suggestions: [],
    };
  }

  // Length checks
  if (password.length >= 8) {
    score += 1;
  } else {
    suggestions.push("Use at least 8 characters.");
  }

  if (password.length >= 12) {
    score += 1;
  }

  // Lowercase
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push("Add lowercase letters.");
  }

  // Uppercase
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push("Add uppercase letters.");
  }

  // Numbers
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    suggestions.push("Include numbers.");
  }

  // Special characters
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    suggestions.push("Add special characters (!@#$ etc).");
  }

  // Optional: block common passwords
  const commonPasswords = ["123456", "password", "qwerty", "admin"];
  if (commonPasswords.includes(password.toLowerCase())) {
    return {
      strength: "weak",
      score: 0,
      suggestions: ["Avoid common passwords."],
    };
  }

  // Determine strength
  let strength: PasswordStrength = "weak";

  if (score >= 5) {
    strength = "strong";
  } else if (score >= 3) {
    strength = "medium";
  }

  return {
    strength,
    score,
    suggestions,
  };
}