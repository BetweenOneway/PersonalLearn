from playwright.sync_api import sync_playwright
from playwright._impl._errors import TimeoutError

# 封装新标签页业务操作
def operate_new_page(new_page):
    try:
        new_page.wait_for_load_state("load",timeout=10000)
        print(f"新标签页标题：{new_page.title()}")
        # 实际业务操作
        # new_page.get_by_text("搜索设置").click()
        # return new_page.locator(".setting-item").text_content()
    except TimeoutError:
        print("页面未加载完成")

def handle_new_tab_demo():
    # 外层函数：定义new_page，与内部回调函数形成嵌套，满足nonlocal使用条件
    new_page = None  # 1. 外层函数作用域定义变量，供nonlocal绑定

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        page.goto("https://scrape.center/")
        print(f"原标签页标题：{page.title()}")

        # 2. 嵌套回调函数：正确使用nonlocal绑定外层函数的new_page
        def handle_new_page(p):
            nonlocal new_page
            new_page = p
            print(f"捕获到新标签页，初始地址：{p.url}")

        # 注册新标签页监听事件
        context.on("page", handle_new_page)

        # 点击触发新标签页
        page.get_by_text("ssr1", exact=False).click()
        # 优化：显式等待新标签页被捕获（替代固定timeout，最多等5秒）
        try:
            page.wait_for_function(
                "x => x !== null",  # 核心修正：带形参函数，x接收Python传入的new_page
                timeout=5000,        # 最大等待5秒
                arg=new_page         # 传入new_page变量本身，而非固定布尔值
            )
        except TimeoutError:
            assert new_page is not None, "5秒内未捕获到新标签页，请检查按钮定位/事件监听"

        if new_page:
            # 执行新标签页操作（独立函数）
            operate_new_page(new_page)
            new_page.close()
        else:
            print("错误：新标签页为None，无法执行操作")

        # 按需操作：关闭浏览器
        page.close()
        browser.close()

# 执行主函数
if __name__ == "__main__":
    handle_new_tab_demo()