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
import  { AxiosError } from "axios";

type Supplier = {
  _id: string;
  supplier: string;
};

type FormValue = {
  supplier: string;
};

const validationSchema = Yup.object({
 supplier: Yup.string().required("Supplier is required"),  
});

const initialValues: FormValue = {
  supplier: "",
};


const Page = () => {
  const [loading, setLoading] = useState<boolean | false>(false);
  const [isLoading, setIsLoading] = useState<boolean | false>(false);
  const [suppliers, setSuppliers] = useState<Supplier[] | []>([]);
  const [filteredSupplier, setFilteredSupplier] = useState<Supplier[] | []>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [itemsPerPage, setItemsPerPage] = useState<number | 10>(10);
  const [currentPage, setCurrentPage] = useState<number | 1>(1);
  const [searchValue, setSearchValue] = useState<string | "">("");

 
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

 
  useEffect(() => {
    const fetchInven = async () => {
      try {
        setLoading(true);
        const supplierData = await axios.get("/admin/get-supplier");        
        setSuppliers(supplierData.data.suppliers);
       
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInven();
    const interval = setInterval(fetchInven, 5000); // poll every 5s

    return () => clearInterval(interval);


  }, []);


  useEffect(() => {
    if (searchValue.length == 0) {
      setFilteredSupplier(suppliers);
    }
  }, [searchValue, suppliers.length, filteredSupplier.length]);


  // paginate filtered Inventory
  const paginatedData = filteredSupplier.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = async (
    values: Record<string, any>,
    { setSubmitting, resetForm }: FormikHelpers<FormValue>
  ) => {

    const formData = {supplier:values.supplier.toLowerCase()}
   

    try {
      await axios.post("/admin/add-supplier", formData);

      toast.success("Supplier Added successfully!");
      resetForm();
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error(error);
      toast.error(
        `Supplier Adding failed: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteModal = (supplier: Supplier): void => {
    setSelectedSupplier(supplier);
    onDeleteOpen();
  };

  const handleDelete = async () => {
    if (selectedSupplier?._id) {
      try {
        setIsLoading(true);
         await axios.delete(
          `/admin/delete-supplier/${selectedSupplier._id}`
        );
        toast.success("Supplier Deleted successfully!");
        onDeleteClose();
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        console.error(error);
        toast.error(
          `Supplier Deleting failed: ${
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
          <Tab>All Suppliers</Tab>
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
                  value={searchValue}
                  onChange={(e) => {
                    const searchInput = e.target.value
                    setSearchValue(searchInput)
                    const filtered = suppliers?.filter((list) => {
                      return list.supplier
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase());
                    });

                    setFilteredSupplier(filtered);
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
                  Add Supplier
                </button>
              </div>
            </div>
            <TableContainer>
              <Table variant="striped" colorScheme="gray">
                <Thead>
                  <Tr className="w-full"></Tr>
                  <Tr>
                    <Th width={10}>SN</Th>
                    <Th width="3xl">Supplier</Th>

                    <Th>More</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredSupplier.length > 0 ? (
                    paginatedData?.map((list, index) => (
                      <Tr key={list._id}>
                        <Td>{index + 1}</Td>
                        <Td>{list.supplier}</Td>

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
                        {loading  ? (
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


      {/* Add Supplier Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Supplier</ModalHeader>
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
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Supplier<span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="string"
                        name="supplier"
                        placeholder="Enter the name of the supplier"
                        className="border p-2 w-full"
                      />
                      <ErrorMessage
                        name="supplier"
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


      {/* Delete Supplier Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Category</ModalHeader>
          <ModalCloseButton />
          <div className="p-5 space-y-4">
            Are you sure you want to delete{" "}
            <span className="uppercase font-semibold">
              {selectedSupplier?.supplier}
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
        data={filteredSupplier}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
    </>
  );
};

export default Page;
