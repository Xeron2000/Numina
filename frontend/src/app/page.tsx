import Link from "next/link";
import { ChartBarIcon, CloudArrowUpIcon, CpuChipIcon, LockClosedIcon, MagnifyingGlassIcon, PresentationChartLineIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* 英雄区域 */}
      <div className="hero min-h-[60vh] bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold text-primary mb-6">智能数据分析平台</h1>
            <p className="text-xl text-base-content/80 mb-8">
              基于人工智能的下一代数据分析解决方案，助力企业快速洞察数据价值
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard" className="btn btn-primary btn-lg gap-2">
                <ChartBarIcon className="w-6 h-6" />
                立即体验
              </Link>
              <Link href="/login" className="btn btn-outline btn-lg">
                登录/注册
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 核心功能展示 */}
      <div className="py-24 px-4 bg-base-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">核心功能</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 数据可视化 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <ChartBarIcon className="w-16 h-16 text-primary" />
                <h3 className="card-title text-2xl mt-4">智能可视化</h3>
                <p className="text-base-content/80">
                  支持多种图表类型，实时生成交互式数据看板
                </p>
              </div>
            </div>

            {/* 数据探索 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <MagnifyingGlassIcon className="w-16 h-16 text-secondary" />
                <h3 className="card-title text-2xl mt-4">数据探索</h3>
                <p className="text-base-content/80">
                  快速发现数据中的模式和异常，支持多维分析
                </p>
              </div>
            </div>

            {/* 智能分析 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <CpuChipIcon className="w-16 h-16 text-accent" />
                <h3 className="card-title text-2xl mt-4">AI驱动分析</h3>
                <p className="text-base-content/80">
                  内置机器学习算法，自动发现数据深层洞见
                </p>
              </div>
            </div>

            {/* 报告生成 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <PresentationChartLineIcon className="w-16 h-16 text-primary" />
                <h3 className="card-title text-2xl mt-4">自动报告</h3>
                <p className="text-base-content/80">
                  一键生成专业数据分析报告，支持多种格式导出
                </p>
              </div>
            </div>

            {/* 数据安全 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <LockClosedIcon className="w-16 h-16 text-secondary" />
                <h3 className="card-title text-2xl mt-4">企业级安全</h3>
                <p className="text-base-content/80">
                  端到端数据加密，符合GDPR等国际安全标准
                </p>
              </div>
            </div>

            {/* 数据集成 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <CloudArrowUpIcon className="w-16 h-16 text-accent" />
                <h3 className="card-title text-2xl mt-4">无缝集成</h3>
                <p className="text-base-content/80">
                  支持多种数据源接入，实现数据统一管理
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 数据统计 */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
        <div className="stat">
          <div className="stat-title">每日处理数据量</div>
          <div className="stat-value text-primary">15TB</div>
          <div className="stat-desc">2021年至今增长300%</div>
        </div>
        <div className="stat">
          <div className="stat-title">服务企业客户</div>
          <div className="stat-value text-secondary">1.2K+</div>
          <div className="stat-desc">覆盖30+行业领域</div>
        </div>
        <div className="stat">
          <div className="stat-title">平均分析效率提升</div>
          <div className="stat-value text-accent">65%</div>
          <div className="stat-desc">基于客户反馈数据</div>
        </div>
      </div>
    </div>
  );
}
