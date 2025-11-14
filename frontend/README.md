# Spotify Stats - Frontend

Frontend moderno y animado para visualizar estadísticas de Spotify, construido con React, TypeScript, Vite, Tailwind CSS y Framer Motion.

## 🚀 Características

- ✨ **Animaciones increíbles** con Framer Motion
- 🎨 **Diseño moderno** inspirado en Spotify
- 📊 **Visualizaciones interactivas** con Recharts
- 🔐 **Autenticación** con Spotify OAuth
- 📱 **Responsive** - Funciona en todos los dispositivos
- ⚡ **Rápido** - Construido con Vite

## 🛠️ Tecnologías

- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool rápido
- **Tailwind CSS** - Estilos utility-first
- **Framer Motion** - Animaciones fluidas
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos y visualizaciones
- **Lucide React** - Iconos modernos

## 📦 Instalación

1. Instala las dependencias:

```bash
npm install
```

2. Configura la URL del backend (opcional):

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Por defecto, si no especificas esta variable, usará `http://localhost:8000`.

## 🚀 Desarrollo

Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## 🏗️ Build

Para crear una build de producción:

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`.

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── layout/         # Componentes de layout (Navbar, etc)
│   └── ui/            # Componentes UI (Button, Card, etc)
├── contexts/          # Contextos de React (AuthContext)
├── pages/            # Páginas de la aplicación
├── services/          # Servicios API
├── types/            # Tipos TypeScript
├── config/           # Configuración
└── App.tsx           # Componente principal
```

## 🎯 Páginas

- **Home** (`/`) - Página de inicio con botón de login
- **Dashboard** (`/dashboard`) - Estadísticas generales del usuario
- **Top Artistas** (`/top-artists`) - Lista de artistas más escuchados
- **Top Canciones** (`/top-tracks`) - Lista de canciones más escuchadas con gráficos

## 🎨 Características de Diseño

- **Tema oscuro** inspirado en Spotify
- **Gradientes animados** en el fondo
- **Efectos hover** en todos los elementos interactivos
- **Transiciones suaves** entre páginas
- **Modales animados** para detalles
- **Gráficos interactivos** con Recharts

## 🔗 Integración con Backend

El frontend se comunica con el backend de FastAPI a través de:

- **Autenticación**: `/auth/login` y `/auth/callback`
- **Usuario**: `/spotify/me`
- **Artistas**: `/spotify/top-artist-user`
- **Canciones**: `/spotify/top-tracks-user`

Las cookies se manejan automáticamente para la autenticación.

## 📝 Notas

- Asegúrate de que el backend esté corriendo antes de iniciar el frontend
- El backend debe tener CORS configurado para permitir requests del frontend
- Las cookies deben estar habilitadas para que la autenticación funcione correctamente
