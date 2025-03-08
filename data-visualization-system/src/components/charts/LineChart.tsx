// components/charts/LineChart.tsx
import React, { useMemo } from "react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "next-themes";

interface LineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  name: string;
  color?: string;
  additionalLines?: {
    key: string;
    name: string;
    color?: string;
  }[];
  className?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  yKey,
  name,
  color,
  additionalLines = [],
  className,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const chartColors = useMemo(() => {
    return {
      main: color || (isDark ? "#6366f1" : "#4f46e5"), // indigo-500/600
      grid: isDark ? "#333" : "#e5e7eb", // gray-200 in light / gray-700 in dark
      text: isDark ? "#9ca3af" : "#4b5563", // gray-400 in dark / gray-600 in light
      background: isDark ? "#1f2937" : "#ffffff", // gray-800 in dark / white in light
      additionalColors: [
        "#f59e0b", // amber-500
        "#10b981", // emerald-500
        "#ef4444", // red-500
        "#8b5cf6", // violet-500
        "#ec4899", // pink-500
      ],
    };
  }, [color, isDark]);

  // Format date if the xKey is a date
  const formattedData = useMemo(() => {
    return data.map((item) => {
      const newItem = { ...item };
      // Try to detect if it's a date string
      if (typeof item[xKey] === "string" && item[xKey].match(/^\d{4}-\d{2}-\d{2}/)) {
        const date = new Date(item[xKey]);
        if (!isNaN(date.getTime())) {
          newItem[xKey] = date.toLocaleDateString();
        }
      }
      return newItem;
    });
  }, [data, xKey]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis
            dataKey={xKey}
            tick={{ fill: chartColors.text }}
            tickLine={{ stroke: chartColors.text }}
            axisLine={{ stroke: chartColors.grid }}
          />
          <YAxis
            tick={{ fill: chartColors.text }}
            tickLine={{ stroke: chartColors.text }}
            axisLine={{ stroke: chartColors.grid }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: chartColors.background,
              borderColor: chartColors.grid,
              color: chartColors.text,
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={yKey}
            name={name}
            stroke={chartColors.main}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          {additionalLines.map((line, index) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color || chartColors.additionalColors[index % chartColors.additionalColors.length]}
              strokeWidth={2}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;