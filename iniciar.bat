@echo off
title QG PMMA 2026 - Central de Estudos
echo =======================================================
echo     QG PMMA 2026 - Central de Estudos (Modo Local)
echo =======================================================
echo.
echo [1/3] Verificando e instalando dependencias (Flask, Openpyxl)...
python -m pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo.
    echo Ops! Ocorreu um problema ao instalar com '--quiet'. Tentando instalação comum...
    python -m pip install -r requirements.txt
)
echo.
echo [2/3] Iniciando servidor web local...
echo.
echo [3/3] Abrindo o painel no navegador padrao...
start "" http://localhost:5000
echo.
echo =======================================================
echo ATENCAO: NAO feche esta janela enquanto estiver estudando.
echo Ela e a ponte entre o site e a sua planilha Excel!
echo =======================================================
echo.
python server.py
pause
