# 🎯 SPRINT 2 - RESUMEN EJECUTIVO RÁPIDO

**Fecha Inicio**: 29 de marzo de 2026  
**Duración**: 10 días (2 semanas)  
**Objetivo**: Motor de Tickets con Escalada por Riesgo (ERM)  
**TOTAL SP**: 68 (Backend 34, Frontend 21, QA 13)

---

## 📊 QUÉ SE IMPLEMENTA

### Feature Principal: Sistema de Tickets + ERM
1. **Crear Ticket** con campos: Activo, Título, Descripción, Probabilidad (1-5), Consecuencia (1-5)
2. **Cálculo ERM Automático**: Probabilidad × Consecuencia = Riesgo
   - LOW (1-5), MEDIUM (6-12), HIGH (13-20), EXTREME (21-25)
3. **Escalada por Riesgo**:
   - HIGH/EXTREME → Estado PENDING_APPROVAL (bloqueado)
   - Requiere aprobación de MANAGER/CRO/ADMIN
   - TECH no puede cambiar estado bloqueados (403 Forbidden)
4. **Vistas Diferenciadas por Rol**:
   - TECH: ve solo sus tickets (/dashboard/tickets)
   - MANAGER/CRO: bandeja de aprobaciones (/dashboard/approvals)
   - ADMIN: acceso total
5. **Audit Trail**: Registro completo de creación, aprobación, cambios de estado

---

## 🏗️ ARQUITECTURA

### Backend (34 SP)
```
Día 1-2: Setup DB (tabla jaxon_tickets) + Entidades Dominio
Día 3-4: Casos de Uso (CreateTicket, ApproveTicket, etc.)
Día 4-5: Endpoints REST + Middleware RBAC
Día 5: Build & Coverage ≥85%
```

**Endpoints Nuevos**:
```
POST   /api/v1/tickets                      ← Crear
GET    /api/v1/tickets                      ← Listar (filtro por rol)
GET    /api/v1/tickets/{ticketId}           ← Detalle
PATCH  /api/v1/tickets/{ticketId}/status    ← Cambiar estado
PATCH  /api/v1/tickets/{ticketId}/approve   ← Aprobar (MANAGER/CRO)
```

### Frontend (21 SP)
```
Día 6-7: Hooks useTickets + Componentes (RiskBadge, TicketForm)
Día 7-8: Pages (/dashboard/tickets, /dashboard/approvals)
Día 9: Estilos Tailwind + Tests
```

**Vistas Nuevas**:
- `/dashboard/tickets`: Listado de tickets (filtrado por rol)
- `/dashboard/tickets/create`: Formulario de creación
- `/dashboard/approvals`: Bandeja de aprobaciones (MANAGER/CRO)

### QA (13 SP)
```
Día 9-10: Tests RBAC (8), Escalada (8), E2E Playwright (4)
Validar Coverage ≥85%
```

---

## 📋 TAREAS DIARIAS

### 🟦 SEMANA 1: Backend + Setup

#### Día 1-2: DB + Dominio
- [ ] Migración Prisma: tabla `jaxon_tickets` con campos (ticketId, assetId FK, title, description, probability, consequence, riskLevel, status, approverId, createdBy, createdAt, updatedAt)
- [ ] Entidad `Ticket.ts` (Aggregate Root)
- [ ] Enums `RiskLevel.ts`, `TicketStatus.ts`
- [ ] Validadores Zod `TicketValidators.ts`
- [ ] Unit tests dominio: `Ticket.spec.ts` (8 casos)
  - Test: `calculateRiskLevel(4, 5)` → EXTREME
  - Test: `calculateRiskLevel(1, 2)` → LOW

**Commit**: `feat(domain): add Ticket aggregate with ERM calculator`

#### Día 3: Repository + Use Cases
- [ ] `TicketRepository.ts` (Prisma implementation)
- [ ] `CreateTicket.ts` use case (validar activo, calcular riesgo, asignar estado)
- [ ] `ListTickets.ts` (filtro por rol)
- [ ] `GetTicket.ts`, `ApproveTicket.ts`
- [ ] Tests: `CreateTicket.spec.ts` (9 casos), `ListTickets.spec.ts` (5 casos)
  - Test: crear LOW → estado APPROVED
  - Test: crear HIGH → estado PENDING_APPROVAL
  - Test: NotFoundException para activo no existe

**Commits**:
- `feat(infrastructure): add TicketRepository`
- `feat(application): add CreateTicket use case`
- `test(application): add Ticket use case tests`

#### Día 4-5: Endpoints + Middleware
- [ ] `TicketController.ts` (create, list, getById, updateStatus, approve)
- [ ] `ticketRoutes.ts` con rutas REST
- [ ] Middleware `requireTicketApprover` (validar riesgo + rol)
- [ ] Integrar en DI Container
- [ ] Tests API: `TicketController.spec.ts` (10+ casos)
  - Test: POST /tickets → 201
  - Test: PATCH /approve (TECH) → 403
  - Test: PATCH /approve (MANAGER) → 200
- [ ] Build: `pnpm build` sin errores
- [ ] Coverage: `pnpm test:coverage` ≥85%

**Commits**:
- `feat(presentation): add TicketController`
- `test(presentation): add TicketController tests`
- `ci: backend coverage ≥85%`

---

### 🟧 SEMANA 2: Frontend + QA

#### Día 6-7: Hooks + Componentes
- [ ] `TicketService.ts` (API client con métodos create, list, get, updateStatus, approve)
- [ ] `useTickets.ts` hook (React Query para GET/POST/PATCH)
- [ ] Componentes:
  - `RiskBadge.tsx` (colores: LOW→gris, MEDIUM→amarillo, HIGH→naranja, EXTREME→rojo)
  - `StatusBadge.tsx`
  - `TicketForm.tsx` (seleccionar activo, campos prob/cons, validación Zod)
- [ ] Tests componentes (10+ casos)

**Commit**: `feat(client): add Ticket hooks and components`

#### Día 7-8: Pages
- [ ] `/dashboard/tickets/page.tsx` (listado con filtros, tabla, paginación)
  - TECH: solo sus tickets
  - MANAGER: todos
  - Columnas: ID, Activo, Título, Riesgo (badge), Estado
- [ ] `/dashboard/tickets/create/page.tsx` (formulario con TicketForm)
- [ ] `/dashboard/approvals/page.tsx` (solo MANAGER/CRO, filtra PENDING_APPROVAL + HIGH/EXTREME)
  - Botón "Aprobar" → PATCH /approve
- [ ] Tests pages (10+ casos)

**Commit**: `feat(pages): add Ticket dashboard views`

#### Día 9: Styling + Component Tests
- [ ] Tailwind CSS styling (responsive, dark mode)
- [ ] Accesibilidad (ARIA labels)
- [ ] UI tests (5+ casos)

**Commit**: `style: add Tailwind for Ticket views`

#### Día 9-10: QA & E2E
- [ ] RBAC API tests (8 casos): TC-021 a TC-024
  - TECH intenta cambiar HIGH → 403
  - MANAGER aprueba → 200
- [ ] Escalation tests (8 casos): TC-025 a TC-029
  - P=4, C=5 → EXTREME, PENDING_APPROVAL
  - P=2, C=2 → LOW, APPROVED automático
- [ ] E2E Playwright (4 escenarios):
  - [E2E-001] TECH ve bandeja, intenta aprobar → bloqueado
  - [E2E-002] MANAGER aprueba ticket
  - [E2E-003] UI bloqueada para TECH en HIGH
  - [E2E-004] End-to-end completo: crear → aprobar → cerrar
- [ ] Coverage report: ≥85%

**Commits**:
- `test(api): add RBAC and escalation tests`
- `test(e2e): add Playwright ticket scenarios`
- `ci: generate coverage reports`

---

## ✅ DEFINITION OF DONE (Sprint 2)

### Compilación
- [x] `pnpm build` sin errores
- [x] ESLint + Prettier OK
- [x] TypeScript strict mode OK

### Testing (≥85% coverage)
- [x] 50+ tests nuevos (total ~100 del proyecto)
- [x] Domain, Application, Presentation tests
- [x] RBAC 403 validation tests
- [x] Escalation end-to-end tests
- [x] E2E Playwright 4 escenarios
- [x] Coverage ≥85% en dominio/application/presentation

### Funcionalidad
- [x] ERM calcula correctamente: P × C → RiskLevel
- [x] Tickets LOW/MEDIUM → APPROVED automáticamente
- [x] Tickets HIGH/EXTREME → PENDING_APPROVAL (bloqueado)
- [x] TECH no puede cambiar HIGH/EXTREME (403)
- [x] MANAGER/CRO aprueban tickets
- [x] TECH ve solo sus tickets
- [x] MANAGER ve todos en aprobaciones

### Base de Datos
- [x] Tabla `jaxon_tickets` creada
- [x] Foreign keys correctos
- [x] Enums sincronizados
- [x] Índices en columnas consultas

### Documentación
- [x] README.md con nuevas rutas
- [x] CHANGELOG.md actualizado
- [x] Comentarios JSDoc en código
- [x] Este plan + reporte final

### CI/CD
- [x] GitHub Actions pasa todos los jobs
- [x] Coverage ≥85%
- [x] Branch main protegida
- [x] Tag `v2.0.0-sprint-2` creado

---

## 📁 ARCHIVOS CLAVE

### Backend (34 SP)
| Archivo | LOC aprox | Descripción |
|---------|----------|------------|
| `Ticket.ts` | 80 | Aggregate root |
| `CreateTicket.ts` | 60 | Use case |
| `TicketRepository.ts` | 100 | Prisma repo |
| `TicketController.ts` | 120 | REST controller |
| `ticketRoutes.ts` | 30 | Express routes |
| Tests | 500+ | Domain + Application + API |

### Frontend (21 SP)
| Archivo | LOC aprox | Descripción |
|---------|----------|------------|
| `useTickets.ts` | 80 | React Query hooks |
| `TicketForm.tsx` | 120 | Componente formulario |
| `RiskBadge.tsx` | 40 | Badge con colores |
| `tickets/page.tsx` | 150 | Listado |
| `approvals/page.tsx` | 100 | Bandeja manager |
| Tests | 300+ | Components + Pages |

### QA (13 SP)
| Archivo | LOC aprox | Descripción |
|---------|----------|------------|
| `tickets.rbac.spec.ts` | 200 | RBAC tests |
| `tickets.escalation.spec.ts` | 200 | Escalation tests |
| `tickets.spec.ts` (E2E) | 100 | Playwright |

---

## 🚀 COMANDOS ÚTILES

```bash
# Crear rama
git checkout -b feature/sprint-2-tickets

# Prisma
cd jaxon-core-api
npx prisma migrate dev --name add_tickets_table

# Backend
pnpm build              # Compilar
pnpm test              # Tests
pnpm test:coverage     # Coverage
pnpm lint              # ESLint

# Frontend
cd ../jaxon-client
pnpm test:coverage     # Tests + coverage

# E2E
npx playwright test

# Commit
git add .
git commit -m "feat(domain): add Ticket..."
git push origin feature/sprint-2-tickets

# Merge
# Crear PR en GitHub → approve → merge
git tag v2.0.0-sprint-2
git push origin v2.0.0-sprint-2
```

---

## 📈 MÉTRICAS META SPRINT 2

| Métrica | Meta | Método |
|---------|------|--------|
| **Test Count** | 50+ | Sumar domain + app + presentation + e2e |
| **Coverage** | ≥85% | HTML report en `/coverage/index.html` |
| **Compilación** | 0 errores | `pnpm build` exit code 0 |
| **ESLint** | 0 críticos | `pnpm lint` |
| **E2E Playwright** | 4/4 pasando | `npx playwright test` |
| **CI/CD GitHub** | All GREEN | Verificar workflow |
| **Performance** | <200ms list | Query /api/v1/tickets con 100 items |

---

## 🔄 PRÓXIMOS PASOS (Sprint 3)

1. Sprint 3: Órdenes de Mantenimiento
   - Crear orden a partir de ticket APPROVED
   - Estado workflow: PENDING → ASSIGNED → IN_PROGRESS → COMPLETED
   - Referencia a ticket.riskLevel para urgencia

2. Sprint 4: IA MCP
   - Agent consulta tickets para predicciones
   - Lee sin mutaciones
   - Sugiere acciones (human-in-the-loop)

---

**Status**: 🟢 LISTO PARA INICIAR  
**Próximo**: Crear rama `feature/sprint-2-tickets` e iniciar Día 1  
**Documento**: `/doc/SPRINT-2-PLAN-EJECUCION.md`

