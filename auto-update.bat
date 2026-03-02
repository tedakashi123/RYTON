@echo off
cd c:/Users/USUARIO/Desktop/negocio
echo 🔄 Verificando cambios...
git status --porcelain | findstr /R "^[^?].*" >nul
if %errorlevel% equ 0 (
    echo 📝 Hay cambios, haciendo commit y push...
    git add .
    git commit -m "Auto-update: %date% %time%"
    git push origin main
    echo ✅ Cambios subidos a GitHub
) else (
    echo ✨ No hay cambios para subir
)
pause
