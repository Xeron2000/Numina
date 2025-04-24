import { createContext, useContext } from 'react';
import * as echarts from 'echarts';

interface MapContextType {
  chart: echarts.EChartsType | null;
  setChart: (chart: echarts.EChartsType | null) => void;
}

export const MapContext = createContext<MapContextType>({
  chart: null,
  setChart: () => {},
});

export const useMapContext = () => useContext(MapContext);