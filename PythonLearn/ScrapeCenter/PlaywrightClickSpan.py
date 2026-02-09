import time
from playwright.sync_api import sync_playwright

def ClickSpan():
    #url = 'http://127.0.0.1:3000/PythonLearn/ScrapeCenter/TestSpanClick.html'
    url="http://localhost:5173/ClickSpan"
    extension_path="D:/repo/online/smarteeproj/Exe/JsLib/extension"
    user_data_dir = ""

    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            user_data_dir,
            channel="chromium",
            headless=False,  # 必关：无头模式不支持扩展
            slow_mo=500,
            ignore_default_args=["--enable-automation"],
            no_viewport=True,  # 核心：禁用默认视口，让浏览器原生最大化/自适应
            args=[
                # 扩展核心参数（低版本必须写在这里）
                f"--disable-extensions-except={extension_path}",
                f"--load-extension={extension_path}",
                # 浏览器基础参数
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
                "--enable-features=ExtensionManifestV3",  # 低版本开启V3扩展支持
                "--disable-site-isolation-trials",  # 兼容部分隔离策略的扩展
                "--start-maximized",  # 启动时窗口最大化，避免扩展布局异常
                "--allow-sandbox-debugging",
                "--ash-debug-shortcuts",
                "--debug-devtools",
            ],
        )
        page = context.pages[0]
        page.goto(url,timeout=0,wait_until="domcontentloaded")

        page.locator("#app .display-btn").click()
        time.sleep(5)

if __name__=="__main__":
    ClickSpan()