import { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';
import { format } from 'date-fns';
import { Search, ArrowLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { ErrorBoundary } from '@/components/error-boundary';
import chinaMapData from '@/features/geospatial/map/data/province.json';
import { geospatialApi } from '@/api/geospatial';
import { datasetsApi } from '@/api/datasets';

const { getCitySiteData, getCityData, getCityHistoryData } = geospatialApi;
const { upload, uploaddict } = datasetsApi;

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

// interface CityData {
//   [key: string]: {};
// }

interface CityResponseData {
  cityData: any;
  provinceData: any;
}

interface CityDetailData {
  TimePoint: string;
  Area: string;
  CityCode: number | string;
  CO: string | number;
  NO2: string | number;
  O3: string | number;
  PM10: string | number;
  PM2_5: string | number;
  SO2: string | number;
  AQI: string | number;
  PrimaryPollutant: string;
  Quality: string;
  Measure: string;
  Unheathful: string;
}

export default function GeospatialMap() {
  const exampleData = {
    TimePoint: '',
    Area: '',
    CityCode: -1,
    CO: '',
    NO2: '',
    O3: '',
    PM10: '',
    PM2_5: '',
    SO2: '',
    AQI: '',
    PrimaryPollutant: '',
    Quality: '',
    Measure: '',
    Unheathful: ''
  }
  const chartRef = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.EChartsType | null>(null);
  const [currentView, setCurrentView] = useState<string>('china');
  const [searchText, setSearchText] = useState('');
  const [airQualityData, setAirQualityData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState<CityDetailData>(exampleData);

  const citySiteData = async (cityName: string, currentProvince: string) => {
    setIsLoading(true);
    try {
      const dataSite = await getCitySiteData(cityName);
      console.log('站点数据:', dataSite); // 使用数据
      console.log(currentProvince)
      const code = getCode(cityName, currentProvince);
      if (code) {
        const response = await getCityHistoryData(String(code));
        console.log(response);
      }
    } finally {
      setIsLoading(false);
    }
  }

    const getCode = (name: string, provinceName: string) => {
      const raw = JSON.parse(sessionStorage.getItem('cityData') || '{}');
      const datas = raw[provinceName] || [];  // 确保是数组
      for (let i = 0; i < datas.length; i++) {
        const city = datas[i];
        if (name in city) {
          return city[name]["CityCode"]
        }
      }
      return ""; // 如果没有找到，返回空字符串或其他默认值 
  }

  const allCityData = async () => {
    console.log('allCityData')
    const response = await getCityData();
    const data = response as unknown as CityResponseData;  // 先转为 unknown 再转为目标类型
    console.log("cityData",response)
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
    setIsLoading(true);

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
      echarts.registerMap(mapName, mapData);
      renderMap(mapName, currentData);
    } catch (error) {
      console.error("加载地图数据失败:", error);
    } finally {
      setIsLoading(false);
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
          selectedMode: 'single', // 添加选择模式
          select: {
            itemStyle: {
              areaColor: '#389BB7',  // 选中区域的颜色
              borderWidth: 2,         // 选中区域的边框宽度
              borderColor: '#fff',    // 选中区域的边框颜色
              shadowBlur: 10,         // 选中区域的阴影模糊大小
              shadowColor: 'rgba(0, 0, 0, 0.5)'  // 选中区域的阴影颜色
            }
          },
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
    chart.current.off('click'); // 移除之前的点击事件处理函数
    // 在 renderMap 函数中修改点击事件处理
    const allData = JSON.parse(sessionStorage.getItem('cityData') || '{}');
    chart.current.on('click', function (params) {
      if (mapName === 'china') {
        resetZoom();
        const provinceName = params.name;
        setCurrentView(provinceName);
        console.log('点击省份:', provinceName);
        loadMap(provinceName);
        if (allData && allData[provinceName]?.[0]) {
          const cityData = Object.values(allData[provinceName][0])[0] as CityDetailData;
          setCurrentData(cityData || exampleData);
        } else {
          setCurrentData(exampleData);
        }
      } else {
        // 处理城市点击事件
        const cityName = params.name;
        console.log('点击城市:', cityName, '所在省份:', mapName);
        const datas = allData[mapName] || [];
        if (datas) {
          for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            const [key, value] = Object.entries(data)[0]
            if (key === cityName) {
              setCurrentData(value as CityDetailData || exampleData);
            }
          }
        }
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
    setCurrentData(exampleData);  // 使用预定义的 exampleData 替代空对象
    loadMap('china');
    resetZoom();
  };

  useEffect(() => {

  }, [currentView, airQualityData, currentData])

  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 处理搜索
  const handleSearch = (cityName: string) => {
    if (!cityName) return;

    const allData = JSON.parse(sessionStorage.getItem('cityData') || '{}');

    // 遍历所有省份的数据
    for (const province in allData) {
      const cities = allData[province] || [];
      for (const cityData of cities) {
        const [key, value] = Object.entries(cityData)[0];
        if (key === cityName) {
          resetZoom();
          setCurrentView(province);
          loadMap(province);
          setCurrentData(value as CityDetailData);
          citySiteData(cityName, province);
          chart.current?.dispatchAction({
            type: 'select',
            name: cityName  // 要选中的区域名称
          });
          break;
        }
      }
    }

    setSearchText(cityName);
    setShowDropdown(false);
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    if (!value) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // 从 sessionStorage 获取所有城市数据
    const allData = JSON.parse(sessionStorage.getItem('cityData') || '{}');
    const matchedCities: string[] = [];

    // 遍历所有省份的数据查找匹配的城市
    for (const province in allData) {
      const cities = allData[province] || [];
      for (const cityData of cities) {
        const cityName = Object.keys(cityData)[0];
        if (cityName.toLowerCase().includes(value.toLowerCase())) {
          matchedCities.push(cityName);
        }
      }
    }

    setSearchResults(matchedCities);
    setShowDropdown(true);
  };
  const dataSets = () => {
    console.log(currentView)
    if (currentView === 'china') {
      const data = JSON.parse(sessionStorage.getItem('cityData') || '{}')
      console.log(currentView)
      const response = uploaddict(data);
      console.log(response)
    } else {
      const raw = JSON.parse(sessionStorage.getItem('cityData') || '{}');
      const datas = raw[currentView] || [];  // 确保是数组
      console.log(currentView);
      const response = upload(datas, currentView);
      console.log(response)
    }
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col">
        <Header className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="flex flex-1 items-center space-x-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">地理空间分析</h2>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{currentView === 'china' ? '全国' : currentView}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索城市..."
                  value={searchText}
                  onChange={handleInputChange}
                  className="pl-8"
                />
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute w-full mt-1 max-h-60 overflow-auto bg-white border rounded-md shadow-lg z-50">
                    {searchResults.map((city, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSearch(city)}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button onClick={dataSets} className="btn">
              datasets
            </button>
          </div>
        </Header>

        <Main className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
            <div className="flex-1 space-y-4">
              <Card>
                <div className="relative aspect-[2/1]">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                      <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">
                          正在加载地图数据...
                        </p>
                      </div>
                    </div>
                  ) : null}
                  <div ref={chartRef} className="absolute inset-0" />
                  {currentView !== 'china' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBack}
                      className="absolute left-4 top-4 z-10"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      返回全国
                    </Button>
                  )}
                </div>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">空气质量等级说明</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {[
                      { color: '#00e400', label: '优', range: '0-50' },
                      { color: '#ffff00', label: '良', range: '51-100' },
                      { color: '#ff7e00', label: '轻度污染', range: '101-150' },
                      { color: '#ff0000', label: '中度污染', range: '151-200' },
                      { color: '#99004c', label: '重度污染', range: '201-300' },
                      { color: '#7e0023', label: '严重污染', range: '>300' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="space-y-0.5">
                          <div className="text-xs font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.range}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full lg:w-[400px]">
              <Card>
                <CardHeader>
                  <CardTitle>空气质量详情</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {Object.keys(currentData).length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      <p>点击地图区域查看详细数据</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">{currentData.AQI}</div>
                            <div className="text-xs text-muted-foreground">
                              {currentData.Area}空气质量指数 (AQI)
                            </div>
                          </div>
                          <Badge variant="secondary" className={`
                            ${currentData.Quality === '优' ? 'bg-green-100 text-green-700' : ''}
                            ${currentData.Quality === '良' ? 'bg-yellow-100 text-yellow-700' : ''}
                            ${currentData.Quality === '轻度污染' ? 'bg-orange-100 text-orange-700' : ''}
                            ${currentData.Quality === '中度污染' ? 'bg-red-100 text-red-700' : ''}
                            ${currentData.Quality === '重度污染' ? 'bg-purple-100 text-purple-700' : ''}
                            ${currentData.Quality === '严重污染' ? 'bg-rose-100 text-rose-700' : ''}
                          `}>
                            {currentData.Quality}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          更新时间：{currentData.TimePoint ? format(new Date(currentData.TimePoint), 'yyyy-MM-dd HH:mm') : '-'}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        {[
                          { label: 'PM2.5', value: currentData.PM2_5, max: 500, unit: 'μg/m³' },
                          { label: 'PM10', value: currentData.PM10, max: 600, unit: 'μg/m³' },
                          { label: 'SO₂', value: currentData.SO2, max: 800, unit: 'μg/m³' },
                          { label: 'NO₂', value: currentData.NO2, max: 200, unit: 'μg/m³' },
                          { label: 'O₃', value: currentData.O3, max: 300, unit: 'μg/m³' },
                          { label: 'CO', value: currentData.CO, max: 15, unit: 'mg/m³' },
                        ].map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium">
                                        {item.label}
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">
                                      {getIndicatorDescription(item.label)}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <span className="text-sm">
                                {item.value} {item.unit}
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-secondary">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{
                                  width: `${(Number(item.value) / item.max) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-lg bg-yellow-50 p-4">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="mt-0.5 h-4 w-4 text-yellow-600" />
                          <div className="text-sm text-yellow-800">
                            <div>建议：{currentData.Measure}</div>
                            <div className="mt-1">{currentData.Unheathful}</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </Main>
      </div>
    </ErrorBoundary>
  );
}
