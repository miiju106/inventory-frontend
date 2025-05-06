"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import LandingShoeImg from "@/public/images/landing-shoe.jpg";

const Login = () => {
  const auth = useAuth();

  if (!auth)
    return (
      <div className="container">
        <p>Authentication Error</p>
      </div>
    );
  const { login, loading } = auth;

  return (
    <div className="h-screen w-screen container bg-[url('/images/landing-shoe.jpg')] bg-cover bg-top bg-no-repeat flex justify-center items-center">
      <div className="flex justify-center flex-col items-center py-10 px-6 shadow-md md:w-[50%] bg-white rounded-md gap-4">
        <h2 className="text-center font-semibold text-[#5A05BA]"> Shoeven</h2>
        <p className="text-center">Shoeven is a web app used to manage shoe inventories.</p>
        <button
          className=" w-full p-2 bg-[#5A05BA] hover:bg-[#5A05BA]/70 rounded-md text-white"
          onClick={login}
        >
          {loading ? "Loading" : "Proceed"}
        </button>
      </div>
    </div>
  );
};

export default Login;
