DOCUMENTO DE ESPECIFICACIÓN DE REQUERIMIENTOS DE SOFTWARE (SRS)
Proyecto: J-axon v2.0.0 (Plataforma de Gobernanza y Mantenimiento Predictivo)
Código de Proyecto: JAX-2024-CORE
Autor y Arquitecto Principal: Juan Pablo Cano
Versión: 1.0
Clasificación: Confidencial / Técnico

INTRODUCCIÓN
1.1. Propósito
Este documento de Especificación de Requerimientos de Software (SRS) define detalladamente los requisitos funcionales y no funcionales para la construcción de J-axon v2.0.0. Está diseñado para ser consumido por el equipo de ingeniería (líderes técnicos, desarrolladores de backend y frontend, y especialistas en control de calidad), sirviendo como la base contractual para el desarrollo, las pruebas y la validación del sistema.

1.2. Alcance
En alineación con el BRD previo, el sistema J-axon v2.0.0 automatizará la gestión de activos, el enrutamiento de incidencias y la trazabilidad de auditoría. Este SRS cubre la especificación de la API central (Backend), la interfaz de usuario (Frontend) y el componente aislado de Inteligencia Artificial (MCP Sidecar).

DESCRIPCIÓN GENERAL DEL SISTEMA
2.1. Entorno Operativo

Arquitectura Cliente-Servidor separada físicamente.

Backend: API RESTful desarrollada en Node.js (Next.js API o Express) bajo estricta Arquitectura Hexagonal.

Frontend: Single Page Application (SPA) construida con React/Next.js.

Base de Datos: PostgreSQL 15+ (Relacional, 3NF).

Motor IA: Servidor Model Context Protocol (MCP) en contenedor aislado.

2.2. Perfiles de Usuario (Roles RBAC)

Administrador (ADMIN): Acceso irrestricto a módulos operativos y lectura de logs forenses.

Gestor / Chief Risk Officer (MANAGER/CRO): Autoridad de Segunda Línea. Capacidad de aprobación de tickets de riesgo Alto/Extremo.

Técnico Operativo (TECH): Usuario de Primera Línea. Capacidad de lectura y modificación restringida a los activos y tickets asignados a su persona.

Auditor (AUDITOR): Tercera Línea. Acceso global de solo lectura. Imposibilidad absoluta de mutar datos.

REQUERIMIENTOS FUNCIONALES (CASOS DE USO E HISTORIAS DE USUARIO)
A continuación, se detallan las especificaciones para los módulos principales.

3.1. Épica 1: Gestión de Activos (Core Inventory)

REQ-F1.1 (Creación de Activos): El sistema debe permitir a los usuarios con rol ADMIN o MANAGER registrar un nuevo activo físico o lógico.

Criterio de Aceptación 1: Los campos obligatorios deben incluir descripción, categoría, estado inicial ('ACTIVE') y responsable.

Criterio de Aceptación 2: El sistema debe generar automáticamente un UUID versión 4 como identificador primario.

Criterio de Aceptación 3: La operación debe registrar automáticamente el evento en la tabla Audit_Logs.

REQ-F1.2 (Modificación de Estado - Soft Delete): El sistema no debe permitir la eliminación de activos.

Criterio de Aceptación 1: Las solicitudes de eliminación deben transformarse en una actualización del campo estado al valor 'RETIRED'.

Criterio de Aceptación 2: Si un activo tiene tickets de nivel "Alto" abiertos, el sistema debe bloquear el cambio a estado 'RETIRED' y retornar un error HTTP 409 (Conflict).

3.2. Épica 2: Triage y Gestión de Tickets (Incident Routing)

REQ-F2.1 (Apertura de Ticket): El sistema debe permitir el registro de fallas vinculadas a un UUID de activo específico.

Criterio de Aceptación 1: Al crear el ticket, el sistema debe calcular el Nivel de Riesgo Inherente basándose en la matriz paramétrica de Probabilidad x Consecuencia.

REQ-F2.2 (Escalada Automática): Si el cálculo del Nivel de Riesgo resulta en 'Alto' o 'Extremo', el sistema debe alterar el flujo de trabajo estándar.

Criterio de Aceptación 1: El ticket no puede ser asignado directamente a un técnico sin la aprobación digital previa de un usuario con rol MANAGER o CRO.

Criterio de Aceptación 2: La interfaz de usuario debe deshabilitar los botones de acción para perfiles TECH en tickets pendientes de aprobación.

3.3. Épica 3: Trazabilidad y Auditoría (Audit Log Inmutable)

REQ-F3.1 (Interceptor de Mutaciones): Toda solicitud HTTP que mutile el estado de la base de datos (POST, PUT, PATCH) debe pasar por un middleware de auditoría.

Criterio de Aceptación 1: El sistema debe registrar el id_usuario, ip_origen, fecha_hora_servidor y un volcado en formato JSONB del estado anterior y nuevo del registro.

REQ-F3.2 (Encadenamiento Criptográfico): El sistema debe asegurar la integridad del log de auditoría.

Criterio de Aceptación 1: Cada nuevo registro en Audit_Logs debe calcular su columna hash_current utilizando el algoritmo SHA-256 sobre la concatenación del hash_prev (del registro inmediatamente anterior), el ID del actor, la acción y el payload actual.

3.4. Épica 4: Integración de Inteligencia Artificial (MCP Sidecar)

REQ-F4.1 (Consulta Aislada): El sistema principal debe delegar las consultas complejas de mantenimiento al servidor MCP.

Criterio de Aceptación 1: La API principal debe interceptar la petición del usuario, validar su token RBAC, extraer únicamente los datos permitidos de la base de datos y enviarlos como contexto al servidor MCP.

Criterio de Aceptación 2: Las respuestas del servidor MCP deben tratarse como sugerencias estáticas en el Frontend y nunca deben ejecutar comandos DML (Data Manipulation Language) de manera autónoma en la base de datos.

REQUERIMIENTOS NO FUNCIONALES (NFRs)
Estos requerimientos dictan los atributos de calidad del sistema y son innegociables para pasar a producción.

4.1. Rendimiento y Escalabilidad (Performance)

NFR-01: El tiempo de respuesta de la API para consultas de lectura (GET) no debe exceder los 200 milisegundos en el percentil 95 (P95).

NFR-02: El tiempo de respuesta para operaciones de escritura (POST/PUT) que incluyan cálculo de hash criptográfico no debe exceder los 500 milisegundos.

4.2. Seguridad y Control de Acceso (Security)

NFR-03 (Validación de Datos): Toda entrada de datos desde el cliente debe ser validada en tiempo de ejecución utilizando esquemas estrictos de Zod. El backend debe rechazar (HTTP 400) cualquier payload que contenga campos no definidos en el esquema.

NFR-04 (Autenticación): Las sesiones deben gestionarse mediante JSON Web Tokens (JWT) firmados asimétricamente. El payload del JWT no debe contener información sensible ni datos de dominio, limitándose al UUID del usuario, rol y tiempos de expiración (exp, iat).

4.3. Disponibilidad y Recuperación (Reliability)

NFR-05 (Resiliencia MCP): Si el contenedor del servidor MCP falla o presenta un timeout superior a 3 segundos, la API principal debe implementar un patrón Circuit Breaker, retornando una respuesta HTTP 503 (Service Unavailable) específica para el submódulo de IA, sin degradar la funcionalidad operativa del resto del sistema.

NFR-06 (Transacciones Atómicas): Toda operación de negocio que requiera escritura en múltiples tablas (ej. Actualizar un Activo y escribir en el Audit Log) debe encapsularse en una transacción SQL (BEGIN...COMMIT/ROLLBACK) para garantizar las propiedades ACID.

