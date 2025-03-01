import Link from "next/link";
import {
  TableCellsIcon,
  ChartBarIcon,
  ServerStackIcon,
  DocumentTextIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      {/* 主导航栏 */}
      <nav className="navbar bg-base-100 shadow-md">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            Numina
          </Link>
        </div>
        <div className="flex gap-2">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/dashboard" className="flex gap-2">
                <TableCellsIcon className="w-5 h-5" />
                仪表盘
              </Link>
            </li>
            <li>
              <Link href="/dashboard/analysis" className="flex gap-2">
                <ChartBarIcon className="w-5 h-5" />
                分析
              </Link>
            </li>
            <li>
              <Link href="/dashboard/datasets" className="flex gap-2">
                <ServerStackIcon className="w-5 h-5" />
                数据集
              </Link>
            </li>
            <li>
              <Link href="/dashboard/reports" className="flex gap-2">
                <DocumentTextIcon className="w-5 h-5" />
                报告
              </Link>
            </li>
            <li>
            </li>
          </ul>
          <div className="z-10 mr-8">
          <ThemeToggle />
          </div>
          <div className="dropdown dropdown-end mr-8 z-10">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
        </div>
      </nav>
      {/* 内容区域 */}
      <div className="flex-grow z-0">{children}</div>
    </div>
  );
}