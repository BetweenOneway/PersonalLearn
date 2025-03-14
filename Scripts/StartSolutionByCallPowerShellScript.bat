@echo off
echo Opening Visual Studio solutions sequentially...

:: 设置 Visual Studio 的路径（如果需要）
set VS_PATH="C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\IDE\devenv.exe"

:: 定义解决方案的路径
set SOLUTION1="D:\repo\dev\smarteeproj\Exe\business.sln"
set SOLUTION2="D:\repo\dev\smarteeproj\Exe\algorithm.sln"
set SOLUTION3="D:\repo\dev\smarteeproj\LibTools\libtools.sln"

:: 定义 PowerShell 脚本路径
set PS_SCRIPT_PATH="openSolution.ps1"

:: 打开第一个解决方案并等待其完全加载
powershell -File %PS_SCRIPT_PATH% -SolutionPath %SOLUTION1% -VsPath %VS_PATH%

:: 打开第二个解决方案并等待其完全加载
powershell -File %PS_SCRIPT_PATH% -SolutionPath %SOLUTION2% -VsPath %VS_PATH%

:: 打开第三个解决方案并等待其完全加载
powershell -File %PS_SCRIPT_PATH% -SolutionPath %SOLUTION3% -VsPath %VS_PATH%

echo All solutions have been opened.
