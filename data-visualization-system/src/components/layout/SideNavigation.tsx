// components/layout/SideNavigation.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/dashboard/logo";
import { 
  LayoutDashboard, 
  Database, 
  BarChart, 
  LineChart, 
  Settings, 
  LogOut 
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Datasets",
    href: "/datasets",
    icon: Database,
  },
  {
    title: "Visualizations",
    href: "/visualizations",
    icon: BarChart,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: LineChart,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function SideNavigation({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 h-full flex flex-col", className)}>
      <div className="py-4 px-6 flex items-center">
        <Logo />
      </div>
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 border-t">
        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950/30">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}