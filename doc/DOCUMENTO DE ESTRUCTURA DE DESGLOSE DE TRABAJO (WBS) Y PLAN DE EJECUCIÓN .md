DOCUMENTO DE ESTRUCTURA DE DESGLOSE DE TRABAJO (WBS) Y PLAN DE EJECUCIÓN (SPRINT PLAN)
Proyecto: J-axon v2.0.0 (Plataforma de Gobernanza y Mantenimiento Predictivo)
Código de Proyecto: JAX-2024-CORE
Autor y Arquitecto Principal: Juan Pablo Cano
Versión: 1.0
Clasificación: Confidencial / Técnico - Gestión de Proyecto

1. PROPÓSITO DEL DOCUMENTO
Este documento establece la Estructura de Desglose de Trabajo (WBS) y el cronograma de ejecución ágil (Sprint Plan) para la construcción de J-axon v2.0.0. Su función es traducir los requerimientos técnicos y arquitectónicos (SRS, SAD, API Spec) en paquetes de trabajo ejecutables, asignables y medibles para los equipos de ingeniería de Backend, Frontend y DevOps. Constituye la línea base para el control de avance del proyecto.

2. ESTRATEGIA DE EJECUCIÓN Y METODOLOGÍA
La ejecución se regirá bajo el marco de trabajo Scrum modificado para requerimientos de alta criticidad:
- Duración del Sprint: 2 semanas (10 días hábiles).
- Ramificación de Código: Flujo estricto de GitFlow (Ramas `main`, `develop`, `feature/*`, `hotfix/*`).
- Integración Continua (CI): Todo Pull Request hacia `develop` debe pasar automáticamente las pruebas del Linter, compilación de TypeScript y pruebas unitarias antes de habilitar el botón de "Merge".

3. ESTRUCTURA DE DESGLOSE DE TRABAJO (WBS) - NIVEL ÉPICAS
El proyecto se divide en 5 grandes bloques de construcción que deben ejecutarse de manera secuencial para respetar las dependencias de la Arquitectura Hexagonal.

- Épica 1: Cimentación Arquitectónica e Infraestructura (DevOps & Tech Leads).
- Épica 2: Dominio Core, Seguridad y Módulo de Activos (Backend & Frontend).
- Épica 3: Motor de Triage, Riesgos (ERM) y Gestión de Tickets (Backend & Frontend).
- Épica 4: Programación de Mantenimiento y Auditoría Inmutable (Backend & Frontend).
- Épica 5: Integración del Motor Sidecar MCP (Inteligencia Artificial) y QA Final.

4. PLANIFICACIÓN DE SPRINTS (SPRINT BACKLOG)

4.1. SPRINT 0: Arquitectura Base y Entornos (Semanas 1-2)
Objetivo: Establecer los cimientos del código, repositorios y canalización de despliegue. Ningún código de negocio se escribe en esta fase.
- Tarea 0.1: Inicialización de repositorios separados (`jaxon-core-api` y `jaxon-client`).
- Tarea 0.2: Configuración de ESLint, Prettier, Husky y TypeScript strict mode en ambos repositorios.
- Tarea 0.3: Diseño y despliegue del Modelo Físico de Base de Datos (DDL en PostgreSQL) y configuración del ORM.
- Tarea 0.4: Configuración del API Gateway (CORS, Rate Limiting básico).
- Tarea 0.5: Configuración de Tailwind CSS y creación de la estructura de carpetas (Atomic Design) en Frontend.

4.2. SPRINT 1: Módulo Core de Activos y Seguridad Base (Semanas 3-4)
Objetivo: Habilitar la autenticación de usuarios y el ciclo de vida de los activos de hardware/software.
- Tarea 1.1 (Backend): Implementar middleware de autenticación JWT y directivas RBAC por ruta.
- Tarea 1.2 (Backend): Construir Caso de Uso y Controladores para el CRUD de Activos (Alta, Lectura, Soft-Delete).
- Tarea 1.3 (Backend): Implementar servicio de cálculo `integrity_hash` (SHA-256) para la tabla de activos.
- Tarea 1.4 (Frontend): Construir pantalla de Login y gestión de tokens seguros (HttpOnly Cookies).
- Tarea 1.5 (Frontend): Construir el Dashboard de Inventario (Tabla paginada) y formulario de Alta de Activos con validación Zod en cliente.

4.3. SPRINT 2: Motor de Tickets y Triage de Riesgos (Semanas 5-6)
Objetivo: Implementar el sistema de incidencias y las reglas automáticas de escalada.
- Tarea 2.1 (Backend): Construir lógica de cálculo ERM (Probabilidad x Consecuencia) al recibir un ticket.
- Tarea 2.2 (Backend): Implementar flujo de bloqueo de tickets de riesgo "Alto", requiriendo aprobación de rol MANAGER.
- Tarea 2.3 (Frontend): Construir interfaces para creación de tickets vinculados a activos específicos.
- Tarea 2.4 (Frontend): Desarrollar vista de bandeja de entrada para técnicos (solo tickets asignados) y vista de aprobación para Managers.

4.4. SPRINT 3: Mantenimiento y Auditoría Forense (Semanas 7-8)
Objetivo: Completar el ciclo de vida del mantenimiento y asegurar la inmutabilidad de la base de datos.
- Tarea 3.1 (Backend): Implementar Casos de Uso para programación y cierre de Mantenimiento Preventivo/Correctivo.
- Tarea 3.2 (Backend): Construir el encadenamiento criptográfico estricto en la tabla `Audit_Logs` para todos los eventos del sistema.
- Tarea 3.3 (Frontend): Desarrollar componente de calendario (Drag & Drop) para la planificación visual de mantenimientos.
- Tarea 3.4 (Frontend): Crear visor de auditoría (solo lectura, exclusivo para rol ADMIN y AUDITOR) con validación visual de hash.

4.5. SPRINT 4: Integración IA (MCP Sidecar) y Estabilización (Semanas 9-10)
Objetivo: Conectar el motor de Inteligencia Artificial y ejecutar pruebas de carga/seguridad.
- Tarea 4.1 (Backend/DevOps): Desplegar contenedor Docker aislado para el servidor MCP.
- Tarea 4.2 (Backend): Construir adaptador para sanitizar datos del contexto y enviarlos al MCP, procesando la respuesta.
- Tarea 4.3 (Frontend): Diseñar e implementar el componente UI "Sugerencia de IA", requiriendo confirmación explícita ("Human-in-the-loop").
- Tarea 4.4 (QA): Ejecutar pruebas de penetración (Pentesting) sobre los roles RBAC y pruebas de concurrencia optimista (OCC).
- Tarea 4.5 (DevOps): Configurar pipelines de producción y despliegue final (Go-Live).

5. CRITERIOS DE CONTROL DE CALIDAD

5.1. Definition of Ready (DoR) - Condiciones para iniciar una tarea
Para que un desarrollador pueda tomar una tarea del backlog, la historia de usuario debe cumplir con:
- Contrato de API en Swagger redactado y aprobado (si aplica).
- Diseño UI/UX y flujos en Figma aprobados (si aplica).
- Criterios de aceptación funcionales definidos por el Analista.
- Dependencias arquitectónicas resueltas.

5.2. Definition of Done (DoD) - Condiciones para cerrar una tarea
Una tarea se considera finalizada únicamente cuando:
- El código cumple con los estándares del linter y no presenta advertencias en TypeScript.
- Se han ejecutado y superado pruebas unitarias (mínimo 80% de cobertura en capa de dominio).
- La revisión de código (Code Review) ha sido aprobada por al menos un Líder Técnico.
- La funcionalidad opera correctamente en el entorno de pruebas (Staging).
- Se ha documentado cualquier variable de entorno nueva.
