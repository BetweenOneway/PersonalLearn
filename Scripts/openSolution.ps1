param (
    [string]$SolutionPath,
    [string]$VsPath = "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\IDE\devenv.exe"
)

$solutionName = [System.IO.Path]::GetFileNameWithoutExtension($SolutionPath)

# 启动 Visual Studio 并打开解决方案
$process = Start-Process -FilePath $VsPath -ArgumentList $SolutionPath -PassThru

# 等待 Visual Studio 窗口出现并加载解决方案
$timeout = 600 # 设置超时时间（秒）
$startTime = Get-Date

while ($true) {
    $windowTitle = (Get-Process -Id $process.Id -ErrorAction SilentlyContinue | Select-Object -ExpandProperty MainWindowTitle)
    if ($windowTitle -match $solutionName) {
        Write-Host "Solution $solutionName has been loaded."
        break
    }
    Start-Sleep -Seconds 1
    if ((Get-Date) -gt $startTime.AddSeconds($timeout)) {
        Write-Host "Timeout waiting for solution to load."
        break
    }
}

# 等待几秒钟以确保解决方案完全加载
Start-Sleep -Seconds 5
