# INFORME QA ESTRICTO — Revisión Gemini/Claude

Fecha de ejecución: 2026-03-29  
Repositorio: `j-axon_v2`  
Rama evaluada: `work`

## 1) Contexto revisado en `doc/`

Se revisó la documentación funcional/arquitectura/QA para alinear los criterios de validación técnica y cobertura mínima:

- Requerimientos, arquitectura, API, seguridad y plan maestro QA.
- Se tomó como referencia explícita el criterio de pruebas unitarias + integración y trazabilidad de calidad.

## 2) Verificación de ramas de Gemini y Claude

Resultado real de Git en el entorno evaluado:

- Solo existe la rama local `work`.
- No existen ramas locales o remotas llamadas `gemini`, `claude` o equivalentes.

### Conclusión de alcance

No fue posible realizar revisión comparativa “rama vs rama” de Gemini y Claude por ausencia de dichas ramas en el repositorio disponible.

## 3) Auditoría milimétrica de tests existentes (atribuidos a Gemini/Claude)

### Estado encontrado

Se detectaron pruebas en `jaxon-core-api/src/application/**/__tests__/*.spec.ts` con problemas graves:

1. Usan `vitest` pero el proyecto no lo tiene instalado/configurado de forma ejecutable en este entorno.
2. Varias pruebas validan comportamientos no implementados (ejemplo: eventos websocket/auditoría en casos de uso que no reciben esos servicios).
3. Existen firmas de constructor/requests incompatibles con código real (`actorRole`, argumentos extra).
4. Se observaron aserciones orientadas a “pasar un escenario ideal” sin validar contratos completos ni manejo de errores real.

### Dictamen QA

- Las pruebas `*.spec.ts` actuales **no son confiables** como evidencia de calidad.
- En su estado actual parecen más cercanas a “métrica superficial” que a verificación funcional real.

## 4) Revisión de aplicación de `SKILL.md` al código

Se auditaron skills relevantes en `doc/.agents/skills/`:

- `jaxon-coding-standards`: exige uso de `pnpm` y convenciones consistentes.
- `javascript-testing-patterns`: recomienda infraestructura de testing coherente y cobertura de rutas felices + errores.

### Hallazgos

- Había desalineación de facto: tests en framework no operativo (`vitest`) y sin pipeline verificable.
- No existe evidencia fuerte de cumplimiento sistemático de skills en CI (gates/checks automáticos).

## 5) Trabajo QA ejecutado en esta intervención

## 5.1 Nuevas pruebas reales por función (capa aplicación)

Se creó `jaxon-core-api/src/application/application.qa.test.ts` con pruebas ejecutables (Node test runner) que validan:

- Assets: `CreateAsset`, `GetAsset`, `ListAssets`.
- Tickets: `CreateTicket`, `GetTicket`, `ListTickets`, `UpdateTicketStatus`.
- Maintenance: `CreateMaintenance`, `GetMaintenance`, `ListMaintenance`, `UpdateMaintenanceStatus`.
- Users: `RegisterUser`, `AuthenticateUser`.
- AI: `PredictMaintenance`.

Se cubren rutas felices y errores/not found/internal en cada bloque funcional.

## 5.2 Correcciones mínimas para habilitar testabilidad funcional

- Se agregó implementación local de `Result` y `matchError` para eliminar dependencia faltante (`better-result`) y estabilizar flujos de resultado.
- Se reemplazaron errores tipados dependientes de `better-result` por clases de error locales.
- Se corrigió la entidad `Maintenance` agregando métodos `start`, `complete`, `cancel` que hoy invoca `UpdateMaintenanceStatus`.
- Se corrigió el contenedor DI para inyectar dependencias completas de `CreateMaintenance` y `UpdateMaintenanceStatus`.
- Se cambiaron imports de servicios en casos de uso de mantenimiento a `import type` para evitar carga runtime innecesaria durante tests.

## 6) Ejecución y resultados

### Pruebas que pasan

- `pnpm test` en `jaxon-core-api`: pasa (7/7 pruebas QA).
- `pnpm test` en `jaxon-client`: pasa (4/4 pruebas QA).

### Fallas estructurales aún presentes

`pnpm build` en `jaxon-core-api` falla por problemas de base del repositorio, no solo por tests:

- Dependencias faltantes/403 de descarga (`prisma`, `socket.io`, etc.).
- Cliente Prisma generado ausente.
- Inconsistencias entre exports/imports de rutas/controladores.
- Tests legacy `*.spec.ts` con contratos incompatibles.

## 7) Documentación y estado funcional

- Se mantiene este informe actualizado con hallazgos y evidencia de ejecución.
- El código de capa aplicación queda con pruebas reales ejecutables.
- El sistema completo aún no cumple criterio de “build limpio integral” en backend por deuda técnica/integración.

## 8) Qué está fallando (resumen ejecutivo)

1. **No existen ramas Gemini/Claude** en el repo disponible.  
2. **Suite legacy de tests (`*.spec.ts`) no confiable** por desacople con implementación real.  
3. **Backend no compila de extremo a extremo** por dependencias/artefactos e inconsistencias de integración.  
4. **Cumplimiento de skills no está institucionalizado** mediante validación en CI.

## 9) Recomendación QA estricta para cierre

1. Publicar/sincronizar ramas reales `gemini` y `claude` para auditoría diferencial.  
2. Desactivar o migrar tests legacy inválidos a suite QA ejecutable y trazable.  
3. Corregir pipeline backend: generación Prisma offline-compatible + dependencias bloqueadas + build gate obligatorio.  
4. Añadir verificación de cumplimiento de skills (checklist o CI rule) para evitar regresión de calidad.
