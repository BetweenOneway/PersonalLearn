"""
DevContainer Demo - 工具函数
"""

import os
import json
from datetime import datetime, UTC


def get_container_info() -> dict:
    """
    检测当前是否运行在容器环境中
    返回环境信息字典
    """
    info = {
        "timestamp": datetime.now(UTC).isoformat(),
        "is_container": os.path.exists("/.dockerenv"),
        "hostname": os.uname().nodename if hasattr(os, "uname") else "unknown",
    }

    # 检查环境变量
    container_env_vars = {
        "PROJECT_NAME": os.environ.get("PROJECT_NAME"),
        "PYTHONUNBUFFERED": os.environ.get("PYTHONUNBUFFERED"),
        "FLASK_ENV": os.environ.get("FLASK_ENV"),
    }
    info["container_env_vars"] = container_env_vars

    return info


def save_info_to_file(filepath: str = "container_info.json") -> None:
    """将容器信息保存到文件"""
    info = get_container_info()
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(info, f, indent=2, ensure_ascii=False)
    print(f"✅ 容器信息已保存到 {filepath}")


def add(a: int, b: int) -> int:
    """简单的加法函数（用于演示测试）"""
    return a + b


def multiply(a: int, b: int) -> int:
    """简单的乘法函数（用于演示测试）"""
    return a * b
