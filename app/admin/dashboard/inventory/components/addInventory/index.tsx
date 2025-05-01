"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Flex,
} from "@chakra-ui/react";
import { IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";
import { FormikHelpers } from "formik";
import axios from "@/utils/api";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AxiosError } from "axios";

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
  // images: Yup.array()
  //   .of(Yup.string().required("Image is required"))
  //   .min(1, "At least one image is required"),
});

interface FormInventory {
  itemName: string;
  category: string;
  qty: number;
  price: number;
  supplier: string;
}

type AddModalProps = {
  isAddOpen: boolean; 
  onAddClose: () => void;
};

type Category = {
  _id: string;
  category: string;
};

type Supplier = {
  _id: string;
  supplier: string;
};

const AddInventory = ({ isAddOpen, onAddClose }: AddModalProps) => {
  const [categories, setCategories] = useState<Category[] | []>([]);
  const [suppliers, setSuppliers] = useState<Supplier[] | []>([]);

  useEffect(() => {
    const fetchId = async () => {
      try {
        const [res1, res2] = await Promise.all([
          axios.get("/admin/get-category"),
          axios.get("/admin/get-supplier"),
        ]);

        setCategories(res1.data.categories);
        setSuppliers(res2.data.suppliers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchId();
  }, []);

  const initialValues: FormInventory = {
    itemName: "",
    category: "",
    qty: 0,
    price: 0,
    supplier: "",
  };

  categories?.sort((a: Category, b: Category) => {
    if (a.category < b.category) {
      return -1;
    } else if (a.category > b.category) {
      return 1;
    } else {
      return 0;
    }
  });

  suppliers?.sort((a: Supplier, b: Supplier) => {
    if (a.supplier < b.supplier) {
      return -1;
    } else if (a.supplier > b.supplier) {
      return 1;
    } else {
      return 0;
    }
  });

  const handleSubmit = async (
    values: Record<string, any>,
    { setSubmitting, resetForm }: FormikHelpers<FormInventory>
  ) => {
    try {
      await axios.post("/admin/add-stock", values);
      toast.success("Stock Added successfully!");
      resetForm();
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error(error);
      toast.error(
        `Stock Adding failed: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Inventory</ModalHeader>
          <ModalCloseButton />
          <div className="p-5">
            <div className="space-y-5 p-5">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
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
                        <option value="">Pick a category</option>
                        {categories.sort().map((list) => (
                          <option key={list._id} value={list.category}>
                            {list?.category.toLowerCase()}
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
                        <option value="">Pick a supplier</option>
                        {suppliers.map((list) => (
                          <option key={list._id} value={list.supplier}>
                            {list?.supplier.toLowerCase()}
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
                        Unit Price (&#36;)
                        <span className="text-red-500">*</span>
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

                    {/* <div className="mb-5">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Property Image<span className="text-red-500">*</span>
                          </label>
                          <FieldArray name="images">
                            {({ remove, push }) => (
                              <div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    document.getElementById("image-input").click()
                                  }
                                  className="flex items-center px-4 py-2 border border-main text-main rounded-md hover:bg-main hover:text-white"
                                >
                                  <FaUpload className="mr-2" />
                                  Select Images
                                </button>
                                <input
                                  id="image-input"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageChange(e, push)}
                                />
                                <ErrorMessage
                                  name="images"
                                  component="p"
                                  className="text-red-500 text-sm mt-1"
                                />
                                {values.images && values.images.length > 0 && (
                                  <div className="flex gap-4 flex-wrap mt-4">
                                    {values.images.map((image, index) => (
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
                        </div> */}

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

                    <Flex gap="4" direction="column" width="full" mt="4">
                      <button
                        className="bg-[#5A05BA] hover:bg-[#5A05BA]/70 text-white py-2 px-5 rounded-lg hover:bg-main-dark transition"
                        type="submit"
                      >
                        {isSubmitting ? "Adding" : "Add Inventory"}
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

export default AddInventory;
