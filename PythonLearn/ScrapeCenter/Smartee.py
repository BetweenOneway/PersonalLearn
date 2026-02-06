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
            # 勾选信息块Ⅱ
            page1.locator("#tableData .table-list .tb-blockTwo input").first.click()
            #点击生成按钮
            #page1.locator('#tableData .table-list .tb-btn span.generate.btn').first.click(force=True)
            #page1.locator(".generate").first.click(force=True)
            # 先等待元素出现在DOM中，超时可自定义（比如10秒）
            page1.wait_for_selector('#tableData .table-list .tb-btn span.generate.btn', timeout=10000)
            # 再执行点击
            # 执行页面端代码，返回结果到Node.js/Python端
            result = page1.evaluate('''() => {
                const ele = document.querySelector('#tableData .table-list .tb-btn span.generate.btn');
                if (!ele) {
                    return "click fail: 元素不存在";
                }
                // 步骤1：将元素滚动到可视区域（解决元素在页面外的问题）
                ele.scrollIntoView({ behavior: 'instant', block: 'center' });
                // 步骤2：创建并触发mousedown事件（鼠标按下，前端核心绑定事件）
                const mousedown = new MouseEvent('mousedown', {
                    bubbles: true,  // 事件冒泡（兼容父元素绑定的点击逻辑）
                    cancelable: true,
                    view: window
                });
                ele.dispatchEvent(mousedown);
                // 步骤3：创建并触发mouseup事件（鼠标抬起）
                const mouseup = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
                ele.dispatchEvent(mouseup);
                // 步骤4：触发click事件（兜底）
                const click = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                ele.dispatchEvent(click);
                return "click success";
            }''')
            print(result)
            #page.evaluate(lambda: document.querySelector("button").click())
            # page1.evaluate('''() => {
            #     const ele = document.querySelector('#tableData .table-list .tb-btn span.generate.btn');
            #     if (ele) 
            #     {
            #         alert("no elem")
            #         ele.click(); // 加个判断，避免元素不存在时报错
            #     }
            #     else{
            #         alert("no elem")}
            # }''')
            # 1. 用Playwright定位元素，获取元素句柄
            #ele_handle = page1.locator("#tableData .table-list .tb-btn .generate.btn").first.element_handle()
            # 2. 执行原生JS点击（把元素句柄作为参数传入）
            #page1.evaluate('(ele) => ele.click()', ele_handle)
            # 1. 验证元素是否存在且可见（输出True/False）
            #loc = page1.locator("#tableData .table-list .tb-btn .generate.btn").first
            #loc.scroll_into_view_if_needed() # 滚动元素到视口（自动适配布局）
            #loc.click()
            #print("元素是否存在：", loc.count() > 0)
            #print("元素是否可见：", loc.is_visible())
            # 2. 高亮元素（运行时页面会标红该元素，确认定位的位置是否正确）
            #loc.highlight()
            #page1.wait_for_timeout(2000)  # 等待2秒，看标红的位置
            #loc.click(force=True,delay=100)
            #page.get_by_role("span", name="生成").click()
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
