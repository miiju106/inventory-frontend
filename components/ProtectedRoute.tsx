"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import Image from "next/image";
import React, { ReactNode } from "react";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles: string[];
}

export default function ProtectedRoute({
  children,
  requiredRoles,
}: ProtectedRouteProps) {
  const auth = useAuth();
  const router = useRouter();
  if (!auth)
    return (
      <div className="container">
        <p>Authentication Error</p>
      </div>
    );

  const { user, loading } = auth;

  const token = Cookies.get("token");
  

  useEffect(() => {
    if (!loading) {
      if (!token) {
        router.push("/login");
      } else if (user && !requiredRoles.includes(user.role)) {
        toast.error("You do not have permission to access this page.");
        router.push("/");
      }
    }
  }, [loading, user, token, router, requiredRoles]);
  

  if (loading) {
    return (
      <div className="h-screen grid place-content-center">
        <Image
          src="/images/spinner.gif"
          width={500}
          height={500}
          className="w-16 aspect-square"
          alt="logo"
        />
      </div>
    );
  }

  return <>{children}</>;
}
