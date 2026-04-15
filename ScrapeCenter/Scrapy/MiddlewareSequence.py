# -*- coding: utf-8 -*-
"""
Scrapy 下载中间件优先级调用 最小演示示例
模拟：BASE配置 + 优先级排序 + request正序 + response逆序
"""

# ------------------------------
# 1. 模拟 Scrapy 内置 DOWNLOADER_MIDDLEWARES_BASE
# ------------------------------
DOWNLOADER_MIDDLEWARES_BASE = {
    'DemoMiddleware1': 100,  # 数值最小，最先执行 request
    'DemoMiddleware2': 300,
    'DemoMiddleware3': 500,
    'DemoMiddleware4': 700,  # 数值最大，最后执行 request
}

# 模拟用户自定义配置（可覆盖/禁用）
DOWNLOADER_MIDDLEWARES = {
    'DemoMiddleware3': None,  # 设为 None 即可禁用
}

# ------------------------------
# 2. 定义4个演示中间件（自带打印，看调用顺序）
# ------------------------------
class DemoMiddleware1:
    def process_request(self, request, spider):
        print(f"→ [请求] 中间件 1 (优先级100) 执行 process_request")
        return None  # 继续下一个中间件

    def process_response(self, request, response, spider):
        print(f"← [响应] 中间件 1 (优先级100) 执行 process_response")
        return response

class DemoMiddleware2:
    def process_request(self, request, spider):
        print(f"→ [请求] 中间件 2 (优先级300) 执行 process_request")
        return None

    def process_response(self, request, response, spider):
        print(f"← [响应] 中间件 2 (优先级300) 执行 process_response")
        return response

class DemoMiddleware3:
    def process_request(self, request, spider):
        print(f"→ [请求] 中间件 3 (优先级500) 执行 process_request")
        return None

    def process_response(self, request, response, spider):
        print(f"← [响应] 中间件 3 (优先级500) 执行 process_response")
        return response

class DemoMiddleware4:
    def process_request(self, request, spider):
        print(f"→ [请求] 中间件 4 (优先级700) 执行 process_request")
        return None

    def process_response(self, request, response, spider):
        print(f"← [响应] 中间件 4 (优先级700) 执行 process_response")
        return response

# ------------------------------
# 3. 模拟 Scrapy 核心：中间件排序（按优先级升序）
# ------------------------------
def load_and_sort_middlewares(base_mws, custom_mws):
    """
    完全复刻 Scrapy 逻辑：
    1. 合并 BASE + 用户配置
    2. 过滤 None（禁用）
    3. 按优先级数字**升序排序**
    """
    # 合并：用户配置覆盖 base
    merged = {**base_mws, **custom_mws}
    # 过滤掉 None，保留启用的中间件
    enabled = [(mw, prio) for mw, prio in merged.items() if prio is not None]
    # 按优先级升序排列（核心！）
    enabled_sorted = sorted(enabled, key=lambda x: x[1])
    print("\n✅ 按优先级排序后的中间件顺序：")
    for mw, prio in enabled_sorted:
        print(f"   {mw} (优先级:{prio})")

    # 实例化中间件
    mws_instances = [globals()[mw_cls]() for mw_cls, _ in enabled_sorted]
    return mws_instances

# ------------------------------
# 4. 模拟 Scrapy 核心：链式调用（request 正序 / response 逆序）
# ------------------------------
def call_process_request(middlewares, request, spider):
    """process_request：按【正序】调用"""
    print("\n========== 开始处理请求（正序执行）==========")
    for mw in middlewares:
        mw.process_request(request, spider)

def call_process_response(middlewares, request, response, spider):
    """process_response：按【逆序】调用"""
    print("\n========== 开始处理响应（逆序执行）==========")
    for mw in reversed(middlewares):
        mw.process_response(request, response, spider)

# ------------------------------
# 5. 运行演示
# ------------------------------
if __name__ == '__main__':
    # 1. 加载 + 排序中间件（完全复刻 Scrapy 逻辑）
    mw_instances = load_and_sort_middlewares(
        DOWNLOADER_MIDDLEWARES_BASE,
        DOWNLOADER_MIDDLEWARES
    )

    # 2. 模拟请求流程（引擎 → 下载器）
    call_process_request(mw_instances, "request", "spider")

    # 3. 模拟响应流程（下载器 → 引擎）
    call_process_response(mw_instances, "request", "response", "spider")

    print("\n🎉 演示完成！")