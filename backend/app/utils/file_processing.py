import os
from pathlib import Path
from typing import Union
from fastapi import UploadFile
import pandas as pd

async def save_upload_file(upload_file: UploadFile, destination: Union[str, Path]) -> str:
    """保存上传文件到指定路径"""
    try:
        # 确保目标目录存在
        os.makedirs(os.path.dirname(destination), exist_ok=True)
        
        # 保存文件
        with open(destination, "wb") as buffer:
            content = await upload_file.read()
            buffer.write(content)
            
        return str(destination)
    except Exception as e:
        raise RuntimeError(f"文件保存失败: {str(e)}")

def parse_data_file(file_path: str) -> pd.DataFrame:
    """解析数据文件为DataFrame"""
    try:
        # 根据文件扩展名选择解析方式
        if file_path.endswith('.csv'):
            return pd.read_csv(file_path)
        elif file_path.endswith('.parquet'):
            return pd.read_parquet(file_path)
        elif file_path.endswith('.xlsx'):
            return pd.read_excel(file_path)
        else:
            raise ValueError("不支持的文件格式")
    except Exception as e:
        raise RuntimeError(f"文件解析失败: {str(e)}")