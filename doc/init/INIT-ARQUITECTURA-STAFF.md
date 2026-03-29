# INIT - Contexto, Arquitectura y Staff

## 1. Contexto del proyecto

**Proyecto:** J-axon v2.0.0  
**Objetivo:** construir una plataforma de gobernanza y mantenimiento predictivo con trazabilidad inmutable, control de riesgo y asistencia IA bajo validacion humana.

### Alcance inicial (MVP)
- Gestion de activos (alta, consulta, cambio de estado, retiro logico).
- Gestion de tickets con triage de riesgo y flujo de aprobacion para casos criticos.
- Gestion de mantenimiento preventivo/correctivo.
- Auditoria criptografica insert-only.
- Integracion IA (MCP sidecar) solo como recomendacion, sin escritura directa.

### Restricciones obligatorias
- Separacion fisica `client` (frontend) y `core-api` (backend).
- API REST versionada (`/api/v1`) con contrato estable.
- RBAC estricto por rol: `ADMIN`, `MANAGER/CRO`, `TECH`, `AUDITOR`.
- Soft delete en dominios core (sin borrado fisico en produccion).

---

## 2. Arquitectura orientada al staff

## 2.1 Vista de arquitectura (alto nivel)
- **Client SPA (Next.js):** experiencia por rol, estado con React Query + Zustand, consumo de API.
- **Core API (Node.js/Express + TS):** orquestacion de casos de uso, validacion, auth, RBAC, auditoria.
- **PostgreSQL:** almacenamiento transaccional 3NF e integridad de datos.
- **MCP Sidecar:** analisis IA aislado; la API filtra contexto y aplica circuit breaker.

## 2.2 Arquitectura backend por capas (hexagonal)
- **Dominio:** entidades, value objects y puertos.
- **Aplicacion:** casos de uso (activos, tickets, mantenimiento, auditoria, IA).
- **Infraestructura:** Prisma, hash service, cliente MCP, cache/sesion.
- **Interfaz HTTP:** rutas, controladores, middlewares (zod, auth, rbac, errores).

## 2.3 Arquitectura frontend por responsabilidades
- **App Router:** rutas y layouts por dominio.
- **Presentacional vs Contenedor:** UI desacoplada de logica y datos.
- **Estado:**
  - servidor (React Query)
  - global de sesion/permisos (Zustand)
  - local (useState/useReducer)
- **Seguridad UX:** guardas de ruta por rol, estados para 401/403/409/503.

## 2.4 Modulos funcionales y ownership de equipo
- **Modulo Activos:** Backend + Frontend + QA.
- **Modulo Tickets/Riesgo:** Backend + Frontend + QA + apoyo de Analista.
- **Modulo Mantenimiento:** Backend + Frontend + QA.
- **Modulo Auditoria:** Backend + DBA + QA + Auditor funcional.
- **Modulo IA MCP:** Backend + IA Engineer + DevOps + QA seguridad.

---

## 3. Staff recomendado para iniciar

## 3.1 Equipo base (minimo viable)
- **1 Tech Lead / Arquitecto de Software**
  - custodio de SAD, decisiones tecnicas, calidad de PR y deuda tecnica.
- **1 Backend Engineer Senior**
  - hexagonal, API contract, seguridad, auditoria, integridad hash.
- **1 Frontend Engineer Senior**
  - dashboards RBAC, formularios, flujos por rol, consumo robusto de API.
- **1 Fullstack Mid**
  - soporte transversal en features y correcciones de integracion.
- **1 QA Engineer (automation-first)**
  - unit/integration/e2e, RTM, criterios de release.
- **1 DevOps/SRE (part-time o full segun entorno)**
  - CI/CD, contenedores, secretos, observabilidad, rollback.
- **1 Product Owner / Analista funcional**
  - priorizacion, criterios de aceptacion, trazabilidad con negocio.

## 3.2 Staff extendido (cuando escale)
- **1 Security Engineer (part-time)** para hardening OWASP, pentest y controles ISO.
- **1 Data/DBA Engineer (part-time)** para tuning, indices, migraciones complejas y DRP.
- **1 IA Engineer (part-time/full en Sprint 4+)** para sidecar MCP y calidad de prompts/outputs.

---

## 4. Matriz RACI simplificada

| Entregable | Responsible | Accountable | Consulted | Informed |
| :--- | :--- | :--- | :--- | :--- |
| Arquitectura tecnica | Tech Lead | Tech Lead | Backend/Frontend/DevOps | Todo el equipo |
| API Core | Backend Senior | Tech Lead | QA, DBA | Frontend |
| Frontend por rol | Frontend Senior | Tech Lead | PO, QA | Backend |
| Seguridad (JWT/RBAC/CORS/Rate limit) | Backend Senior | Tech Lead | Security, DevOps | QA |
| Modelo de datos y migraciones | Backend + DBA | Tech Lead | QA | Frontend |
| CI/CD y despliegue | DevOps/SRE | Tech Lead | Backend, Frontend | QA, PO |
| Plan de pruebas | QA Engineer | Tech Lead | Backend, Frontend | PO |

---

## 5. Roadmap de inicio por staff (primeros 30 dias)

## Semana 1
- Tech Lead: baseline de arquitectura y convenciones.
- Backend: estructura hexagonal + auth bootstrap + prisma base.
- Frontend: estructura app/components/hooks/store + cliente HTTP.
- DevOps: pipeline CI minimo (lint, typecheck, test) y secretos.
- QA: estrategia de pruebas y casos criticos iniciales.

## Semana 2
- Backend: endpoints de activos + auditoria inicial.
- Frontend: login, guardas RBAC y vistas de activos.
- QA: integracion de casos de activos y auth.

## Semana 3
- Backend: tickets, calculo de riesgo y aprobacion por rol.
- Frontend: dashboards diferenciados TECH vs MANAGER/CRO.
- QA: pruebas de permisos y flujos de bloqueo 403/409.

## Semana 4
- Backend: robustecer auditoria, observabilidad y manejo de errores.
- Frontend: bandejas por rol y manejo de estados de red.
- DevOps + QA: hardening de pipeline y gate de release a staging.

---

## 6. Criterios de cumplimiento de este INIT
- Existe una base documental en `doc/init/` para onboarding tecnico.
- La arquitectura esta definida por capas y por ownership de equipo.
- El staff base esta definido con responsabilidades claras.
- Hay plan de arranque de 30 dias con foco en entregables concretos.
