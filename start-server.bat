@echo off
cd c:/Users/USUARIO/Desktop/negocio
echo 🚀 Iniciando servidor Ryton...
echo 📝 Configurando variables de entorno...

set MONGODB_URI=mongodb://localhost:27017/ryton
set MONGODB_DBNAME=ryton
set JWT_SECRET=supersecreto-ryton-2024-cambiar-en-produccion
set SMTP_HOST=smtp.gmail.com
set SMTP_PORT=587
set SMTP_SECURE=false
set SMTP_USER=tu-email@gmail.com
set SMTP_PASS=tu-app-password
set ADMIN_SEED_EMAIL=admin@ryton.com
set ADMIN_SEED_PASSWORD=Admin123456
set PORT=3000
set NODE_ENV=development
set CORS_ORIGIN=http://localhost:3000

echo ✅ Variables configuradas
echo 🌐 Iniciando servidor en http://localhost:3000
echo.

node server.js

pause
