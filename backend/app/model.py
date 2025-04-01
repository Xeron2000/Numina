import pkgutil
import importlib
from app.db.base import Base
from rich.console import Console
from rich.table import Table

console = Console()

def get_models():
    models = []
    package = "app.models"
    
    # 遍历 `app/models` 目录下的所有模块，强制导入它们
    for _, module_name, _ in pkgutil.iter_modules(["app/models"]):
        module = importlib.import_module(f"{package}.{module_name}")
        # 遍历模块内的类，找到继承 `Base` 的 ORM 模型
        for attr in dir(module):
            obj = getattr(module, attr)
            if isinstance(obj, type) and issubclass(obj, Base) and obj is not Base:
                models.append(obj)
    return models

def list_detailed_models():
    # 先强制导入所有模型，确保 __subclasses__() 有值
    get_models()
    
    models = Base.__subclasses__()
    if not models:
        console.print("[red]没有找到任何 ORM 模型，请确认模型模块已正确导入。[/red]")
        return

    for model in models:
        # 模型名称和表名
        model_name = model.__name__
        table_name = model.__tablename__
        console.print(f"[bold magenta]{model_name}[/bold magenta] ([cyan]{table_name}[/cyan])")
        
        # 构建字段信息表格
        table = Table(show_header=True, header_style="bold blue")
        table.add_column("Column Name", style="cyan", justify="left")
        table.add_column("Type", style="green", justify="left")
        table.add_column("Nullable", style="yellow", justify="center")
        table.add_column("Default", style="white", justify="left")
        
        for column in model.__table__.columns:
            # 获取默认值，如果有的话
            default = str(column.default.arg) if column.default is not None else ""
            table.add_row(
                column.name,
                str(column.type),
                str(column.nullable),
                default
            )
        console.print(table)
        console.print("\n")

if __name__ == "__main__":
    list_detailed_models()
