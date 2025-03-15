import os
import uuid
import pandas as pd
from fastapi import UploadFile
from typing import Tuple, Dict, List, Any
import json
import numpy as np

from app.core.config import settings
from app.utils.data_processor import execute_query

def validate_file_extension(filename: str) -> bool:
    """验证文件扩展名是否允许上传"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in settings.ALLOWED_EXTENSIONS

async def save_upload_file(file: UploadFile) -> str:
    """保存上传的文件，返回文件路径"""
    # 确保上传目录存在
    os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)
    
    # 生成唯一文件名
    unique_filename = f"{uuid.uuid4()}.{file.filename}"
    file_path = os.path.join(settings.UPLOAD_FOLDER, unique_filename)
    
    # 保存文件
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    return file_path

def get_file_info(file_path: str, file_extension: str) -> Tuple[int, str]:
    """获取文件信息，返回行数和列信息"""
    result = execute_query(file_path,file_extension)

    row_count = result['row_count']
    df = result['result']
    
    # 获取列信息
    columns_info = []
    for col in df.columns:
        dtype_name = str(df[col].dtype)
        columns_info.append({
            "name": col,
            "type": dtype_name,
            "sample": convert_numpy_types(df[col].iloc[0]) if not df.empty else None
        })

    return row_count, json.dumps(columns_info)

def convert_numpy_types(value):
    if isinstance(value, (np.integer)):
        return int(value)
    elif isinstance(value, (np.floating)):
        return float(value)
    return value