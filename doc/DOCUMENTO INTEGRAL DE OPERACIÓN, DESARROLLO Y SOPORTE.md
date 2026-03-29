DOCUMENTO INTEGRAL DE OPERACIÓN, DESARROLLO Y SOPORTE
Proyecto: J-axon v2.0.0 (Plataforma de Gobernanza y Mantenimiento Predictivo)
Código de Proyecto: JAX-2024-CORE
Autor y Rol: Juan Pablo Cano - Documentador Técnico Principal
Versión: 1.0
Clasificación: Interno / Operativo

1. PROPÓSITO DEL DOCUMENTO
Este manual unifica las tres áreas críticas para la adopción y el mantenimiento del sistema J-axon v2.0.0. Está dividido en tres secciones dirigidas a audiencias específicas: el usuario final que opera el sistema, el nuevo ingeniero que se integra al equipo de desarrollo, y el personal de soporte técnico que diagnostica fallas.

---

SECCIÓN I: MANUAL DE USUARIO FINAL
Audiencia: Técnicos, Gestores (CRO) y Auditores.

1.1. Acceso y Autenticación
1. Navegue a la URL oficial del sistema proporcionada por el departamento de TI.
2. Ingrese sus credenciales corporativas (Correo y Contraseña).
3. El sistema lo redirigirá automáticamente a su bandeja de trabajo según su rol (Primera Línea, Segunda Línea o Auditor). Si visualiza una pantalla de "Acceso Denegado", contacte a TI para la asignación de su perfil RBAC.

1.2. Operativa del Técnico (Primera Línea)
- Escaneo de Activos: En dispositivos móviles, utilice el botón flotante "Escanear QR" ubicado en la esquina inferior derecha. La cámara capturará el identificador y abrirá la ficha técnica del activo, mostrando su historial y estado actual.
- Cierre de Tickets: Al resolver una incidencia, acceda al ticket, ingrese el diagnóstico técnico en el campo provisto y cambie el estado a "Resuelto". 
- Bloqueo por Riesgo: Si el ticket que intenta cerrar está marcado con un icono de candado rojo (Riesgo Alto/Extremo), el botón de cierre estará deshabilitado. Debe esperar a que un Gestor revise el caso y libere la restricción.

1.3. Operativa del Gestor / CRO (Segunda Línea)
- Triage y Aprobación: En su panel principal (Dashboard), la tabla "Aprobaciones Pendientes" listará los tickets de alta criticidad. Haga clic en la fila para abrir el panel lateral, revise la información provista por el técnico y seleccione "Aprobar Ejecución" para desbloquear el ticket.
- Interpretación de Sugerencias de IA: Al consultar un activo, si la Inteligencia Artificial detecta un patrón de falla, mostrará una tarjeta con borde distintivo. Lea la sugerencia, marque las acciones aplicables en las casillas de verificación y presione "Convertir en Orden de Trabajo". La IA no actúa sola; su clic es la autorización formal.

1.4. Operativa del Auditor (Tercera Línea)
- Libro Mayor (Audit Log): Acceda a la pestaña "Auditoría". No podrá modificar ningún dato. Para validar la integridad de un registro, verifique que la fila contenga el icono de "Escudo Verde", lo que certifica matemáticamente que el hash criptográfico no ha sido alterado.

---

SECCIÓN II: GUÍA DE ONBOARDING PARA DESARROLLADORES (CONTRIBUTING)
Audiencia: Ingenieros de Software, DevOps.

2.1. Requisitos Previos (Prerequisites)
- Node.js v20.x o superior.
- Docker y Docker Compose instalados y ejecutándose.
- Git.

2.2. Aprovisionamiento del Entorno Local
Paso 1: Clonar los repositorios e instalar dependencias.
```bash
git clone https://github.com/empresa/jaxon-core-api.git
git clone https://github.com/empresa/jaxon-client.git
cd jaxon-core-api && npm ci
cd ../jaxon-client && npm ci
```

Paso 2: Configurar las variables de entorno.
Copie los archivos de ejemplo en ambos repositorios:
```bash
cp .env.example .env
```
Asegúrese de que el `MASTER_SALT_HASH` en el backend tenga una longitud de 64 caracteres para que los tests criptográficos no fallen.

Paso 3: Levantar la infraestructura base (Base de Datos y Motor MCP Mock).
Dentro de la carpeta `jaxon-core-api`, ejecute:
```bash
docker-compose up -d
```
Esto levantará PostgreSQL en el puerto 5432.

Paso 4: Ejecutar migraciones y sembrar datos (Seeders).
```bash
npm run db:migrate
npm run db:seed
```
El seeder creará los usuarios por defecto: `admin@jaxon.local`, `tech@jaxon.local`, `cro@jaxon.local`.

Paso 5: Iniciar los servidores de desarrollo.
Backend: `npm run dev` (Inicia en http://localhost:8080)
Frontend: `npm run dev` (Inicia en http://localhost:3000)

2.3. Reglas de Contribución (GitFlow)
- Nunca realice commits directos a `main` o `develop`.
- Cree una rama desde `develop` con el formato: `feature/JAX-123-nombre-tarea`.
- Su Pull Request será bloqueado automáticamente si la cobertura de pruebas unitarias baja del 85% o si el Linter detecta errores.

---

SECCIÓN III: DICCIONARIO DE ERRORES Y TROUBLESHOOTING
Audiencia: Soporte Técnico (Niveles 2 y 3).

| Código de Error | Descripción Técnica | Instrucción de Resolución (Soporte) |
| :--- | :--- | :--- |
| `ERR_AUTH_401` | Token JWT expirado, ausente o corrupto. | Solicitar al usuario que recargue la página. Si persiste, forzar cierre de sesión limpiando las cookies del navegador (F12 > Application > Cookies) e iniciar sesión nuevamente. |
| `ERR_RBAC_403` | El usuario intentó acceder a un endpoint sin el permiso atómico requerido en su payload JWT. | Verificar en la base de datos (`jaxon_users.role_name`) que el usuario tenga el rol correcto. No escalar a desarrollo a menos que el rol sea correcto y el bloqueo persista. |
| `ERR_CONFLICT_409` | Optimistic Concurrency Control. Dos usuarios intentaron editar el mismo activo simultáneamente. | Instruir al usuario afectado a actualizar la pantalla para cargar la última versión del registro y volver a ingresar su modificación. |
| `ERR_HASH_MISMATCH` | El cálculo del `integrity_hash` falló al insertar en `Audit_Logs`. | INCIDENCIA CRÍTICA. Detener el servicio afectado. Posible alteración manual en la base de datos o fallo en el `MASTER_SALT`. Escalar inmediatamente al Arquitecto y DBA. |
| `ERR_MCP_TIMEOUT` | El servidor Sidecar de IA no respondió en el tiempo límite (3000ms). | El sistema principal seguirá funcionando mediante el Circuit Breaker. Revisar el estado del contenedor MCP en la consola de AWS/Docker (`docker logs mcp_sidecar`). Reiniciar el contenedor MCP. |

---
