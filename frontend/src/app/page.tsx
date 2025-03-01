import Link from "next/link";


export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900">
      {/* 标题部分 */}
      <h1 className="text-4xl font-bold mb-4">Numina</h1>
      <p className="text-lg text-gray-600 mb-8">简单、高效、可视化的数据分析平台</p>

      {/* CTA 按钮 */}
      <div className="flex gap-4">
        <Link href="/dashboard">
          <span className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            进入系统
          </span>
        </Link>
        <Link href="/login">
          <span className="px-6 py-3 border border-gray-400 text-gray-900 rounded-lg hover:bg-gray-100 transition">
            登录/注册
          </span>
        </Link>
      </div>

      {/* 背景装饰或动画（可选） */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-500 to-transparent opacity-30"></div>
    </div>
  );
}
