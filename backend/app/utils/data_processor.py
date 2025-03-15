import csv
import pandas as pd
from cachetools import cached, TTLCache
from typing import Dict, List, Any, Tuple
import json

from app.models.dataset import Dataset

# 初始化缓存，限制最大条目和存活时间
file_cache = TTLCache(maxsize=50, ttl=3600)  # 示例：最多缓存50个文件，存活1小时

def execute_query(file_path: str, file_type: str) -> Tuple[List[str], List[Dict[str, Any]], int]:
    """执行查询并返回结果"""
    delimiter = detect_delimiter(file_path)

    result = ''

    if file_path in file_cache:
        result = file_cache[file_path]
    else:
        # 读取数据到DataFrame
        if file_type == 'csv':
            result = pd.read_csv(file_path,sep=delimiter,)
            file_cache[file_path] = result
        elif file_type in ['xlsx', 'xls']:
            result = pd.read_csv(file_path)
            file_cache[file_path] = result
        elif file_type == 'json':
            result = pd.read_csv(file_path)
            file_cache[file_path] = result
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
    
    # 将结果转换为字典列表
    columns = result.columns.tolist()
    data = result.to_dict(orient='records')
    row_count = len(data)
    
    return {
        'result':result,
        'columns':columns,
        'data':data,
        'row_count':row_count
    }

def detect_delimiter(file_path, sample_lines=5):
    with open(file_path, 'r', encoding='utf-8') as f:
        # 读取前几行内容（跳过可能的注释行）
        sample = ''.join([f.readline() for _ in range(sample_lines)])
        
    # 使用 csv.Sniffer 检测分隔符
    sniffer = csv.Sniffer()
    delimiter = sniffer.sniff(sample).delimiter
    return delimiter