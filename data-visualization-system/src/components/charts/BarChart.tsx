// components/charts/BarChart.tsx
import React, { useMemo } from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "next-themes";

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  name: string;
  color?: string;
  additionalBars?: {
    key: string;
    name: string;
    color?: string;
  }[];
  className?: string;
  layout?: "vertical" | "horizontal";
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  yKey,
  name,
  color,
  additionalBars = [],
  className,
  layout = "horizontal",
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

  // Format date if the xKey contains date strings
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
  }, [data, xKey, resolvedTheme]);

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
        <RechartsBarChart
          data={formattedData}
          layout={layout}
          margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis
            dataKey={layout === "horizontal" ? xKey : undefined}
            type={layout === "horizontal" ? "category" : "number"}
            tick={{ fill: chartColors.text, textAnchor: layout === "horizontal" ? "end" : "middle", style: { transform: `rotate(${-45}deg)` } }}
            tickLine={{ stroke: chartColors.text }}
            axisLine={{ stroke: chartColors.grid }}
            textAnchor={layout === "horizontal" ? "end" : "middle"}
            height={60}
          />
          <YAxis
            dataKey={layout === "vertical" ? xKey : undefined}
            type={layout === "vertical" ? "category" : "number"}
            tick={{ fill: chartColors.text }}
            tickLine={{ stroke: chartColors.text }}
            axisLine={{ stroke: chartColors.grid }}
            width={layout === "vertical" ? 120 : 80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: chartColors.background,
              borderColor: chartColors.grid,
              color: chartColors.text,
            }}
          />
          <Legend />
          <Bar
            dataKey={yKey}
            name={name}
            fill={chartColors.main}
            radius={[4, 4, 0, 0]}
          />
          {additionalBars.map((bar, index) => (
            <Bar
              key={`${bar.key}-${index}`}
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color || chartColors.additionalColors[index % chartColors.additionalColors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;