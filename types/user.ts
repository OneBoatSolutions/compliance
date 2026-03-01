export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
