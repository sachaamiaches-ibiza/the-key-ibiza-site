# Tareas Pendientes de Seguridad

## 1. Cloudinary Upload Preset
- **Preset:** `the-key-feedback`
- **Riesgo:** BAJO
- **Ubicación:** `VillaDetailPage.tsx` (subida de fotos de feedback)
- **Acción:** Verificar en Cloudinary Dashboard que el preset tenga:
  - [ ] Restricción de carpeta (solo permitir uploads a carpeta `feedback`)
  - [ ] Restricción de tipo de archivo (solo imágenes)
  - [ ] Límite de tamaño

---

## 2. Gemini API Key
- **Archivo:** `src/services/gemini.ts`
- **Riesgo:** BAJO
- **Problema:** Usa `process.env.API_KEY` que no funciona en Vite
- **Acción:**
  - [ ] Verificar si la función AI Concierge está activa/se necesita
  - [ ] Si se necesita: migrar a `import.meta.env.VITE_GEMINI_API_KEY`
  - [ ] Si no se necesita: eliminar el archivo `gemini.ts`

---

## 3. JWT Tokens en localStorage (Texto Plano)
- **Archivos:** `VipLogin.tsx`, `vipAuth.ts`, `villaService.ts`
- **Riesgo:** MEDIO
- **Estado actual:** JWT guardado en localStorage/sessionStorage sin encriptar
- **Contexto:** Es práctica estándar para SPAs, pero vulnerable a XSS

### Opciones de mejora:

| Opción | Seguridad | Complejidad | Cambios necesarios |
|--------|-----------|-------------|-------------------|
| **HttpOnly Cookie** | ✅ Mejor | Alta | Backend: enviar cookie en response, Frontend: eliminar storage |
| **Memory only** | ✅ Mejor | Baja | Token se pierde al refrescar (mala UX) |
| **Mantener actual** | 🟡 OK | - | Aceptable para nivel de riesgo actual |

### Para implementar HttpOnly Cookies:

**Backend (`server.js`):**
```javascript
// En /vip/login, cambiar respuesta:
res.cookie('vip_token', token, {
  httpOnly: true,
  secure: true, // Solo HTTPS
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 24h
});
res.json({ success: true, user: {...} }); // Sin token en body
```

**Frontend:**
```javascript
// Eliminar storage.setItem('vip_token', ...)
// Las cookies se envían automáticamente con credentials: 'include'
fetch(url, { credentials: 'include' });
```

- **Acción:**
  - [ ] Decidir si el nivel de riesgo actual justifica el cambio
  - [ ] Si sí: implementar HttpOnly cookies en backend y frontend

---

## Notas

- **Cloudinary Cloud Name** (`drxf80sho`): Público por diseño, NO es problema de seguridad
- **Última revisión de seguridad:** 2026-02-25
- **Fixes completados:** GOLDKEY eliminado, VipUserManagement eliminado, .gitignore mejorado
