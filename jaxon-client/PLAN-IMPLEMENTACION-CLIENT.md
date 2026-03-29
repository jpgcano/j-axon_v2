# Plan de implementacion - jaxon-client

## 1) Objetivo
Construir el frontend de J-axon v2.0.0 (Next.js App Router) alineado al contrato API, RBAC, UX operativa y requisitos de trazabilidad.

## 2) Fuentes base (SSOT)
- `doc/DOCUMENTO DE REQUERIMIENTOS DE NEGOCIO.md`
- `doc/DOCUMENTO DE ESPECIFICACION DE REQUERIMIENTOS DE SOFTWARE.md`
- `doc/DOCUMENTO DE ARQUITECTURA DEL SISTEMA.md`
- `doc/DOCUMENTO DE ESPECIFICACION DE API Y CONTRATO DE INTEGRACION.md`
- `doc/DOCUMENTO DE ESPECIFICACION DE INTERFAZ DE USUARIO Y GESTION DE ESTADO.md`
- `doc/DOCUMENTO DE ESPECIFICACION DE SEGURIDAD Y CONTROL DE ACCESO.md`
- `doc/DOCUMENTO DE PLAN MAESTRO DE PRUEBAS Y ASEGURAMIENTO DE CALIDAD (QA TEST PLAN).md`
- `doc/DOCUMENTO DE ESTRUCTURA DE DESGLOSE DE TRABAJO (WBS) Y PLAN DE EJECUCION .md`

## 3) Principios de implementacion del cliente
- Next.js App Router con separacion clara entre rutas, componentes, hooks y estado.
- Estado de servidor con React Query; estado global con Zustand; estado local con hooks de React.
- Sin logica de negocio en componentes visuales; contenedores/hook para orquestacion.
- Alineacion estricta al envelope de API y codigos HTTP definidos en API Spec.
- RBAC visible en UI (habilitar/deshabilitar acciones segun rol/permisos).
- Human-in-the-loop para sugerencias de IA (nunca autoaplicar mutaciones).

## 4) Backlog de tareas por fase

### Fase 0 - Cimentacion tecnica
- [ ] Definir estructura de carpetas: `app/`, `components/`, `hooks/`, `store/`, `lib/`, `types/`, `providers/`.
- [ ] Configurar reglas de calidad: ESLint estricto, TypeScript strict y convenciones de imports.
- [ ] Configurar Tailwind y tokens base de tema (colores, tipografia, espaciado).
- [ ] Crear layout raiz con providers (QueryClientProvider, store hydration, toasts).
- [ ] Definir contrato de variables de entorno cliente (`NEXT_PUBLIC_API_URL`).
- [ ] Implementar cliente HTTP base (`lib/http`) con timeout, headers y `X-Request-ID`.
- [ ] Implementar parser estandar para envelope de exito/error de la API.
- [ ] Crear estrategia base de manejo de errores de red y fallback UI.

### Fase 1 - Seguridad y sesion
- [ ] Implementar pantalla de login y formulario con `react-hook-form` + `zod`.
- [ ] Implementar flujo de autenticacion contra API (`/auth/*`) y manejo de sesion.
- [ ] Guardar solo estado no sensible en cliente (uuid, role, permisos derivados).
- [ ] Implementar logout y limpieza total de estado/cache.
- [ ] Implementar guardas de ruta por autenticacion y autorizacion (RBAC).
- [ ] Implementar matriz de permisos en frontend para mostrar/ocultar acciones.
- [ ] Manejar respuestas 401 (redirigir a login) y 403 (modal acceso denegado).

### Fase 2 - Modulo de activos
- [ ] Definir tipos/schemas cliente para assets (input/output) alineados al API Spec.
- [ ] Implementar hooks React Query: listar, detalle, crear, cambiar estado.
- [ ] Implementar pagina de inventario con tabla, filtros, busqueda y paginacion.
- [ ] Implementar formulario de alta de activo con validacion y mensajes por campo.
- [ ] Implementar vista detalle de activo con bloque de metadatos de auditoria.
- [ ] Implementar accion de cambio de estado (soft delete a `RETIRED`).
- [ ] Enviar `currentIntegrityHash` en operaciones PATCH y manejar 409 de concurrencia.
- [ ] Mostrar feedback transaccional (loading, disabled, success, error).

### Fase 3 - Modulo de tickets y triage
- [ ] Definir tipos/schemas cliente para tickets y niveles de riesgo.
- [ ] Implementar formulario de apertura de ticket vinculado a activo.
- [ ] Implementar bandeja de tickets para TECH (asignados) y MANAGER/ADMIN (global).
- [ ] Implementar vista de aprobacion para tickets `HIGH` y `EXTREME`.
- [ ] Deshabilitar acciones de cierre/escalada segun rol y estado del ticket.
- [ ] Implementar componentes visuales de severidad/riesgo (badges y alertas).
- [ ] Implementar invalidacion de cache y sincronizacion de listas tras mutaciones.

### Fase 4 - Mantenimiento y auditoria visual
- [ ] Implementar vista de mantenimiento (lista inicial; calendario en iteracion posterior).
- [ ] Implementar flujo de creacion/actualizacion de ordenes de mantenimiento.
- [ ] Implementar vista solo lectura de logs de auditoria para ADMIN y AUDITOR.
- [ ] Mostrar evidencia de integridad (hash y metadata) de forma legible.
- [ ] Agregar trazabilidad UI de `requestId` para soporte y debugging.

### Fase 5 - Integracion MCP (IA asistida)
- [ ] Implementar hook para solicitar recomendaciones al endpoint MCP.
- [ ] Crear componente visual diferenciado para sugerencias IA.
- [ ] Implementar accion explicita "Aplicar recomendacion" (confirmacion obligatoria).
- [ ] Manejar timeout/degradacion MCP (503) con UX clara y continuidad manual.
- [ ] Asegurar que IA no ejecute mutaciones automaticas desde UI.

### Fase 6 - Calidad, performance y release
- [ ] Implementar pruebas unitarias de componentes criticos y hooks.
- [ ] Implementar pruebas de integracion de formularios y flujos de error.
- [ ] Implementar E2E de escenarios criticos (login, activos, bloqueo RBAC).
- [ ] Verificar accesibilidad WCAG AA (contraste, teclado, labels, focus).
- [ ] Optimizar rendimiento percibido (skeletons, memoizacion, carga diferida).
- [ ] Documentar manual de uso frontend y mapa de rutas.
- [ ] Ejecutar checklist de salida a staging.

## 5) Tareas transversales obligatorias (cliente)
- [ ] Crear libreria compartida de mensajes de error por codigo HTTP (400, 401, 403, 409, 500, 503).
- [ ] Estandarizar componentes base: Button, Input, Select, Modal, Table, Badge, Alert.
- [ ] Definir convencion de nombres para query keys y hooks.
- [ ] Registrar decisiones de frontend (mini ADR) para cambios de arquitectura.
- [ ] Mantener trazabilidad requisito -> pantalla -> prueba (RTM simplificada frontend).

## 6) Criterios de cierre del plan cliente
- [ ] Todas las vistas core implementadas y conectadas al API real.
- [ ] Flujos de error y RBAC verificados en pruebas automatizadas.
- [ ] Sin bloqueantes de accesibilidad critica.
- [ ] Build de produccion y lint en verde.
- [ ] Documentacion actualizada para onboarding del equipo.
