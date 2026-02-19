# The Key Ibiza - Infraestructura y Servicios

## Servicios en USO (Necesarios)

| Servicio | Función | URL/Acceso | Necesario |
|----------|---------|------------|-----------|
| **Supabase** | Base de datos PostgreSQL | https://supabase.com/dashboard | ✅ SÍ |
| **Vercel** | Hosting frontend + backend | https://vercel.com/dashboard | ✅ SÍ |
| **GitHub** | Control de versiones | https://github.com | ✅ SÍ |
| **Cloudinary** | Hosting de imágenes | https://cloudinary.com/console | ✅ SÍ |

---

## Repositorios GitHub

| Repo | Contenido | URL |
|------|-----------|-----|
| `the-key-ibiza-site` | Frontend (React + Vite) | https://github.com/sachaamiaches-ibiza/the-key-ibiza-site |
| `the-key-ibiza-backend` | Backend (Express + Node) | https://github.com/sachaamiaches-ibiza/the-key-ibiza-backend |

---

## Proyectos Vercel

| Proyecto | Tipo | URL Producción |
|----------|------|----------------|
| the-key-ibiza-site | Frontend | https://the-key-ibiza-site.vercel.app |
| the-key-ibiza-backend | Backend API | https://the-key-ibiza-backend.vercel.app |

---

## Variables de Entorno (Vercel Backend)

| Variable | Descripción |
|----------|-------------|
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_KEY` | Clave de servicio de Supabase |
| `VIP_SECRET` | Clave secreta para firmar tokens JWT |

---

## Tablas Supabase

| Tabla | Contenido |
|-------|-----------|
| `villas` | Listado de villas (33 columnas) |
| `yachts` | Listado de yates |
| `catamarans` | Listado de catamaranes |
| `vip_users` | Usuarios VIP/Admin |

---

## Flujo de Datos

```
Usuario → Frontend (Vercel) → Backend API (Vercel) → Supabase (DB)
                                    ↓
                              Cloudinary (imágenes)
```

---

## Resumen: ¿Qué puedes cerrar?

- ✅ **Mantén abierto:** Supabase, Vercel, GitHub (cuando trabajes)

---

Última actualización: 19 Feb 2026
