DOCUMENTO DE ESPECIFICACIÓN DE SEGURIDAD Y CONTROL DE ACCESO (SECURITY SPEC)
Proyecto: J-axon v2.0.0 (Plataforma de Gobernanza y Mantenimiento Predictivo)
Código de Proyecto: JAX-2024-CORE
Autor y Arquitecto Principal: Juan Pablo Cano
Versión: 1.0
Clasificación: Estrictamente Confidencial / Técnico - Seguridad

1. PROPÓSITO DEL DOCUMENTO
Este documento define las políticas, mecanismos y arquitecturas de seguridad que gobernarán la plataforma J-axon v2.0.0. Su objetivo es garantizar la confidencialidad, integridad y disponibilidad de la información en estricto cumplimiento con la norma ISO 27001. Sirve como guía obligatoria para los desarrolladores en la implementación de la autenticación (AuthN), autorización (AuthZ), criptografía forense y protección contra vulnerabilidades web.

2. ARQUITECTURA DE AUTENTICACIÓN (AuthN)
El sistema operará bajo un modelo de autenticación sin estado (Stateless) basado en tokens, diseñado para mitigar ataques de falsificación de peticiones a sitios cruzados (CSRF) y robo de sesión (XSS).

2.1. Ciclo de Vida de Tokens (JWT)
- Access Token: Token JWT firmado asimétricamente (algoritmo RS256). Contiene únicamente el `sub` (UUID del usuario), el `role` y la fecha de expiración (`exp`). Tiempo de vida máximo: 15 minutos. Este token será inyectado por el Frontend en la cabecera `Authorization: Bearer`.
- Refresh Token: Token opaco de larga duración (7 días). Se utilizará exclusivamente para emitir nuevos Access Tokens.
  - Almacenamiento Obligatorio: Debe ser enviado al cliente configurado estrictamente como una cookie `HttpOnly`, `Secure` (solo HTTPS) y `SameSite=Strict`. El código JavaScript del Frontend no debe tener acceso a este token bajo ninguna circunstancia.

2.2. Revocación y Control de Sesión
- El backend implementará una lista de bloqueo (Denylist) en memoria (ej. Redis) para registrar tokens revocados antes de su expiración, permitiendo cierres de sesión forzados desde el panel de administración.
- Se limitará a un máximo de 3 sesiones concurrentes por UUID de usuario.

3. CONTROL DE ACCESO BASADO EN ROLES (RBAC - AuthZ)
El sistema aplica el principio de Privilegio Mínimo (Zero Trust). Todo endpoint del backend estará denegado por defecto, requiriendo la declaración explícita de un permiso atómico.

3.1. Matriz de Permisos por Rol
La siguiente tabla define los permisos absolutos. Ningún desarrollador puede crear excepciones codificadas (hardcoded) fuera de esta matriz.

| Módulo / Dominio | Administrador (ADMIN) | Gestor / CRO (MANAGER) | Técnico (TECH) | Auditor (AUDITOR) |
| :--- | :--- | :--- | :--- | :--- |
| **Activos (Assets)** | Create, Read, Update, Retire | Create, Read, Update, Retire | Read (Global) | Read (Global) |
| **Tickets** | Create, Read, Update, Delete | Create, Read, Update | Create, Read (Asignados), Update (Asignados) | Read (Global) |
| **Mantenimiento** | Create, Read, Update, Approve | Create, Read, Update, Approve | Read (Asignados), Update (Asignados) | Read (Global) |
| **Log de Auditoría** | Read (Global) | Ninguno | Ninguno | Read (Global) |
| **Motor IA (MCP)** | Query (Global) | Query (Global) | Query (Asignados) | Ninguno |

3.2. Autorización Delegada (Motor MCP)
El servidor Sidecar MCP no posee credenciales propias de acceso a la base de datos. Toda petición al MCP hereda el contexto de autorización del usuario que dispara la solicitud. El Backend filtrará los datos (Data Masking) según el rol del usuario antes de enviar el contexto a la IA.

4. CRIPTOGRAFÍA E INTEGRIDAD FORENSE
Para cumplir con la norma ISO 9001 (Trazabilidad) y proteger la cadena de custodia de la información, el sistema implementa mecanismos criptográficos a nivel de capa de aplicación y base de datos.

4.1. Algoritmo de Integridad (SHA-256)
Toda transacción de escritura (Mutación) debe calcular un hash criptográfico.
- Entradas de la Función Hash: El payload estructurado de la petición (ordenado alfabéticamente por llaves), concatenado con el Timestamp del servidor (ISO 8601) y un "Salt" maestro del servidor.
- Destino: El resultado se almacena en la columna `integrity_hash` de la tabla correspondiente y se utiliza en la tabla `Audit_Logs` para el encadenamiento tipo blockchain (`hash_current` = SHA256 de `hash_prev` + payload actual).

4.2. Protección de Datos en Reposo y Tránsito
- En Tránsito: Todo tráfico HTTP será forzado a TLS 1.3. Las conexiones a la base de datos PostgreSQL desde el backend también deben realizarse sobre canales encriptados (SSL Mode = Require).
- En Reposo: Las contraseñas de los usuarios (si se utiliza autenticación local) deben ser procesadas utilizando el algoritmo Argon2id o bcrypt (costo mínimo de 12). Queda prohibido el almacenamiento de contraseñas en texto plano o usando algoritmos obsoletos (MD5, SHA1).

5. SEGURIDAD PERIMETRAL Y PREVENCIÓN DE VULNERABILIDADES (OWASP)
El código debe implementar controles sistemáticos contra las vulnerabilidades más críticas (OWASP Top 10):

5.1. Sanitización de Entrada (A03:2021-Injection)
- Prohibición de concatenación SQL. Toda consulta a PostgreSQL debe utilizar consultas parametrizadas o un ORM/Query Builder seguro (ej. Prisma, Drizzle) para prevenir inyecciones SQL.
- El middleware Zod configurado en modo `strict()` rechazará cualquier petición HTTP que contenga campos adicionales a los esperados, previniendo ataques de asignación masiva (Mass Assignment).

5.2. Control de Tasa (Rate Limiting)
Para mitigar ataques de denegación de servicio (DDoS) y fuerza bruta:
- Endpoints de Autenticación (`/api/v1/auth/*`): Límite de 5 intentos fallidos por IP en una ventana de 15 minutos.
- Endpoints de API Estándar: Límite de 300 peticiones por IP por minuto.
- Si se excede el umbral, el servidor retornará HTTP 429 (Too Many Requests).

5.3. Políticas de Intercambio de Recursos (CORS)
El backend configurará cabeceras CORS restrictivas. El parámetro `Access-Control-Allow-Origin` debe apuntar única y exclusivamente al dominio oficial del Frontend en producción (ej. `https://app.j-axon.com`). El uso de comodines (`*`) está estrictamente prohibido en entornos de Staging y Producción.

