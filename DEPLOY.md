# Ryton - Quick Deploy Guide

## 🚀 Subir a GitHub - Pasos Rápidos

### 1. Preparar Repositorio Local
```bash
# En la carpeta del proyecto
git init
git add .
git commit -m "Initial commit: Ryton platform with 3D animations"
git branch -M main
```

### 2. Crear Repositorio en GitHub
1. Ir a [github.com](https://github.com)
2. Click en "New repository"
3. Nombre: `ryton`
4. Descripción: `Plataforma de computadores reacondicionados`
5. NO marcar "Add a README file"
6. Click en "Create repository"

### 3. Conectar y Subir
```bash
# Reemplaza TU_USUARIO con tu usuario de GitHub
git remote add origin https://github.com/TU_USUARIO/ryton.git
git push -u origin main
```

### 4. Configurar GitHub Pages (Opcional)
1. En tu repositorio > Settings > Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)
5. Click en Save

### 5. Acceder al Sitio
- **GitHub Pages**: `https://TU_USUARIO.github.io/ryton`
- **Repositorio**: `https://github.com/TU_USUARIO/ryton`

## 📋 Checklist Antes de Subir

- [ ] Archivos sensibles en `.gitignore`
- [ ] Variables de entorno en `.env.example`
- [ ] README.md completo
- [ ] LICENSE.md agregado
- [ ] Sin archivos temporales
- [ ] Código limpio y comentado

## 🔧 Comandos Útiles

```bash
# Ver estado del repositorio
git status

# Ver commits
git log --oneline

# Ver remotos
git remote -v

# Forzar push (si es necesario)
git push -f origin main
```

## 🌐 Hosting Alternativos

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

### Netlify
```bash
# Arrastrar carpeta a netlify.com
# O usar CLI
npm i -g netlify-cli
netlify deploy --prod --dir=.
```

### Railway
```bash
# Instalar CLI
npm i -g @railway/cli

# Desplegar
railway up
```

---

**🎯 Listo para producción!**
