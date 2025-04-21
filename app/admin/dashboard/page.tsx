import React from 'react'
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
import BarChartComponent from './components/barchart';

const Page = () => {
  return (
    <div>
      <BarChartComponent/>
      </div>
  )
}

export default Page