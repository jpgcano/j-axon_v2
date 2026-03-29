DOCUMENTO DE ARQUITECTURA DEL SISTEMA (SAD)
Proyecto: J-axon v2.0.0 (Plataforma de Gobernanza y Mantenimiento Predictivo)
Código de Proyecto: JAX-2024-CORE
Autor y Arquitecto Principal: Juan Pablo Cano
Versión: 1.0
Clasificación: Confidencial / Técnico Arquitectónico

PROPÓSITO DEL DOCUMENTO
El Documento de Arquitectura del Sistema (SAD) define la estructura técnica fundamental de J-axon v2.0.0. Este artefacto traduce los requerimientos funcionales y no funcionales (establecidos en el SRS) en un diseño de ingeniería ejecutable. Está dirigido a Líderes Técnicos, Ingenieros DevOps, Especialistas en Bases de Datos y Desarrolladores (Backend/Frontend) como la "Única Fuente de Verdad" (SSOT) para la construcción del software.

REGISTRO DE DECISIONES ARQUITECTÓNICAS (ADR)
Antes de detallar los componentes, se documentan las decisiones críticas que moldean el sistema:

ADR-01 (Patrón Arquitectónico): Se adopta Arquitectura Hexagonal (Puertos y Adaptadores) para el Backend. Justificación: Aísla la lógica de negocio de las dependencias externas (bases de datos, frameworks HTTP, motores de IA), permitiendo pruebas unitarias puras y mitigando la obsolescencia tecnológica.

ADR-02 (Separación de Entornos): Desacoplamiento estricto entre Cliente (SPA Next.js) y Servidor (Node.js API). Justificación: Cumplimiento de segregación de entornos (ISO 27001) y escalabilidad independiente de la carga de interfaz visual frente a la carga de procesamiento de datos.

ADR-03 (Motor de Base de Datos): Se utilizará PostgreSQL 15+. Justificación: Soporte nativo para transacciones ACID robustas, tipos de datos JSONB (requeridos para el payload forense de auditoría) y alta capacidad de indexación.

ADR-04 (Motor IA Aislado): Implementación del Model Context Protocol (MCP) mediante un contenedor Sidecar. Justificación: Evita la inyección de prompts maliciosos en el núcleo transaccional y asegura que la IA herede el RBAC del usuario invocante sin acceso directo a la base de datos.

VISTAS DE ARQUITECTURA (MODELO C4)

3.1. Nivel 1: Diagrama de Contexto
El sistema J-axon interactúa con los siguientes actores y sistemas:

Actores: Técnicos de Primera Línea, Gestores de Segunda Línea, Auditores de Tercera Línea y CRO.

Sistemas Externos: Proveedor de Identidad (IdP / OAuth opcional en fase 2), Servidor de Correo (SMTP para alertas), Motor LLM Externo (conectado vía el MCP Sidecar).

3.2. Nivel 2: Diagrama de Contenedores
La topología de despliegue consistirá en cuatro contenedores principales:

Contenedor 1 (Web SPA): Aplicación Next.js (Frontend) estática o SSR, servida a través de un CDN/Nginx. Maneja la UI y el estado del cliente (Zustand/React Query).

Contenedor 2 (Core API Gateway): Aplicación Node.js/Express. Expone la API RESTful. Contiene los middlewares de autenticación (JWT) y validación (Zod).

Contenedor 3 (Relational Database): Instancia PostgreSQL aislada en red privada (VPC). Accesible únicamente por el Contenedor 2.

Contenedor 4 (AI MCP Sidecar): Servicio en Node.js o Python. Recibe peticiones del Contenedor 2 con contexto estandarizado, consulta al LLM y retorna objetos de datos estructurados (Propuestas de Mantenimiento).

ESPECIFICACIÓN DE LA ARQUITECTURA HEXAGONAL (BACKEND)
El repositorio del backend debe estructurarse obligatoriamente bajo las siguientes capas concéntricas (de adentro hacia afuera):

4.1. Capa de Dominio (Domain Layer)

Entidades: Clases puras de TypeScript (ej. Asset, Ticket, AuditLog).

Objetos de Valor (Value Objects): Tipos inmutables (ej. AssetStatus, RiskLevel).

Puertos (Ports): Interfaces abstractas (ej. IAssetRepository, IHashService).

Regla Inquebrantable: Esta capa no debe tener dependencias de bibliotecas externas (cero imports de Express, Postgres o Zod).

4.2. Capa de Aplicación (Application Layer / Use Cases)

Contiene los flujos de negocio (ej. CreateAssetUseCase, EscalateTicketUseCase).

Orquesta las entidades y los puertos. Lanza excepciones de dominio.

4.3. Capa de Infraestructura (Infrastructure Layer / Adapters)

Implementa los puertos definidos en el dominio (ej. PostgresAssetRepository, SHA256HashService).

Contiene los modelos del ORM (Prisma, Drizzle o TypeORM) y los clientes HTTP externos (Axios hacia el MCP).

4.4. Capa de Interfaz (Primary Adapters / UI-API)

Controladores y Rutas HTTP.

Middlewares de validación de entrada (esquemas Zod) y verificación JWT.

Regla Inquebrantable: Los controladores no contienen lógica condicional de negocio; solo mapean la petición al Caso de Uso y formatean la respuesta HTTP.

MODELO DE DATOS FÍSICO Y DICCIONARIO DE DATOS (MER)
El diseño respeta la Tercera Forma Normal (3NF) y los requerimientos de trazabilidad ISO 9001.

5.1. Tablas Core y Columnas Obligatorias
Todas las tablas maestras (jaxon_assets, jaxon_tickets, jaxon_maintenance) deben heredar obligatoriamente las siguientes columnas de auditoría:

created_by (UUID, Foreign Key a Users)

updated_by (UUID, Foreign Key a Users)

created_at (TIMESTAMP WITH TIME ZONE)

updated_at (TIMESTAMP WITH TIME ZONE)

ip_origin (VARCHAR 45)

integrity_hash (VARCHAR 64) -> Algoritmo: SHA-256(ID + Columnas Clave + updated_at).

5.2. Tabla de Auditoría Criptográfica (jaxon_audit_logs)
Diseñada para anexos inmutables (Insert-Only).

id_log (UUID, Primary Key)

entity_table (VARCHAR 50) - Ej: 'jaxon_assets'

entity_id (UUID)

action_type (VARCHAR 50) - Ej: 'UPDATE_STATUS'

payload_before (JSONB) - Estado previo del registro.

payload_after (JSONB) - Estado nuevo del registro.

actor_id (UUID) - Usuario que ejecuta.

hash_prev (VARCHAR 64) - Hash del log anterior (Encadenamiento).

hash_current (VARCHAR 64) - Cálculo: SHA-256(hash_prev + action_type + actor_id + payload_after).

PROTOCOLOS DE SEGURIDAD Y COMUNICACIÓN

6.1. Autenticación y Autorización

Autenticación Estándar: JSON Web Tokens (JWT) asimétricos (RS256).

Gestión de Sesión: Access Token de corta duración (15 minutos) en memoria o cabecera; Refresh Token almacenado en cookie HTTP-Only, Secure, SameSite=Strict.

Autorización RBAC: Decoradores o middlewares en rutas evaluando permisos atómicos (ej. requirePermission('ticket:escalate')).

6.2. Estrategia Optimistic Concurrency Control (OCC)
Para evitar sobrescritura de datos concurrentes:

Todo endpoint de actualización (PUT/PATCH) exige que el cliente envíe el integrity_hash actual que visualiza en pantalla.

Si el hash enviado por el cliente difiere del integrity_hash almacenado en la base de datos, el backend rechaza la transacción con un HTTP 409 Conflict.

ESTRATEGIA DE DESPLIEGUE Y CI/CD

El código fuente estará versionado en Git, aplicando la estrategia GitFlow.

Los Pull Requests (PR) están condicionados a:

Paso de Linter estricto (ESLint).

Verificación de tipos TypeScript (tsc --noEmit).

Cobertura de pruebas unitarias superior al 80% en las capas de Dominio y Aplicación.

Los contenedores se construirán utilizando imágenes Docker multi-stage (basadas en Alpine Linux o Distroless) para minimizar la superficie de ataque.