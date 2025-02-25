from typing import Dict, Any, Optional
from datetime import datetime
from app.schemas.analysis import CleanRequest, TransformRequest, TrainRequest, AnalysisRequest
import numpy as np
from app.services.dataset_service import DatasetService
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
import pickle

class AnalysisService:
    @staticmethod
    async def clean_data(request: CleanRequest) -> Dict[str, Any]:
        # 获取数据集
        dataset = await DatasetService.get_dataset(request.dataset_id)
        df = pd.read_parquet(dataset.path)
        
        # 应用清洗规则
        for rule, params in request.cleaning_rules.items():
            if rule == "drop_na":
                df = df.dropna(**params)
            elif rule == "fill_na":
                df = df.fillna(**params)
            elif rule == "drop_duplicates":
                df = df.drop_duplicates(**params)
            elif rule == "rename_columns":
                df = df.rename(columns=params)
        
        # 保存清洗后的数据
        output_path = f"data/cleaned/{request.dataset_id}.{request.output_format}"
        df.to_parquet(output_path)
        
        return {"path": output_path, "rows": len(df)}

    @staticmethod
    async def transform_data(request: TransformRequest) -> Dict[str, Any]:
        # 获取数据集
        dataset = await DatasetService.get_dataset(request.dataset_id)
        df = pd.read_parquet(dataset.path)
        
        # 构建转换管道
        pipeline = Pipeline([
            (step["name"], step["transformer"](**step.get("params", {})))
            for step in request.transformation_pipeline
        ])
        
        # 应用转换
        transformed_data = pipeline.fit_transform(df)
        
        # 保存转换后的数据
        output_path = f"data/transformed/{request.dataset_id}.{request.output_format}"
        transformed_data.to_parquet(output_path)
        
        return {"path": output_path, "rows": len(transformed_data)}

    @staticmethod
    async def analyze_trends(
        request: AnalysisRequest,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """执行趋势分析并返回图表数据"""
        try:
            dataset = await DatasetService.get_dataset(request.dataset_id)
            df = pd.read_parquet(dataset.path)
            
            # 时间序列处理
            df['date'] = pd.to_datetime(df[request.date_column])
            df.set_index('date', inplace=True)
            
            # 应用时间范围过滤
            if request.start_date:
                df = df.loc[request.start_date:]
            if request.end_date:
                df = df.loc[:request.end_date]
            
            # 按指定周期重采样
            resampled = df[request.value_column].resample(request.interval).agg({
                'sum': 'sum',
                'avg': 'mean',
                'max': 'max',
                'min': 'min'
            })
            
            # 生成折线图数据格式
            chart_data = {
                "labels": resampled.index.strftime('%Y-%m-%d').tolist(),
                "datasets": [{
                    "label": request.value_column,
                    "data": resampled['avg'].round(2).tolist(),
                    "borderColor": "#4F46E5",
                    "fill": False
                }]
            }
            
            return {
                "chart_data": chart_data,
                "stats": {
                    "total": resampled['sum'].sum(),
                    "average": resampled['avg'].mean(),
                    "peak_value": resampled['max'].max(),
                    "peak_date": resampled['max'].idxmax().strftime('%Y-%m-%d')
                }
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"趋势分析失败: {str(e)}")

    @staticmethod
    async def train_model(request: TrainRequest) -> Dict[str, Any]:
        # 获取数据集
        dataset = await DatasetService.get_dataset(request.dataset_id)
        df = pd.read_parquet(dataset.path)
        
        # 划分训练测试集
        X = df.drop(columns=[request.model_config["target"]])
        y = df[request.model_config["target"]]
        X_train, X_test, y_train, y_test = train_test_split(
            X, y,
            test_size=request.test_size,
            random_state=request.random_state
        )
        
        # 训练模型
        model = request.model_config["model"](**request.training_params)
        model.fit(X_train, y_train)
        
        # 保存模型
        model_path = f"models/{request.dataset_id}.pkl"
        with open(model_path, "wb") as f:
            pickle.dump(model, f)
        
        return {
            "model_path": model_path,
            "test_size": len(X_test),
            "train_size": len(X_train)
        }

    @staticmethod
    def clean_data(df: pd.DataFrame) -> pd.DataFrame:
        """基础数据清洗
        参数:
            df: 原始数据 DataFrame
        返回:
            清洗后的 DataFrame (删除空值并重置索引)
        """
        return df.dropna().reset_index(drop=True)

    @staticmethod
    def generate_trend(df: pd.DataFrame) -> dict:
        """生成趋势数据
        参数:
            df: 清洗后的 DataFrame
        返回:
            各列平均值的趋势字典
        """
        return df.mean().round(2).to_dict()