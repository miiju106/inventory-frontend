"use client";
import React, { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const Pagination = ({ data, itemsPerPage, setItemsPerPage, currentPage, setCurrentPage }) => {
  const [pagesInArray, setPagesInArray] = useState([]);
  const perPageArray = [10, 20, 50];

  const totalPages = Math.ceil(data.length / itemsPerPage);
  
 

  useEffect(() => {
    const windowSize = 5;
    const halfWindowSize = Math.floor(windowSize / 2);
    const startIndex = Math.max(
      Math.min(currentPage - halfWindowSize, totalPages - windowSize + 1),
      1
    );
    const endIndex = Math.min(startIndex + windowSize - 1, totalPages);

    setPagesInArray(
      Array.from(
        { length: endIndex - startIndex + 1 },
        (_, i) => startIndex + i
      )
    );
  }, [currentPage, totalPages]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center py-7 px-4">
      <div className="flex flex-wrap gap-3 mb-4 md:mb-0">
        {pagesInArray.map((pageNumber) => (
          <div
            key={pageNumber}
            className={`w-8 h-8 flex justify-center items-center text-sm rounded ${
              pageNumber === currentPage
                ? "bg-[#024d91] text-white"
                : "border text-black hover:bg-gray-200"
            } cursor-pointer`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </div>
        ))}
        {totalPages > pagesInArray.length && (
          <span className="text-sm">...</span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Items Per Page Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm">Items per page:</span>
          <select
            className="rounded-md py-1 px-2 font-semibold border"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {perPageArray.map((list) => (
              <option key={list} value={list}>
                {list}
              </option>
            ))}
          </select>
        </div>

        <button
          className="flex items-center gap-2 border rounded-md py-1 px-3 hover:bg-gray-100 disabled:opacity-50"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <FaAngleLeft />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>

        <button
          className="flex items-center gap-2 border rounded-md py-1 px-3 hover:bg-gray-100 disabled:opacity-50"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <span className="hidden sm:inline">Next</span>
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
