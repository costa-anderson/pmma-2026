@echo off
title QG PMMA 2026 - Central de Estudos (Acesso Remoto 4G/5G)
echo =======================================================
echo     QG PMMA 2026 - Central de Estudos (Acesso Remoto)
echo =======================================================
echo.
echo [1/3] Verificando e instalando dependencias (Flask, Openpyxl)...
python -m pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo.
    echo Tentando instalacao comum...
    python -m pip install -r requirements.txt
)
echo.
echo [2/3] Iniciando servidor local em segundo plano...
start /b python server.py
echo.
echo [3/3] Criando conexao segura para acesso externo (4G/5G)...
echo.
echo =======================================================
echo ATENCAO: Procure pela linha terminada em '.lhr.life' abaixo!
echo Ela contem o link seguro HTTPS (ex: https://xxxx.lhr.life)
echo Abra esse link no seu celular no 4G/5G para estudar de onde quiser.
echo.
echo NAO feche esta janela enquanto estiver estudando fora!
echo =======================================================
echo.
ssh -o StrictHostKeyChecking=no -R 80:localhost:5000 nokey@localhost.run
pause
