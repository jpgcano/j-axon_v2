# Backlog formato Jira (Epics/Stories/Tasks)

Proyecto sugerido Jira: `JAX`

## Epics

| Epic Key | Epic Name | Objetivo |
| :-- | :-- | :-- |
| JAX-EP01 | Foundation & Platform | Base tecnica, estructura, CI/CD, entorno seguro |
| JAX-EP02 | Security & Access | Auth JWT, RBAC, sesion, hardening de acceso |
| JAX-EP03 | Asset Lifecycle | Flujo completo de activos con OCC y auditoria |
| JAX-EP04 | Ticketing & Risk | Triage, escalamiento y vistas por rol |
| JAX-EP05 | Maintenance & Audit | Mantenimiento operativo y trazabilidad forense |
| JAX-EP06 | MCP AI Integration | IA asistida con aislamiento y degradacion segura |
| JAX-EP07 | QA & Release Readiness | Pruebas, gates de calidad y salida a staging/prod |

## Stories y Tasks

### JAX-EP01 - Foundation & Platform

| Story Key | Story | Area |
| :-- | :-- | :-- |
| JAX-ST01 | Estructura base backend hexagonal y tooling | BACK |
| JAX-ST02 | Estructura base frontend y cliente HTTP | FRONT |
| JAX-ST03 | Pipeline CI inicial y secretos por entorno | DEVOPS |
| JAX-ST04 | Estrategia QA inicial y base de automatizacion | QA |

| Task Key | Parent Story | Task |
| :-- | :-- | :-- |
| JAX-TSK001 | JAX-ST01 | Crear carpetas `domain/application/infrastructure/interfaces` |
| JAX-TSK002 | JAX-ST01 | Definir scripts `dev/build/start/lint/typecheck/test` |
| JAX-TSK003 | JAX-ST01 | Configurar TS strict + lint/prettier backend |
| JAX-TSK004 | JAX-ST01 | Bootstrap Express y middlewares globales |
| JAX-TSK005 | JAX-ST01 | Configurar Prisma y primera migracion |
| JAX-TSK006 | JAX-ST02 | Crear estructura `app/components/hooks/store/lib/providers` |
| JAX-TSK007 | JAX-ST02 | Configurar Tailwind + layout raiz con providers |
| JAX-TSK008 | JAX-ST02 | Implementar cliente HTTP base + `X-Request-ID` |
| JAX-TSK009 | JAX-ST03 | Crear pipeline CI: lint, typecheck, test |
| JAX-TSK010 | JAX-ST03 | Configurar inyeccion de secretos por entorno |
| JAX-TSK011 | JAX-ST04 | Definir plan QA de unit/integration/e2e |

### JAX-EP02 - Security & Access

| Story Key | Story | Area |
| :-- | :-- | :-- |
| JAX-ST05 | Implementar autenticacion JWT y sesion | BACK |
| JAX-ST06 | Implementar autorizacion RBAC y controles de seguridad | BACK |
| JAX-ST07 | Implementar login y guardas por rol en cliente | FRONT |

| Task Key | Parent Story | Task |
| :-- | :-- | :-- |
| JAX-TSK012 | JAX-ST05 | Endpoints login/refresh/logout |
| JAX-TSK013 | JAX-ST05 | Firma/verificacion RS256 |
| JAX-TSK014 | JAX-ST05 | Denylist de revocacion y sesiones concurrentes |
| JAX-TSK015 | JAX-ST06 | Middleware auth bearer |
| JAX-TSK016 | JAX-ST06 | Middleware RBAC por permisos atomicos |
| JAX-TSK017 | JAX-ST06 | CORS restrictivo + rate limiting |
| JAX-TSK018 | JAX-ST07 | Pantalla login con RHF + Zod |
| JAX-TSK019 | JAX-ST07 | Guardas de ruta por rol |
| JAX-TSK020 | JAX-ST07 | UX estandar para 401 y 403 |

### JAX-EP03 - Asset Lifecycle

| Story Key | Story | Area |
| :-- | :-- | :-- |
| JAX-ST08 | API de activos con contrato v1 | BACK |
| JAX-ST09 | Pantallas de activos por rol | FRONT |
| JAX-ST10 | Validacion QA del flujo de activos | QA |

| Task Key | Parent Story | Task |
| :-- | :-- | :-- |
| JAX-TSK021 | JAX-ST08 | `POST /api/v1/assets` |
| JAX-TSK022 | JAX-ST08 | `GET /api/v1/assets/{assetId}` |
| JAX-TSK023 | JAX-ST08 | `PATCH /api/v1/assets/{assetId}/status` |
| JAX-TSK024 | JAX-ST08 | OCC con `currentIntegrityHash` y 409 |
| JAX-TSK025 | JAX-ST08 | Soft delete via estado `RETIRED` |
| JAX-TSK026 | JAX-ST09 | Listado de activos con filtros/paginacion |
| JAX-TSK027 | JAX-ST09 | Formulario alta activo |
| JAX-TSK028 | JAX-ST09 | Detalle activo + metadatos auditoria |
| JAX-TSK029 | JAX-ST09 | UX para 409 concurrencia |
| JAX-TSK030 | JAX-ST10 | Integracion API activos |
| JAX-TSK031 | JAX-ST10 | E2E login + alta de activo |

### JAX-EP04 - Ticketing & Risk

| Story Key | Story | Area |
| :-- | :-- | :-- |
| JAX-ST11 | Motor de tickets y calculo de riesgo | BACK |
| JAX-ST12 | Vistas por rol TECH vs MANAGER/CRO | FRONT |
| JAX-ST13 | QA de escalamiento y permisos | QA |

| Task Key | Parent Story | Task |
| :-- | :-- | :-- |
| JAX-TSK032 | JAX-ST11 | Crear ticket + calculo P x C |
| JAX-TSK033 | JAX-ST11 | Bloqueo y aprobacion para `HIGH/EXTREME` |
| JAX-TSK034 | JAX-ST11 | Endpoints tickets (crear/listar/actualizar/aprobar) |
| JAX-TSK035 | JAX-ST12 | Bandeja TECH (solo asignados) |
| JAX-TSK036 | JAX-ST12 | Bandeja aprobaciones MANAGER/CRO |
| JAX-TSK037 | JAX-ST12 | Reglas visuales de bloqueo por rol |
| JAX-TSK038 | JAX-ST13 | Pruebas RBAC 403 |
| JAX-TSK039 | JAX-ST13 | Pruebas flujo de escalada |

### JAX-EP05 - Maintenance & Audit

| Story Key | Story | Area |
| :-- | :-- | :-- |
| JAX-ST14 | Casos de uso de mantenimiento | BACK |
| JAX-ST15 | Auditoria criptografica inmutable | BACK |
| JAX-ST16 | Vistas mantenimiento y auditoria | FRONT |
| JAX-ST17 | QA forense e inmutabilidad | QA |

| Task Key | Parent Story | Task |
| :-- | :-- | :-- |
| JAX-TSK040 | JAX-ST14 | Crear/planificar/cerrar mantenimiento |
| JAX-TSK041 | JAX-ST14 | Transacciones atomicas multi-tabla |
| JAX-TSK042 | JAX-ST15 | Hash service SHA-256 (`integrity_hash`) |
| JAX-TSK043 | JAX-ST15 | Middleware mutaciones con `payload_before/after` |
| JAX-TSK044 | JAX-ST15 | Cadena `hash_prev/hash_current` insert-only |
| JAX-TSK045 | JAX-ST16 | Vista de mantenimiento operativa |
| JAX-TSK046 | JAX-ST16 | Visor auditoria solo lectura ADMIN/AUDITOR |
| JAX-TSK047 | JAX-ST17 | Caso QA validacion hash manual |

### JAX-EP06 - MCP AI Integration

| Story Key | Story | Area |
| :-- | :-- | :-- |
| JAX-ST18 | Integracion API con MCP aislado | BACK |
| JAX-ST19 | UX de sugerencias IA con validacion humana | FRONT |
| JAX-ST20 | Infra MCP aislada y disponible | DEVOPS |

| Task Key | Parent Story | Task |
| :-- | :-- | :-- |
| JAX-TSK048 | JAX-ST18 | Adapter MCP con timeout 3s |
| JAX-TSK049 | JAX-ST18 | Data masking por rol antes de invocar MCP |
| JAX-TSK050 | JAX-ST18 | Endpoint `POST /api/v1/ai/maintenance/predict` |
| JAX-TSK051 | JAX-ST18 | Circuit breaker y 503 especifico |
| JAX-TSK052 | JAX-ST19 | Componente de sugerencia IA diferenciado |
| JAX-TSK053 | JAX-ST19 | Boton "Aplicar recomendacion" con confirmacion |
| JAX-TSK054 | JAX-ST19 | Estado degradado cuando MCP cae |
| JAX-TSK055 | JAX-ST20 | Despliegue contenedor MCP en red privada |

### JAX-EP07 - QA & Release Readiness

| Story Key | Story | Area |
| :-- | :-- | :-- |
| JAX-ST21 | Cobertura automatizada y gates de calidad | QA |
| JAX-ST22 | Observabilidad y readiness de produccion | DEVOPS |

| Task Key | Parent Story | Task |
| :-- | :-- | :-- |
| JAX-TSK056 | JAX-ST21 | Unit tests dominio/aplicacion >=85% |
| JAX-TSK057 | JAX-ST21 | Integration tests API + BD efimera |
| JAX-TSK058 | JAX-ST21 | E2E criticos por rol |
| JAX-TSK059 | JAX-ST21 | Pruebas seguridad (OWASP/RBAC/Zod strict) |
| JAX-TSK060 | JAX-ST22 | Logging estructurado con `requestId` |
| JAX-TSK061 | JAX-ST22 | Alertas 5xx, RBAC_DENIED, HASH_MISMATCH |
| JAX-TSK062 | JAX-ST22 | Runbook de deploy y rollback validado |

## Campos Jira recomendados
- `Issue Type`: Epic / Story / Task / Bug
- `Priority`: Highest, High, Medium, Low
- `Labels`: `front`, `back`, `qa`, `devops`, `security`, `mcp`
- `Sprint`: Sprint 0..4
- `Components`: `jaxon-client`, `jaxon-core-api`, `infra`, `qa`
- `Definition of Done`: lint + typecheck + tests + code review + evidencia

## Consulta rapida JQL sugerida
```text
project = JAX AND statusCategory != Done ORDER BY priority DESC, created ASC
```
