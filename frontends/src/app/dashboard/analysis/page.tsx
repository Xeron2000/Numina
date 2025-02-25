import KanbanBoard from '@/components/visualization/KanbanBoard';

const initialCards = [
  {
    id: '1',
    title: '任务1',
    content: '这是第一个任务的内容',
  },
  {
    id: '2', 
    title: '任务2',
    content: '这是第二个任务的内容',
  },
  {
    id: '3',
    title: '任务3',
    content: '这是第三个任务的内容',
  },
];

export default function AnalysisPage() {
  return (
    <div className="p-6 flex flex-col gap-6 min-h-screen bg-base-100">
      <h1 className="text-4xl font-bold text-primary-content bg-primary p-4 rounded-box shadow-lg">
        智能分析看板
      </h1>

      <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
        <div className="card-body p-4 md:p-6">
          <h2 className="card-title text-2xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            任务看板
          </h2>
          <KanbanBoard initialCards={initialCards} />
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
        <div className="card-body p-4 md:p-6">
          <h2 className="card-title text-2xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            分析统计
          </h2>
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
            <div className="stat place-items-center">
              <div className="stat-title">总任务数</div>
              <div className="stat-value text-primary">3</div>
              <div className="stat-desc">↗︎ 12% 月环比</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-title">进行中</div>
              <div className="stat-value text-secondary">2</div>
              <div className="stat-desc">→ 与上月持平</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-title">已完成</div>
              <div className="stat-value">1</div>
              <div className="stat-desc">↘︎ 5% 月环比</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
        <div className="card-body p-4 md:p-6">
          <h2 className="card-title text-2xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            任务完成趋势
          </h2>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-gray-500">图表区域</span>
          </div>
        </div>
      </div>
    </div>
  );
}