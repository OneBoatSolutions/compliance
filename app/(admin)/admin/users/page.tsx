import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { UserManagementClient } from "@/components/admin/users/user-management-client";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <UserManagementClient currentUserId={session.user.id} />;
}
