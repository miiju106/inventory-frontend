import ProtectedRoute from "@/components/ProtectedRoute";
import { ReactNode } from "react";
import Sidebar from "@/components/sidebar";


export const metadata = {
  title: "Shoeven",
  description: "Inventory App for managing shoe inventories",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <div className="flex max-w-[1920px] mx-auto">
        <Sidebar/>
        <div className="w-full">
          <div className="p-5 mt-6 md:mt-0">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
