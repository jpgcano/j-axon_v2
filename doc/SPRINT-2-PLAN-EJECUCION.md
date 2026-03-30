# 📋 SPRINT 2 - PLAN DE EJECUCIÓN: MOTOR DE TICKETS Y TRIAGE DE RIESGOS

**Fecha**: 29 de marzo de 2026  
**Duración**: 2 semanas (10 días de trabajo)  
**Objetivos**: Motor de tickets con cálculo ERM automático, escalada por riesgo, RBAC en aprobaciones  
**Aprobación Gating**: Coverage ≥85%, Todos tests GREEN  

---

## 📊 RESUMEN EJECUTIVO

### Qué es Sprint 2
Implementar sistema de **incidencias (tickets)** con **clasificación automática de riesgos** (ERM: Probabilidad × Consecuencia) y **flujo de aprobaciones** basado en RBAC. Cuando se crea un ticket con riesgo HIGH/EXTREME, se bloquea automáticamente y require aprobación de MANAGER/CRO antes de cualquier cambio.

### Valor de Negocio
- Automatización de triage (reducir asignación manual en 60%)
- Escalada de control según criticidad (governance)
- Audit trail completo de aprobaciones (compliance)
- Interfaz diferenciada por rol (UX eficiente)

### Story Points Total: 68 SP
- Backend: 34 SP
- Frontend: 21 SP  
- QA: 13 SP

---

## 🔄 DEPENDENCIAS Y SECUENCIA

```
  SPRINT 1 ✅ (COMPLETADO)
     ↓
  [Assets CRUD, Auth JWT, RBAC, Audit Logs]
     ↓
  SPRINT 2 (AHORA)
  ├─ Día 1-2: Setup DB + Entidades
  ├─ Día 2-5: Backend Core (CreateTicket, Endpoints, Middleware)
  ├─ Día 5-8: Frontend (Components, Pages, State)
  └─ Día 8-10: QA (Tests, E2E, Coverage)
     ↓
  [Requiere: Tables Assets, Users, Auth JWT]
  [Produce: Tables Tickets, nuevas rutas API, vistas filtradas]
     ↓
  SPRINT 3 (PRÓXIMO): Mantenimiento y Órdenes
```

---

## 📅 CALENDARIO DE EJECUCIÓN

### SEMANA 1 (Días 1-5)

#### Día 1-2: Preparación
- [ ] **DIA 1 - Mañana**: Refactorizar schema Prisma - agregar tabla `jaxon_tickets`
  - Campos: ticketId (UUID), assetId (FK), title, description, probability (1-5), consequence (1-5), riskLevel, status, approverId?, createdBy, createdAt, updatedAt
  - Migración: `npx prisma migrate dev --name add_tickets_table`
  
- [ ] **DIA 1 - Tarde**: Definir entidades dominio
  - `src/domain/tickets/Ticket.ts` (Aggregate Root)
  - `src/domain/tickets/value-objects/RiskLevel.ts` (Enum: LOW|MEDIUM|HIGH|EXTREME)
  - `src/domain/tickets/value-objects/TicketStatus.ts` (Enum: PENDING_APPROVAL|APPROVED|IN_PROGRESS|RESOLVED|CLOSED)
  - `src/domain/tickets/TicketRepository.ts` (Interface)

- [ ] **DIA 2 - Mañana**: Validadores y tipos
  - `src/lib/validators/TicketValidators.ts` (Zod schemas)
  - `src/types/ticket.ts` (TypeScript client types)
  - `src/domain/tickets/exceptions/` (Custom exceptions)

- [ ] **DIA 2 - Tarde**: Unit tests dominio
  - `src/domain/tickets/__tests__/Ticket.spec.ts` (8 casos)
    - Constructor, validación, cálculo ERM, cambios de estado
    - Test: `calculateRiskLevel(4, 5)` → EXTREME (20)
    - Test: `calculateRiskLevel(1, 2)` → LOW (2)
  - Commit: `feat(domain): add Ticket aggregate with ERM calculator`

#### Día 2-3: Backend - Repository & Use Cases
- [ ] **DIA 2 - Noche + DIA 3**: Implementar repositorio Ticket
  - `src/infrastructure/prisma/repositories/TicketRepository.ts`
  - Métodos: `create()`, `findById()`, `findByAssetId()`, `updateStatus()`, `findPendingApprovals()`
  - Integrar con Prisma client (existente)
  - Tests: `TicketRepository.spec.ts` (7 casos)
  - Commit: `feat(infrastructure): add TicketRepository with Prisma`

- [ ] **DIA 3 - Mañana**: Crear use case CreateTicket
  - `src/application/tickets/CreateTicket.ts` (Use case)
    - Input: assetId, title, description, probability, consequence, authorId
    - Output: Ticket creado con riskLevel calculado
    - Validaciones:
      - Activo existe (verificar en assetRepository)
      - probability y consequence en rango 1-5
      - title/description lengths correctos
    - Lógica: calcular riskLevel, asignar estado (IF riskLevel HIGH/EXTREME → PENDING_APPROVAL, ELSE → APPROVED)
    - DI: assetRepository, ticketRepository, auditLogger
  - Tests: `CreateTicket.spec.ts` (9 casos)
    - Test de cálculo ERM correcto
    - Test de estado PENDING_APPROVAL para HIGH
    - Test de estado APPROVED para LOW
    - Test NotFoundException para activo inexistente
    - Test audit log registramiento
  - Commit: `feat(application): add CreateTicket use case with ERM`

- [ ] **DIA 3 - Tarde**: Otros use cases básicos
  - `src/application/tickets/ListTickets.ts` (con filtrados por rol)
  - `src/application/tickets/GetTicket.ts`
  - `src/application/tickets/UpdateTicketStatus.ts` (solo state changes)
  - `src/application/tickets/ApproveTicket.ts` (cambiar PENDING_APPROVAL → APPROVED)
  - Tests básicos para cada uno (2-3 casos mínimo)
  - Commit: `feat(application): add Ticket use cases (list, get, approve)`

#### Día 4-5: Backend - API Endpoints & Middleware
- [ ] **DIA 4 - Mañana**: Crear TicketController
  - `src/presentation/tickets/TicketController.ts`
  - Métodos:
    - `create(req, res)` → llama CreateTicket uc
    - `list(req, res)` → llama ListTickets uc (filtrar por rol)
    - `getById(req, res)` → llama GetTicket uc
    - `updateStatus(req, res)` → llama UpdateTicketStatus uc
    - `approve(req, res)` → llama ApproveTicket uc (solo MANAGER/CRO)
  - Validación de entrada con Zod
  - Manejo de errores y respuestas HTTP correctas

- [ ] **DIA 4 - Tarde**: Crear rutas y middleware
  - `src/presentation/tickets/ticketRoutes.ts`
    - POST /api/v1/tickets (pública, autenticada)
    - GET /api/v1/tickets (pública, autenticada)
    - GET /api/v1/tickets/:ticketId (pública, autenticada)
    - PATCH /api/v1/tickets/:ticketId/status (validar riesgo - si HIGH, denegar para TECH)
    - PATCH /api/v1/tickets/:ticketId/approve (solo MANAGER/CRO)
  - Middleware `requireTicketApprover` que valida:
    ```typescript
    // Si ticket.riskLevel >= HIGH && ticketStatus != APPROVED
    //   Y usuario NO es (MANAGER | CRO | ADMIN) → 403
    ```
  - Registrar rutas en router principal
  - Commit: `feat(presentation): add TicketController and routes`

- [ ] **DIA 4 - Noche**: Tests endpoint (Supertest/API)
  - `src/presentation/__tests__/TicketController.spec.ts` (10 casos)
    - POST /api/v1/tickets → 201
    - PATCH /approve con MANAGER → 200
    - PATCH /approve con TECH → 403
    - POST con datos inválidos → 400
    - GET listado filtra por rol TECH → solo asignados
  - Commit: `test(presentation): add TicketController integration tests`

- [ ] **DIA 5 - Mañana**: Integración DI Container
  - `src/infrastructure/di/container.ts`
    - Exportar: createTicket (use case instance)
    - Exportar: ticketRepository (instance)
    - Actualizar Router para TicketController
  - Tests de DI (1-2 casos)
  - Commit: `feat(infrastructure): register Ticket services in DI container`

- [ ] **DIA 5 - Tarde**: Build & Coverage Backend
  - `pnpm build` → sin errores
  - `pnpm test:coverage` → ≥85% en dominio/application tickets
  - Revisar coverage report, documentar gaps
  - Commit: `ci: backend tests pass with ≥85% coverage`

**BACKEND STAT**: ✅ 34 SP completados

---

### SEMANA 2 (Días 6-10)

#### Día 6-7: Frontend - Hooks y Componentes Reutilizables
- [ ] **DIA 6 - Mañana**: Crear hooks React Query
  - `src/hooks/useTickets.ts`
    ```typescript
    - useTickets() → GET /api/v1/tickets (filtro por rol)
    - useTicket(ticketId) → GET /api/v1/tickets/{ticketId}
    - useCreateTicket() → POST /api/v1/tickets
    - useApproveTicket() → PATCH /api/v1/tickets/{ticketId}/approve
    - useUpdateTicketStatus() → PATCH /api/v1/tickets/{ticketId}/status
    ```
  - Integración con AssetService (verificar asset exists)
  - Queryy client invalidation automática

- [ ] **DIA 6 - Tarde**: Crear TicketService (API client)
  - `src/services/TicketService.ts`
    - `createTicket(data)` → POST
    - `listTickets(filters)` → GET con query params
    - `getTicket(id)` → GET
    - `updateTicketStatus(id, status)` → PATCH status
    - `approveTicket(id)` → PATCH approve
  - Error handling, retry logic
  - Commit: `feat(client): add Ticket API service and React Query hooks`

- [ ] **DIA 6 - Noche + DIA 7**: Componentes reutilizables
  - `src/components/tickets/RiskBadge.tsx`
    - Props: riskLevel, size (sm|md|lg)
    - Render: badge con color (LOW→gris, MEDIUM→amarillo, HIGH→naranja, EXTREME→rojo)
    - CSS con Tailwind
  
  - `src/components/tickets/StatusBadge.tsx`
    - Props: status, isPending?
    - Render: badge con color por estado
  
  - `src/components/tickets/TicketForm.tsx`
    - Props: initialValues?, onSubmit, isLoading
    - Campos: Activo (select), Título, Descripción, Probabilidad (select 1-5), Consecuencia (select 1-5)
    - Validación Zod cliente + servidor
    - React Hook Form para state
    - Submit disabilitado cuando loading o invalid
    - Commit: `feat(components): add Ticket components (Badge, Form)`

- [ ] **DIA 7 - Tarde**: Unit tests componentes
  - `src/components/tickets/__tests__/RiskBadge.test.tsx` (4 casos)
  - `src/components/tickets/__tests__/TicketForm.test.tsx` (6 casos)
    - Render form fields
    - Submit con datos válidos
    - Validación cliente falla con datos inválidos
  - Commit: `test(components): add Ticket component tests`

#### Día 7-8: Frontend - Pages y Layouts
- [ ] **DIA 7 - Noche + DIA 8 - Mañana**: Crear página /dashboard/tickets
  - `src/app/dashboard/tickets/page.tsx`
  - Layout:
    - Header: "Tickets" + Botón "Crear Ticket"
    - Filtros top: por Riesgo (dropdown multi), por Estado (dropdown multi), búsqueda por título
    - Tabla principal:
      - Columnas: ID, Activo, Título, Riesgo (badge), Estado (badge), Acciones
      - Fila expandible (opcional): ver descripción, probability, consequence
      - Botones acciones: Ver detalle, Editar (si no bloqueado), Cambiar estado
    - Paginación: 10/20 items por página
    - Loading state, error boundary
  - Filtrado según rol:
    - Si TECH: mostrar solo tickets asignados a este usuario (createdBy == currentUser)
    - Si MANAGER/CRO: mostrar ALL
    - Si ADMIN: mostrar ALL + acciones extra
  - Commit: `feat(pages): add /dashboard/tickets list view`

- [ ] **DIA 8 - Mañana**: Crear modal/página de creación de ticket
  - `src/app/dashboard/tickets/create/page.tsx` (o modal en page.tsx)
  - Usar componente TicketForm
  - Post-submit: redirect a /dashboard/tickets con toast success
  - Commit: `feat(pages): add /dashboard/tickets/create form`

- [ ] **DIA 8 - Tarde**: Crear página /dashboard/approvals
  - `src/app/dashboard/approvals/page.tsx`
  - Ruta protegida solo MANAGER/CRO/ADMIN (redirect si no autorizado)
  - Layout:
    - Header: "Bandeja de Aprobaciones"
    - Filtro: solo mostrar tickets con status = PENDING_APPROVAL Y riskLevel >= HIGH
    - Card grid o tabla:
      - Card per ticket: Activo, Título, Descripción, Prob/Cons, RiskLevel (badge)
      - Botones: "Aprobar" (verde), "Rechazar" (rojo, opcional S2)
    - Contador: "X pending approvals"
  - Loading state, empty state ("No pending approvals")
  - Commit: `feat(pages): add /dashboard/approvals queue view`

- [ ] **DIA 8 - Noche**: Crear componentes de lista
  - `src/components/tickets/TicketList.tsx`
  - `src/components/tickets/ApprovalQueue.tsx`
  - Tests básicos (2 casos cada uno)
  - Commit: `feat(components): add TicketList and ApprovalQueue components`

#### Día 9: Frontend - Integration & Testing
- [ ] **DIA 9 - Mañana**: Integración CSS/Tailwind
  - Revisar estilos de componentes
  - Responsive design (mobile, tablet, desktop)
  - Dark mode (si aplica)
  - Accesibilidad (a11y labels, ARIA)
  - Commit: `style(pages): add Tailwind styling for Ticket views`

- [ ] **DIA 9 - Tarde**: UI Component Tests
  - `src/app/dashboard/tickets/__tests__/page.test.tsx` (5 casos)
    - Render list
    - Filtros carguen
    - Paginación funciona
    - Rol TECH solo ve asignados
    - Rol MANAGER ve todos
  - Commit: `test(pages): add Ticket page integration tests`

**FRONTEND STAT**: ✅ 21 SP completados

#### Día 9-10: QA - Tests Completos
- [ ] **DIA 9 - Noche + DIA 10 - Mañana**: API Tests (Supertest) - RBAC
  - `src/__tests__/api/tickets.rbac.spec.ts` (8 casos)
    - TC-021: TECH intenta cambiar estado de HIGH → 403
    - TC-022: MANAGER aprueba bloqueado → 200
    - TC-023: Sin auth intenta crear → 401
    - TC-024: AUDITOR lee pero no crea → 403 en POST
    - Y 4 casos más de edge scenarios

- [ ] **DIA 10 - Mañana**: API Tests - Flujo Escalada
  - `src/__tests__/api/tickets.escalation.spec.ts` (8 casos)
    - TC-025: P=4, C=5 → EXTREME, PENDING_APPROVAL
    - TC-026: P=2, C=2 → LOW, APPROVED automáticamente
    - TC-027: MANAGER aprueba alts HIGH → APPROVED
    - TC-028: TECH cierra LOW sin aprobación → 200
    - TC-029: TECH cierra HIGH sin aprobación → 403
    - Y 3 casos más

- [ ] **DIA 10 - Mañana**: E2E Tests (Playwright)
  - `e2e/tickets.spec.ts` (4 casos)
    - [E2E-001] Login TECH → Ver bandeja → Intentar aprobar → blocked
    - [E2E-002] Login MANAGER → Ver aprobaciones → Aprobar → status updated
    - [E2E-003] Crear ticket HIGH → UI bloqueada para TECH
    - [E2E-004] End-to-end: crear → bloquear → aprobar → cerrar
  - Playwright config con Chromium
  - Commit: `test(e2e): add Ticket end-to-end tests`

- [ ] **DIA 10 - Mañana/Mediodía**: Coverage Report
  - `pnpm test:coverage` (backend + frontend)
  - Generar HTML report
  - Verificar ≥85% en:
    - Domain/tickets
    - Application/tickets
    - Presentation/tickets
  - Documentar cualquier gap que quede
  - Commit: `ci: generate coverage reports for Sprint 2`

- [ ] **DIA 10 - Tarde**: GitHub Actions & Merge
  - Verificar CI/CD pipeline pasa (lint, typecheck, tests)
  - No warnings en build
  - Merge a main (si todo verde)
  - Tag: `v2.0.0-sprint-2`
  - Commit final: `chore: merge Sprint 2 - Tickets & ERM`

**QA STAT**: ✅ 13 SP completados

---

## 📊 ESTRUCTURA DE ARCHIVOS A CREAR

### Backend

```
jaxon-core-api/src/
├── domain/tickets/
│   ├── Ticket.ts (Aggregate Root)
│   ├── value-objects/
│   │   ├── RiskLevel.ts
│   │   └── TicketStatus.ts
│   ├── exceptions/
│   │   └── TicketNotFound.ts
│   ├── TicketRepository.ts (interface)
│   └── __tests__/
│       └── Ticket.spec.ts
├── application/tickets/
│   ├── CreateTicket.ts
│   ├── ListTickets.ts
│   ├── GetTicket.ts
│   ├── UpdateTicketStatus.ts
│   ├── ApproveTicket.ts
│   └── __tests__/
│       ├── CreateTicket.spec.ts
│       ├── ListTickets.spec.ts
│       └── ...
├── infrastructure/prisma/
│   ├── repositories/
│   │   └── TicketRepository.ts
│   └── __tests__/
│       └── TicketRepository.spec.ts
├── presentation/tickets/
│   ├── TicketController.ts
│   ├── ticketRoutes.ts
│   ├── middlewares/requireTicketApprover.ts
│   └── __tests__/
│       ├── TicketController.spec.ts
│       └── TicketController.integration.spec.ts
├── lib/validators/
│   └── TicketValidators.ts
└── __tests__/api/
    ├── tickets.rbac.spec.ts
    └── tickets.escalation.spec.ts

prisma/
└── schema.prisma (+ migration: add_tickets_table)
```

### Frontend

```
jaxon-client/src/
├── types/
│   └── ticket.ts
├── services/
│   └── TicketService.ts
├── hooks/
│   └── useTickets.ts
├── components/tickets/
│   ├── RiskBadge.tsx
│   ├── StatusBadge.tsx
│   ├── TicketForm.tsx
│   ├── TicketList.tsx
│   ├── ApprovalQueue.tsx
│   └── __tests__/
│       ├── RiskBadge.test.tsx
│       ├── TicketForm.test.tsx
│       └── ...
├── app/dashboard/tickets/
│   ├── page.tsx (list)
│   ├── create/
│   │   └── page.tsx
│   └── __tests__/
│       └── page.test.tsx
├── app/dashboard/approvals/
│   ├── page.tsx
│   └── __tests__/
│       └── page.test.tsx
└── lib/validators/
    └── TicketValidators.ts (client-side)

e2e/
└── tickets.spec.ts
```

---

## ✅ CRITERIOS DE ACEPTACIÓN (DoD - Sprint 2)

### Compilación y Build
- [ ] TypeScript compila sin errores: `pnpm build`
- [ ] ESLint pasa: `pnpm lint` (con 0 warnings críticos)
- [ ] Prettier aplicado: `pnpm format`
- [ ] No hay advertencias de tipo missing en undefined checks

### Pruebas Unitarias + Integración
- [ ] 50+ nuevos test cases implementados
- [ ] Backend: tests en Domain, Application, Presentation
- [ ] Frontend: tests en componentes y pages
- [ ] Coverage ≥85% en:
  - `src/domain/tickets/*`
  - `src/application/tickets/*`
  - `src/presentation/tickets/*`
  - `src/components/tickets/*`
- [ ] Todos test cases GREEN (exit code 0)
- [ ] Coverage report generado en `/coverage/index.html`

### Funcionalidad: ERM y Escalada
- [ ] Cálculo ERM: `P × C` genera riesgo correcto
  - LOW: 1-5, MEDIUM: 6-12, HIGH: 13-20, EXTREME: 21-25
- [ ] Creación de ticket LOW/MEDIUM → estado APPROVED automáticamente
- [ ] Creación de ticket HIGH/EXTREME → estado PENDING_APPROVAL
- [ ] Aprobación de ticket HIGH/EXTREME → cambiar a APPROVED, registrar approver
- [ ] TECH no puede cambiar estado de HIGH/EXTREME (403 Forbidden)
- [ ] MANAGER/CRO pueden aprobar tickets bloqueados
- [ ] ADMIN ve todos, puede hacer todo

### Funcionalidad: UI por Rol
- [ ] Página /dashboard/tickets filtra según rol:
  - TECH: solo tickets creados por este usuario
  - MANAGER/CRO: todos los tickets globales
  - ADMIN: todos los tickets + acciones extra
- [ ] Página /dashboard/approvals:
  - Solo MANAGER/CRO/ADMIN pueden acceder (redirect si TECH)
  - Filtra PENDING_APPROVAL con riesgo HIGH/EXTREME
  - Botón Aprobar ejecuta PATCH /approve
- [ ] Componente RiskBadge renderiza colores correctos
- [ ] Componente TicketForm valida campos

### Sensibilidad a Cambios RBAC
- [ ] No existen rutas públicas accidentales
- [ ] Todos los PATCH/POST requieren autenticación
- [ ] RBAC se valida en backend + frontend (defensa en profundidad)
- [ ] Audit logs registran: quién, qué, cuándo para tickets

### Base de Datos
- [ ] Migración Prisma ejecutada: tabla `jaxon_tickets` creada
- [ ] Schema tiene campos: ticketId, assetId (FK), title, description, probability, consequence, riskLevel, status, approverId, createdBy, createdAt, updatedAt
- [ ] Foreign keys correctos:
  - assetId → jaxon_assets.assetId
  - createdBy → jaxon_users.userId
  - approverId → jaxon_users.userId (nullable)
- [ ] Enums en BD sincronizados con código (`RiskLevel`, `TicketStatus`)
- [ ] Índices en `assetId`, `createdBy`, `status` para queries rápidas

### Seguridad
- [ ] Todos los inputs validados con Zod en servidor
- [ ] No existen inyecciones SQL (Prisma paramétrico)
- [ ] Hash de auditoría en jaxon_audit_logs para cambios de status
- [ ] Tokens JWT verificados antes de cualquier acción mutante
- [ ] No hay secretos en código ni logs

### Documentación
- [ ] README.md actualizado con nuevas rutas:
  ```
  POST   /api/v1/tickets
  GET    /api/v1/tickets
  GET    /api/v1/tickets/{ticketId}
  PATCH  /api/v1/tickets/{ticketId}/status
  PATCH  /api/v1/tickets/{ticketId}/approve
  ```
- [ ] CHANGELOG.md con resumen de cambios Sprint 2
- [ ] Comentarios JSDoc en funciones públicas
- [ ] ADR sobre decisión de ERM si no existe

### DevOps/CI
- [ ] GitHub Actions workflow pasa:
  - Lint job: OK
  - Typecheck job: OK
  - Backend test job: coverage ≥85%
  - Frontend test job: coverage ≥85%
  - E2E test job: 4 escenarios principales OK
- [ ] Branch protegida main requiere:
  - CI pasa
  - Coverage ≥85%
  - PR review approval
- [ ] CHANGELOG de DB reflects tabla nueva
- [ ] Tag `v2.0.0-sprint-2` creado post-merge

---

## 🎯 COMMITS ESPERADOS (Secuencia Recomendada)

```bash
# Día 1-2: Preparación
1. "feat(prisma): add jaxon_tickets table migration"
2. "feat(domain): add Ticket aggregate with ERM calculator"
3. "feat(types): add Ticket TypeScript types and validators"

# Día 3-4: Backend Core
4. "feat(infrastructure): add TicketRepository implementation"
5. "feat(application): add CreateTicket use case with ERM"
6. "feat(application): add Ticket listing, retrieval, and approval use cases"
7. "test(domain): add Ticket domain unit tests (8 cases)"
8. "test(application): add Ticket application use case tests (20 cases)"

# Día 4-5: Backend API
9. "feat(presentation): add TicketController with CRUD endpoints"
10. "feat(presentation): add requireTicketApprover middleware"
11. "feat(presentation): add ticketRoutes with RBAC validation"
12. "test(presentation): add TicketController API integration tests (10 cases)"
13. "feat(di): register Ticket services in DI container"

# Día 5: Backend Verification
14. "ci: backend build successful, tests pass coverage ≥85%"

# Día 6-7: Frontend Hooks & Components
15. "feat(client): add TicketService API client"
16. "feat(client): add useTickets React Query hooks"
17. "feat(components): add RiskBadge and StatusBadge components"
18. "feat(components): add TicketForm component with Zod validation"
19. "test(components): add Ticket component unit tests (10 cases)"

# Día 7-8: Frontend Pages
20. "feat(pages): add /dashboard/tickets list view with role-based filtering"
21. "feat(pages): add /dashboard/tickets/create form view"
22. "feat(pages): add /dashboard/approvals queue for MANAGER/CRO"
23. "test(pages): add Ticket pages integration tests (10 cases)"

# Día 9: Frontend Styling & Testing
24. "style: add Tailwind CSS styling for Ticket views"
25. "test(pages): add Ticket pages unit tests"

# Día 9-10: QA & E2E
26. "test(api): add Ticket RBAC validation tests (8 cases)"
27. "test(api): add Ticket escalation end-to-end tests (8 cases)"
28. "test(e2e): add Playwright scenarios for Ticket workflow (4 cases)"

# Día 10: Finalization
29. "ci: generate coverage reports, all tests pass ≥85%"
30. "chore: merge Sprint 2 - Tickets & Risk Management"
31. "chore: tag v2.0.0-sprint-2"
```

---

## 📈 MÉTRICAS A CAPTURAR

### Coverage Targets
| Componente | Target | Método |
|-----------|--------|--------|
| Domain Ticket | ≥90% | `pnpm test:coverage --coverage-reporters=text` |
| Application | ≥85% | Incluye todos use cases |
| Presentation | ≥80% | Controllers + routes |
| Frontend Components | ≥75% | vitest + @testing-library |

### Test Counts
| Capa | Cantidad | Coverage |
|------|----------|----------|
| Domain | 8 | Ticket aggregate |
| Application | 20 | 5 use cases × 4 casos |
| Presentation | 10 | TicketController |
| RBAC | 8 | Validación de permisos |
| Escalation | 8 | Flujos HIGH/EXTREME |
| Frontend | 10 | Componentes y pages |
| E2E | 4 | Escenarios principales |
| **TOTAL** | **≥68** | Tickets Sprint 2 |

### Performance Baselines
- GET /api/v1/tickets (100 tickets): <200ms
- POST /api/v1/tickets: <100ms
- PATCH /api/v1/tickets/{id}/approve: <100ms
- Frontend render /dashboard/tickets: <1s

---

## 📋 RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|--------|-----------|
| Cálculo ERM genera valores fuera de rango | Media | Alto | Tests edge: (0,0), (5,5), valores boundary |
| Performance con muchos tickets (1000+) | Baja | Medio | Índices en BD, paginación, virtual scrolling |
| RBAC mal sincronizado BE/FE | Media | Alto | Tests en ambas capas, middleware strict |
| Aprobaciones timeout bloquean usuarios | Baja | Alto | Escalada automática en Sprint 3 |
| UI no responsive en mobile | Baja | Bajo | Tailwind breakpoints, testing responsive |

---

## 🔗 INTERCONEXIÓN CON SPRINTS POSTERIORES

### Sprint 3 (Semanas 7-8): Órdenes de Mantenimiento
- Utilizará `ticketId` como referencia en tabla `jaxon_maintenance_orders`
- Status `APPROVED` en ticket permite crear orden de mantenimiento
- RiskLevel del ticket determina urgencia de orden

### Sprint 4 (Semanas 9-10): IA MCP
- MCP agent consulta tickets (SELECT riskLevel, status)
- Genera recomendaciones para tickets HIGH/EXTREME
- NO ejecuta cambios (read-only + sugerencias)

---

## ✅ CHECKLIST PRE-SPRINT 2

Antes de iniciar Sprint 2:

- [x] Sprint 1 completado y testeado ✅
- [x] Repositorios limpio (git status clean)
- [x] Rama `qa` sincronizada con `main`
- [x] Equipo alineado en requisitos (WBS, ERM, RBAC)
- [x] Base de datos entorno dev funcional
- [x] CI/CD pipeline configurado y pasando
- [x] **[TODO]** Crear rama feature: `git checkout -b feature/sprint-2-tickets`
- [x] **[TODO]** Iniciar desarrollo con Día 1

---

## 🚀 CÓMO EJECUTAR SPRINT 2

### Preparación Inicial
```bash
cd /home/luky/Documentos/j-axon_v2

# Actualizar ramas
git fetch origin
git checkout qa
git pull origin qa

# Crear rama de feature
git checkout -b feature/sprint-2-tickets

# Instalar dependencias (si necesario)
cd jaxon-core-api && pnpm install
cd ../jaxon-client && pnpm install
```

### Desarrollo Daily
```bash
# Mañana - revisar tickets del día
# Checkout a rama feature

# Desarrollo - realizado en IDE

# Antes de commit
pnpm lint
pnpm format
pnpm test

# Commit por tarea completada
git add .
git commit -m "feat(domain): add Ticket aggregate..."

# Al final del sprint
git push origin feature/sprint-2-tickets
# Crear PR → Code Review → Merge a main
```

### Validación Final Sprint 2
```bash
# Backend
cd jaxon-core-api
pnpm build          # Debe compilar sin errores
pnpm test:coverage  # Debe pasar y ≥85% coverage
pnpm lint           # 0 warnings críticos

# Frontend
cd ../jaxon-client
pnpm build
pnpm test:coverage  # ≥85%
pnpm lint

# E2E
npx playwright test

# CI/CD
git push origin feature/sprint-2-tickets
# Ir a GitHub Actions → verificar todos jobs GREEN
```

---

**Documento Generado**: 29 de marzo de 2026  
**Proyecto**: J-axon v2.0.0  
**Sprint**: 2 de 6  
**Status**: 🟢 LISTO PARA INICIAR  
**Next Action**: Crear rama feature e iniciar Día 1

