@echo off
echo Opening Visual Studio solutions...

:: 设置 Visual Studio 的路径（如果需要）
set VS_PATH="C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\IDE\devenv.exe"

:: 定义解决方案的路径
set SOLUTION1="D:\repo\dev\smarteeproj\Exe\business.sln"
set SOLUTION2="D:\repo\dev\smarteeproj\Exe\algorithm.sln"
set SOLUTION3="D:\repo\dev\smarteeproj\LibTools\libtools.sln"

:: 打开解决方案
start "" %VS_PATH% %SOLUTION1%
start "" %VS_PATH% %SOLUTION2%
start "" %VS_PATH% %SOLUTION3%

echo All solutions have been opened.