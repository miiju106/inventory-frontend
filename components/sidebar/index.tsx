"use client";
import React, { useState, useEffect } from "react";
import { BsGrid } from "react-icons/bs";
import { MdOutlineInventory2 } from "react-icons/md";
import Link from "next/link";
import { FiMenu} from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { TbViewfinder } from "react-icons/tb";
import { BiCategoryAlt } from "react-icons/bi";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { IoIosLogOut } from "react-icons/io";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean | true>(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean | false>(
    false
  );
  const pathname = usePathname();
  const auth = useAuth();

  if (!auth)
    return (
      <div className="container">
        <p>Authentication Error</p>
      </div>
    );
  const { logOutByUser } = auth;

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

  // const toggleSidebarOpen = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  const sidebarLink = [
    {
      name: "Home",
      icon: <BsGrid size="20" />,
      path: "/admin/dashboard",
    },
    {
      name: "Inventory",
      icon: <MdOutlineInventory2 size="20" />,
      path: "/admin/dashboard/inventory",
    },
    {
      name: "Sales",
      icon: <BiPurchaseTagAlt size="20" />,
      path: "/admin/dashboard/sales",
    },
    {
      name: "Suppliers",
      icon: <TbViewfinder size="20" />,
      path: "/admin/dashboard/suppliers",
    },
    {
      name: "Categories",
      icon: <BiCategoryAlt size="20" />,
      path: "/admin/dashboard/categories",
    },
  ];

  return (
    <aside>
      <button className="md:hidden fixed top-4 px-5">
        <FiMenu size={24} onClick={toggleSidebarVisible} />
      </button>

      <div
        className={`h-screen md:sticky fixed top-0 bg-gray-100 py-5 z-[100] ${
          isSidebarOpen ? "w-[240px]" : "w-[70px]"
        } ${isSidebarVisible ? "w-full" : "hidden"} md:block `}
      >
        <div className="flex flex-row-reverse w-full md:hidden p-3">
          <IoClose
            onClick={() => {
              setIsSidebarVisible(false);
            }}
            size={24}
          />
        </div>
        <div className="flex flex-col ">
          {sidebarLink.map((list, index) => (
            <Link
              className={`flex w-full gap-2 items-center group hover:bg-[#5A05BA]/20 p-3 ${
                pathname == list.path ? "bg-[#5A05BA]/40 text-white" : ""
              }`}
              key={index}
              href={list.path}
              onClick={() => {
                setIsSidebarVisible(false);
              }}
            >
              <div
                className={`text-black/50 ${
                  pathname == list.path ? "text-white" : ""
                }`}
              >
                {list.icon}
              </div>
              <div
                className={`${isSidebarOpen ? "block" : "md:hidden lg:block"}`}
              >
                {list.name}
              </div>
            </Link>
          ))}
          <div
            className=" flex w-full gap-2 items-center group hover:bg-[#5A05BA]/20 p-3"
            onClick={() => logOutByUser()}
          >
            <div>
              <IoIosLogOut size="20" />
            </div>
            <div
              className={`${isSidebarOpen ? "block" : "md:hidden lg:block"}`}
            >
              Log out
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
