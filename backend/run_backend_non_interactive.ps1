# PowerShell script to start both Whisper server and Python backend non-interactively
# This is a modified version of start_with_output.ps1 that bypasses all Read-Host prompts

$portPython = 5167
$portWhisper = 8178
$modelName = "tiny.en"
$languageName = "en"

Write-Host "====================================="
Write-Host "Meetily Backend Startup (Non-Interactive)"
Write-Host "====================================="
Write-Host "Python Backend Port: $portPython"
Write-Host "Whisper Server Port: $portWhisper"
Write-Host "Whisper Model:       $modelName"
Write-Host "Language:            $languageName"
Write-Host "====================================="
Write-Host ""

# Kill any existing whisper-server.exe processes
$whisperProcesses = Get-Process -Name "whisper-server" -ErrorAction SilentlyContinue
if ($whisperProcesses) {
    Write-Host "Stopping existing Whisper server processes..."
    $whisperProcesses | ForEach-Object { $_.Kill() }
    Start-Sleep -Seconds 1
}

# Kill any existing processes on port 5167 (FastAPI App)
$portInUse = Get-NetTCPConnection -LocalPort $portPython -State Listen -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "Stopping process using port $portPython..."
    $portInUse | ForEach-Object {
        $p = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        if ($p) {
            Write-Host "Killing process $($p.Name) (PID: $($p.Id))"
            $p.Kill()
        }
    }
    Start-Sleep -Seconds 1
}

# Check if whisper-server-package exists, create if not
if (-not (Test-Path "whisper-server-package")) {
    Write-Host "Creating whisper-server-package directory..."
    New-Item -ItemType Directory -Path "whisper-server-package" -Force | Out-Null
}

if (-not (Test-Path "whisper-server-package\public")) {
    if (Test-Path "whisper-custom\public") {
        Write-Host "Copying public folder from whisper-custom..."
        Copy-Item -Path "whisper-custom\public" -Destination "whisper-server-package\public" -Recurse -Force
    } else {
        New-Item -ItemType Directory -Path "whisper-server-package\public" -Force | Out-Null
        $indexContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Whisper Server</title>
</head>
<body>
    <h1>🎙️ Whisper Server Running</h1>
</body>
</html>
"@
        Set-Content -Path "whisper-server-package\public\index.html" -Value $indexContent
    }
}

# Check if whisper-server.exe exists, download if not
if (-not (Test-Path "whisper-server-package\whisper-server.exe")) {
    Write-Host "whisper-server.exe not found. Fetching latest release..."
    try {
        $headers = @{"User-Agent" = "PowerShell-Script"}
        $apiUrl = "https://api.github.com/repos/Zackriya-Solutions/meeting-minutes/releases/latest"
        $releaseInfo = Invoke-RestMethod -Uri $apiUrl -Headers $headers -UseBasicParsing
        $tagName = $releaseInfo.tag_name
        Write-Host "Latest release tag: $tagName"
        
        $downloadUrl = "https://github.com/Zackriya-Solutions/meeting-minutes/releases/download/$tagName/whisper-server.exe"
        $destinationPath = "whisper-server-package\whisper-server.exe"
        
        Write-Host "Downloading whisper-server.exe..."
        if (Get-Command curl.exe -ErrorAction SilentlyContinue) {
            curl.exe -L -o $destinationPath $downloadUrl
        } else {
            Invoke-WebRequest -Uri $downloadUrl -OutFile $destinationPath -UseBasicParsing
        }
        Unblock-File -Path $destinationPath
        Write-Host "Downloaded successfully."
    } catch {
        Write-Host "Error downloading latest whisper-server.exe: $_"
        exit 1
    }
}

# Check if models directory exists
if (-not (Test-Path "whisper-server-package\models")) {
    New-Item -ItemType Directory -Path "whisper-server-package\models" -Force | Out-Null
}

# Download model if not exists
$modelFile = "whisper-server-package\models\ggml-$modelName.bin"
if (-not (Test-Path $modelFile)) {
    Write-Host "Model file not found: $modelFile"
    Write-Host "Downloading model $modelName..."
    
    # Run the download script
    $process = Start-Process -FilePath "cmd.exe" -ArgumentList "/c download-ggml-model.cmd $modelName" -NoNewWindow -Wait -PassThru
    if ($process.ExitCode -eq 0) {
        Write-Host "Download command completed. Checking files..."
        if (Test-Path "models\ggml-$modelName.bin") {
            Copy-Item "models\ggml-$modelName.bin" "whisper-server-package\models\ggml-$modelName.bin" -Force
        }
    }
}

# Setup Python virtual environment if not present
if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..."
    $createVenv = Start-Process -FilePath "python" -ArgumentList "-m venv venv" -NoNewWindow -Wait -PassThru
    if ($createVenv.ExitCode -ne 0) {
        Write-Host "Error: Failed to create virtual environment"
        exit 1
    }
    
    Write-Host "Upgrading pip and installing requirements..."
    Start-Process -FilePath "venv\Scripts\python.exe" -ArgumentList "-m pip install --upgrade pip" -NoNewWindow -Wait
    Start-Process -FilePath "venv\Scripts\python.exe" -ArgumentList "-m pip install -r requirements.txt" -NoNewWindow -Wait
}

# Verify Python app exists
if (-not (Test-Path "app\main.py")) {
    Write-Host "Error: app\main.py not found"
    exit 1
}

# Start Whisper server in a new window
Write-Host "Starting Whisper server on port $portWhisper..."
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd whisper-server-package && whisper-server.exe --model models\ggml-$modelName.bin --host 127.0.0.1 --port $portWhisper --diarize --print-progress --language $languageName" -WindowStyle Normal

# Start Python backend in a new window
Write-Host "Starting Python backend on port $portPython..."
$pythonCommand = "/k call venv\Scripts\activate.bat && set PORT=$portPython && python app\main.py"
Start-Process -FilePath "cmd.exe" -ArgumentList $pythonCommand -WindowStyle Normal

# Wait for startup
Write-Host "Waiting for services to start..."
Start-Sleep -Seconds 10

# Check status
$whisperListening = netstat -ano | Select-String -Pattern ":$portWhisper.*LISTENING"
$pythonListening = netstat -ano | Select-String -Pattern ":$portPython.*LISTENING"

Write-Host "====================================="
Write-Host "Services status:"
Write-Host "Whisper listening: $(if ($whisperListening) { "YES" } else { "NO" })"
Write-Host "Python listening:  $(if ($pythonListening) { "YES" } else { "NO" })"
Write-Host "====================================="
