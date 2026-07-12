@echo off
setlocal
cd /d "%~dp0"

set "BUNDLED_NODE=C:\Users\Smox\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
set "NODE_EXE="

if exist "%BUNDLED_NODE%" set "NODE_EXE=%BUNDLED_NODE%"

if not defined NODE_EXE (
  where node >nul 2>nul
  if not errorlevel 1 set "NODE_EXE=node"
)

if not defined NODE_EXE (
  echo Node.js est introuvable.
  echo Installe Node.js depuis https://nodejs.org puis relance ce fichier.
  pause
  exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
  echo Les dependances ne sont pas encore installees.
  where npm >nul 2>nul
  if errorlevel 1 (
    echo npm est introuvable. Installe Node.js puis execute npm install.
    pause
    exit /b 1
  )
  call npm install
  if errorlevel 1 (
    echo L'installation a echoue.
    pause
    exit /b 1
  )
)

echo Demarrage du site Brugmann...
start "Serveur Brugmann - fermer cette fenetre pour arreter" "%NODE_EXE%" "node_modules\vite\bin\vite.js" --host 127.0.0.1 --port 5173 --strictPort
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:5173"

echo Le site est ouvert dans ton navigateur.
echo Adresse : http://127.0.0.1:5173
timeout /t 4 /nobreak >nul
