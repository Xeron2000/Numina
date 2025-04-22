from fastapi import APIRouter, Depends, HTTPException
import requests
from sqlalchemy.orm import Session
from typing import List

from app.utils.city_data import collect_aqi_data

from app.core.deps import get_current_active_user
from app.core.exceptions import ResourceNotFoundException, PermissionDeniedException
from app.db.session import get_db
from app.models.geospatial import GeoFence
from app.models.user import User
from app.schemas.geospatial import (
    GeoFenceCreate, GeoFenceUpdate, GeoFenceResponse, 
    GeoFenceList, MapDataResponse, HeatmapDataResponse
)

router = APIRouter()

@router.get("/fences", response_model=GeoFenceList)
async def get_geofences(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(GeoFence).filter(GeoFence.owner_id == current_user.id).all()

@router.get("/map", response_model=MapDataResponse)
async def get_map_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # 实现地图数据获取逻辑
    pass

@router.get("/heatmap", response_model=HeatmapDataResponse)
async def get_heatmap_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # 实现热力图数据获取逻辑
    pass

provinceKey = {
  "11": "北京市",
  "12": "天津市",
  "13": "河北省",
  "14": "山西省",
  "15": "内蒙古自治区",
  "21": "辽宁省",
  "22": "吉林省",
  "23": "黑龙江省",
  "31": "上海市",
  "32": "江苏省",
  "33": "浙江省",
  "34": "安徽省",
  "35": "福建省",
  "36": "江西省",
  "37": "山东省",
  "41": "河南省",
  "42": "湖北省",
  "43": "湖南省",
  "44": "广东省",
  "45": "广西壮族自治区",
  "46": "海南省",
  "50": "重庆市",
  "51": "四川省",
  "52": "贵州省",
  "53": "云南省",
  "54": "西藏自治区",
  "61": "陕西省",
  "62": "甘肃省",
  "63": "青海省",
  "64": "宁夏回族自治区",
  "65": "新疆维吾尔自治区"
}

@router.get("/city")
async def get_city_data(
    # db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_active_user)
):
    data = collect_aqi_data()
    provinceData = {}
    provinceData1 = []
    cityData = {}
    for item in data:
        code = str(item["CityCode"])[0:2] 
        aqi = item["AQI"]
        provincename = provinceKey[code]
        if provincename not in provinceData:
            cityData[provincename] = []
            provinceData[provincename] = []
        provinceData[provincename].append(int(aqi))
        cityData[provincename].append({item["Area"]:item})

    for key, value in provinceData.items():
        provinceData1.append({"name":key,"value":sum(value) // len(value)})

    return {
        "cityData": cityData,
        "provinceData": provinceData1
    }

citysiteKey = [
    "TimePoint",
    "PositionName",
    "CO",
    "PM2_5",
    "Measure",
    "NO2",
    "O3",
    "PM10",
    "SO2",
    "AQI",
    "PrimaryPollutant",
    "Quality",
    "Unheathful",
    "NO"
]

@router.get("/citysite")
async def get_citysite_data(
    cityname: str,
    # db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_active_user)
):  
    print(cityname)
    citysiteData = []

    # citysite,get
    url = f"https://air.cnemc.cn:18007/CityData/GetAQIDataPublishLive?cityName={cityname}"

    headers = {
            "User-Agent": "Mozilla/5.0",
            "X-Requested-With": "XMLHttpRequest",
            "Referer": "https://air.cnemc.cn:18007/",
    }

    response = requests.get(url, headers=headers)
    datas = response.json()
    print(len(datas))
    for item in datas:
        filtered_data = {key: item[key] for key in citysiteKey if key in item}
        citysiteData.append(filtered_data)
    print(len(citysiteData))
    return {
        "cityname": cityname,
        "citysiteData": citysiteData
    }

@router.get("/cityhistory")
async def get_cityhistory_data(
    citycode: int,
    # db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_active_user)
):
    pass