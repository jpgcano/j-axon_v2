DOCUMENTO DE ESPECIFICACIÓN DE API Y CONTRATO DE INTEGRACIÓN (API SPEC)
Proyecto: J-axon v2.0.0 (Plataforma de Gobernanza y Mantenimiento Predictivo)
Código de Proyecto: JAX-2024-CORE
Autor y Arquitecto Principal: Juan Pablo Cano
Versión: 1.0
Clasificación: Confidencial / Técnico - Contrato de Desarrollo

1. PROPÓSITO DEL DOCUMENTO
El presente Documento de Especificación de API constituye el contrato técnico estricto entre el equipo de desarrollo Backend (Core API) y el equipo de desarrollo Frontend (Client SPA). Define las reglas de comunicación, las estructuras de datos (JSON), los códigos de estado HTTP y los protocolos de seguridad que habilitan la interacción entre el cliente y las reglas de negocio, garantizando el cumplimiento del Documento de Arquitectura del Sistema (SAD).

Cualquier alteración a las estructuras aquí definidas requiere una solicitud de cambio formal y la actualización de este documento (SSOT).

2. ESTÁNDARES GLOBALES DE LA API
2.1. Arquitectura y Protocolo
- Estilo Arquitectónico: RESTful.
- Protocolo de Transporte: HTTPS (TLS 1.3 obligatorio en producción).
- Versión de API: La URL base para todas las peticiones será `/api/v1`.
- Formato de Intercambio: `application/json` exclusivo.

2.2. Cabeceras Obligatorias (Headers)
Toda petición entrante al servidor debe incluir las siguientes cabeceras:
- `Content-Type: application/json`
- `Accept: application/json`
- `Authorization: Bearer <JWT_ACCESS_TOKEN>` (Excepto en rutas de autenticación pública).
- `X-Request-ID: <UUID>` (Generado por el frontend para trazabilidad de la transacción en los logs).

3. ESTRUCTURA UNIFICADA DE RESPUESTA (ENVELOPE)
Para garantizar la predictibilidad en el consumo de la API por parte del Frontend, todas las respuestas exitosas o fallidas se encapsularán en una estructura estándar.

3.1. Respuesta Exitosa (HTTP 2xx)
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-03-29T10:00:00Z",
    "requestId": "550e8400-e29b-41d4-a716-446655440000",
    "pagination": null
  }
}
```

3.2. Respuesta de Error (HTTP 4xx / 5xx)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "La estructura del payload no cumple con las reglas de negocio.",
    "details": [
      { "field": "estado", "issue": "Valor no permitido. Valores esperados: ACTIVE, MAINTENANCE, RETIRED" }
    ]
  },
  "meta": {
    "timestamp": "2026-03-29T10:01:00Z",
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

4. CATÁLOGO DE ESTADOS HTTP AUTORIZADOS
El Backend tiene estrictamente prohibido utilizar códigos genéricos si existe uno más específico.
- 200 OK: Solicitud procesada correctamente.
- 201 Created: Recurso creado exitosamente (Aplica a POST).
- 400 Bad Request: Fallo en la validación del esquema Zod.
- 401 Unauthorized: Token JWT ausente, expirado o firma inválida.
- 403 Forbidden: El usuario está autenticado pero su rol RBAC no tiene permisos para esta acción.
- 404 Not Found: El recurso solicitado (UUID) no existe.
- 409 Conflict: Falla en la validación de Concurrencia Optimista (El `integrity_hash` enviado no coincide con el de la base de datos).
- 500 Internal Server Error: Excepción no controlada en el servidor (Requiere alerta inmediata).

5. ESPECIFICACIÓN DE ENDPOINTS: MÓDULO CORE DE ACTIVOS

5.1. Crear Activo
- Endpoint: `POST /api/v1/assets`
- Permiso Requerido (RBAC): `asset:create`
- Payload de Entrada (Request Body):
```json
{
  "description": "Servidor Dell PowerEdge R740",
  "categoryId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "assignedTo": "123e4567-e89b-12d3-a456-426614174000"
}
```
- Comportamiento de Negocio: El sistema ignorará cualquier campo adicional no especificado. El estado inicial se forzará internamente a `ACTIVE`. Genera un registro en la tabla `Audit_Logs`.
- Respuesta Exitosa Esperada: 201 Created. El objeto `data` contendrá el UUID generado y el `integrity_hash` inicial.

5.2. Obtener Detalle de Activo
- Endpoint: `GET /api/v1/assets/{assetId}`
- Permiso Requerido (RBAC): `asset:read`
- Comportamiento de Negocio: Retorna la entidad del activo con sus metadatos de auditoría completos.
- Respuesta Exitosa Esperada (Data Object):
```json
{
  "id": "a8098c1a-f86e-11da-bd1a-00112444be1e",
  "description": "Servidor Dell PowerEdge R740",
  "status": "ACTIVE",
  "audit": {
    "createdBy": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2026-03-28T08:00:00Z",
    "updatedAt": "2026-03-28T08:00:00Z",
    "integrityHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
}
```

5.3. Modificar Estado del Activo (Control de Concurrencia y Soft Delete)
- Endpoint: `PATCH /api/v1/assets/{assetId}/status`
- Permiso Requerido (RBAC): `asset:update`
- Payload de Entrada (Request Body):
```json
{
  "status": "MAINTENANCE",
  "reason": "Mantenimiento preventivo programado",
  "currentIntegrityHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```
- Comportamiento de Negocio: 
  1. El backend verifica que el `currentIntegrityHash` enviado sea exactamente igual al almacenado en la base de datos. Si no lo es, aborta con 409 Conflict.
  2. Actualiza el estado, calcula el nuevo hash y registra el evento `STATUS_CHANGED` en el log inmutable.

5.4. Asignar Activo a Usuario
- Endpoint: `PATCH /api/v1/assets/{assetId}/assign`
- Permiso Requerido (RBAC): `asset:update`
- Payload de Entrada (Request Body):
```json
{
  "assigneeId": "123e4567-e89b-12d3-a456-426614174000"
}
```
- Comportamiento de Negocio: Asigna el activo al usuario indicado y registra el evento `UPDATE` en el log inmutable con `payload_before` y `payload_after`.
- Respuesta Exitosa Esperada: 200 OK. Retorna el activo actualizado.

5.5. Desasignar Activo
- Endpoint: `PATCH /api/v1/assets/{assetId}/unassign`
- Permiso Requerido (RBAC): `asset:update`
- Payload de Entrada (Request Body): `{ }`
- Comportamiento de Negocio: Elimina la asignación del activo y registra el evento `UPDATE` en el log inmutable.
- Respuesta Exitosa Esperada: 200 OK. Retorna el activo actualizado.

6. ESPECIFICACIÓN DE ENDPOINTS: MÓDULO TICKETS

6.1. Asignar Ticket a Técnico
- Endpoint: `PATCH /api/v1/tickets/{ticketId}/assign`
- Permiso Requerido (RBAC): `ticket:update`
- Payload de Entrada (Request Body):
```json
{
  "techId": "123e4567-e89b-12d3-a456-426614174000"
}
```
- Comportamiento de Negocio: Asigna el ticket a un técnico, mueve el estado a `IN_PROGRESS` y registra el evento `UPDATE_STATUS` en el log inmutable.
- Respuesta Exitosa Esperada: 200 OK. Retorna el ticket actualizado.

6.2. Cerrar Ticket (Soft Delete)
- Endpoint: `DELETE /api/v1/tickets/{ticketId}`
- Permiso Requerido (RBAC): `ticket:update`
- Comportamiento de Negocio: Cambia el estado a `CLOSED` y registra el evento `UPDATE_STATUS` en el log inmutable.
- Respuesta Exitosa Esperada: 200 OK. Retorna el ticket actualizado.

7. ESPECIFICACIÓN DE ENDPOINTS: MÓDULO USUARIOS

7.1. Desactivar Usuario
- Endpoint: `PATCH /api/v1/users/{userId}/deactivate`
- Permiso Requerido (RBAC): `user:deactivate` (ADMIN o MANAGER).
- Payload de Entrada (Request Body):
```json
{
  "reason": "Salida de la organización"
}
```
- Comportamiento de Negocio: Marca el usuario como inactivo y registra el evento `UPDATE` en el log inmutable.
- Respuesta Exitosa Esperada: 200 OK. Retorna `{ "status": "deactivated", "id": "..." }`.

7.2. Activar Usuario
- Endpoint: `PATCH /api/v1/users/{userId}/activate`
- Permiso Requerido (RBAC): `user:deactivate` (ADMIN o MANAGER).
- Payload de Entrada (Request Body): `{ }`
- Comportamiento de Negocio: Marca el usuario como activo y registra el evento `UPDATE` en el log inmutable.
- Respuesta Exitosa Esperada: 200 OK. Retorna `{ "status": "activated", "id": "..." }`.

8. ESPECIFICACIÓN DE ENDPOINTS: MOTOR DE IA (MCP)

8.1. Solicitar Análisis Predictivo de Mantenimiento
- Endpoint: `POST /api/v1/ai/maintenance/predict`
- Permiso Requerido (RBAC): `ticket:escalate` (Limitado a Segunda Línea o superior).
- Payload de Entrada (Request Body):
```json
{
  "assetId": "a8098c1a-f86e-11da-bd1a-00112444be1e",
  "contextType": "HISTORICAL_FAILURES"
}
```
- Comportamiento de Negocio: La API principal no modifica la base de datos. Consulta los históricos del activo, arma un payload seguro, lo envía al contenedor Sidecar del MCP y retorna la respuesta procesada al Frontend para que el usuario tome una decisión humana.
- Respuesta Exitosa Esperada (Data Object):
```json
{
  "recommendation": "PREVENTIVE",
  "confidenceScore": 0.89,
  "suggestedActions": [
    "Reemplazo de fuente de poder redundante B",
    "Actualización de firmware de controladora RAID"
  ],
  "estimatedDowntimeHours": 2
}
```
