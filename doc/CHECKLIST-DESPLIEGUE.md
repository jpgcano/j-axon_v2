CHECKLIST DE DESPLIEGUE - J-axon v2.0.0

1. Configuración de entorno (Backend)
- NODE_ENV=production
- PORT definido
- DATABASE_URL con SSL
- JWT_PRIVATE_KEY y JWT_PUBLIC_KEY (RS256) cargados
- MASTER_SALT_HASH definido
- MCP_SIDECAR_URL definido
- AUDIT_ENFORCEMENT=soft|hard
- AUDIT_HEALTH_DETAIL=on (si se monitorea auditoría en health)
- RATE_LIMIT_AUTH_WINDOW_MS / RATE_LIMIT_AUTH_MAX
- RATE_LIMIT_API_WINDOW_MS / RATE_LIMIT_API_MAX

2. Configuración de entorno (Frontend)
- NEXT_PUBLIC_API_URL=https://api.j-axon.com/api/v1 (o equivalente)

3. Validaciones previas
- `pnpm test` en jaxon-core-api
- `pnpm run validate:external` en jaxon-core-api
- Health check: `GET /api/v1/health`
- Si AUDIT_HEALTH_DETAIL=on, verificar `missingAuditCount=0`

4. Post-deploy
- Validar login y creación de ticket
- Validar auditoría (registro en jaxon_audit_logs)
- Verificar métricas/alertas (5xx, RBAC, auditoría)
