DOCUMENTO DE MATRIZ DE TRAZABILIDAD DE REQUERIMIENTOS (RTM)
Proyecto: J-axon v2.0.0 (Plataforma de Gobernanza y Mantenimiento Predictivo)
Código de Proyecto: JAX-2024-CORE
Autor y Arquitecto Principal: Juan Pablo Cano
Versión: 1.0
Clasificación: Confidencial / Técnico - Gestión de Calidad

1.  PROPÓSITO DEL DOCUMENTO
    La Matriz de Trazabilidad de Requerimientos (RTM, por sus siglas en inglés) es el artefacto central de aseguramiento de calidad y cumplimiento normativo (ISO 9001 / ISO 27001). Su propósito es establecer una línea de visión ininterrumpida desde los objetivos de negocio originales (BRD) hasta las especificaciones de software (SRS), los componentes de arquitectura (SAD/API) y los casos de prueba de control de calidad (QA).

Este documento garantiza que ningún requerimiento de negocio sea omitido durante el desarrollo y, de igual importancia, que el equipo de ingeniería no invierta recursos programando funcionalidades que no responden a una necesidad estratégica documentada (prevención de "Gold Plating" o corrupción del alcance).

2.  ESTRUCTURA DE LA MATRIZ
    La matriz vincula los identificadores únicos de cada documento previo.

<!-- end list -->

  - ID Negocio (BRD): Código del requerimiento estratégico.
  - ID Software (SRS): Código del requerimiento funcional o no funcional.
  - Componente Técnico (SAD/API): Endpoint, tabla o módulo de interfaz asignado.
  - Caso de Prueba (QA): Identificador de la prueba que validará la implementación exitosa.
  - Estado: Cobertura actual en el ciclo de desarrollo.

<!-- end list -->

3.  MATRIZ DE TRAZABILIDAD CORE (FASE 1)

3.1. Dominio de Trazabilidad e Integridad de Datos
| ID Negocio (BRD) | ID Software (SRS) | Componente Técnico (SAD/API) | Caso de Prueba (QA) | Estado de Cobertura |
| :--- | :--- | :--- | :--- | :--- |
| BR-01 (Inmutabilidad) | REQ-F1.2 (Soft Delete) | PATCH /api/v1/assets/{id}/status<br>Columna `estado` en BD | QA-TC-001: Intentar borrar activo por API (Debe fallar 405/403) | Diseñado |
| BR-02 (Auditoría Forense) | REQ-F3.1 (Interceptor) | Middleware `AuditMiddleware` | QA-TC-002: Verificar creación de registro en tabla `jaxon_audit_logs` | Diseñado |
| BR-02 (Auditoría Forense) | REQ-F3.2 (Criptografía) | `HashService` (SHA-256) | QA-TC-003: Validar que `hash_current` coincide con el cálculo manual del payload | Diseñado |

3.2. Dominio de Gestión de Riesgos y Tickets
| ID Negocio (BRD) | ID Software (SRS) | Componente Técnico (SAD/API) | Caso de Prueba (QA) | Estado de Cobertura |
| :--- | :--- | :--- | :--- | :--- |
| OBJ-03 (Triage) | REQ-F2.1 (Cálculo ERM) | `CalculateRiskUseCase` | QA-TC-004: Enviar matriz de impacto alto y validar que nivel sea 'EXTREMO' | Diseñado |
| BR-F02 (Escalada) | REQ-F2.2 (Bloqueo 1ra Línea) | UI: Deshabilitar botón 'Resolver'<br>API: RBAC `ticket:escalate` | QA-TC-005: Técnico intenta cerrar ticket Alto (Debe retornar HTTP 403) | Diseñado |

3.3. Dominio de IA (Motor MCP)
| ID Negocio (BRD) | ID Software (SRS) | Componente Técnico (SAD/API) | Caso de Prueba (QA) | Estado de Cobertura |
| :--- | :--- | :--- | :--- | :--- |
| OBJ-04 (IA Segura) | REQ-F4.1 (Aislamiento) | POST /api/v1/ai/predict<br>Contenedor Sidecar | QA-TC-006: Enviar prompt malicioso intentando DROP TABLE vía MCP | Diseñado |
| BR-NF03 (Disponibilidad)| NFR-05 (Circuit Breaker) | `AxiosInterceptor` con Timeout (3s) | QA-TC-007: Apagar contenedor MCP y validar que la API principal sigue operando | Diseñado |

3.4. Dominio de Rendimiento y Concurrencia
| ID Negocio (BRD) | ID Software (SRS) | Componente Técnico (SAD/API) | Caso de Prueba (QA) | Estado de Cobertura |
| :--- | :--- | :--- | :--- | :--- |
| BR-NF01 (Seguridad) | NFR-06 (Transacciones) | `DB.transaction()` en Repositorios | QA-TC-008: Forzar error en tabla audit\_logs y verificar Rollback en tabla assets | Diseñado |
| BR-NF01 (Seguridad) | NFR-03 (Validación Zod) | Zod Schema `strict()` | QA-TC-009: Enviar payload con campos no autorizados (Debe retornar HTTP 400) | Diseñado |

4.  PROCEDIMIENTO DE CONTROL DE CAMBIOS
    Dado que esta matriz es un documento de cumplimiento, cualquier alteración en el alcance del software debe seguir este procedimiento estricto:
5.  El negocio solicita una nueva funcionalidad o alteración.
6.  El Analista de Sistemas actualiza el BRD y asigna un nuevo ID de Negocio.
7.  El Arquitecto mapea el cambio en el SRS y API Spec, asignando el ID de Software.
8.  Se añade una nueva fila a esta RTM.
9.  El equipo de QA redacta los casos de prueba asociados antes de que el desarrollador inicie la escritura de código.

