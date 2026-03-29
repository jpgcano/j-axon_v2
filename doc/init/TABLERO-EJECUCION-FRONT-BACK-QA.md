# Tablero de ejecucion - Front, Back y QA

Estado inicial del proyecto: `pending` en todas las tareas.

## Sprint 0 - Cimentacion (2 semanas)

| ID | Area | Tarea | Responsable sugerido | Estado | Prioridad |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S0-01 | BACK | Estructura hexagonal (`domain/application/infrastructure/interfaces`) | Backend Senior | pending | alta |
| S0-02 | BACK | Scripts `dev/build/start/lint/typecheck/test` + TS strict | Backend Senior | pending | alta |
| S0-03 | BACK | Bootstrap Express con middlewares base | Backend Senior | pending | alta |
| S0-04 | BACK | Prisma base + conexion PostgreSQL + primera migracion | Backend Senior | pending | alta |
| S0-05 | FRONT | Estructura `app/components/hooks/store/lib/providers` | Frontend Senior | pending | alta |
| S0-06 | FRONT | Tailwind + tokens base + layout raiz con providers | Frontend Senior | pending | alta |
| S0-07 | FRONT | Cliente HTTP base + `X-Request-ID` + parser envelope API | Frontend Senior | pending | alta |
| S0-08 | DEVOPS | Pipeline CI inicial (lint, typecheck, test) | DevOps/SRE | pending | alta |
| S0-09 | DEVOPS | Gestion de secretos por entorno (sin `.env` versionado) | DevOps/SRE | pending | alta |
| S0-10 | QA | Estrategia QA inicial + suite base unit/integration/e2e | QA Engineer | pending | alta |

## Sprint 1 - Seguridad y Activos (2 semanas)

| ID | Area | Tarea | Responsable sugerido | Estado | Prioridad |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S1-01 | BACK | Auth JWT (login/refresh/logout) con RS256 | Backend Senior | pending | alta |
| S1-02 | BACK | RBAC por permisos atomicos (middleware) | Backend Senior | pending | alta |
| S1-03 | BACK | Endpoints assets (`POST`, `GET`, `PATCH status`) | Backend Senior | pending | alta |
| S1-04 | BACK | OCC con `currentIntegrityHash` y respuesta 409 | Backend Senior | pending | alta |
| S1-05 | BACK | Auditoria inicial de mutaciones (insert-only) | Backend Senior | pending | alta |
| S1-06 | FRONT | Login + manejo de sesion + guardas de ruta RBAC | Frontend Senior | pending | alta |
| S1-07 | FRONT | Vistas de activos: listado, detalle, alta, cambio de estado | Frontend Senior | pending | alta |
| S1-08 | FRONT | Manejo UX de 401/403/409/500 | Frontend Senior | pending | alta |
| S1-09 | QA | Casos criticos activos/auth (API + UI) | QA Engineer | pending | alta |
| S1-10 | QA | E2E: login y creacion de activo | QA Engineer | pending | media |

## Sprint 2 - Tickets y Riesgo (2 semanas)

| ID | Area | Tarea | Responsable sugerido | Estado | Prioridad |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S2-01 | BACK | Apertura ticket + calculo riesgo (P x C) | Backend Senior | pending | alta |
| S2-02 | BACK | Flujo de aprobacion para `HIGH/EXTREME` | Backend Senior | pending | alta |
| S2-03 | FRONT | Vistas de tickets por rol (`TECH` vs `MANAGER/CRO`) | Frontend Senior | pending | alta |
| S2-04 | FRONT | Bandeja de aprobaciones para manager/cro | Frontend Senior | pending | alta |
| S2-05 | QA | Pruebas RBAC 403 y reglas de escalada | QA Engineer | pending | alta |

## Sprint 3 - Mantenimiento y Auditoria (2 semanas)

| ID | Area | Tarea | Responsable sugerido | Estado | Prioridad |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S3-01 | BACK | Casos de uso de mantenimiento (crear/planificar/cerrar) | Backend Senior | pending | alta |
| S3-02 | BACK | Encadenamiento criptografico `hash_prev/hash_current` | Backend Senior | pending | alta |
| S3-03 | FRONT | Vistas de mantenimiento y agenda operativa | Frontend Senior | pending | alta |
| S3-04 | FRONT | Visor de auditoria solo lectura (ADMIN/AUDITOR) | Frontend Senior | pending | alta |
| S3-05 | QA | Validacion hash y no repudio forense | QA Engineer | pending | alta |

## Sprint 4 - IA MCP y Estabilizacion (2 semanas)

| ID | Area | Tarea | Responsable sugerido | Estado | Prioridad |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S4-01 | BACK | Adapter MCP + timeout 3s + circuit breaker (503) | Backend Senior | pending | alta |
| S4-02 | BACK | Endpoint predictivo IA con data masking por rol | Backend Senior | pending | alta |
| S4-03 | FRONT | UI de sugerencias IA con confirmacion explicita | Frontend Senior | pending | alta |
| S4-04 | DEVOPS | Despliegue contenedor MCP aislado en red privada | DevOps/SRE | pending | alta |
| S4-05 | QA | Pruebas resiliencia MCP + pruebas de seguridad finales | QA Engineer | pending | alta |

## Kanban rapido (para uso diario)

### pending
- Todos los IDs `S0-*` a `S4-*`.

### in_progress
- (vacio)

### blocked
- (vacio)

### done
- (vacio)

## Reglas de operacion del tablero
- Solo una tarea `in_progress` por persona.
- Cada PR debe referenciar al menos un ID de tablero.
- No mover a `done` sin evidencia: lint/typecheck/tests en verde.
- Tareas QA criticas son bloqueantes de release.
