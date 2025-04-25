import { geospatialApi } from '@/api/geospatial';

export const cityDataService = {
  async getCityData() {
    const response = await geospatialApi.getCityData();
    const data = response as unknown as {
      cityData: any;
      provinceData: any;
    };
    
    // 保存到sessionStorage以供其他组件使用
    sessionStorage.setItem('cityData', JSON.stringify(data.cityData));
    sessionStorage.setItem('provinceData', JSON.stringify(data.provinceData));
    
    return data;
  }
};