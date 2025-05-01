"use client";
import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader, 
  ModalCloseButton, 
  Flex,  
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,  
} from "@chakra-ui/react";
import axios from "@/utils/api";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { HiDotsVertical } from "react-icons/hi";
import Pagination from "@/components/pagination";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { FormikHelpers } from "formik";
import { AxiosError } from "axios";

type Category = {
  _id: string;
  category: string;
};

type FormValue = {
  category: string;
};

const validationSchema = Yup.object({
  category: Yup.string().required("Category is required"),
});

const Page = () => {
  const [loading, setLoading] = useState<boolean | false>(false);
  const [isLoading, setIsLoading] = useState<boolean | false>(false);
  const [categories, setCategories] = useState<Category[] | []>([]);
  const [filteredCategory, setFilteredCategory] = useState<Category[] | []>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [itemsPerPage, setItemsPerPage] = useState<number | 10>(10);
  const [currentPage, setCurrentPage] = useState<number | 1>(1);

  
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const initialValues: FormValue = {
    category: "",
  };

  useEffect(() => {
    const fetchInven = async () => {
      try {
        setLoading(true);
        const categoryData = await axios.get("/admin/get-category");        
        setCategories(categoryData.data.categories);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInven();
  }, [categories.length]);

  useEffect(() => {
    if (filteredCategory.length == 0) {
      setFilteredCategory(categories);
    }
  }, [filteredCategory.length]);

  // paginate filtered Inventory
  const paginatedData = filteredCategory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = async (
    values: Record<string, any>,
    { setSubmitting, resetForm }: FormikHelpers<FormValue>
  ) => {

    const formData = {category:values.category.toLowerCase()}

    try {
     await axios.post("/admin/add-category", formData);

      toast.success("Category Added successfully!");
      resetForm();
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error(error);
      toast.error(
        `Category Adding failed: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteModal = (category: Category): void => {
    setSelectedCategory(category);
    onDeleteOpen();
  };

  const handleDelete = async () => {
    if (selectedCategory?._id) {
      try {
        setIsLoading(true);
await axios.delete(
          `/admin/delete-category/${selectedCategory._id}`
        );
        toast.success("Category Deleted successfully!");
        onDeleteClose();
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        console.error(error);
        toast.error(
          `Category Deleting failed: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {" "}
      <Tabs className="bg-white p-2 rounded">
        <TabList>
          <Tab>All Categories</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <div className="py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <HiMagnifyingGlass />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => {
                    const filtered = categories?.filter((list) => {
                      return list.category
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase());
                    });

                    setFilteredCategory(filtered);
                  }}
                  width={"19.375rem"}
                />
              </InputGroup>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-fit md:w-full lg:w-1/2 justify-end">
                <button
                  className={
                    "flex items-center gap-2 bg-[#5A05BA] hover:bg-[#5A05BA]/70 !text-white p-2 rounded"
                  }
                  onClick={onAddOpen}
                >
                  Add Category
                </button>
              </div>
            </div>
            <TableContainer>
              <Table variant="striped" colorScheme="gray">
                <Thead>
                  <Tr className="w-full"></Tr>
                  <Tr>
                    <Th width={10}>SN</Th>
                    <Th width="3xl">Category</Th>

                    <Th>More</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredCategory.length > 0 ? (
                    paginatedData?.map((list, index) => (
                      <Tr key={list._id}>
                        <Td>{index + 1}</Td>
                        <Td>{list.category}</Td>

                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<HiDotsVertical />}
                              variant="outline"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem onClick={() => handleDeleteModal(list)}>
                                Delete
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={7} textAlign="center">
                        {loading == true ? (
                          "loading..."
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full">
                            <p>No results</p>{" "}
                          </div>
                        )}
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>


      {/* Add Category Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Category</ModalHeader>
          <ModalCloseButton />
          <div className="p-5">
            <div className="space-y-5 p-5">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({  isSubmitting }) => (
                  <Form>
                    <div className="mb-5">
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Category<span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="string"
                        name="category"
                        placeholder="Enter the name of the category"
                        className="border p-2 w-full"
                      />
                      <ErrorMessage
                        name="category"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <Flex gap="4" direction="column" width="full" mt="4">
                      <button
                        className="bg-[#5A05BA] hover:bg-[#5A05BA]/70 text-white py-2 px-5 rounded-lg hover:bg-main-dark transition"
                        type="submit"
                      >
                        {isSubmitting ? "adding" : "Add"}
                      </button>
                    </Flex>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </ModalContent>
      </Modal>


      {/* Delete Category Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Category</ModalHeader>
          <ModalCloseButton />
          <div className="p-5 space-y-4">
            Are you sure you want to delete{" "}
            <span className="uppercase font-semibold">
              {selectedCategory?.category}
            </span>
            ?
            <div className="flex flex-col md:flex-row w-full gap-2">
              <button
                className="bg-[#5A05BA] hover:bg-[#5A05BA]/70 text-white py-2 px-5 rounded-lg  transition md:w-1/2"
                onClick={handleDelete}
              >
                {isLoading ? "Deleting" : "Yes"}
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
      {/* Pagination */}
      <Pagination
        data={filteredCategory}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
    </>
  );
};

export default Page;
