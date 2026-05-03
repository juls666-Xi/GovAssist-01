"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartContainer } from "./chart-container";

interface ProgramDistributionProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function ProgramDistribution({ data }: ProgramDistributionProps) {
  return (
    <ChartContainer
      title="Program Distribution"
      description="Applications by assistance program"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
