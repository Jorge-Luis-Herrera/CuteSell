# Cute Sell Plush Store

![Aesthetics](https://img.shields.io/badge/Aesthetics-Premium-gold)
![Fullstack](https://img.shields.io/badge/Stack-Next.js%20%2F%20NestJS-blue)

Tienda online de peluches premium con experiencia de compra moderna y atractiva.

## 🧸 Características

- **Catálogo Interactivo** - Explora nuestra colección de peluches
- **Gestión de Inventario** - Control completo de stock y productos
- **Búsqueda Avanzada** - Encuentra rápidamente tus peluches favoritos
- **Diseño Responsivo** - Experiencia perfecta en cualquier dispositivo
- **Admin Panel** - Gestión simplificada de productos y estanterías

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 16** - React framework con App Router
- **TypeScript** - Tipado seguro
- **Tailwind CSS** - Estilos modernos
- **Framer Motion** - Animaciones fluidas

### Backend
- **NestJS** - Framework Node.js TypeScript
- **File Upload** - Manejo de imágenes de productos
- **Static Serving** - Archivos estáticos optimizados

## 📁 Estructura del Proyecto

```text
cutesell/
├── backend/            # NestJS API
│   ├── src/
│   │   ├── auth/       # Autenticación admin
│   │   ├── inventory/  # Gestión de productos
│   │   └── main.ts     # Entry point
│   └── uploads/        # Imágenes de productos
└── frontend/           # Next.js Application
    ├── src/
    │   ├── app/        # App Router pages
    │   ├── components/  # Componentes React
    │   └── lib/        # Utilidades
    └── public/         # Archivos estáticos
```

## 🚀 Instalación y Ejecución

### Desarrollo Local

1. **Instalar dependencias**
```bash
npm run install:all
```

2. **Iniciar backend (puerto 3000)**
```bash
npm run dev:backend
```

3. **Iniciar frontend (puerto 3001)**
```bash
npm run dev:frontend
```

### Producción

1. **Construir proyecto**
```bash
npm run build
```

2. **Iniciar servidor**
```bash
npm run start
```

## 🔐 Acceso Admin

- **Usuario:** `cutesell`
- **Contraseña:** `cutesell2026`

## 📦 Deploy

### Azure App Service

1. **Preparar proyecto**
```bash
npm run build
```

2. **Configurar variables de entorno**
- `PORT`: 3000 (Azure)
- `ADMIN_USER`: cutesell
- `ADMIN_PASSWORD`: cutesell2026

3. **Deploy ZIP**
```bash
# Comprimir proyecto y subir a Azure
zip -r cutesell.zip . -x ".git/*" "node_modules/*" "frontend/node_modules/*" "backend/node_modules/*"
```

## 🎨 Características Destacadas

- **Memory Management** - Optimizado para bajo consumo de RAM
- **Image Optimization** - Manejo eficiente de imágenes con cleanup automático
- **Async Operations** - Backend asíncrono para mejor performance
- **Modern UI** - Diseño actualizado con gradientes y animaciones
- **Search Context** - Búsqueda global persistente

## 🛠️ Scripts Disponibles

- `npm run install:all` - Instala dependencias de todos los proyectos
- `npm run build` - Construye backend y frontend
- `npm run dev:backend` - Desarrollo backend
- `npm run dev:frontend` - Desarrollo frontend
- `npm run start` - Producción unificado

## 📝 Notas

- El frontend genera archivos estáticos en `frontend/out`
- El backend sirve el frontend desde `/api` y archivos desde `/uploads`
- Configurado para deploy unificado en Azure App Service

---

*Crafted with precision for Cute Sell Plush Store.*
En el Portal de Azure: Crea un nuevo Web App (App Service).