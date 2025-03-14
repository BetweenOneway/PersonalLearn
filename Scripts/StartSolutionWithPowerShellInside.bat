@echo off
echo Opening Visual Studio solutions sequentially...

:: 设置 Visual Studio 的路径（如果需要）
set VS_PATH="C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\IDE\devenv.exe"

:: 定义解决方案的路径
set SOLUTION1="D:\repo\dev\smarteeproj\Exe\business.sln"
set SOLUTION2="D:\repo\dev\smarteeproj\Exe\algorithm.sln"
set SOLUTION3="D:\repo\dev\smarteeproj\LibTools\libtools.sln"

:: 定义 PowerShell 脚本
set PS_SCRIPT="& { param($solution) $VsPath = \"%VS_PATH%\"; Start-Process -FilePath $VsPath -ArgumentList $solution -PassThru }"

:: 打开第一个解决方案并等待其完全加载
powershell -Command %PS_SCRIPT% %SOLUTION1%

:: 打开第二个解决方案并等待其完全加载
powershell -Command %PS_SCRIPT% %SOLUTION2%

:: 打开第三个解决方案并等待其完全加载
powershell -Command %PS_SCRIPT% %SOLUTION3%

echo All solutions have been opened.
pause