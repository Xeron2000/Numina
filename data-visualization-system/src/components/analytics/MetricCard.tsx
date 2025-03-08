// src/components/analytics/MetricCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  loading: boolean;
  icon: React.ReactNode;
}

const MetricCard = ({ title, value, change, loading, icon }: MetricCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? <Skeleton className="h-6 w-32" /> : value}
        </div>
        <div className="text-sm text-muted-foreground flex items-center">
          {loading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <>
              {change > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span>{Math.abs(change)}%</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;