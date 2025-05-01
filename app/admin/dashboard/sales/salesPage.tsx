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
  Button,
  
  Flex,
  
  
  Input,
  
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  
} from "@chakra-ui/react";
import Image from "next/image";
import { IoFilterOutline } from "react-icons/io5";
import axios from "@/utils/api";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { HiDotsVertical } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import Pagination from "@/components/pagination";
import DeleteInventory from "../inventory/components/deleteInventory";
// import AddInventory from "./components/addInventory";
// import DeleteInventory from "./components/deleteInventory";

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

const SalesPage = () => {
  const [loading, setLoading] = useState<boolean | false>(false);
  const [inventoryArray, setInventoryArray] = useState<InventoryData[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryData[]>(
    []
  );
  const [selectedInventory, setSelectedInventory] =
    useState<InventoryData | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string[]>([]);
  const [selectedAvailable, setSelectedAvailable] = useState<boolean[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean | false>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number | 10>(10);
  const [currentPage, setCurrentPage] = useState<number | 1>(1);
  const [fromDate, setFromDate] = useState<string | "">("");
  const [toDate, setToDate] = useState<string | "">("");

  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();

  
  const {
    isOpen: isDeleteOpen,
    // onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchInven = async () => {
      try {
        setLoading(true);
        const invenData = await axios.get("/admin/get-sold-stock");

        // data for sales product
        setInventoryArray(invenData.data.stocks.reverse());
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInven();
  }, [inventoryArray]);

  // handles empty filter
  useEffect(() => {
    if (
      selectedCategory.length === 0 &&
      selectedSupplier.length === 0 &&
      selectedAvailable.length == 0
    ) {
      setFilteredInventory(inventoryArray);
    }
  }, [selectedCategory, selectedSupplier, selectedAvailable, inventoryArray]);

  // handles view inventory
  const handleViewInventory = (inven: InventoryData): void => {
    setSelectedInventory(inven);
    setIsDrawerOpen(true);
    router.push(`?inventory=${inven._id}`);
  };

  // handles close inventory
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedInventory(null);
    router.push(pathname);
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

  // paginate filtered Inventory
  const paginatedData = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const inventoryCategories: string[] = [
    ...new Set(inventoryArray.map((list) => list.category)),
  ];
  const inventorySupplier: string[] = [
    ...new Set(inventoryArray.map((list) => list.supplier)),
  ];
 
  // filter by category
  const handleChangeCategory = (category: string) => {
    setSelectedCategory((prev: string[]) =>
      prev.includes(category)
        ? prev.filter((list) => list !== category)
        : [...prev, category]
    );
  };

  // filter by supplier
  const handleChangeSupplier = (supplier: string) => {
    setSelectedSupplier((prev: string[]) =>
      prev.includes(supplier)
        ? prev.filter((list) => list !== supplier)
        : [...prev, supplier]
    );
  };

  

  // apply filter function
  const applyFilter = () => {
    let output = [...filteredInventory];

    if (selectedCategory.length > 0) {
      output = output.filter((list) =>
        selectedCategory.includes(list.category)
      );
    }

    if (selectedSupplier.length > 0) {
      output = output.filter((list) =>
        selectedSupplier.includes(list.supplier)
      );
    }

    if (selectedAvailable.length > 0) {
      output = output.filter((list) =>
        selectedAvailable.includes(list.available)
      );
    }
    if (fromDate && toDate) {
      const fromDateTime = new Date(fromDate);
      const toDateTime = new Date(toDate);

      output = output.filter((list) => {
        const selectedDate = new Date(list.createdAt);
        return selectedDate >= fromDateTime && selectedDate <= toDateTime;
      });
    }
    setFilteredInventory(output);
  };

  // const handleDeleteModal = (inven: InventoryData): void => {
  //   setSelectedInventory(inven);
  //   onDeleteOpen();
  // };

  

  return (
    <>
      {" "}
      <Tabs className="bg-white p-2 rounded">
        <TabList>
          <Tab>All Sales</Tab>
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
                    const filtered = inventoryArray?.filter((list) => {
                      return list.itemName
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase());
                    });

                    setFilteredInventory(filtered);
                  }}
                  width={"19.375rem"}
                />
              </InputGroup>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-fit md:w-full lg:w-1/2 justify-end">
                <Button
                  onClick={onFilterOpen}
                  className="p-2 border rounded-md flex items-center gap-2 py-3 px-5 md:py-2 md:px-4"
                >
                  <IoFilterOutline />
                  Filter
                </Button>
              </div>
            </div>
            <TableContainer>
              <Table variant="striped" colorScheme="gray">
                <Thead>
                  <Tr className="w-full"></Tr>
                  <Tr>
                    <Th width={10}>SN</Th>
                    <Th>Item Name</Th>
                    <Th>Unit Price(&#36;)</Th>
                    <Th>Qty</Th>
                    <Th>Date(mm/dd/yyyy)</Th>
                    <Th>Price Sold(&#36;)</Th>
                    <Th>More</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredInventory.length > 0 ? (
                    paginatedData?.map((list, index) => (
                      <Tr key={list._id}>
                        <Td>{index + 1}</Td>
                        <Td>{sentenceCase(list.itemName)}</Td>
                        <Td>{list.price / list.qty}</Td>

                        <Td>{list.qty}</Td>
                        <Td>{new Date(list.createdAt).toLocaleDateString()}</Td>
                        <Td>{list.price}</Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<HiDotsVertical />}
                              variant="outline"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem
                                onClick={() => handleViewInventory(list)}
                              >
                                View 
                              </MenuItem>

                              {/* <MenuItem onClick={() => handleDeleteModal(list)}>
                                Delete
                              </MenuItem> */}
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
                            {/* <Image src={img} alt="/" />{" "} */}
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
      {/* View Inventory */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        placement="right"
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Inventory Profile</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            {selectedInventory && (
              <div className="space-y-4">
                <div className="flex flex-col gap-4">
                  <Image
                    src="https://placehold.co/100x100"
                    alt={selectedInventory.itemName}
                    width={50}
                    height={50}
                    className="w-20 h-20 rounded-full"
                    unoptimized
                  />

                  <div>
                    <h3 className="text-main">
                      {sentenceCase(selectedInventory.itemName)}
                    </h3>
                    <p className="text-sm text-black">
                      Date Sold:{" "}
                      {new Date(
                        selectedInventory.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="">Category</p>
                  <div className="border p-2 rounded-md">
                    <p className="text-black text-sm">
                      {selectedInventory.category}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col text-black text-sm">
                  <p> Supplier</p>
                  <div className="border p-2 rounded-md">
                    <p className="text-sm">{selectedInventory.supplier}</p>
                  </div>
                </div>

                <div className="flex flex-col text-black text-sm">
                  <p> Unit Price</p>
                  <div className="border p-2 rounded-md">
                    <p className="text-sm">{selectedInventory.price / selectedInventory.qty}</p>
                  </div>
                </div>

                <div className="flex flex-col text-black text-sm">
                  <p> Quantity</p>
                  <div className="border p-2 rounded-md">
                    <p className="text-sm">{selectedInventory.qty}</p>
                  </div>
                </div>

                <div className="flex flex-col text-black text-sm">
                  <p> Price Sold</p>
                  <div className="border p-2 rounded-md">
                    <p className="text-sm">
                      {selectedInventory.price}
                    </p>
                  </div>
                </div>

                {/* <div>
                  <p className="">Author</p>
                  <div className="flex gap-3 items-center justify-between">
                    <div className="border py-2 px-4 rounded-md">
                      <p className="text-black text-sm">
                        {selectedInventory.createdBy?.name || "No name"}
                      </p>
                    </div>

                    <Link
                      href={`/portal/users/${selectedInventory.createdBy?._id}`}
                      target="_blank"
                      className="underline"
                    >
                      View Author
                    </Link>
                  </div>
                </div> */}

                {/* <div>
                  <p className="mb-2">Sales Page Information</p>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-center justify-between">
                      <div className="text-black flex flex-col">
                        <p className="text-sm">Web address: </p>
                        <div className="border py-2 px-4 rounded-md text-sm">
                          {selectedInventory.slug || "draft"}
                        </div>
                      </div>

                      <Link
                        href={selectedInventory.slug || "#"}
                        target="_blank"
                        className="underline"
                      >
                        View Sales Page
                      </Link>
                    </div>
                  </div>
                </div> */}
              </div>
            )}
          </DrawerBody>
          <Button onClick={handleCloseDrawer} m={4}>
            Close
          </Button>
        </DrawerContent>
      </Drawer>
      {/* Pagination */}
      <Pagination
        data={filteredInventory}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      {/* Filter Modal */}
      <Modal isOpen={isFilterOpen} onClose={onFilterClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filter</ModalHeader>
          <ModalCloseButton />
          <div className="p-5">
            <div>
              <h5 className="font-semibold mb-2">Category</h5>
              {inventoryCategories.map((list) => (
                <div key={list}>
                  <input
                    type="checkbox"
                    checked={selectedCategory.includes(list)}
                    onChange={() => handleChangeCategory(list)}
                  />
                  <span className="ml-2">{list}</span>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <h5 className="font-semibold mb-2">Supplier</h5>
              {inventorySupplier.map((list) => (
                <div key={list}>
                  <input
                    type="checkbox"
                    checked={selectedSupplier.includes(list)}
                    onChange={() => handleChangeSupplier(list)}
                  />
                  <span className="ml-2">{list.toLowerCase()}</span>
                </div>
              ))}
            </div>

            {/* <div className="mt-5">
              <h5 className="font-semibold mb-2">Available</h5>
              {inventoryAvailable.map((list, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    checked={selectedAvailable.includes(list)}
                    onChange={() => handleChangeAvailable(list)}
                  />
                  <span className="ml-2">{list.toString()}</span>
                </div>
              ))}
            </div> */}

            <div className="mt-5 flex gap-3">
              <div className="flex flex-col gap-1">
                <label>From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label>To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
            </div>

            <Flex gap="4" direction="column" width="full" mt="4">
              <button
                className="bg-[#5A05BA] hover:bg-[#5A05BA]/70 text-white py-2 px-5 rounded-lg hover:bg-main-dark transition"
                onClick={applyFilter}
              >
                Apply
              </button>
              <button
                className="bg-white border-2 py-2 px-5 rounded-lg hover:bg-gray-100 transition"
                onClick={() => {
                  setSelectedCategory([]);
                  setSelectedSupplier([]);
                  setSelectedAvailable([]);
                  setFromDate("");
                  setToDate("");
                  // onFilterClose();
                }}
              >
                Clear All
              </button>
            </Flex>
          </div>
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <DeleteInventory
        isDeleteOpen={isDeleteOpen}        
        onDeleteClose={onDeleteClose}
        selectedInventory={selectedInventory}
      />
    </>
  );
};

export default SalesPage;
