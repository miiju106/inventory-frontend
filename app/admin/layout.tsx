import ProtectedRoute from "@/components/ProtectedRoute";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";


import Sidebar from "@/components/sidebar";


export const metadata = {
  title: "Management",
  description: "Inventory Frontend",
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
