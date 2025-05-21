"use client";
import React, { useState, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { io, Socket } from "socket.io-client";
import axios from "@/utils/api";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type Notification = {
  message: string;
  type: string;
  read: boolean;
  data: {
    itemName: string;
    stockId: string;
    category: string;
    qty: number;
    price: number;
    supplier: string;
    sold: boolean;
    _id: string;
    createdAt: string;
  };
  createdAt: string;
  _id: string;
};

// const notifications: Notification[] = [
//   {
//     item: "This is a notification that hasn't been read for you to look at we woulld need to define what will be displayed here",
//     time: "07:12",
//   },
//   {
//     item: "This is a notification that hasn't been read for you to look at we woulld need to define what will be displayed here",
//     time: "07:12",
//   },
//   {
//     item: "This is a notification that hasn't been read for you to look at we woulld need to define what will be displayed here",
//     time: "07:12",
//   },
//   {
//     item: "This is a notification that hasn't been read for you to look at we woulld need to define what will be displayed here",
//     time: "07:12",
//   },
//   {
//     item: "This is a notification that hasn't been read for you to look at we woulld need to define what will be displayed here",
//     time: "07:12",
//   },
//   {
//     item: "This is a notification that hasn't been read for you to look at we woulld need to define what will be displayed here",
//     time: "07:12",
//   },
// ];

const Header = () => {
  const [openModal, setOpenModal] = useState<boolean | false>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchNoti = async () => {
      try {
        const resp = await axios.get("/admin/get-notifications");
        const allNotifyNotRead = resp.data.data.filter(
          (list: Notification) => !list.read
        );
        setNotifications(allNotifyNotRead.reverse());
      } catch (error) {
        console.log(error);
      }
    };
    fetchNoti();
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL);

    newSocket.on("connect", () => {
      console.log("Connected to notification server");
    });

    newSocket.on("new-sales", (notification: Notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    // clean up unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleReadNotification = async (id: string) => {
    try {
      await axios.put(`/admin/notifications/${id}/read`);
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
      toast.success("Notification Read successfully");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error(error);
      toast.error(
        `Notification Read Failed: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  const handleSeeMoreReads = () => {
    router.push("/admin/dashboard/notifications");
    setOpenModal(false);
  };

  return (
    <div className="flex flex-row-reverse p-5">
      <div className="relative">
        <IoMdNotificationsOutline
          size={24}
          onClick={() => setOpenModal(!openModal)}
          className="hover:bg-gray-100 cursor-pointer"
        />

        {notifications.length > 0 && (
          <div className="absolute w-[7px] h-[7px] rounded-full bg-[#EB5017] right-1.5 top-0"></div>
        )}

        {openModal && (
          <div className="absolute z-[70] right-0 rounded-md shadow-md bg-white w-[350px] px-4 py-3 ">
            {notifications.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-semibold">
                    Notifications({notifications.length})
                  </h5>
                  <div
                    onClick={() => setOpenModal(false)}
                    className="border p-1 rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    <IoClose />
                  </div>
                </div>

                <div className="overflow-y-auto mb-7">
                  {notifications.slice(0, 4).map((list) => (
                    <div
                      key={list._id}
                      className="w-full border-b-2 py-2 space-y-2 "
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm">{list.message}</p>

                        <div onClick={() => handleReadNotification(list._id)}>
                          <p className="text-sm font-semibold cursor-pointer hover:text-[#5A05BA]/40">
                            Read
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-row-reverse items-center gap-3">
                        <p className="text-sm">
                          {list.createdAt
                            ? formatDistanceToNow(new Date(list.createdAt), {
                                addSuffix: true,
                              })
                            : "Unknown time"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white flex flex-row-reverse">
                  <p
                    className="text-sm font-semibold hover:text-[#5A05BA]/40 cursor-pointer"
                    onClick={handleSeeMoreReads}
                  >
                    See More UnReads
                  </p>
                </div>
              </div>
            ) : (
              <div>No Notifications</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
