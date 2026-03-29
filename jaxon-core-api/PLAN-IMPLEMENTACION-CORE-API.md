# Plan de implementacion - jaxon-core-api

## 1) Objetivo
Construir el Core API de J-axon v2.0.0 con arquitectura hexagonal, seguridad RBAC/JWT, persistencia PostgreSQL y trazabilidad inmutable.

## 2) Fuentes base (SSOT)
- `doc/DOCUMENTO DE REQUERIMIENTOS DE NEGOCIO.md`
- `doc/DOCUMENTO DE ESPECIFICACION DE REQUERIMIENTOS DE SOFTWARE.md`
- `doc/DOCUMENTO DE ARQUITECTURA DEL SISTEMA.md`
- `doc/DOCUMENTO DE ESPECIFICACION DE API Y CONTRATO DE INTEGRACION.md`
- `doc/DOCUMENTO DE DICCIONARIO DE DATOS Y MODELO ENTIDAD-RELACION.md`
- `doc/DOCUMENTO DE ESPECIFICACION DE SEGURIDAD Y CONTROL DE ACCESO.md`
- `doc/DOCUMENTO DE PLAN MAESTRO DE PRUEBAS Y ASEGURAMIENTO DE CALIDAD (QA TEST PLAN).md`
- `doc/DOCUMENTO DE ESTRUCTURA DE DESGLOSE DE TRABAJO (WBS) Y PLAN DE EJECUCION .md`
- `doc/DOCUMENTO DE MANUAL DE OPERACIONES Y DESPLIEGUE CONTINUO (DEVOPS RUNBOOK).md`

## 3) Principios de implementacion del core
- Arquitectura hexagonal: dominio puro, casos de uso, adaptadores de infraestructura e interfaz HTTP.
- API REST versionada (`/api/v1`) con envelope estandar de respuestas.
- Validacion estricta con Zod (`strict`) en toda entrada de datos.
- Autenticacion JWT y autorizacion RBAC por permisos atomicos.
- Inmutabilidad: sin delete fisico en datos de negocio; usar cambios de estado.
- Auditoria criptografica insert-only con encadenamiento de hash.
- Resiliencia: timeouts y circuit breaker para MCP.

## 4) Backlog de tareas por fase

### Fase 0 - Bootstrap tecnico
- [ ] Definir estructura del proyecto por capas:
  - `src/domain`
  - `src/application`
  - `src/infrastructure`
  - `src/interfaces/http`
  - `src/shared`
- [ ] Configurar scripts npm: `dev`, `build`, `start`, `lint`, `typecheck`, `test`.
- [ ] Configurar TypeScript strict y aliases de paths.
- [ ] Configurar ESLint + Prettier y convenciones de calidad.
- [ ] Definir `env` schema con Zod para variables obligatorias.
- [ ] Crear servidor Express base con middlewares globales.

### Fase 1 - Persistencia y modelo de datos
- [ ] Modelar `schema.prisma` con tablas core: `jaxon_users`, `jaxon_assets`, `jaxon_tickets`, `jaxon_audit_logs`.
- [ ] Definir enums de dominio (roles, estados de asset, estado/riesgo de tickets).
- [ ] Configurar constraints e indices segun MER.
- [ ] Configurar migraciones versionadas (sin SQL manual en produccion).
- [ ] Implementar seed inicial para usuarios/roles base.
- [ ] Implementar repositorios Prisma (assets, tickets, users, audit logs).

### Fase 2 - Seguridad y control de acceso
- [ ] Implementar modulo auth: login, refresh, logout.
- [ ] Implementar firma y verificacion JWT (RS256) con llaves por entorno.
- [ ] Implementar middleware de autenticacion (`Authorization: Bearer`).
- [ ] Implementar middleware de autorizacion RBAC por permiso atomico.
- [ ] Implementar denylist de tokens revocados (redis o adapter in-memory inicial).
- [ ] Implementar control de sesiones concurrentes por usuario.
- [ ] Configurar CORS restrictivo por entorno.
- [ ] Configurar rate limiting por ruta (`/auth/*` y resto de API).

### Fase 3 - API contract y modulos core
- [ ] Implementar envelope de respuesta estandar para exito/error.
- [ ] Implementar `X-Request-ID` propagation en request/response y logs.
- [ ] Implementar endpoint `POST /api/v1/assets`.
- [ ] Implementar endpoint `GET /api/v1/assets/{assetId}`.
- [ ] Implementar endpoint `PATCH /api/v1/assets/{assetId}/status`.
- [ ] Implementar validacion OCC por `currentIntegrityHash` (409 Conflict).
- [ ] Implementar reglas de soft delete para activos (`RETIRED`).
- [ ] Bloquear cierre/logica prohibida segun reglas de riesgo y rol.

### Fase 4 - Dominio tickets, triage y mantenimiento
- [ ] Implementar caso de uso de apertura de ticket con calculo de riesgo (P x C).
- [ ] Implementar regla de escalada automatica para riesgo `HIGH/EXTREME`.
- [ ] Implementar bloqueo de acciones para TECH en estados no permitidos.
- [ ] Implementar endpoints de tickets (crear, listar, actualizar estado, aprobar).
- [ ] Implementar casos de uso de mantenimiento (crear, planificar, cerrar).
- [ ] Implementar transacciones atomicas para operaciones multi-tabla.

### Fase 5 - Auditoria forense e integridad
- [ ] Implementar servicio `HashService` SHA-256 para `integrity_hash`.
- [ ] Implementar middleware/interceptor de mutaciones (POST/PUT/PATCH).
- [ ] Registrar `payload_before`, `payload_after`, `actor_id`, `ip_origin`.
- [ ] Implementar cadena `hash_prev` -> `hash_current` en `jaxon_audit_logs`.
- [ ] Implementar politica insert-only en auditoria (sin update/delete).
- [ ] Exponer endpoint de consulta de auditoria solo para ADMIN/AUDITOR.

### Fase 6 - Integracion MCP sidecar
- [ ] Implementar adapter HTTP hacia `MCP_SIDECAR_URL` con timeout maximo de 3s.
- [ ] Implementar sanitizacion/masking de datos antes de enviar contexto al MCP.
- [ ] Implementar endpoint `POST /api/v1/ai/maintenance/predict`.
- [ ] Implementar circuit breaker y degradacion controlada (503 especifico).
- [ ] Garantizar que MCP no tenga acceso directo a DB ni operaciones DML.

### Fase 7 - Observabilidad, testing y salida
- [ ] Implementar logger estructurado con contexto (`requestId`, actor, ruta).
- [ ] Implementar metricas de latencia P95 y tasas de error 5xx.
- [ ] Implementar pruebas unitarias dominio/aplicacion (coverage >= 85%).
- [ ] Implementar pruebas de integracion de endpoints con BD efimera.
- [ ] Implementar pruebas de seguridad (RBAC, zod strict, SQL injection, rate limit).
- [ ] Implementar pruebas de resiliencia MCP y fallback operativo.
- [ ] Preparar pipeline CI/CD: lint, typecheck, test, build, scan imagen, migrate deploy.

## 5) Estructura sugerida de implementacion tecnica
- [ ] `src/domain/entities`: `Asset`, `Ticket`, `AuditLog`, `User`.
- [ ] `src/domain/value-objects`: `AssetStatus`, `RiskLevel`, `Role`.
- [ ] `src/domain/ports`: repositorios y servicios (`IHashService`, `IMcpClient`).
- [ ] `src/application/use-cases`: `CreateAsset`, `ChangeAssetStatus`, `CreateTicket`, `EscalateTicket`, `PredictMaintenance`.
- [ ] `src/infrastructure/persistence`: repositorios prisma.
- [ ] `src/infrastructure/security`: jwt, rbac, hashing, rate limiter.
- [ ] `src/interfaces/http`: rutas, controladores, middlewares zod/auth/rbac/error.

## 6) Checklist de cumplimiento de negocio y seguridad
- [ ] No existe endpoint de delete fisico para activos/tickets core.
- [ ] Todos los endpoints mutantes registran auditoria inmutable.
- [ ] RBAC denegado por defecto y permisos explicitos por ruta.
- [ ] Errores usan codigos HTTP del contrato (400/401/403/404/409/500/503).
- [ ] Operaciones criticas se ejecutan en transaccion.
- [ ] Cumplimiento de limites de rendimiento (GET P95 <= 200ms; mutaciones <= 500ms objetivo).

## 7) Criterios de cierre del plan core-api
- [ ] API core operativa con modulos de activos, tickets, mantenimiento y auditoria.
- [ ] Integracion MCP funcionando con aislamiento y degradacion segura.
- [ ] Pipeline CI/CD en verde y migraciones reproducibles.
- [ ] Evidencia de pruebas criticas QA aprobadas.
- [ ] Documentacion tecnica de endpoints y entorno actualizada.
