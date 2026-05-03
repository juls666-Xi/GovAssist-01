"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { ChartContainer } from "./chart-container";

interface ActivityChartProps {
  data: Array<{
    month: string;
    applications: number;
    approved: number;
    rejected: number;
  }>;
  type?: "bar" | "line";
}

export function ActivityChart({ data, type = "bar" }: ActivityChartProps) {
  return (
    <ChartContainer
      title="Monthly Activity"
      description="Application submissions and outcomes over time"
    >
      <ResponsiveContainer width="100%" height={300}>
        {type === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="applications" fill="#0ea5e9" name="Applications" />
            <Bar dataKey="approved" fill="#10b981" name="Approved" />
            <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="applications" stroke="#0ea5e9" name="Applications" />
            <Line type="monotone" dataKey="approved" stroke="#10b981" name="Approved" />
            <Line type="monotone" dataKey="rejected" stroke="#ef4444" name="Rejected" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </ChartContainer>
  );
}
