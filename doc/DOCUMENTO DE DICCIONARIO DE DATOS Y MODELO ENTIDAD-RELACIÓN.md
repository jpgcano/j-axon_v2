DOCUMENTO DE DICCIONARIO DE DATOS Y MODELO ENTIDAD-RELACIÓN (MER FÍSICO)
Proyecto: J-axon v2.0.0 (Plataforma de Gobernanza y Mantenimiento Predictivo)
Código de Proyecto: JAX-2024-CORE
Autor y Arquitecto Principal: Juan Pablo Cano
Versión: 1.0
Clasificación: Confidencial / Técnico - Base de Datos

1. PROPÓSITO DEL DOCUMENTO
Este documento define el esquema físico de la base de datos transaccional de J-axon v2.0.0. Actúa como la "Única Fuente de Verdad" (SSOT) para Administradores de Base de Datos (DBA), Ingenieros de Datos y Desarrolladores Backend. Establece la estructura exacta de las tablas, tipos de datos en PostgreSQL 15+, restricciones (constraints), llaves foráneas y los índices necesarios para garantizar el rendimiento (NFR-01) y la inmutabilidad de la información (ISO 9001 / ISO 27001).

2. ESTÁNDARES GLOBALES DE DISEÑO FÍSICO
- Motor de Base de Datos: PostgreSQL 15 o superior.
- Nomenclatura: Se utilizará estrictamente `snake_case` para el nombre de todas las tablas y columnas (ej. `jaxon_assets`, `created_at`).
- Llaves Primarias (PK): Se utilizará `UUID` (Versión 4) nativo de PostgreSQL para prevenir ataques de enumeración y facilitar la replicación distribuida.
- Normalización: Tercera Forma Normal (3NF).
- Eliminación de Datos: Queda estrictamente prohibida la regla `ON DELETE CASCADE` en tablas transaccionales. Toda eliminación será lógica (Soft Delete) mediante el campo `status`.

3. COLUMNAS OBLIGATORIAS DE AUDITORÍA (ISO 9001)
Todas las tablas del dominio de negocio (exceptuando tablas paramétricas estáticas) deben implementar el siguiente bloque de columnas sin excepción:

- `created_by` (UUID): FK a `jaxon_users.id`.
- `updated_by` (UUID): FK a `jaxon_users.id`.
- `created_at` (TIMESTAMP WITH TIME ZONE): Valor por defecto `CURRENT_TIMESTAMP`.
- `updated_at` (TIMESTAMP WITH TIME ZONE): Valor por defecto `CURRENT_TIMESTAMP`.
- `ip_origin` (INET): Dirección IPv4 o IPv6 del cliente.
- `integrity_hash` (CHAR(64)): Almacena el hash SHA-256 de la fila.

4. DICCIONARIO DE DATOS DETALLADO (TABLAS CORE)

4.1. Tabla: `jaxon_users`
Propósito: Almacena las identidades y roles (RBAC) de los usuarios del sistema.

| Columna | Tipo de Dato (PostgreSQL) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del usuario. |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Correo electrónico corporativo. |
| `password_hash` | VARCHAR(255) | NOT NULL | Hash Argon2id de la contraseña. |
| `role_name` | VARCHAR(50) | NOT NULL | Enum: ADMIN, MANAGER, TECH, AUDITOR. |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Control de acceso lógico. |
| *[Columnas Audit]* | (Ver Sección 3) | NOT NULL | Trazabilidad del registro. |

4.2. Tabla: `jaxon_assets`
Propósito: Almacena el inventario de activos físicos y lógicos.

| Columna | Tipo de Dato (PostgreSQL) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del activo. |
| `description` | VARCHAR(255) | NOT NULL | Descripción técnica. |
| `category` | VARCHAR(100) | NOT NULL | Categoría funcional (Hardware, Software, Facility). |
| `status` | VARCHAR(50) | NOT NULL | Enum: ACTIVE, MAINTENANCE, RETIRED. |
| `assigned_to` | UUID | FK -> `jaxon_users.id`, NULLABLE | Responsable directo del activo. |
| *[Columnas Audit]* | (Ver Sección 3) | NOT NULL | Trazabilidad del registro. |

4.3. Tabla: `jaxon_tickets`
Propósito: Registro de incidencias y motor de triaje de riesgos.

| Columna | Tipo de Dato (PostgreSQL) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del ticket. |
| `asset_id` | UUID | FK -> `jaxon_assets.id`, NOT NULL | Activo que presenta la falla. |
| `issue_description` | TEXT | NOT NULL | Detalle de la falla reportada. |
| `inherent_risk_level` | VARCHAR(50) | NOT NULL | Enum: LOW, MODERATE, HIGH, EXTREME. |
| `status` | VARCHAR(50) | NOT NULL | Enum: OPEN, PENDING_APPROVAL, IN_PROGRESS, RESOLVED. |
| `assigned_tech_id` | UUID | FK -> `jaxon_users.id`, NULLABLE | Técnico de 1ra línea asignado. |
| `approved_by_id` | UUID | FK -> `jaxon_users.id`, NULLABLE | Manager/CRO que aprobó (2da línea). |
| *[Columnas Audit]* | (Ver Sección 3) | NOT NULL | Trazabilidad del registro. |

4.4. Tabla: `jaxon_audit_logs` (Libro Mayor Inmutable)
Propósito: Garantizar el no repudio forense y la cadena de custodia de las modificaciones. Esta tabla es de inserción exclusiva (Insert-Only). No permite UPDATE ni DELETE a nivel de motor de base de datos.

| Columna | Tipo de Dato (PostgreSQL) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id_log` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador del evento de log. |
| `entity_table` | VARCHAR(100) | NOT NULL | Nombre de la tabla afectada (ej. 'jaxon_assets'). |
| `entity_id` | UUID | NOT NULL | ID del registro modificado. |
| `action_type` | VARCHAR(50) | NOT NULL | Ej: CREATED, STATUS_CHANGED, DELETED_LOGICAL. |
| `payload_before` | JSONB | NULLABLE | Estado completo de la fila antes de la mutación. |
| `payload_after` | JSONB | NOT NULL | Estado completo de la fila después de la mutación. |
| `actor_id` | UUID | FK -> `jaxon_users.id`, NOT NULL | Usuario que ejecutó la acción. |
| `ip_origin` | INET | NOT NULL | Origen de la petición HTTP. |
| `hash_prev` | CHAR(64) | NOT NULL | Hash del log inmediatamente anterior en el tiempo. |
| `hash_current` | CHAR(64) | NOT NULL | SHA-256(hash_prev + action_type + actor_id + payload_after). |
| `created_at` | TIMESTAMP W/ TZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Marca de tiempo inmutable. |

5. ESTRATEGIA DE ÍNDICES Y RENDIMIENTO
Para cumplir con los tiempos de respuesta exigidos (NFR-01: P95 < 200ms en lecturas), el DBA deberá aplicar obligatoriamente los siguientes índices:

5.1. Índices B-Tree
- Sobre todas las Llaves Foráneas (FK) para optimizar los JOINs (ej. `idx_assets_assigned_to` sobre `jaxon_assets.assigned_to`).
- Sobre columnas de estado frecuentemente filtradas (ej. `idx_tickets_status` sobre `jaxon_tickets.status`).
- Sobre el `hash_current` de `jaxon_audit_logs` para optimizar las rutinas de verificación de integridad de la cadena.

5.2. Índices GIN (Generalized Inverted Index)
- Se aplicará un índice GIN sobre la columna `payload_after` de la tabla `jaxon_audit_logs`. Esto permitirá realizar búsquedas de texto completo o filtrado por llaves JSON internas en milisegundos durante auditorías forenses, sin degradar el rendimiento del servidor.

6. DESPLIEGUE Y MIGRACIONES
Las alteraciones al esquema de base de datos no se ejecutarán mediante sentencias SQL manuales en los servidores.
- Herramienta Obligatoria: Se utilizará un motor de migraciones versionado (ej. Prisma Migrate, TypeORM Migrations o Flyway).
- Las migraciones deben ser idempotentes y deben incluir obligatoriamente el script de reversión (Down Migration) para asegurar el RTO (Recovery Time Objective) en caso de fallos de despliegue.

