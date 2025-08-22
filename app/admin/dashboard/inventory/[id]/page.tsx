"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { useParams } from "next/navigation";
import axios from "@/utils/api";
import * as Yup from "yup";
import { IoIosArrowDown } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormikHelpers } from "formik";
import { AxiosError } from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { FaUpload } from "react-icons/fa";
import Image from "next/image";
import { useRef } from "react";

// type InventoryData = {
//   _id: string;
//   itemName: string;
//   category: string;
//   qty: number;
//   price: number;
//   supplier: string;
//   available: boolean;
//   sold: boolean;
//   createdAt: string;
//   updatedAt: string;
// };

interface FormInventory {
  itemName: string;
  category: string;
  qty: number;
  price: number;
  supplier: string;
  available: boolean;
  images: File[];
}

interface InventoryData {
  [key: string]: any;
  _id: string;
}

type Category = {
  _id: string;
  category: string;
};

type Supplier = {
  _id: string;
  supplier: string;
};

const validationSchema = Yup.object({
  itemName: Yup.string().required("Stock name is required"),
  category: Yup.string().required("Category is required"),
  qty: Yup.number()
    .typeError("Quantity of the stock must be a number")
    .required("Quantity is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required"),
  supplier: Yup.string().required("Supplier is required"),
  available: Yup.boolean().required("Availability is required"),
  // sold: Yup.boolean().required("sold status is required"),
  images: Yup.array(),
});

const Page = () => {
  const [selectedInventory, setSelectedInventory] =
    useState<InventoryData | null>(null);
  const [loading, setLoading] = useState<boolean | false>(false);
  const [categories, setCategories] = useState<Category[] | []>([]);
  const [suppliers, setSuppliers] = useState<Supplier[] | []>([]);
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchId = async () => {
      try {
        setLoading(true);

        const [res1, res2, res3] = await Promise.all([
          axios.get(`/user/get-stock/${id}`),
          axios.get("/admin/get-category"),
          axios.get("/admin/get-supplier"),
        ]);

        setSelectedInventory(res1.data.stock);
        setCategories(res2.data.categories);
        setSuppliers(res3.data.suppliers);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchId();
  }, [id]);

  if (loading) {
    return <div>Loading</div>;
  }

  console.log("selectedInventory", selectedInventory);

  const initialValues: FormInventory = {
    itemName: selectedInventory?.itemName || "",
    category: selectedInventory?.category || "",
    qty: selectedInventory?.qty || 0,
    price: selectedInventory?.price || 0,
    supplier: selectedInventory?.supplier || "",
    available: selectedInventory?.available,
    images: [],
    // sold: selectedInventory?.sold || false,
  };

  const sentenceCase = (text: string): string => {
    const caplitalizeText = text
      .split(" ")
      .map((list: string) => {
        return list.charAt(0).toUpperCase() + list.slice(1).toLowerCase();
      })
      .join(" ");

    return caplitalizeText;
  };

  const handleSubmit = async (
    values: Record<string, any>,
    { setSubmitting }: FormikHelpers<FormInventory>
  ) => {
    const formData: Record<string, any> = {
      itemName: values.itemName,
      category: values.category,
      qty: values.qty,
      price: values.price,
      supplier: values.supplier,
      available:
        typeof values.available == "string"
          ? values.available === "true"
          : values.available === true,
    };

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    values.images.forEach((img: File) => formDataToSend.append("images", img));

    try {
      await axios.put(`/admin/update-stock/${id}`, formDataToSend);

      toast.success("Stock Updated successfully!");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error(error);
      toast.error(
        `Stock Update failed: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteImg = async (imageUrl: string): Promise<void> => {
  console.log("Deleting image:", imageUrl);

  try {
    await axios.delete(`/admin/delete-stockImg/${id}`, {
      data: { imageUrl }, // req.body
    });

    toast.success("Image deleted successfully!");
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    console.error("Delete error:", err);

    toast.error(
      `Image delete failed: ${err.response?.data?.message || err.message}`
    );
  }
};

  return (
    <div className="space-y-5 p-5">
      <div className="flex gap-2 place-items-center">
        <FaArrowLeft
          size="16"
          className=" hover:text-gray-100 cursor-pointer"
          onClick={() => router.back()}
        />
        <span>Back</span>
      </div>
      <h3>{sentenceCase(selectedInventory?.itemName || "")}</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>
            <div className="mb-5">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stock Name<span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="itemName"
                name="itemName"
                placeholder="Enter title of the property"
                className="mt-1 block w-full px-3 py-2 border"
              />
              <ErrorMessage
                name="itemName"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-5 relative">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category<span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                name="category"
                className="border p-2 w-full appearance-none"
              >
                <option value={values?.category}>{values?.category}</option>
                {categories
                  ?.filter((item) => item.category != values?.category)
                  .map((list) => (
                    <option key={list._id} value={list.category}>
                      {list?.category}
                    </option>
                  ))}
              </Field>
              <IoIosArrowDown className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
              <ErrorMessage
                name="category"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-5 relative">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier<span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                name="supplier"
                className="border p-2 w-full appearance-none"
              >
                <option value={values?.supplier}>{values?.supplier}</option>
                {suppliers
                  ?.filter(
                    (item) =>
                      item.supplier.toLowerCase() !=
                      values?.supplier.toLowerCase()
                  )
                  .map((list) => (
                    <option key={list._id} value={list.supplier}>
                      {list?.supplier}
                    </option>
                  ))}
              </Field>
              <IoIosArrowDown className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
              <ErrorMessage
                name="supplier"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price (&#36;)<span className="text-red-500">*</span>
              </label>
              <Field
                type="number"
                name="price"
                placeholder="Enter Price of the Property"
                className="border p-2 w-full"
              />
              <ErrorMessage
                name="price"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Existing Images
              </label>
              {selectedInventory !== null && (
                <div className="flex gap-4 flex-wrap mt-4">
                  {selectedInventory.images.length > 0 &&
                    selectedInventory?.images.map(
                      (image: string, index: number) => (
                        <div key={index} className="relative w-40 h-40">
                          <Image
                            width={500}
                            height={500}
                            src={image}
                            alt="property"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute p-1 rounded-full top-1 right-1 bg-gray-200 hover:bg-[#5A05BA]/70 hover:text-white text-black"
                            onClick={() => handleDeleteImg(image)}
                          >
                            <div className="relative group">
                              <AiOutlineClose size={18} />
                              <span className="z-100 absolute top-4 left-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black">
                                Delete
                              </span>
                            </div>
                          </button>
                        </div>
                      )
                    )}
                </div>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images<span className="text-red-500"></span>
              </label>
              <FieldArray name="images">
                {({ remove }) => (
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center px-4 py-2 border border-main text-main rounded-md"
                    >
                      <FaUpload className="mr-2" />
                      Update Images
                    </button>
                    <span className="text-sm font-semibold">
                      NB you can only add {3 - selectedInventory?.images.length}{" "}
                      more image(s) to the existing images
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          const newFiles = Array.from(e.target.files);
                          const currentFiles = values.images || [];
                          setFieldValue("images", [
                            ...currentFiles,
                            ...newFiles,
                          ]);
                        }
                      }}
                    />
                    <ErrorMessage
                      name="images"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />

                    {values.images && values.images.length > 0 && (
                      <div className="flex gap-4 flex-wrap mt-4">
                        {values?.images.map((image, index) => (
                          <div key={index} className="relative w-40 h-40">
                            <Image
                              width={500}
                              height={500}
                              src={URL.createObjectURL(image)}
                              alt="property"
                              className="w-full h-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500 hover:text-red-700"
                              onClick={() => remove(index)}
                            >
                              <AiOutlineClose size={20} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </FieldArray>
            </div>

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
                placeholder="Enter No. of Bathrooms"
                className="border p-2 w-full"
              />
              <ErrorMessage
                name="qty"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-5 relative">
              <label
                htmlFor="available"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Available<span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                name="available"
                className="border p-2 w-full appearance-none"
              >
                <option value={`${values.available}`}>
                  {values.available ? "yes" : "no"}
                </option>
                {values.available && <option value="false">no</option>}
                {!values.available && <option value="true">yes</option>}
              </Field>
              <IoIosArrowDown className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
              <ErrorMessage
                name="available"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="flex flex-col md:flex-row mt-6 gap-3">
              <button
                type="submit"
                className="bg-[#024D91] hover:bg-[#024D91]/70 text-[#F9F9F9] py-2 px-7 rounded-md"
                // disabled={isSubmitting}
              >
                {isSubmitting ? "Saving" : "Save"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Page;
