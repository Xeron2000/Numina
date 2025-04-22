import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ErrorBoundary } from '@/components/error-boundary';
import * as echarts from 'echarts';
import chinaMapData from '@/features/geospatial/map/data/province.json';
import { geospatialApi } from '@/api/geospatial';

const { getCitySiteData, getCityData } = geospatialApi;


export default function GeospatialMap() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.EChartsType | null>(null);
  const [currentView, setCurrentView] = useState<string>('china');
  const [searchText, setSearchText] = useState('');
  const [airQualityData, setAirQualityData] = useState();

  const citySiteData = async (cityName: string) => {
    const data = await getCitySiteData(cityName);
    console.log(data);
  }

  const allCityData = async () => {
    console.log('allCityData')
    const response = await getCityData();
    sessionStorage.setItem('cityData', JSON.stringify(response.cityData));
    sessionStorage.setItem('provinceData', JSON.stringify(response.provinceData));
  }

  // 初始化图表
  useEffect(() => {

    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);
    chart.current = myChart;
    const initMapAfterDataLoaded = async () => {
      if (!sessionStorage.getItem('provinceData') && !sessionStorage.getItem("cityData")) {
        await allCityData(); // 如果是异步函数
      }

      // 数据加载完成后再加载地图
      loadMap('china');
    };

    initMapAfterDataLoaded(); // 调用初始化函数

    // 窗口大小变化时重绘图表
    const resizeHandler = () => myChart.resize();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      myChart.dispose();
    };
  }, []);

  // 加载地图数据并渲染
  const loadMap = async (mapName: string) => {
    if (!chart) return;

    try {
      let mapData;

      if (mapName === 'china') {
        // 全国地图已经预先导入
        mapData = chinaMapData
      } else {
        // 动态导入省份地图数据
        try {
          // 注意路径写法，这里使用模板字符串动态构建路径
          const module = await import(`@/features/geospatial/map/data/province_all/${mapName}.json`);
          mapData = module.default; // 使用.default获取实际数据
        } catch (importError) {
          console.error(`无法加载${mapName}的地图数据:`, importError);
          return; // 加载失败时提前返回
        }
      }

      // 设置当前空气质量数据
      let currentData = [];

      if (mapName === 'china') {
        currentData = JSON.parse(sessionStorage.getItem('provinceData') || '[]');
      } else {
        const raw = JSON.parse(sessionStorage.getItem('cityData') || '{}');
        const datas = raw[mapName] || {};
        console.log(datas)
        for (const data of datas) {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              currentData.push({
                name: data[key]["Area"],
                value: Number(data[key]["AQI"])
              });
            }
          }
        }
      }

      setAirQualityData(currentData);

      // 注册地图并渲染
      echarts.registerMap(mapName, mapData);
      console.log(currentData)
      renderMap(mapName, currentData);
    } catch (error) {
      console.error("加载地图数据失败:", error);
    }
  };

  // 渲染地图
  const renderMap = (mapName: string, data: any[]) => {
    if (!chart.current) return;

    const option = {
      title: {
        text: mapName === 'china' ? '中国空气质量指数' : `${mapName}空气质量指数`,
        subtext: '点击省份查看详情',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>空气质量指数: {c}'
      },
      visualMap: {
        min: 0,
        max: 600,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],
        inRange: {
          color: ['#00e400', '#ffff00', '#ff7e00', '#ff0000', '#99004c', '#99004c', '#7e0023', '#7e0023', '#7e0023', '#7e0023', '#7e0023', '#7e0023']
        },
        calculable: true
      },
      series: [
        {
          name: '空气质量指数',
          type: 'map',
          map: mapName,
          roam: true,
          emphasis: {
            label: {
              show: true
            }
          },
          data: data
        }
      ]
    };

    chart.current.setOption(option);
    // 为地图添加点击事件
    chart.current.off('click');

    chart.current.on('click', function (params) {
      if (mapName === 'china') {
        resetZoom();
        const provinceName = params.name;
        setCurrentView(provinceName);
        loadMap(provinceName);
      } else {
        // 处理城市点击事件
        console.log("adcode", params);
        const cityName = params.name;
        setCurrentView(cityName);
        console.log('城市点击事件:', cityName);
      }
    });
  };

  const resetZoom = () => {
    if (chart.current) {
      chart.current.dispatchAction({
        type: 'restore'
      });
    }
  };

  // 返回全国视图
  const handleBack = () => {
    setCurrentView('china');
    loadMap('china');
    resetZoom();
  };

  useEffect(() => {

  }, [currentView, airQualityData])

  // 处理搜索
  const handleSearch = () => {
    if (!searchText) return;

    const province = airQualityData.find(item =>
      item.name.includes(searchText)
    );

    if (province && currentView === 'china') {
      setCurrentView(province.name);
      loadMap(province.name);
    }
  };

  return (
    <ErrorBoundary>
      <div className="container">
        <Header>
        <div className="w-full flex flex-row items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">地图分析</h2>
              <p className="text-sm text-muted-foreground">
                空气质量数据的地理空间分析
              </p>
            </div>
            <div>
              <div className="flex gap-2">
                <Input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="输入省份名称"
                />
                <Button onClick={handleSearch}>搜索</Button>
              </div>
            </div>
          </div>
        </Header>
        <Main className="py-6">
          <div className="grid gap-4 lg:grid-cols-4">
            <Card className="lg:col-span-3">
              <div className="aspect-[16/9] relative">
                <div
                  ref={chartRef}
                  className="w-full h-full"
                />
                {currentView !== 'china' && (
                  <Button
                    onClick={handleBack}
                    className="absolute top-4 left-4"
                  >
                    返回全国
                  </Button>
                )}
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                <div className="flex items-center mr-4">
                  <span className="inline-block w-4 h-4 bg-[#00e400] mr-1"></span>
                  <span className="text-sm">优 (0-50)</span>
                </div>
                <div className="flex items-center mr-4">
                  <span className="inline-block w-4 h-4 bg-[#ffff00] mr-1"></span>
                  <span className="text-sm">良 (51-100)</span>
                </div>
                <div className="flex items-center mr-4">
                  <span className="inline-block w-4 h-4 bg-[#ff7e00] mr-1"></span>
                  <span className="text-sm">轻度污染 (101-150)</span>
                </div>
                <div className="flex items-center mr-4">
                  <span className="inline-block w-4 h-4 bg-[#ff0000] mr-1"></span>
                  <span className="text-sm">中度污染 (151-200)</span>
                </div>
                <div className="flex items-center mr-4">
                  <span className="inline-block w-4 h-4 bg-[#99004c] mr-1"></span>
                  <span className="text-sm">重度污染 (201-300)</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 bg-[#7e0023] mr-1"></span>
                  <span className="text-sm">严重污染 ({'>'}300)</span>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-4">

              </div>
            </Card>
          </div>
        </Main>
      </div>
    </ErrorBoundary>
  );
}
