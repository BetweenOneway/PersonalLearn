import re
#from playwright.async_api import async_playwright
from playwright.sync_api import Playwright, sync_playwright, expect
import os
import asyncio
import time  # 新增：用于扩展加载的短暂等待

def Smartee():
    url = ""
    userName = ""
    password = ""
    # 插件路径
    extension_path="D:/repo/online/smarteeproj/Exe/JsLib/extension"
    user_data_dir = ""
    
    # 校验路径是否存在，避免路径错误
    if not os.path.exists(extension_path):
        raise FileNotFoundError(f"插件路径不存在，请检查：{extension_path}")

    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            user_data_dir,
            channel="chromium",
            headless=False,  # 必关：无头模式不支持扩展
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

        # 打印已加载的扩展ID
        extensions = context.background_pages
        service_workers = context.service_workers
        if extensions:
            print("扩展后台页面信息：", [f"URL: {ext.url} | 扩展ID: {ext.url.split('/')[2]}" for ext in extensions])
        elif service_workers:
            print("service workers信息：", [f"URL: {ext.url} | 扩展ID: {ext.url.split('/')[2]}" for ext in service_workers])

        page = context.pages[0]
        # 禁用超时 等待DOM树构建完成即可
        page.goto(url,timeout=0,wait_until="domcontentloaded")
        page.get_by_role("textbox", name="请输入用户名").click()
        page.get_by_role("textbox", name="请输入用户名").fill(userName)
        page.get_by_role("textbox", name="请输入密码").click()
        page.get_by_role("textbox", name="请输入密码").fill(password)
        page.get_by_role("button", name="登录").click()
        page.locator("div").filter(has_text=re.compile(r"^生产管理$")).click()
        page.get_by_role("menuitem", name="病例信息管理").click()
        page.get_by_role("button", name=" 高级查询").click()
        # 链式调用：先定位发货日期输入框，再定位其内部的清除图标，直接点击
        #page.get_by_role("textbox", name="发货日期").first.locator(".el-icon-circle-close").click()
        #page.get_by_role("textbox", name="发货日期").first.click()

        target_ele = page.wait_for_selector('.v-date-range i.el-range__close-icon')  # css定位
        # 2. 执行hover动作（鼠标悬浮在元素上）
        target_ele.hover()
        page.wait_for_selector('.v-date-range i.el-icon-circle-close').click()
        #page.get_by_role("textbox", name="发货日期").first.locator(".el-icon-circle-close").click()
        
        #page.get_by_role("textbox", name="请输入任务编号").click()
        page.get_by_role("textbox", name="请输入任务编号").fill("26013108729")
        page.get_by_role("button", name=" 查询").click()
        page.locator(".el-table__fixed-body-wrapper > .el-table__body > tbody > .el-table__row > .el-table_1_column_1 > .cell > .el-checkbox > .el-checkbox__input > .el-checkbox__inner").first.click()
        with page.expect_popup() as page1_info:
            page.get_by_role("button", name="原型下载").click()
        
            #等待原型生成页面加载成功
            page1 = page1_info.value
            page1.wait_for_load_state("load",timeout=0)
            print("原型页面加载成功")
            page1.locator("div#loadingModel").wait_for(state="visible", timeout=0)
            print("加载页面加载成功")
            page1.locator("div#loadingModel").wait_for(state="hidden", timeout=0)
            print("加载完成，加载页面消失")
            
            #原型下载页面处理
            
            #测试获取页面信息
            caseNo = page1.locator('.table-list .tb-id').inner_text()
            print('caseNo:',caseNo)

            # 勾选信息块Ⅱ
            page1.locator("#tableData .table-list .tb-blockTwo input").first.click()

            #点击生成按钮
            #BUTTON_SELECTOR = '#tableData .table-list .tb-btn span.generate.btn'
            BUTTON_SELECTOR = f'span[data-cs="{caseNo}"].generate.btn'
            gen = page1.locator(BUTTON_SELECTOR)
            gen.wait_for(state='visible')
            print('btn attached')
            # 这个按钮不知道为什么要过一段时间才能点击成功 所以循环点击
            # 持续点击按钮，直到按钮消失（触发加载状态）
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

            print("点击生成按钮")
            
            #等待开始生成
            page1.locator("#tableData .table-list .tb-btn .load-image").wait_for(state="visible")
            #等待生成完成
            page1.locator("#tableData .table-list .tb-btn .generate.btn").first.wait_for(state="visible")
            print("生成完成，关闭页面")
            page1.close()
        #
        page.close()
        context.close()

if __name__=="__main__":
    Smartee()
