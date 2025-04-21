"use client"
import React from "react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const auth = useAuth()

  if(!auth) return <div className="container"><p>Authentication Error</p></div>
  const {login, loading} = auth

 
  return (
    <div className="h-screen container flex justify-center items-center">
      <div className="flex justify-center flex-col items-center p-8 shadow-md md:w-[35%] w-[90%]  rounded-md gap-4">
        <h3 className="text-center">Welcome</h3>
        <button className="px-4 py-2 bg-[#5A05BA] hover:bg-[#5A05BA]/70 rounded-md text-white" onClick={login}>{loading ? "Loading":"Login"}</button>
       
      </div>
    </div>
  );
};

export default Login;
