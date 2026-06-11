@echo off
echo Starting Whisper Server...
start "Whisper Server" cmd /k "cd backend\whisper-server-package && whisper-server.exe --model models\ggml-tiny.en.bin --host 127.0.0.1 --port 8178 --diarize --print-progress --language en"

echo Starting FastAPI Backend...
start "FastAPI Backend" cmd /k "cd backend && venv\Scripts\python.exe app\main.py"

echo Starting Tauri Frontend...
start "Tauri Frontend" cmd /k "cd frontend && pnpm run tauri:dev:cpu"

echo All services started!
