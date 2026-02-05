import re
from playwright.sync_api import Playwright, sync_playwright, expect


def run(playwright: Playwright) -> None:
    url = ""
    userName = ""
    password =""
    browser = playwright.chromium.launch(channel="msedge",headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto(url,timeout=5000000,wait_until="load")
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
    page.get_by_role("textbox", name="发货日期").first.click()
    page.locator(".el-icon-circle-close").click()
    page.get_by_role("textbox", name="请输入任务编号").click()
    page.get_by_role("textbox", name="请输入任务编号").fill("26013108729")
    page.get_by_role("button", name=" 查询").click()
    page.locator(".el-table__fixed-body-wrapper > .el-table__body > tbody > .el-table__row > .el-table_1_column_1 > .cell > .el-checkbox > .el-checkbox__input > .el-checkbox__inner").first.click()
    with page.expect_popup() as page1_info:
        page.get_by_role("button", name="原型下载").click()
    page1 = page1_info.value
    page1.wait_for_load_state("load",timeout=10000)
    #原型下载页面处理
    page1.locator(".tb-blockTwo>input").click()
    page1.locator(".tb-btn>span>.generate.btn").click()
    page.locator(".tb-btn>span>.generate.btn").wait_for(state="visible")
    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
