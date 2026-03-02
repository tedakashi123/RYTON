# Render Deployment Guide - Ryton

## 🚀 Preparación para Render

### 📋 Requisitos

1. **Cuenta en Render**: https://render.com
2. **Repositorio GitHub**: https://github.com/tedakashi123/ryton
3. **MongoDB Atlas**: Base de datos en la nube

### 🔧 Configuración necesaria

#### 1. MongoDB Atlas
```bash
# URL de conexión (ejemplo)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ryton?retryWrites=true&w=majority
```

#### 2. Variables de entorno en Render
- **MONGODB_URI**: Tu conexión de MongoDB Atlas
- **MONGODB_DBNAME**: ryton
- **JWT_SECRET**: Clave secreta para tokens
- **NODE_ENV**: production
- **PORT**: 10000 (puerto de Render)

### 📝 Pasos para subir a Render

#### Paso 1: Crear cuenta en Render
1. Ve a https://render.com
2. Regístrate con GitHub
3. Conecta tu cuenta de GitHub

#### Paso 2: Crear Web Service
1. Dashboard → "New +" → "Web Service"
2. Conecta tu repositorio: `tedakashi123/ryton`
3. Configura:
   - **Name**: Ryton
   - **Branch**: main
   - **Root Directory**: ./
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

#### Paso 3: Configurar variables de entorno
1. En "Environment" tab, agrega:
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/ryton
   MONGODB_DBNAME=ryton
   JWT_SECRET=your-production-secret
   NODE_ENV=production
   PORT=10000
   ```

#### Paso 4: Deploy
1. Click en "Create Web Service"
2. Espera el build y deploy
3. Obtén tu URL: `https://ryton.onrender.com`

### 🌐 MongoDB Atlas Setup

#### 1. Crear cluster gratis
1. Ve a https://cloud.mongodb.com
2. Crea cuenta gratuita
3. Crea un cluster (M0 Sandbox)
4. Configura IP access: `0.0.0.0/0` (acceso desde cualquier lugar)

#### 2. Crear usuario
1. Database Access → Add User
2. Username: `ryton-user`
3. Password: Genera una segura
4. Roles: Read and write to any database

#### 3. Obtener conexión
1. Cluster → Connect → Connect your application
2. Copia la URL de conexión
3. Reemplaza username y password

### 🎯 URL final del proyecto

Una vez deployado, tu proyecto estará en:
- **Render**: https://ryton.onrender.com
- **GitHub**: https://github.com/tedakashi123/ryton
- **MongoDB Atlas**: En tu dashboard de MongoDB

### 📋 Checklist antes de deploy

- [ ] Cuenta en Render creada
- [ ] Repositorio conectado
- [ ] MongoDB Atlas configurado
- [ ] Variables de entorno agregadas
- [ ] Build command correcto
- [ ] Start command correcto
- [ ] Puerto configurado (10000)

### 🔧 Troubleshooting

#### Si falla el build
- Verifica `package.json` tiene todos los scripts
- Revisa que `server.js` sea ES module
- Confirma que `start-server.bat` no esté en el repo

#### Si falla la conexión a MongoDB
- Verifica la URL de conexión
- Confirma IP access en MongoDB Atlas
- Revisa credenciales de usuario

#### Si la app no responde
- Verifica el puerto (10000)
- Revisa logs de Render
- Confirma que el servidor esté escuchando

---

**Nota**: Render ofrece hosting gratuito para proyectos Node.js con MongoDB Atlas.
