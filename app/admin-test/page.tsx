import AdminLayout from "../(admin)/admin/layout";
import AdminUsersPage from "../(admin)/admin/users/page";

export default function TestAdminPage() {
  return (
    <AdminLayout>
      <AdminUsersPage />
    </AdminLayout>
  );
}
