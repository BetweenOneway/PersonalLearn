#测试浏览器加载插件
import re
from playwright.sync_api import Playwright, sync_playwright, expect
import os
import time  # 新增：用于扩展加载的短暂等待

def run():
    url = ""
    userName = ""
    password = ""
    # chromeBrowserPath = "C:/Program Files/Google/Chrome/Application/chrome.exe"  # 可选：指定本地Chrome，建议先注释，用Playwright自带Chromium测试
    extension_path = "D:/repo/online/smarteeproj/Exe/JsLib/extension"
    user_data_dir = ""

    # 校验扩展路径（关键：必须是解压后的根目录，直接包含manifest.json）
    if not os.path.exists(extension_path):
        raise FileNotFoundError(f"插件路径不存在，请检查：{extension_path}")
    if not os.path.exists(os.path.join(extension_path, "manifest.json")):
        raise FileNotFoundError(f"扩展根目录无manifest.json，请检查路径：{extension_path}")

    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            user_data_dir,
            channel="chromium",
            headless=False,  # 必关：无头模式不支持扩展
            ignore_default_args=["--enable-automation"],
            args=[
                # 扩展核心参数（低版本必须写在这里）
                f"--disable-extensions-except={extension_path}",
                f"--load-extension={extension_path}",
                # 浏览器基础参数
                #"--no-sandbox",
                #"--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
                "--enable-features=ExtensionManifestV3",  # 低版本开启V3扩展支持
                "--disable-site-isolation-trials",  # 兼容部分隔离策略的扩展
                #"--start-maximized"  # 低版本替代no_viewport=True：启动时窗口最大化，避免扩展布局异常
            ],
            slow_mo=100,  # 慢动作，方便调试元素操作
        )

        extensions = context.background_pages
        service_workers = context.service_workers
        if extensions:
            print("扩展后台页面信息：", [f"URL: {ext.url} | 扩展ID: {ext.url.split('/')[2]}" for ext in extensions])
        elif service_workers:
            print("service workers信息：", [f"URL: {ext.url} | 扩展ID: {ext.url.split('/')[2]}" for ext in service_workers])

        # 3. 创建页面，后续业务逻辑不变（仅优化部分定位和超时）
        page = context.pages[0]
        page.goto(url, timeout=0, wait_until="domcontentloaded")
        
        # 登录操作（简化链式调用，更简洁）
        page.get_by_role("textbox", name="请输入用户名").fill(userName)
        page.get_by_role("textbox", name="请输入密码").fill(password)
        page.get_by_role("button", name="登录").click()

        #page.pause()
        time.sleep(10)
        # 关闭页面（按顺序：子页面->主页面->上下文->浏览器）
        page.close()
        context.close()

if __name__ == "__main__":
    run()