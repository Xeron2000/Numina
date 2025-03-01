'use client';

import React from 'react';
import ChartConfigurator from '@/components/visualization/ChartConfigurator';

export default function OverviewPage() {
  return (
    <div className="p-6 space-y-6 bg-base-100 min-h-screen">

      {/* 关键指标卡片 - Material Design风格 */}
      {/* Google风格指标卡片 */}
      {/* 关键指标卡片组 - Material Design风格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 数据增长卡片 */}
        <div className="card shadow-sm hover:shadow-md transition-shadow ">
          <div className="card-body p-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">今日新增数据</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">2,345</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
              </svg>
              <span className="ml-1">12% 较昨日</span>
            </div>
          </div>
        </div>

        <div className="card shadow-lg bg-base-200 transition-all hover:shadow-xl">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="card-title text-lg">处理中任务</h3>
            </div>
            <div className="mt-2">
              <p className="text-3xl font-bold">89</p>
              <div className="badge badge-error badge-sm mt-2">↓3% 上周同期</div>
            </div>
          </div>
        </div>

        <div className="card shadow-lg bg-base-200 transition-all hover:shadow-xl">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="card-title text-lg">数据源健康度</h3>
            </div>
            <div className="mt-2">
              <p className="text-3xl font-bold text-success">98%</p>
              <div className="badge badge-warning badge-sm mt-2">2个异常源</div>
            </div>
          </div>
        </div>

        {/* 新增第四个指标卡片 */}
        <div className="card shadow-lg bg-base-200 transition-all hover:shadow-xl">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="card-title text-lg">平均响应时间</h3>
            </div>
            <div className="mt-2">
              <p className="text-3xl font-bold">236<span className="text-lg">ms</span></p>
              <div className="badge badge-success badge-sm mt-2">↓15% 上月</div>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 图表配置区 */}
        {/* Google风格图表区域 */}
        {/* 图表配置区 - Material Design风格 */}
        <div className="lg:col-span-2  p-6 rounded-lg shadow-md ">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-800">实时数据趋势</h2>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                刷新
              </button>
              <button className="btn btn-sm btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="h-96">
            <ChartConfigurator
              chartType="line"
              title="用户活跃度趋势"
              onConfigChange={(config) => console.log('配置更新:', config)}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* 快捷操作面板 */}
        <div className="space-y-4">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-lg">快捷操作</h2>
              <div className="space-y-3">
                <button className="btn btn-primary btn-block gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  新建分析任务
                </button>
                <button className="btn btn-outline btn-block gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  导入数据集
                </button>
              </div>
            </div>
          </div>

          {/* 最近活动 */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-lg">最近活动</h2>
              <ul className="menu menu-compact bg-base-100 rounded-box">
                <li className="menu-title">今日更新</li>
                <li>
                  <a className="py-3">
                    <div className="text-sm">新数据集上传</div>
                    <div className="text-xs opacity-50">10分钟前</div>
                  </a>
                </li>
                <li>
                  <a className="py-3">
                    <div className="text-sm">分析任务完成</div>
                    <div className="text-xs opacity-50">1小时前</div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}