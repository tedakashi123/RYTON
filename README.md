# Ryton - Computadores Reacondicionados y Compra de Usados

Plataforma web moderna para la venta de computadores reacondicionados y compra de equipos usados en Colombia.

## 🚀 Características

- **Diseño 3D Moderno**: Efectos visuales impresionantes con animaciones fluidas
- **Tipografía Futurista**: Poppins, Orbitron y JetBrains Mono
- **Iconos Interactivos**: Font Awesome con efectos hover y sonidos
- **Animaciones Llamativas**: Pulse, arcoíris, shimmer, bounce, flip
- **Responsive**: Adaptado para móviles, tablets y desktop
- **Sonidos UI**: Sistema de audio para interacciones
- **Favicon Personalizado**: Icono SVG moderno

## 🛠️ Stack Tecnológico

### Frontend
- **HTML5**: Semántico y accesible
- **CSS3**: Variables CSS, animaciones 3D, gradientes
- **JavaScript Vanilla**: SPA con routing dinámico
- **Font Awesome**: Iconos profesionales
- **Google Fonts**: Poppins, Orbitron, JetBrains Mono

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web minimalista
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación segura

### Características Técnicas
- **SPA (Single Page Application)**: Navegación sin recargas
- **API REST**: Endpoints para productos, pedidos, usuarios
- **Geo-restricción**: Limitado a Colombia (configurable)
- **Upload de archivos**: Sistema para fotos de productos
- **Carrito dinámico**: Gestión de compras en tiempo real

## 📁 Estructura del Proyecto

```
negocio/
├── 📄 index.html              # Página principal
├── 🎨 styles.css             # Estilos con animaciones 3D
├── 📱 app.js                 # Lógica del frontend (SPA)
├── 🖥️ server.js              # Servidor backend
├── 📦 package.json           # Dependencias NPM
├── 🔐 .env                  # Variables de entorno
├── 📋 .gitignore            # Archivos ignorados
├── 🎵 icons-sounds.js       # Sistema de sonidos
├── 🖼️ favicon.svg           # Icono del sitio
├── 📁 src/                  # Código backend
│   ├── routes/              # Rutas API
│   ├── models/              # Modelos de datos
│   ├── middleware/          # Middleware Express
│   └── db/                 # Conexión a BD
├── 📁 scripts/              # Scripts de utilidad
├── 📁 uploads/              # Archivos subidos
└── 🚀 start.bat             # Script para iniciar servidor
```

## 🌟 Funcionalidades Principales

### 🏠 Página Principal
- Hero section con animaciones 3D
- Marcas con efectos hover
- Sección "Por qué Ryton" con tarjetas animadas
- "Cómo funciona" con pasos interactivos
- Números y características con efectos visuales

### 🛍️ Catálogo de Productos
- Filtros dinámicos por marca, modelo, precio, estado
- Cards con animaciones de entrada
- Carrito de compras funcional
- Vista detallada de productos

### 🛒 Carrito de Compras
- Gestión en tiempo real
- Cálculo automático de totales
- Proceso de checkout seguro
- Confirmación por correo

### 👤 Cuenta de Usuario
- Registro y login
- Gestión de perfil
- Historial de pedidos
- Panel de administración

### 💰 Vender Equipo
- Formulario para venta de equipos
- Upload de fotos
- Sistema de evaluación
- Contacto automático

### 📞 Contacto y Soporte
- Formulario de contacto
- Información de soporte
- Ubicación y horarios
- Respuesta automática

### 📝 Blog
- Artículos de tecnología
- Consejos de mantenimiento
- Guías de compra
- SEO optimizado

## 🎨 Animaciones y Efectos

### Animaciones 3D
- **Cards**: Rotación y profundidad en hover
- **Botones**: Elevación y brillo dinámico
- **Textos**: Sombras múltiples para efecto 3D
- **Navegación**: Perspectiva y profundidad

### Animaciones Llamativas
- **Pulse Glow**: Efecto de pulso expansivo
- **Rainbow Border**: Borde arcoíris animado
- **Wave Text**: Texto ondulante
- **Shimmer**: Brillo deslizante metálico
- **Bounce In**: Entrada elástica dinámica
- **Slide In Blur**: Entrada con desenfoque
- **Rotate Colors**: Colores ciclícos
- **Magnetic Hover**: Efecto magnético interactivo

### Micro-interacciones
- **Sonidos UI**: Clicks, éxito, error, notificaciones
- **Hover Effects**: Múltiples capas de efectos
- **Loading States**: Indicadores animados
- **Success/Error**: Animaciones contextuales

## 🚀 Instalación y Ejecución

### Requisitos
- Node.js 16+
- NPM o Yarn
- MongoDB (local o Atlas)

### Instalación
```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd negocio

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar servidor
npm start
```

### Scripts Disponibles
```bash
npm start          # Iniciar servidor en puerto 3000
npm run dev        # Modo desarrollo con hot-reload
npm run seed       # Poblar base de datos con datos de prueba
npm run build      # Construir para producción
```

## 🔧 Configuración

### Variables de Entorno (.env)
```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/ryton
MONGODB_TEST_URI=mongodb://localhost:27017/ryton_test

# JWT
JWT_SECRET=tu-secreto-super-seguro
JWT_EXPIRES=7d

# Servidor
PORT=3000
NODE_ENV=development

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña
```

## 🌐 Despliegue

### Opciones de Hosting
1. **Vercel**: Ideal para frontend estático + API serverless
2. **Heroku**: Bueno para Node.js completo
3. **DigitalOcean**: Droplet con Docker
4. **AWS EC2**: Escalable y profesional
5. **Netlify**: Frontend estático con functions
6. **Railway**: Moderno y fácil de usar

### Configuración de Producción
```bash
# Variables de producción
NODE_ENV=production
PORT=80
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ryton

# Construir para producción
npm run build

# Iniciar en modo producción
npm start
```

## 📱 Características Responsive

### Mobile First
- **< 520px**: Layout móvil optimizado
- **520-768px**: Tablets pequeñas
- **768-1024px**: Tablets grandes
- **> 1024px**: Desktop y laptops

### Adaptaciones
- **Touch-friendly**: Botones grandes y espaciados
- **Readable text**: Tamaños de fuente adecuados
- **Optimized images**: Carga progresiva
- **Fast navigation**: Menú hamburguesa en móvil

## 🔒 Seguridad

### Implementaciones
- **JWT Tokens**: Autenticación sin estado
- **Input sanitization**: Prevención de XSS
- **Rate limiting**: Límite de peticiones
- **CORS**: Configuración segura
- **HTTPS**: SSL/TLS obligatorio
- **Env variables**: Datos sensibles protegidos

### Buenas Prácticas
- **Password hashing**: Bcrypt para contraseñas
- **Input validation**: Validación de datos
- **Error handling**: Manejo seguro de errores
- **Logging**: Registro de actividades
- **Backup**: Copias de seguridad

## 🎯 SEO y Optimización

### Meta Tags
- **Title**: Descriptivo y único por página
- **Description**: Resúmenes atractivos
- **Keywords**: Palabras clave relevantes
- **Open Graph**: Para redes sociales
- **Twitter Cards**: Optimizado para Twitter

### Performance
- **Lazy loading**: Carga diferida de imágenes
- **Code splitting**: División de JavaScript
- **Minificación**: CSS y JS comprimidos
- **Cache**: Estrategias de caché
- **CDN**: Para assets estáticos

## 🧪 Testing

### Tests Automatizados
```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests E2E
npm run test:e2e
```

### Tipos de Tests
- **Unit**: Funciones individuales
- **Integration**: API endpoints
- **E2E**: Flujo completo de usuario
- **Performance**: Tiempos de carga

## 📊 Monitorización

### Métricas
- **Analytics**: Google Analytics 4
- **Performance**: Core Web Vitals
- **Error tracking**: Sentry o similar
- **Uptime**: Monitoreo 24/7
- **Database**: Estadísticas de uso

### Logs
- **Access logs**: Peticiones y respuestas
- **Error logs**: Errores y excepciones
- **Performance logs**: Tiempos de respuesta
- **Security logs**: Intentos de acceso

## 🤝 Contribución

### Flujo de Trabajo
1. **Fork** el repositorio
2. **Crear rama**: `git checkout -b feature/nueva-funcionalidad`
3. **Commit**: `git commit -m "Agregar nueva funcionalidad"`
4. **Push**: `git push origin feature/nueva-funcionalidad`
5. **Pull Request**: Revisión de código
6. **Merge**: Integración a main

### Estándares de Código
- **ESLint**: Linting automático
- **Prettier**: Formato consistente
- **Husky**: Git hooks pre-commit
- **Conventional Commits**: Mensajes estandarizados
- **TypeScript**: Tipado opcional

## 📄 Licencia

MIT License - Libre para uso comercial y personal

## 👥 Créditos

- **Desarrollo**: [Tu Nombre]
- **Diseño**: Ryton Team
- **Iconos**: Font Awesome
- **Fuentes**: Google Fonts
- **Animaciones**: CSS3 y JavaScript moderno

---

## 🚀 Subir a GitHub

### Pasos para subir el repositorio:

1. **Crear repositorio en GitHub**
   - Ir a github.com y crear nuevo repositorio "ryton"
   - No inicializar con README (ya existe)

2. **Subir código local**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Ryton platform with 3D animations"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/ryton.git
   git push -u origin main
   ```

3. **Configurar GitHub Pages (opcional)**
   - En Settings > Pages seleccionar fuente "main"
   - Seleccionar carpeta "root"
   - Sitio disponible en: `https://tu-usuario.github.io/ryton`

4. **Configurar dominio personal**
   - En Settings > Pages > Custom domain
   - Añadir registros DNS según instrucciones de GitHub

### Recomendaciones para GitHub
- **README completo**: Documentación detallada
- **.gitignore**: Excluir node_modules y archivos sensibles
- **License**: Archivo LICENSE.md
- **Tags/Releases**: Versiones marcadas
- **Issues/Projects**: Gestión de tareas
- **Wiki**: Documentación extendida
- **Discussions**: Comunidad y soporte

---

**🎉 ¡Listo para producción!**

Este proyecto está optimizado, es seguro, moderno y listo para desplegar en cualquier plataforma de hosting. Las animaciones 3D y los efectos visuales lo hacen destacar frente a la competencia.
