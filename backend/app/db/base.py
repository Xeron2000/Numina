# 导入基础类
from app.db.base_class import Base

# 导入所有模型以便 Alembic 能够检测到它们
# 注意：这些导入仅用于 Alembic，不应在其他地方使用
# 为避免循环导入，我们将这些导入放在文件末尾

# 在这里添加模型导入