from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from fastapi import Form, HTTPException

from app.core.deps import get_current_active_user
from app.core.exceptions import ResourceNotFoundException, PermissionDeniedException
from app.db.session import get_db
from app.models.query import SavedQuery
from app.models.dataset import Dataset
from app.models.user import User
from app.models.analytics import AnalyticsTask  # Update this line
from app.schemas.query import (
    QueryRequest, QueryResult, SavedQueryCreate, SavedQueryUpdate, 
    SavedQueryResponse, SavedQueryList,
    AnalyticsTaskResponse, AnalyticsTaskList  # Move these from models to schemas
)
from app.utils.data_processor import execute_query

router = APIRouter()

from fastapi import HTTPException
import json


def analyze_china_data(data):
    """分析全国空气质量数据"""
    result = {
        "summary": {},
        "charts": {}
    }
    
    # 统计各省市空气质量等级分布
    quality_stats = {}
    aqi_data = []
    pollutant_stats = {
        "PM2_5": [],
        "PM10": [],
        "SO2": [],
        "NO2": [],
        "O3": [],
        "CO": []
    }
    
    for province, cities in data.items():
        for city_data in cities:
            for city_name, info in city_data.items():
                # AQI数据收集
                aqi_data.append({
                    "name": city_name,
                    "value": float(info["AQI"])
                })
                
                # 空气质量等级统计
                quality = info["Quality"]
                quality_stats[quality] = quality_stats.get(quality, 0) + 1
                
                # 污染物数据收集
                for pollutant in pollutant_stats.keys():
                    if pollutant == "PM2_5":
                        value = float(info["PM2_5"])
                    elif pollutant == "CO":
                        value = round(float(info["CO"]), 2)  # CO保留两位小数
                    else:
                        value = float(info[pollutant])
                    pollutant_stats[pollutant].append(value)
    
    # 生成统计结果
    result["summary"] = {
        "城市总数": len(aqi_data),
        "空气质量分布": quality_stats,
        "平均AQI": round(sum(item["value"] for item in aqi_data) / len(aqi_data), 2)
    }
    
    # 生成图表数据
    result["charts"] = {
        "aqi_distribution": {
            "title": { "text": "城市AQI分布" },
            "tooltip": { "trigger": "axis" },
            "xAxis": { 
                "type": "category",
                "data": [item["name"] for item in aqi_data]
            },
            "yAxis": { "type": "value" },
            "series": [{
                "type": "bar",
                "data": [int(item["value"]) for item in aqi_data]  # 转换为整数
            }]
        },
        "quality_pie": {
            "title": { "text": "空气质量等级分布" },
            "tooltip": { "trigger": "item" },
            "series": [{
                "type": "pie",
                "radius": "50%",
                "data": [{"name": k, "value": v} for k, v in quality_stats.items()]
            }]
        },
        "pollutant_radar": {
            "title": { "text": "污染物指标分析" },
            "tooltip": { "trigger": "item" },
            "radar": {
                "indicator": [
                    {"name": "PM2.5", "max": int(max(pollutant_stats["PM2_5"]))},  # 转换为整数
                    {"name": "PM10", "max": int(max(pollutant_stats["PM10"]))},
                    {"name": "SO2", "max": int(max(pollutant_stats["SO2"]))},
                    {"name": "NO2", "max": int(max(pollutant_stats["NO2"]))},
                    {"name": "O3", "max": int(max(pollutant_stats["O3"]))},
                    {"name": "CO", "max": int(max(pollutant_stats["CO"]))}
                ]
            },
            "series": [{
                "type": "radar",
                "data": [{
                    "value": [
                        int(sum(pollutant_stats["PM2_5"]) / len(pollutant_stats["PM2_5"])),  # 转换为整数
                        int(sum(pollutant_stats["PM10"]) / len(pollutant_stats["PM10"])),
                        int(sum(pollutant_stats["SO2"]) / len(pollutant_stats["SO2"])),
                        int(sum(pollutant_stats["NO2"]) / len(pollutant_stats["NO2"])),
                        int(sum(pollutant_stats["O3"]) / len(pollutant_stats["O3"])),
                        round(sum(pollutant_stats["CO"]) / len(pollutant_stats["CO"]), 2)  # CO保留两位小数
                    ],
                    "name": "平均值"
                }]
            }]
        }
    }
    
    return result

def analyze_historical_data(data):
    """分析历史空气质量数据"""
    from sklearn.linear_model import LinearRegression
    import numpy as np
    from datetime import datetime
    
    result = {
        "summary": {},
        "charts": {},
        "prediction": {}
    }
    
    # 提取时间序列数据
    time_series = []
    aqi_series = []
    pollutants_series = {
        "PM2_5": [],
        "PM10": [],
        "SO2": [],
        "NO2": [],
        "O3": [],
        "CO": []
    }
    
    for record in data["hour"]:
        time_point = record["TimePointStr"]
        time_series.append(time_point)
        aqi_series.append(float(record["AQI"]))
        
        for pollutant in pollutants_series.keys():
            if pollutant == "PM2_5":
                value = float(record["PM2_5"])
            elif pollutant == "CO":
                value = round(float(record["CO"]), 2)  # CO保留两位小数
            else:
                value = float(record[pollutant])
            pollutants_series[pollutant].append(value)
    
    # 计算统计指标
    result["summary"] = {
        "平均空气质量指数": int(np.mean(aqi_series)),
        "最高空气质量指数": int(max(aqi_series)),
        "最低空气质量指数": int(min(aqi_series)),
        "空气质量指数标准差": int(np.std(aqi_series))
    }
    
    # 准备预测数据
    X = np.array(range(len(time_series))).reshape(-1, 1)
    y = np.array(aqi_series)
    model = LinearRegression()
    model.fit(X, y)
    
    # 预测未来24小时
    future_X = np.array(range(len(time_series), len(time_series) + 24)).reshape(-1, 1)
    predictions = model.predict(future_X)
    
    # 生成图表数据
    result["charts"] = {
        "aqi_trend": {
            "title": { "text": "空气质量指数趋势" },
            "tooltip": { "trigger": "axis" },
            "xAxis": { 
                "type": "category",
                "data": time_series
            },
            "yAxis": { "type": "value" },
            "series": [{
                "type": "line",
                "data": [int(x) for x in aqi_series]
            }]
        },
        "pollutants_trend": {
            "title": { "text": "污染物浓度趋势" },
            "tooltip": { "trigger": "axis" },
            "legend": {
                "data": ["PM2.5", "PM10", "SO2", "NO2", "O3", "CO"]
            },
            "xAxis": { 
                "type": "category",
                "data": time_series
            },
            "yAxis": { "type": "value" },
            "series": [
                {
                    "name": pollutant,
                    "type": "line",
                    "data": [int(v) if pollutant != "CO" else round(v, 2) for v in values]
                }
                for pollutant, values in pollutants_series.items()
            ]
        }
    }
    
    # 添加预测结果
    result["prediction"] = {
        "title": { "text": "空气质量指数预测" },
        "tooltip": { "trigger": "axis" },
        "xAxis": { 
            "type": "category",
            "data": [f"未来{i+1}小时" for i in range(24)]
        },
        "yAxis": { "type": "value" },
        "series": [{
            "type": "line",
            "data": [int(x) for x in predictions.tolist()]
        }]
    }
    
    return result

def analyze_province_data(data):
    """分析省级空气质量数据"""
    result = {
        "summary": {},
        "charts": {}
    }
    
    # 统计城市空气质量
    cities_aqi = []
    cities_quality = {}
    pollutant_data = {
        "PM2_5": [],
        "PM10": [],
        "SO2": [],
        "NO2": [],
        "O3": [],
        "CO": []
    }
    
    for city_data in data:
        for city_name, info in city_data.items():
            # 收集AQI数据
            cities_aqi.append({
                "name": city_name,
                "value": float(info["AQI"])
            })
            
            # 统计空气质量等级
            quality = info["Quality"]
            cities_quality[quality] = cities_quality.get(quality, 0) + 1
            
            # 收集污染物数据
            for pollutant in pollutant_data.keys():
                if pollutant == "PM2_5":
                    value = float(info["PM2_5"])
                elif pollutant == "CO":
                    value = round(float(info["CO"]), 2)  # CO保留两位小数
                else:
                    value = float(info[pollutant])
                pollutant_data[pollutant].append({
                    "name": city_name,
                    "value": value
                })
    
    # 生成统计结果
    result["summary"] = {
        "城市总数": len(cities_aqi),
        "平均空气质量指数": int(sum(item["value"] for item in cities_aqi) / len(cities_aqi)),
        "空气质量分布": cities_quality
    }
    
    # 生成图表数据
    result["charts"] = {
        "cities_aqi": {
            "type": "bar",
            "title": {"text": "城市AQI分布"},
            "tooltip": {"trigger": "axis"},
            "xAxis": {
                "type": "category",
                "data": [item["name"] for item in sorted(cities_aqi, key=lambda x: x["value"], reverse=True)]
            },
            "yAxis": {"type": "value"},
            "series": [{
                "type": "bar",
                "data": [int(item["value"]) for item in sorted(cities_aqi, key=lambda x: x["value"], reverse=True)]
            }]
        },
        "quality_distribution": {
            "type": "pie",
            "title": {"text": "空气质量等级分布"},
            "tooltip": {"trigger": "item"},
            "series": [{
                "type": "pie",
                "radius": "50%",
                "data": [{"name": k, "value": v} for k, v in cities_quality.items()]
            }]
        },
        "pollutant_radar": {
            "title": {"text": "污染物指标分析"},
            "tooltip": {"trigger": "item"},
            "radar": {
                "indicator": [
                    {"name": "PM2.5", "max": max([item["value"] for item in pollutant_data["PM2_5"]])},
                    {"name": "PM10", "max": max([item["value"] for item in pollutant_data["PM10"]])},
                    {"name": "SO2", "max": max([item["value"] for item in pollutant_data["SO2"]])},
                    {"name": "NO2", "max": max([item["value"] for item in pollutant_data["NO2"]])},
                    {"name": "O3", "max": max([item["value"] for item in pollutant_data["O3"]])},
                    {"name": "CO", "max": max([item["value"] for item in pollutant_data["CO"]])}
                ]
            },
            "series": [{
                "type": "radar",
                "data": [{
                    "value": [
                        sum([item["value"] for item in pollutant_data["PM2_5"]]) / len(pollutant_data["PM2_5"]),
                        sum([item["value"] for item in pollutant_data["PM10"]]) / len(pollutant_data["PM10"]),
                        sum([item["value"] for item in pollutant_data["SO2"]]) / len(pollutant_data["SO2"]),
                        sum([item["value"] for item in pollutant_data["NO2"]]) / len(pollutant_data["NO2"]),
                        sum([item["value"] for item in pollutant_data["O3"]]) / len(pollutant_data["O3"]),
                        round(sum([item["value"] for item in pollutant_data["CO"]]) / len(pollutant_data["CO"]), 2)
                    ],
                    "name": "平均值"
                }]
            }]
        }
    }
    
    return result

@router.post("/saved-queries")
async def create_saved_query(
    query_in: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):

    # 检查数据集是否存在
    dataset = db.query(Dataset).filter(Dataset.id == query_in).first()
    if not dataset:
        raise ResourceNotFoundException("Dataset")
    
    # 检查权限
    if dataset.owner_id != current_user.id:
        raise PermissionDeniedException()
    
    path_name = dataset.file_path
    print(path_name)
    action = ''
    theName = ''
    try:
        with open(path_name, 'r', encoding='utf-8') as file:
            data = json.loads(file.read())
            print(f"成功读取JSON文件：{path_name}")
            
            # 根据数据类型调用相应的分析函数
            if 'china' in path_name:
                action = '全国空气质量分析'
                theName = '数据分析与可视化'
                result = analyze_china_data(data)
            elif 'Historical' in dataset.description:
                action = f'{dataset.name}空气质量预测'
                theName = '预测与可视化'
                result = analyze_historical_data(data)
            else:
                action = f'{dataset.name}空气质量分析'
                theName = '数据分析与可视化'
                result = analyze_province_data(data)
            print('ok')
            # 创建保存的查询
            db_query = AnalyticsTask(
                name=theName,
                status=action,
                query_string=json.dumps(result),
                dataset_id=query_in,
                owner_id=current_user.id
            )
            try:
                db.add(db_query)
                db.commit()
                db.refresh(db_query)
            except Exception as e:
                print(f"Error adding query to the database: {str(e)}")
                raise HTTPException(
                    status_code=500,
                    detail="Error adding query to the database"
                )

            return result
            
    except FileNotFoundError:
        print(f"找不到文件：{path_name}")
        raise ResourceNotFoundException(f"找不到文件：{path_name}")
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400,
            detail=f"无法解析JSON文件：{path_name}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"读取文件时发生错误：{str(e)}"
        )

# get task(id)
@router.get("/tasks/{id}", response_model=AnalyticsTaskResponse)
async def get_task(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    task = db.query(AnalyticsTask).filter(AnalyticsTask.id == id).first()
    
    if not task:
        raise ResourceNotFoundException("Analytics Task")
    
    if task.owner_id != current_user.id:
        raise PermissionDeniedException()
    
    return task
# get alltasks
@router.get("/tasks")
async def get_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(AnalyticsTask).filter(AnalyticsTask.owner_id == current_user.id)
    tasks = query.offset(skip).limit(limit).all()
    total = query.count()
    print(total)
    
    return {"items": tasks, "total": total}

# delete task
@router.delete("/tasks/{id}")
async def delete_task(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    task = db.query(AnalyticsTask).filter(AnalyticsTask.id == id).first()
    
    if not task:
        raise ResourceNotFoundException("Analytics Task")
    
    if task.owner_id != current_user.id:
        raise PermissionDeniedException()
    
    db.delete(task)
    db.commit()
