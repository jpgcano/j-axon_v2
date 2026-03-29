# Matriz de vistas por rol - jaxon-client

## 1) Objetivo
Definir que vistas debe ver cada rol en el cliente, que acciones puede ejecutar y que informacion debe mostrarse en cada pantalla.

## 2) Roles del sistema
- `ADMIN`
- `MANAGER` / `CRO`
- `TECH`
- `AUDITOR`

## 3) Vistas globales (comunes)

### Publicas
- `/login`: autenticacion de usuario.

### Privadas (con sesion)
- `/dashboard`: redirige al dashboard segun rol.
- `/perfil`: datos basicos de sesion, rol y configuraciones de interfaz.
- `/acceso-denegado`: vista informativa para intentos sin permiso.

## 4) Dashboards por rol

### 4.1 Dashboard ADMIN
**Objetivo:** vista ejecutiva-operativa completa.

**Widgets/KPIs recomendados:**
- Total de activos por estado (`ACTIVE`, `MAINTENANCE`, `RETIRED`).
- Tickets abiertos por nivel de riesgo.
- Tickets pendientes de aprobacion de segunda linea.
- Ordenes de mantenimiento vencidas/proximas.
- Indicadores de auditoria (eventos, hash mismatch, intentos RBAC denegados).

**Tablas/feeds:**
- Ultimos activos creados/modificados.
- Ultimos tickets criticos.
- Eventos recientes de `jaxon_audit_logs`.

### 4.2 Dashboard MANAGER/CRO
**Objetivo:** control de riesgo, aprobaciones y continuidad operativa.

**Widgets/KPIs recomendados:**
- Cola de tickets `HIGH` y `EXTREME` pendientes de aprobacion.
- SLA de atencion por prioridad.
- Riesgo agregado por categoria de activo.
- Tendencia semanal de incidencias criticas.

**Tablas/feeds:**
- Bandeja de aprobacion (acciones aprobar/rechazar/escalar).
- Activos con mayor reincidencia de fallas.

### 4.3 Dashboard TECH
**Objetivo:** ejecucion rapida de trabajo asignado.

**Widgets/KPIs recomendados:**
- Mis tickets asignados por estado (`OPEN`, `IN_PROGRESS`, `PENDING_APPROVAL`).
- Tareas de mantenimiento de hoy/proximas 48h.
- Alertas de prioridad alta asociadas a mis activos.

**Tablas/feeds:**
- Lista de tickets asignados (no global).
- Activos a su cargo y estado actual.

**Restricciones visuales:**
- No mostrar panel global de auditoria.
- No mostrar aprobaciones de segunda linea.

### 4.4 Dashboard AUDITOR
**Objetivo:** supervision y trazabilidad de solo lectura.

**Widgets/KPIs recomendados:**
- Volumen de cambios por modulo y por periodo.
- Conteo de eventos de seguridad (`RBAC_DENIED`, `HASH_MISMATCH`).
- Cobertura de trazabilidad (porcentaje de mutaciones con log asociado).

**Tablas/feeds:**
- Visor de auditoria completo (filtros por entidad, actor, accion, fecha).
- Cambios recientes en activos/tickets (sin acciones de mutacion).

**Restricciones visuales:**
- Sin botones de crear/editar/aprobar/cerrar.

## 5) Modulos y visibilidad por rol

### 5.1 Activos
- `ADMIN`: crear, leer global, actualizar estado, retirar (soft delete).
- `MANAGER/CRO`: crear, leer global, actualizar estado, retirar (soft delete).
- `TECH`: leer global (o filtrado operativo segun asignacion), sin retiro.
- `AUDITOR`: leer global, sin mutaciones.

**Vistas sugeridas:**
- `/assets` (inventario)
- `/assets/new` (solo ADMIN, MANAGER)
- `/assets/[id]`
- `/assets/[id]/status` (solo roles con update)

### 5.2 Tickets
- `ADMIN`: crear, leer global, actualizar.
- `MANAGER/CRO`: crear, leer global, actualizar y aprobar alto/extremo.
- `TECH`: crear, leer asignados, actualizar asignados (sin cierre de alto/extremo no aprobado).
- `AUDITOR`: leer global, sin mutaciones.

**Vistas sugeridas:**
- `/tickets`
- `/tickets/new`
- `/tickets/[id]`
- `/tickets/approvals` (solo MANAGER/CRO, ADMIN)

### 5.3 Mantenimiento
- `ADMIN`: crear, leer, actualizar, aprobar.
- `MANAGER/CRO`: crear, leer, actualizar, aprobar.
- `TECH`: leer asignados y actualizar asignados.
- `AUDITOR`: leer global.

**Vistas sugeridas:**
- `/maintenance`
- `/maintenance/calendar`
- `/maintenance/[id]`

### 5.4 Auditoria
- `ADMIN`: lectura global.
- `MANAGER/CRO`: sin acceso.
- `TECH`: sin acceso.
- `AUDITOR`: lectura global.

**Vistas sugeridas:**
- `/audit/logs`
- `/audit/logs/[id]`

### 5.5 IA (MCP)
- `ADMIN`: consulta global.
- `MANAGER/CRO`: consulta global.
- `TECH`: consulta sobre activos/tickets asignados.
- `AUDITOR`: sin acceso.

**Vistas sugeridas:**
- Panel embebido en `/tickets/[id]` y `/assets/[id]`.
- Estado degradado visible cuando MCP no disponible (HTTP 503).

## 6) Informacion permitida por rol en cada vista

### Campos siempre ocultos en cliente (todos los roles)
- `password_hash` y secretos de autenticacion.
- Llaves criptograficas del servidor.
- `MASTER_SALT_HASH`.

### Campos con acceso segun rol
- `integrity_hash`:
  - visible en detalle para `ADMIN` y `AUDITOR`.
  - visible opcional en `MANAGER/CRO` en contexto de validacion.
  - no prioritario para `TECH` (solo cuando el flujo lo requiera).
- `payload_before/payload_after` de auditoria:
  - completo para `ADMIN` y `AUDITOR`.
  - no disponible para `TECH` y `MANAGER/CRO` (sin modulo auditoria).
- Datos de asignacion de tickets:
  - global para `ADMIN` y `MANAGER/CRO`.
  - solo asignados para `TECH`.

## 7) Comportamiento UX obligatorio por permisos
- Ocultar en navegacion modulos no autorizados (no solo bloquear al entrar).
- Deshabilitar botones de accion cuando el estado de negocio no lo permita.
- Mostrar motivo de bloqueo en tooltip/mensaje (ej. "Requiere aprobacion de segunda linea").
- Ante `403`, mostrar modal de acceso denegado sin romper la sesion.
- Ante `409`, mostrar mensaje de concurrencia y opcion de recargar.
- Ante `401`, cerrar sesion y redirigir a login.

## 8) Diferencia clave de dashboards (ejemplo solicitado)
- Un `TECH` ve solo trabajo operativo propio: tickets y mantenimientos asignados, sin panel global de riesgo ni auditoria.
- Un `MANAGER/CRO` ve vista global de riesgo y aprobaciones: cola de tickets criticos, capacidad de aprobar/escalar y metricas de SLA.
- Un `ADMIN` ve todo el panorama operativo y de control.
- Un `AUDITOR` ve trazabilidad completa en solo lectura, sin capacidad de mutar datos.
