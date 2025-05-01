"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import Image from "next/image";
import { toast } from "react-toastify";
import { FormikHelpers } from "formik";
import axios from "@/utils/api";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";

const validationSchema = Yup.object({
  qty: Yup.number()
    .typeError("Quantity of the stock must be a number")
    .required("Quantity is required"),
});

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

type SellModalProps = {
  isSellOpen: boolean;
  onSellOpen: () => void;
  onSellClose: () => void;
  selectedInventory: InventoryData | null;
};

type FormValue = {
  qty: number;
};

const SellInventory = ({
  isSellOpen,
  onSellOpen,
  onSellClose,
  selectedInventory,
}: SellModalProps) => {
  const initialValues: FormValue = {
    qty: 0,
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: FormikHelpers<FormValue>
  ) => {
    try {
      const response = await axios.post(
        `/admin/buy-stock/${selectedInventory?._id}`,
        values
      );

      toast.success("Stock Sold successfully!");
      resetForm();
    } catch (error: any) {
      console.error(error);
      toast.error(
        `Stock Selling failed: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // capitalize first letter
  const sentenceCase = (text: string): string => {
    const caplitalizeText = text
      .split(" ")
      .map((list: string) => {
        return list.charAt(0).toUpperCase() + list.slice(1).toLowerCase();
      })
      .join(" ");

    return caplitalizeText;
  };

  return (
    <div>
      <Modal isOpen={isSellOpen} onClose={onSellClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sell Inventory</ModalHeader>
          <ModalCloseButton />
          <div className="p-5">
            <div className="space-y-5 p-5">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, isSubmitting, setFieldValue }) => (
                  <Form>
                    <div className="mb-5">
                      <label
                        htmlFor="qty"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Quantity<span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="number"
                        name="qty"
                        placeholder="Enter number of items to be sold"
                        className="border p-2 w-full"
                      />
                      <ErrorMessage
                        name="qty"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {values.qty > 0 && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <p className="">Name of the Item</p>
                          <div className="border p-2 rounded-md">
                            <p className="text-black text-sm">
                              {sentenceCase(selectedInventory?.itemName || "")}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col text-black text-sm">
                          <p> Unit Price</p>
                          <div className="border p-2 rounded-md">
                            <p className="text-sm">
                              {selectedInventory?.price}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col text-black text-sm">
                          <p> Total Price</p>
                          <div className="border p-2 rounded-md">
                            <p className="text-sm">
                              {selectedInventory?.price &&
                                selectedInventory?.price * values.qty}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Flex gap="4" direction="column" width="full" mt="4">
                      <button
                        className="bg-[#5A05BA] hover:bg-[#5A05BA]/70 text-white py-2 px-5 rounded-lg hover:bg-main-dark transition"
                        type="submit"
                      >
                        {isSubmitting ? "loading" : "Sell"}
                      </button>
                    </Flex>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SellInventory;
