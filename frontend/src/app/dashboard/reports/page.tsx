import { DocumentTextIcon, ArrowDownTrayIcon, TrashIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      name: "2025年1月销售报告",
      type: "PDF",
      status: "已完成",
      created: "2025-01-31",
      size: "12MB"
    },
    {
      id: 2,
      name: "Q4市场分析报告",
      type: "Excel",
      status: "生成中",
      created: "2025-01-15",
      size: "8MB"
    },
    {
      id: 3,
      name: "年度财务总结",
      type: "PDF",
      status: "失败",
      created: "2025-01-01",
      size: "15MB"
    }
  ];

  return (
    <div className="space-y-8">
      {/* 标题区域 */}
      <div className="bg-base-100 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-primary">报告管理</h1>
        <p className="text-base-content/80">查看、生成和管理数据分析报告</p>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4">
        <button className="btn btn-primary gap-2">
          <DocumentTextIcon className="w-5 h-5" />
          新建报告
        </button>
        <button className="btn btn-outline gap-2">
          <ClockIcon className="w-5 h-5" />
          查看生成历史
        </button>
      </div>

      {/* 报告列表 */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">报告列表</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>报告名称</th>
                  <th>类型</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th>大小</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.name}</td>
                    <td>{report.type}</td>
                    <td>
                      <span className={`badge ${
                        report.status === "已完成" ? "badge-success" :
                        report.status === "生成中" ? "badge-warning" :
                        "badge-error"
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td>{report.created}</td>
                    <td>{report.size}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm gap-1" disabled={report.status !== "已完成"}>
                          <ArrowDownTrayIcon className="w-4 h-4" />
                          下载
                        </button>
                        <button className="btn btn-ghost btn-sm gap-1">
                          <TrashIcon className="w-4 h-4" />
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 报告生成统计 */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
        <div className="stat">
          <div className="stat-title">总报告数量</div>
          <div className="stat-value text-primary">128</div>
          <div className="stat-desc">2025年至今</div>
        </div>
        <div className="stat">
          <div className="stat-title">平均生成时间</div>
          <div className="stat-value text-secondary">3.2分钟</div>
          <div className="stat-desc">基于最近30天数据</div>
        </div>
        <div className="stat">
          <div className="stat-title">成功率</div>
          <div className="stat-value text-accent">96.5%</div>
          <div className="stat-desc">过去90天</div>
        </div>
      </div>
    </div>
  );
}