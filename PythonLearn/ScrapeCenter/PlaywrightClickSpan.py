import time
from playwright.sync_api import sync_playwright

def ClickSpan():
    #url = 'http://127.0.0.1:3000/PythonLearn/ScrapeCenter/TestSpanClick.html'
    #url="http://localhost:5173/ClickSpan"
    url="http://172.16.27.110:6023/#prototype?https=1&token=XTOKEN%3A&name=%E7%8E%8B%E4%BC%9F&MESRequestURL=https%3A%2F%2Fmesglobal.smartee.cn%3A32082&data=%5B%7B%22CaseCode%22%3A%221831819%22%2C%22HospitalName%22%3A%22%E6%B8%85%E8%BF%9C%E5%B8%82%E6%B8%85%E5%9F%8E%E5%8C%BA%E5%9C%A3%E9%9B%85%E5%8F%A3%E8%85%94%E9%97%A8%E8%AF%8A%E9%83%A8%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8%22%2C%22IsAutoMes%22%3Afalse%2C%22Name%22%3A%22%E5%AD%94%E7%91%9E%E5%8D%8E%22%2C%22ProductSeriesName%22%3A%22%E7%BB%8F%E5%85%B8%E7%89%88%22%2C%22PrototypeID%22%3A%2210ac283e-0905-43b2-a715-507677e72e71%22%2C%22PrototypeSN%22%3A%22PP25112206398%22%7D%5D&uid=42A384B1-1D87-FF11-A7EC-097402010001&robot=1&smarteePlugin=2.2&lan=0&apiHost=smartcheck3.smartee.cn&SYSTIME=1770690405321&MESAuthorization=def6d90e829e50c63f98c387daecd138"
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
                #"--auto-open-devtools-for-tabs",  # 自动为每个标签页打开开发者工具
                "--start-maximized",  # 启动时窗口最大化，避免扩展布局异常
                "--allow-sandbox-debugging",
                "--ash-debug-shortcuts",
                "--debug-devtools",
            ],
        )
        page = context.pages[0]
        page.goto(url,timeout=0,wait_until="domcontentloaded")

        #测试获取页面信息
        caseNo = page.locator('.table-list .tb-id').inner_text()
        print('caseNo:',caseNo)

        #BUTTON_SELECTOR = '#tableData .table-list .tb-btn span.generate.btn'
        BUTTON_SELECTOR = f'span[data-cs="{caseNo}"].generate.btn'
        gen = page.locator(BUTTON_SELECTOR)
        gen.wait_for(state='visible')
        print('btn attached')
        # 2. 持续点击按钮，直到按钮消失（触发加载状态）
        click_count = 0
        while True:
            try:
                # 每次点击前先确认按钮仍可见（避免无效点击）
                if gen.is_visible():
                    gen.click()
                    click_count += 1
                    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] 第{click_count}次点击...")
                    # 等待1秒
                    time.sleep(1)
                else:
                    # 按钮消失，说明触发了加载状态，退出点击循环
                    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] 生成按钮消失...")
                    break
            except Exception as e:
                # 点击失败（如按钮已消失），直接退出点击循环
                break

        print("gen.click")

        time.sleep(30)

if __name__=="__main__":
    ClickSpan()