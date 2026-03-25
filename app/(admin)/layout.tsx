// app/(admin)/layout.tsx

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

//  Icons
import { Layers, Users } from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
};

//  ADMIN NAV ITEMS
const adminNavItems = [
  {
    label: "Frameworks",
    href: "/admin/frameworks",
    icon: Layers,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

export default function AdminLayout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">

      {/*  Sidebar */}
      <Sidebar items={adminNavItems} />

      {/*  Main Content */}
      <div className="flex flex-col flex-1 ml-60">
        
        <Header />

        <main className="flex-1 overflow-auto p-4 pt-20">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
