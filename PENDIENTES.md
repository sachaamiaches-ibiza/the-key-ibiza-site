# The Key Ibiza - Lista de Ajustes Pendientes

## Prioridad Alta

### 1. Panel Admin para Gestión de Usuarios VIP
**Complejidad:** Media | **Tiempo estimado:** 30 min

**Tareas:**
- [ ] Añadir columna `role` a tabla `vip_users` en Supabase
- [ ] Crear endpoint `GET /vip/users` (listar usuarios)
- [ ] Crear endpoint `POST /vip/users` (crear usuario)
- [ ] Crear endpoint `PUT /vip/users/:id` (editar usuario)
- [ ] Crear endpoint `DELETE /vip/users/:id` (desactivar usuario)
- [ ] Proteger endpoints solo para rol "admin"
- [ ] Crear componente VipUserManagement en frontend

---

## Prioridad Media

### 2. Lógica de Estancia Mínima Flexible
**Complejidad:** Media-Alta | **Tiempo estimado:** 45-60 min

**Descripción:**
Implementar validación de estancia mínima con soporte para temporadas flexibles. Ejemplo: Julio-Agosto mínimo 7 noches, resto del año 5 noches.

**Tareas:**
- [ ] Modificar campo `min_stay` en Supabase a JSONB con estructura flexible:
  ```json
  {
    "default": 5,
    "seasonal": [
      {"from": "07-01", "to": "08-31", "min": 7}
    ]
  }
  ```
- [ ] Actualizar `villaService.ts` para parsear estancia mínima flexible
- [ ] En `VillaDetailPage.tsx`:
  - [ ] Validar selección de fechas contra estancia mínima
  - [ ] Mostrar error si selección < mínimo requerido
  - [ ] Mostrar información de estancia mínima al usuario
- [ ] En `VillasPage.tsx` (listado):
  - [ ] Filtrar villas según fechas seleccionadas y estancia mínima
  - [ ] Mostrar badge con estancia mínima en cada tarjeta
- [ ] Añadir tipo TypeScript para estancia mínima flexible

---

## Prioridad Baja

### 3. Mejoras de Filtrado en Listado de Villas
**Complejidad:** Baja | **Tiempo estimado:** 20 min

**Tareas:**
- [ ] Filtro por número de habitaciones
- [ ] Filtro por rango de precio
- [ ] Filtro por ubicación
- [ ] Ordenar por precio/nombre/habitaciones

---

### 4. Galería de Miniaturas Arrastrable
**Complejidad:** Media | **Tiempo estimado:** 30-45 min

**Descripción:**
En la galería de fotos de las villas, la tira de miniaturas de abajo no se puede arrastrar para ver más imágenes. Implementar scroll horizontal interactivo.

**Tareas:**
- [ ] Implementar drag-to-scroll funcional con el ratón
- [ ] Asegurar que funcione swipe en móvil/tablet
- [ ] Evitar conflictos entre arrastre y click para seleccionar imagen
- [ ] Ubicación: `VillaDetailPage.tsx`, sección gallery modal

---

## Notas
- Última actualización: 19 Feb 2026
- Orden de prioridad: Admin Panel → Estancia Mínima → Filtros
- Para añadir tareas, editar este archivo
