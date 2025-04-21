"use client";
import { useState, useEffect } from "react";
import React, { ReactNode } from "react";
import { IoGrid } from "react-icons/io5";
import { MdOutlineInventory2 } from "react-icons/md";
import Link from "next/link";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean | true>(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean | false>(
    false
  );

  useEffect(() => {
    const handleResizeSidebar = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1280) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResizeSidebar();

    window.addEventListener("resize", handleResizeSidebar);
    return () => window.removeEventListener("resize", handleResizeSidebar);
  }, []);

  useEffect(() => {
    if (isSidebarVisible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isSidebarVisible]);

  const toggleSidebarVisible = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const toggleSidebarOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarLink = [
    {
      name: "Home",
      icon: <IoGrid size="20" />,
      path: "/admin/dashboard",
    },
    {
      name: "Inventory",
      icon: <MdOutlineInventory2 size="20" />,
      path: "/admin/dashboard/inventory",
    },
  ];

  console.log(isSidebarVisible);

  return (
    <aside>
      <button className="md:hidden fixed top-4 px-5">
        <FiMenu size={24} onClick={toggleSidebarVisible} />
      </button>

      <div
        className={`h-screen md:sticky fixed top-0 bg-gray-100 p-5 z-[100] ${
          isSidebarOpen ? "w-[240px]" : "w-[90px]"
        } ${isSidebarVisible ? "w-full" : "hidden"} md:block `}
      >
        <div className="flex flex-row-reverse w-full md:hidden">
          <IoClose
            onClick={() => {
              setIsSidebarVisible(false);
            }}
            size={24}
          />
        </div>
        <div className="flex flex-col">
          {sidebarLink.map((list, index) => (
            <Link
              className="flex gap-2 items-center group hover:bg-[#FFE7BB] p-2"
              key={index}
              href={list.path}
              onClick={() => {
                setIsSidebarVisible(false);
              }}
            >
              <div className="text-black/50">{list.icon}</div>
              <div>{list.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
