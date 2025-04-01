from fastapi import FastAPI
from app.api.analytics.routes import router as analytics_router
from app.api.auth.routes import router as auth_router
from app.api.datasets.routes import router as datasets_router
from app.api.visualizations.routes import router as visualizations_router
from rich.console import Console
from rich.table import Table

app = FastAPI()

# 注册子路由
app.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(datasets_router, prefix="/datasets", tags=["Datasets"])
app.include_router(visualizations_router, prefix="/visualizations", tags=["Visualizations"])

console = Console()

def list_routes():
    routes = [{"path": route.path, "methods": list(route.methods), "name": route.name} for route in app.routes]

    table = Table(title="Available API Routes", show_header=True, header_style="bold magenta")
    table.add_column("Path", style="cyan", justify="left")
    table.add_column("Methods", style="green", justify="center")
    table.add_column("Name", style="yellow", justify="left")
    
    for route in routes:
        table.add_row(
            route["path"],
            ", ".join(route["methods"]),
            route["name"]
        )
    
    console.print(table)
    return routes

if __name__ == "__main__":
    list_routes()  # 直接使用 rich 输出