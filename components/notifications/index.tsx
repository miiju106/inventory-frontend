"use client";
import React, { useState, useEffect } from "react";
import { Notification } from "../header";
import axios from "@/utils/api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { formatDistanceToNow } from "date-fns";
import Pagination from "../pagination";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<number | 10>(10);
  const [currentPage, setCurrentPage] = useState<number | 1>(1);

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
    const interval = setInterval(fetchNoti, 5000); // poll every 5s

    return () => clearInterval(interval);
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

  // paginate notifications
  const paginatedData = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

 

  return (
    <div>
      <h4 className="mb-6"> UnRead Notifications</h4>
      <div className="mb-4">
        {notifications.length > 0 ? (
          paginatedData.map((list) => (
            <div key={list._id} className="w-full border-b-2 py-2 space-y-2 ">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm">{list.message} at &#36;{list.data.price}</p>

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
          ))
        ) : (
          <div>No Notifications</div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        data={notifications}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default NotificationPage;
