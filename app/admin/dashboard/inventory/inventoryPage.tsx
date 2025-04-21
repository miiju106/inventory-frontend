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
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
  Flex,
  Grid,
  GridItem,
  Input,
  Badge,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  InputGroup,
  InputLeftElement,
  Image as ChakraImage,
} from "@chakra-ui/react";
import Image from "next/image";
import { IoFilterOutline } from "react-icons/io5";
import axios from "@/utils/api";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { HiDotsVertical } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState<string | "">("");
  const [loading, setLoading] = useState<boolean | false>(false);
  const [inventoryArray, setInventoryArray] = useState<InventoryData[] | []>(
    []
  );
  const [selectedInventory, setSelectedInventory] = useState<InventoryData | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean | false> (false)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchInven = async () => {
      try {
        setLoading(true);
        const invenData = await axios.get("/user/get-stocks");
        setInventoryArray(invenData.data.stocks);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInven();
  }, []);

  const handleViewInventory = (inven:InventoryData):void =>{
    setSelectedInventory(inven);
    setIsDrawerOpen(true);
    router.push(`?inventory=${inven._id}`);
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedInventory(null);
    router.push(pathname);
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

  return (
    <>
      {" "}
      <Tabs className="bg-white p-2 rounded">
        <TabList>
          <Tab>All Inventories</Tab>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  width={"19.375rem"}
                />
              </InputGroup>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-fit md:w-full lg:w-1/2 justify-end">
                <Button className="p-2 border rounded-md flex items-center gap-2 py-3 px-5 md:py-2 md:px-4">
                  <IoFilterOutline />
                  Filter
                </Button>
                <button
                  className={
                    "flex items-center gap-2 bg-[#5A05BA] !text-white p-2 rounded"
                  }
                  // onClick={routeAddTeacher}
                >
                  {/* <Plus size={20} color="white" /> */}
                  Add Inventory
                </button>
              </div>
            </div>
            <TableContainer>
              <Table variant="striped" colorScheme="gray">
                <Thead>
                  <Tr className="w-full"></Tr>
                  <Tr>
                    <Th width={10}>SN</Th>
                    <Th>Item Name</Th>
                    <Th>Unit Price</Th>
                    <Th>Qty</Th>
                    <Th>Date</Th>
                    <Th>Availability</Th>
                    <Th>More</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {inventoryArray.length > 0 ? (
                    inventoryArray.map((list, index) => (
                      <Tr key={list._id}>
                        <Td>{index + 1}</Td>
                        <Td>{sentenceCase(list.itemName)}</Td>
                        <Td>{list.price}</Td>
                       
                        <Td>{list.qty}</Td>
                        <Td>
                          {new Date(list.createdAt).toLocaleDateString()}
                        </Td>
                         <Td>{list.available ? "Yes" : "No"}</Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<HiDotsVertical />}
                              variant="outline"
                              size="sm"
                            />
                            <MenuList>
                              {/* {business.status !== "draft" && (
                                <MenuItem
                                  as="a"
                                  href={`/${business.slug || "#"}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View Sales Page
                                </MenuItem>
                              )} */}
                              <MenuItem
                                onClick={() =>
                                  handleViewInventory(list)
                                }
                              >
                                View Inventory
                              </MenuItem>
                              <MenuItem
                                 onClick={() =>
                                  router.push(`inventory/${list._id}`)
                                }
                              >
                                Edit
                              </MenuItem>
                              <MenuItem
                                // onClick={() =>
                                //   handleOpenDeleteConfirmation(business)
                                // }
                              >
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
                            {/* <Image src={img} alt="/" />{" "} */}
                            <p>You don’t have any business details yet</p>{" "}
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

 {/* Business Profile Drawer */}
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
                      {selectedInventory.itemName}
                    </h3>
                    <p className="text-sm text-black">
                      Created:{" "}
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
                  <p> Supplier:</p>
                  <div className="border p-2 rounded-md">
                    <p className="text-sm">{selectedInventory.supplier}</p>
                  </div>
                </div>

                <div className="flex flex-col text-black text-sm">
                  <p> Unit Price</p>
                  <div className="border p-2 rounded-md">
                    <p className="text-sm">{selectedInventory.price}</p>
                  </div>
                </div>

                <div className="flex flex-col text-black text-sm">
                  <p> Quantity</p>
                  <div className="border p-2 rounded-md">
                    <p className="text-sm">{selectedInventory.qty}</p>
                  </div>
                </div>

                <div className="flex flex-col text-black text-sm">
                  <p> Available</p>
                  <div className="border p-2 rounded-md">
                    <p className="text-sm">{selectedInventory.available ? "Yes" : "No"}</p>
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
      
    </>
  );
};

export default InventoryPage;
