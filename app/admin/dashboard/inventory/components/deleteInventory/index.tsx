"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  
  ModalCloseButton,  
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import axios from "@/utils/api";
import { AxiosError } from "axios";

type InventoryData = {
  _id: string;
  itemName: string;
  category: string;
  qty: number;
  price: number;
  supplier: string;
  available: boolean;
  sold: boolean;
  createdAt: string;
  updatedAt: string;
  
};

type AddDeleteProps = {
  isDeleteOpen: boolean;
  
  onDeleteClose: () => void;
  selectedInventory: InventoryData | null;
};


const DeleteInventory = ({
  isDeleteOpen,
 
  onDeleteClose,
  selectedInventory,
}: AddDeleteProps) => {
 
  const [loading, setLoading] = useState<boolean | false>(false);

  const handleDelete = async () => {
    if (selectedInventory?._id) {
      try {
        setLoading(true);       
        await axios.delete(
          `/admin/delete-stock/${selectedInventory._id}`
        );
        toast.success("Stock Deleted successfully!");
        onDeleteClose();
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        console.error(error);
        toast.error(
          `Stock Deleting failed: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Inventory</ModalHeader>
          <ModalCloseButton />
          <div className="p-5 space-y-4">
            Are you sure you want to delete{" "}
            <span className="uppercase font-semibold">
              {selectedInventory?.itemName}
            </span>
            ?
            <div className="flex flex-col md:flex-row w-full gap-2">
              <button
                className="bg-[#5A05BA] hover:bg-[#5A05BA]/70 text-white py-2 px-5 rounded-lg  transition md:w-1/2"
                onClick={handleDelete}
              >
                {loading ? "Deleting" : "Yes"}
              </button>
              <button
                className="bg-white border-2 py-2 px-5 rounded-lg hover:bg-gray-100 transition md:w-1/2"
                onClick={() => {
                  onDeleteClose();
                }}
              >
                No
              </button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DeleteInventory;
