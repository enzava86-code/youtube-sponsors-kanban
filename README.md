# 📺 YouTube Sponsors Kanban

Sistema completo de gestión de patrocinios para YouTubers con tablero Kanban interactivo, funcionalidad de drag & drop, **persistencia de datos con SQLite**, y métricas en tiempo real.

![Next.js](https://img.shields.io/badge/Next.js-15.5.0-000000?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Latest-000000?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-6.1.0-2D3748?style=for-the-badge&logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-3.0-003B57?style=for-the-badge&logo=sqlite)

## ✨ Características Principales

### 🎯 Tablero Kanban Interactivo
- **9 columnas de estado** desde "Prospecto" hasta "Completado"
- **Drag & Drop persistente** para mover acuerdos entre etapas (se guarda en base de datos)
- **Indicadores visuales** durante el arrastre con animaciones
- **Contadores automáticos** de acuerdos por columna

### 🗄️ Persistencia de Datos
- **Base de datos SQLite local** sin configuración externa
- **API REST completa** para todas las operaciones CRUD
- **Drag & Drop persistente** - Los cambios se guardan automáticamente
- **Estados de loading** y manejo de errores
- **Datos de seed** incluidos para empezar inmediatamente

### 📊 Dashboard de Métricas
- **KPIs en tiempo real**: Acuerdos activos, ingresos mensuales
- **Alertas de vencimiento**: Próximos plazos y tareas pendientes
- **Valor promedio** de acuerdos y tasa de conversión

### 🃏 Tarjetas de Patrocinio Avanzadas
- **Indicadores de prioridad** con código de colores
- **Alertas de vencimiento** automáticas
- **Información completa**: Marca, contacto, monto, fecha de entrega
- **Barras de progreso** para seguimiento visual
- **Menús de acciones** para ver, editar y mover

### 📝 Modal de Creación Completo
- **Formulario estructurado** con validación
- **Secciones organizadas** con acordeón:
  - Información de marca
  - Detalles del acuerdo
  - Información financiera
  - Fechas y plazos
  - Estado inicial
  - Notas y adjuntos

### 🎨 Diseño y UX
- **Tema YouTube**: Colores oficiales de YouTube
- **Diseño responsive** con scroll horizontal en móvil
- **Componentes Shadcn UI** para consistencia visual
- **Dark mode ready** (preparado para modo oscuro)

## 🚀 Tecnologías Utilizadas

- **Next.js 15.5.0** - Framework React con App Router
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Styling utility-first
- **Shadcn UI** - Componentes de UI modernos y accesibles
- **Prisma 6.1.0** - ORM moderno para TypeScript
- **SQLite** - Base de datos local sin configuración
- **@dnd-kit** - Librería de drag & drop
- **React Hook Form + Zod** - Manejo de formularios y validación
- **Lucide React** - Iconos modernos y consistentes
- **date-fns** - Manejo de fechas y formateo
- **Sonner** - Notificaciones toast

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/enzava86-code/youtube-sponsors-kanban.git

# Navegar al directorio
cd youtube-sponsors-kanban

# Instalar dependencias
npm install

# Configurar base de datos (primera vez)
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Crear base de datos SQLite
npm run db:seed      # Cargar datos de ejemplo

# Ejecutar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales con tema YouTube
│   └── page.tsx           # Página principal con datos de prueba
├── components/
│   ├── kanban/            # Componentes del tablero Kanban
│   │   ├── KanbanBoard.tsx       # Tablero principal con drag & drop
│   │   ├── KanbanColumn.tsx      # Columnas como drop zones
│   │   └── SponsorshipCard.tsx   # Tarjetas draggables
│   ├── layout/            # Componentes de layout
│   │   ├── Header.tsx     # Header con búsqueda y acciones
│   │   └── Layout.tsx     # Layout principal
│   ├── metrics/           # Dashboard de métricas
│   │   └── MetricsDashboard.tsx  # KPIs y estadísticas
│   ├── modals/            # Modales de la aplicación
│   │   └── CreateSponsorshipModal.tsx  # Modal de creación
│   └── ui/                # Componentes base de Shadcn UI
├── types/                 # Definiciones de TypeScript
│   └── sponsorship.ts     # Interfaces y tipos principales
└── lib/
    └── utils.ts          # Utilidades y helpers
```

## 📋 Estados del Flujo de Trabajo

1. **🎯 Prospecto** - Marcas identificadas como potenciales patrocinadores
2. **📞 Contacto Inicial** - Primer contacto realizado con la marca
3. **🤝 Negociación** - Discusión de términos y condiciones
4. **📄 Propuesta Enviada** - Propuesta formal enviada y pendiente
5. **✅ Contrato Firmado** - Acuerdo formalizado y listo para producción
6. **🎬 Contenido en Producción** - Creación y edición del contenido
7. **👀 Revisión del Cliente** - Cliente revisando antes de publicación
8. **📺 Publicado** - Contenido publicado en el canal
9. **🎉 Completado** - Patrocinio finalizado y pagado

## 🛠️ Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Ejecutar build de producción
npm run lint         # Linter de código
```

### Base de Datos
```bash
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Sincronizar esquema con BD
npm run db:seed      # Ejecutar datos de seed
npm run db:studio    # Abrir Prisma Studio (GUI)
```

## 🔌 API Endpoints

La aplicación incluye una API REST completa:

```bash
GET    /api/sponsorships          # Listar todos los patrocinios
POST   /api/sponsorships          # Crear nuevo patrocinio  
PUT    /api/sponsorships/[id]     # Actualizar patrocinio completo
PATCH  /api/sponsorships/[id]     # Actualizar solo estado (drag & drop)
DELETE /api/sponsorships/[id]     # Eliminar patrocinio
```

## 📱 Características Responsive

- **Escritorio**: Vista completa del tablero con todas las columnas
- **Tablet**: Scroll horizontal suave para navegación
- **Móvil**: Optimizado para gestos táctiles y drag & drop

## 🎨 Tema y Colores

El proyecto utiliza el esquema de colores oficial de YouTube:

- **Primary**: YouTube Red (#FF0000)
- **Indicadores de prioridad**: Verde (Baja), Amarillo (Media), Naranja (Alta), Rojo (Urgente)
- **Estados de columna**: Colores temáticos para cada etapa del flujo

## 🔜 Próximas Características

- [x] ~~Persistencia de datos con base de datos~~ ✅ **Completado**
- [ ] Sistema de autenticación
- [ ] Migración a PostgreSQL/MySQL
- [ ] Notificaciones push para vencimientos
- [ ] Exportación de reportes
- [ ] Vista de calendario
- [ ] Integración con APIs de YouTube
- [ ] Modo oscuro completo
- [ ] Filtros avanzados y búsqueda
- [ ] Upload de archivos adjuntos
- [ ] Dashboard de analytics avanzado

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Reconocimientos

- **Shadcn UI** por los componentes de interfaz
- **@dnd-kit** por la funcionalidad de drag & drop
- **Lucide** por los iconos
- **Vercel** por el hosting y herramientas de desarrollo

---

**Desarrollado con ❤️ para la comunidad de YouTubers**

🔗 **Demo**: [Ver aplicación en vivo](http://localhost:3000)
🐛 **Issues**: [Reportar bugs](https://github.com/enzava86-code/youtube-sponsors-kanban/issues)
⭐ **Dale una estrella** si te gusta el proyecto!