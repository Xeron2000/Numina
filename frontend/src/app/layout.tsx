import { HomeIcon, ChartBarIcon, DocumentTextIcon, CogIcon, ServerStackIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="flex flex-col h-screen">
          {/* 主导航栏 */}
          <nav className="navbar bg-base-100 shadow-md flex-none">
            <div className="flex-1">
              <Link href="/" className="btn btn-ghost text-xl">
                数据分析平台
              </Link>
            </div>
            <div className="flex-none">
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
                  <Link href="/dashboard/settings" className="flex gap-2">
                    <CogIcon className="w-5 h-5" />
                    设置
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* 页面内容 */}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
