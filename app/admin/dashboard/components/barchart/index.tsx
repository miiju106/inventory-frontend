"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Select } from "@chakra-ui/react";
import axios from "@/utils/api";
import { PiDotOutlineBold } from "react-icons/pi";

type ChartData = {
  date: string;
  sales: number;
  purchase: number;
};

type SalesData = {
  _id: string;
  itemName: string;
  category: string;
  qty: number;
  price: number;
  supplier: string;
  stockId:string;
  sold: boolean;
  createdAt: string;
  updatedAt: string;
};

// Define the shape of the result object
interface CategoryCount {
  [category: string]: number;
}

interface BarChart {
  date: string;

  [category: string]: string | number;
}

type CategoryData ={
  category:string,
  _id:string
}



const BarChartComponent = () => {
  const [timePeriod, setTimePeriod] = useState<string | "1year">("1year");
  const [salesArray, setSalesArray] = useState<SalesData[]>([]);
  const [categoryArray, setCategoryArray] = useState<CategoryData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesStock = await axios.get("/admin/get-sold-stock");
        // const arrayForSales = salesStock.data.stocks.filter(
        //   (list: SalesData) => list.sold == true
        // );
        
        setSalesArray(salesStock.data.stocks);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const salesCategory = await axios.get("/admin/get-category");
        setCategoryArray(salesCategory.data.categories);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory()
  }, []);

  const filterByMonth = (
    abrevMonth: string,
    soldArray: SalesData[]
  ): CategoryCount => {
    const filterDataBasedByMonth = soldArray.filter((list: SalesData) => {
      const dateCreated = new Date(list.createdAt);
      const month = dateCreated.toLocaleString("en-US", { month: "short" });
      const currentYear = new Date().getUTCFullYear();
      const year = dateCreated.getUTCFullYear();

      return month == abrevMonth && year == currentYear;
    });

    const countCategories = filterDataBasedByMonth.reduce(
      (acc: CategoryCount, item) => {
        if(!acc[item.category]){
          acc[item.category] = 0

        }
        acc[item.category] += item.qty;
        return acc;
      },
      {}
    );

    return countCategories;
  };

  const filterByDay = (
    abrevDay: string,
    soldArray: SalesData[]
  ): CategoryCount => {
    const filterDataBasedByMonth = soldArray.filter((list: SalesData) => {
      const dateCreated = new Date(list.createdAt);
      const month = dateCreated.toLocaleString("en-US", { month: "short" });
      const day = dateCreated.getDate();
      const dayFormat = `${month} ${day}`;
      const currentYear = new Date().getUTCFullYear();
      const year = dateCreated.getUTCFullYear();

      return dayFormat == abrevDay && year == currentYear;
    });

    const countCategories = filterDataBasedByMonth.reduce(
      (acc: CategoryCount, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      },
      {}
    );

    return countCategories;
  };

  const getLastNDays = (days: number): string[] => {
    const daysArray = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const month = date.toLocaleString("en-US", { month: "short" });
      const day = date.getDate();
      const dayFormat = `${month} ${day}`;
      daysArray.push(dayFormat);
    }
    return daysArray.reverse();
  };

  // Note this must be in US date abbrev format
  const monthsInAYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  

  const getBarChartData = (period: string): BarChart[] => {
    if (period === "1year") {
      const salesByYear = monthsInAYear.map((abbrevMonth: string) => ({
        date: abbrevMonth,
        ...filterByMonth(abbrevMonth, salesArray),
      }));
      return salesByYear;
    } else if (period === "last7days") {
      const last7days = getLastNDays(7);
      const salesLast7Days = last7days.map((abbrevDate: string) => ({
        date: abbrevDate,
        ...filterByDay(abbrevDate, salesArray),
      }));
      return salesLast7Days;
    } else {
      const last30days = getLastNDays(30);
      const salesLast30Days = last30days.map((abbrevDate: string) => ({
        date: abbrevDate,
        ...filterByDay(abbrevDate, salesArray),
      }));
      return salesLast30Days;
    }
  };

  const colors:string[] = ["#EB5017", "#17A2EB", "#50EB17", "#EB17A2", "#FFD700"];

  const barChartDataArray = getBarChartData(timePeriod);

  
  // const CustomLegend = ({ payload }:any) => {
  //   return (
  //     <div className="flex items-center justify-end mb-4">
  //       {payload.map((entry, index) => (
  //         <div key={`item-${index}`} style={{ color: entry.color }}>
  //           <div className="flex items-center">
  //             <PiDotOutlineBold size={32} color={entry.color} weight="fill" />
  //             {entry.value}
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  const tickFormatter = (value:any) => `${value}`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-3">
        <p className="font-bold text-[1rem]">Categories Sales Activity</p>
        <div className="w-[5.4rem]">
          <Select
            placeholder=""
            className="!rounded-full focus:!outline-none focus:!ring-white"
            size="sm"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            <option value="1year">1 year</option>
            <option value="last30days">Last 30 days</option>
            <option value="last7days">Last 7 days</option>
          </Select>
        </div>
      </div>
      <div className="border rounded-md p-2">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={barChartDataArray}
            margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="" stroke="#ddd" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={tickFormatter}
              // domain={[0, maxValue]}
              allowDecimals={false}
            />
            <Tooltip />
            <Legend
              // content={<CustomLegend />}
              layout="horizontal"
              verticalAlign="top"
              align="center"
            />
            {
              categoryArray?.map((list, index)=>(
                <Bar key={list._id} dataKey={list.category} fill={colors[index % colors.length]} />
              ))
            }
 
            {/* <Bar dataKey="Students" fill="#EB5017" />
            <Bar dataKey="Teachers" fill="#3F0482" />
            <Bar dataKey="Admins" fill="#7630C6" /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;
