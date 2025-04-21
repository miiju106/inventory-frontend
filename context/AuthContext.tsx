"use client";
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axios from "@/utils/api";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import React, { ReactNode } from "react";

interface User {
  firstname: string;
  lastname: string;
  email: string;
  role: "admin" | "user";
  isVerified: boolean;
}

type AuthContextType = {
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean | null;
  isAuthenticated: boolean | null;
};

interface JwtPayload {
  userId: string;
  exp: number;
  iat: number;
}

type UserRole = "admin" | "user";

const roleRoutes = {
  admin: "/admin/dashboard",
  user: "/user/dashboard",
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | false>(
    false
  );
  const [loading, setLoading] = useState<boolean | false>(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token"); // get access token from Cookies
    if (!token) return;

    try {
      const decodeToken = jwtDecode<JwtPayload>(token);
      const expiryTime = decodeToken.exp * 1000; // in millisecs
      const currentTime = Date.now(); // current time
      setIsAuthenticated(true);

      if (expiryTime <= currentTime) {
        logout();
      } else {
        const timeOut = setTimeout(logout, expiryTime - currentTime);
        return () => clearTimeout(timeOut);
      }
    } catch (error) {
      console.log("Unauthorized token", error);
      logout();
    }
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      const resp = await axios.post("/auth/login", {
        email: process.env.NEXT_PUBLIC_EMAIL,
        password: process.env.NEXT_PUBLIC_PASS,
      });
      Cookies.set("token", resp.data.accessToken, { expires: 4, secure: true });
      setIsAuthenticated(true);
      setUser(resp.data.user);
      toast.success("Login successful!");

      const redirect = roleRoutes[resp.data.user.role as UserRole];

      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/");
        toast.warning("Not authorized");
      }
    } catch (error: any) {
      toast.error(
        error.resp?.data?.message || "An error occurred during login."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    toast.warning("Logged out due to inactivity.");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
