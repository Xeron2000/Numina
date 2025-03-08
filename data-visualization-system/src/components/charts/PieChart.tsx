// components/charts/PieChart.tsx
import React, { useMemo } from "react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useTheme } from "next-themes";

interface PieChartProps {
  data: any[];
  nameKey: string;
  valueKey: string;
  colors?: string[];
  className?: string;
  innerRadius?: number;
  outerRadius?: number;
  showLabels?: boolean;
}

const RADIAN = Math.PI / 180;

const PieChart: React.FC<PieChartProps> = ({
  data,
  nameKey,
  valueKey,
  colors,
  className,
  innerRadius = 0,
  outerRadius = 80,
  showLabels = false,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const chartColors = useMemo(() => {
    if (colors && colors.length) return colors;

    return isDark
      ? [
          "#6366f1", // indigo-500
          "#f59e0b", // amber-500
          "#10b981", // emerald-500
          "#ef4444", // red-500
          "#8b5cf6", // violet-500
          "#ec4899", // pink-500
          "#06b6d4", // cyan-500
          "#f97316", // orange-500
          "#14b8a6", // teal-500
          "#a3e635", // lime-500
        ]
      : [
          "#4f46e5", // indigo-600
          "#d97706", // amber-600
          "#059669", // emerald-600
          "#dc2626", // red-600
          "#7c3aed", // violet-600
          "#db2777", // pink-600
          "#0891b2", // cyan-600
          "#ea580c", // orange-600
          "#0d9488", // teal-600
          "#65a30d", // lime-600
        ];
  }, [colors, isDark]);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

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
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showLabels ? renderCustomizedLabel : undefined}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}`, ""]}
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              borderColor: isDark ? "#333" : "#e5e7eb",
              color: isDark ? "#9ca3af" : "#4b5563",
            }}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ fontSize: "12px" }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;