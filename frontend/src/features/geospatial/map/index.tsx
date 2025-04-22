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

const { getCitySiteData, getCityData} = geospatialApi;

import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";

interface CityData {
  [key: string]: {
    Area: string;
    AQI: string;
    Adcode: string;
    [key: string]: string;
  };
}

interface CityResponseData {
  cityData: {
    [province: string]: CityData[];
  };
  provinceData: {
    name: string;
    value: number;
  }[];
}

export default function GeospatialMap() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.EChartsType | null>(null);
  const [currentView, setCurrentView] = useState<string>('china');
  const [searchText, setSearchText] = useState('');
  const [airQualityData, setAirQualityData] = useState();

  const citySiteData = async (cityName: string, currentProvince: string) => {
    const dataSite = await getCitySiteData(cityName);
    console.log(dataSite);
    getCode(cityName, currentProvince);
  }

  const getCode = (name: string, provinceName: string) => {
    const raw = JSON.parse(sessionStorage.getItem('cityData') || '{}');
    console.log('当前省份:', provinceName);
    const datas = raw[provinceName] || {};
    console.log('城市数据:', datas);
    for (const data of datas) {
      for (const key in data) {
        if (key === name) {
          return data[key]["Adcode"];
        }
      }
    }
  }

  const allCityData = async () => {
    console.log('allCityData')
    const response = await getCityData();
    const data = response.data as CityResponseData;
    console.log("cityData", data.cityData)
    sessionStorage.setItem('cityData', JSON.stringify(data.cityData));
    sessionStorage.setItem('provinceData', JSON.stringify(data.provinceData));
  }
  const getIndicatorDescription = (indicator: string) => {
    const descriptions: Record<string, string> = {
      'PM2.5': '细颗粒物，直径小于等于2.5微米的颗粒物',
      'PM10': '可吸入颗粒物，直径小于等于10微米的颗粒物',
      'SO₂': '二氧化硫，主要来源于化石燃料燃烧',
      'NO₂': '二氧化氮，主要来源于机动车尾气和工业排放',
      'CO': '一氧化碳，不完全燃烧产生的有害气体',
      'O₃': '臭氧，光化学反应产生的次生污染物'
    };
    return descriptions[indicator] || '暂无说明';
  };
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
      console.log("currentData", currentData)
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
    // 在 renderMap 函数中修改点击事件处理
    chart.current.on('click', function (params) {
      if (mapName === 'china') {
        resetZoom();
        const provinceName = params.name;
        setCurrentView(provinceName);
        console.log('点击省份:', provinceName);
        loadMap(provinceName);
      } else {
        // 处理城市点击事件
        const cityName = params.name;
        console.log('点击城市:', cityName, '所在省份:', mapName);
        citySiteData(cityName, mapName); // 传入当前地图名称作为省份名
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
    console.log(currentView)
  }, [currentView, airQualityData])

  // 处理搜索
  const handleSearch = () => {
    if (!searchText) return;

    // const province = airQualityData.find(item =>
    //   item.name.includes(searchText)
    // );

    // if (province && currentView === 'china') {
    //   setCurrentView(province.name);
    //   loadMap(province.name);
    // }
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
                <div>
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-lg font-semibold">空气质量详情</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <div className="space-y-3">
                      <div className="relative w-full h-32 bg-white rounded-lg flex items-center justify-center mb-4">
                        <div className="absolute left-4 top-4">
                          <span className="text-sm text-muted-foreground">北京市</span>
                        </div>
                        <div className="absolute right-4 top-4">
                          <span className="text-xs text-muted-foreground">04月23日13:00 更新</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="relative w-24 h-24">
                            <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="10"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="10"
                                strokeDasharray="282.7"
                                strokeDashoffset={282.7 - (282.7 * 59) / 500}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-3xl font-bold">59</span>
                              <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                                良
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: 'PM2.5', value: 18, max: 100, unit: 'μg/m³' },
                          { label: 'PM10', value: 67, max: 100, unit: 'μg/m³' },
                          { label: 'SO₂', value: 4, max: 100, unit: 'μg/m³' },
                          { label: 'NO₂', value: 7, max: 100, unit: 'μg/m³' }
                        ].map((item, index) => (
                          <div key={index} className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <span className="text-sm text-muted-foreground cursor-help">{item.label}</span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">{getIndicatorDescription(item.label)}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <span className="text-sm font-medium">{item.value} {item.unit}</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${(item.value / item.max) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-start gap-2 bg-yellow-50 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <p className="text-sm text-yellow-700">推荐少数敏感人群减少户外活动</p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>
        </Main>
      </div>
    </ErrorBoundary>
  );
}
