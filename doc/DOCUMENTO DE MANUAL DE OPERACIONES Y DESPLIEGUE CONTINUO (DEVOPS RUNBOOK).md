DOCUMENTO DE MANUAL DE OPERACIONES Y DESPLIEGUE CONTINUO (DEVOPS RUNBOOK)
Proyecto: J-axon v2.0.0 (Plataforma de Gobernanza y Mantenimiento Predictivo)
Código de Proyecto: JAX-2024-CORE
Autor y Arquitecto Principal: Juan Pablo Cano
Versión: 1.0
Clasificación: Estrictamente Confidencial / Técnico - Infraestructura y Operaciones

1. PROPÓSITO DEL DOCUMENTO
El presente Manual de Operaciones (Runbook) define los procedimientos estandarizados para el aprovisionamiento de infraestructura, configuración de entornos, Integración Continua / Despliegue Continuo (CI/CD) y recuperación ante desastres (Disaster Recovery). Este documento es la directriz obligatoria para los Ingenieros DevOps, Administradores de Sistemas (SysAdmins) y Site Reliability Engineers (SRE) encargados de mantener la disponibilidad del 99.9% exigida por el negocio.

2. TOPOLOGÍA DE INFRAESTRUCTURA (PRODUCCIÓN)
El sistema operará bajo una arquitectura contenerizada y distribuida para garantizar la segregación de responsabilidades.

2.1. Nodos de Cómputo
- Frontend Node: Plataforma Edge / Serverless (ej. Vercel o AWS Amplify) para servir la aplicación Next.js, aprovechando redes de entrega de contenido (CDN) para mínima latencia.
- Core API Node: Clúster de contenedores Docker (ej. AWS ECS, Render o Kubernetes) ejecutando la API Node.js. Debe configurarse con Auto-Scaling basado en el consumo de CPU (umbral del 70%).
- MCP Sidecar Node: Contenedor Docker aislado en una red privada virtual (VPC). Solo acepta tráfico entrante desde el Core API Node.
- Database Node: Instancia gestionada de PostgreSQL 15+ (ej. AWS RDS o Supabase). Debe estar en una subred privada, sin acceso a Internet público, con copias de seguridad automatizadas (Multi-AZ para alta disponibilidad).

3. GESTIÓN DE SECRETOS Y VARIABLES DE ENTORNO
Queda estrictamente prohibido versionar archivos `.env` en los repositorios de código. Los secretos se inyectarán en tiempo de despliegue mediante un gestor de secretos (ej. AWS Secrets Manager o GitHub Secrets).

3.1. Core API (Backend) - Variables Obligatorias
- `NODE_ENV`: production
- `PORT`: 8080 (o el puerto interno del contenedor)
- `DATABASE_URL`: Cadena de conexión estricta con SSL (ej. `postgres://user:pass@host:5432/jaxon?sslmode=require`)
- `JWT_PRIVATE_KEY`: Llave RSA asimétrica (Base64) para firma de tokens.
- `JWT_PUBLIC_KEY`: Llave RSA para verificación.
- `MASTER_SALT_HASH`: Cadena alfanumérica de 64 caracteres de alta entropía. Crítica para el cálculo del `integrity_hash`.
- `MCP_SIDECAR_URL`: URL interna del contenedor IA (ej. `http://mcp-sidecar.internal:9000`).

3.2. Client (Frontend) - Variables Obligatorias
- `NEXT_PUBLIC_API_URL`: URL pública del API Gateway (ej. `https://api.j-axon.com/v1`).

4. PIPELINE DE INTEGRACIÓN Y DESPLIEGUE CONTINUO (CI/CD)
El flujo de despliegue automatizado (ej. GitHub Actions) debe constar de las siguientes fases secuenciales y bloqueantes. Si una fase falla, el pipeline se aborta.

4.1. Fase de Integración (Trigger: Push a rama `develop` o `main`)
1. Checkout: Clonar el repositorio.
2. Setup: Instalar Node.js e instalar dependencias (`npm ci` estricto).
3. Code Quality: Ejecutar Linter (`npm run lint`).
4. Type Checking: Ejecutar el compilador TypeScript en modo estricto (`tsc --noEmit`).
5. Unit Testing: Ejecutar suite de pruebas unitarias y verificar umbral de cobertura (>85%).

4.2. Fase de Construcción (Build)
1. Backend: Compilar el código TypeScript a JavaScript nativo.
2. Docker Build: Construir la imagen Docker multi-etapa (basada en `node:20-alpine`) y etiquetarla con el hash del commit de Git (ej. `jaxon-api:a1b2c3d`).
3. Vulnerability Scan: Escanear la imagen Docker en busca de vulnerabilidades (CVEs) críticas.

4.3. Fase de Despliegue a Producción (Trigger: Creación de Release Tag)
1. Database Migration: Ejecutar los scripts de migración del ORM (`db push` o `migrate deploy`).
2. Container Registry: Subir la imagen Docker al registro privado (ej. AWS ECR).
3. Rolling Update: Actualizar los servicios en la nube utilizando una estrategia de despliegue sin tiempo de inactividad (Zero-Downtime Deployment). Los contenedores nuevos deben reportar un estado "Healthy" antes de drenar y apagar los contenedores antiguos.

5. PLAN DE RECUPERACIÓN ANTE DESASTRES Y ROLLBACK (DRP)
En caso de fallo crítico en producción tras un despliegue, el equipo operativo debe seguir este protocolo.

5.1. Falla en el Código de Aplicación (API o Frontend)
- Acción: Ejecutar el pipeline de Rollback, el cual re-desplegará la imagen Docker del Tag inmediatamente anterior (N-1) que se encontraba estable.
- Tiempo Objetivo de Recuperación (RTO): < 5 minutos.

5.2. Falla en la Migración de Base de Datos
- Restricción Arquitectónica: Debido a la inmutabilidad de la tabla `Audit_Logs`, los scripts de regresión de base de datos (Down Migrations) que involucren pérdida de datos están prohibidos.
- Acción: Si una migración corrompe el esquema, se debe restaurar la base de datos a partir del último Snapshot o log de transacciones (WAL) en una instancia paralela y re-enrutar el tráfico (Point-in-Time Recovery).
- RTO esperado: < 30 minutos.

5.3. Caída del Motor MCP (Inteligencia Artificial)
- Acción: Ninguna intervención manual requerida en infraestructura. El backend activará automáticamente el patrón Circuit Breaker, degradando el servicio de IA elegantemente y permitiendo que la operativa manual de tickets y activos continúe sin interrupciones.

6. OBSERVABILIDAD Y MONITOREO
El equipo SRE debe configurar alertas automatizadas que notifiquen al canal de incidencias ante los siguientes eventos:
- Tasa de Errores HTTP 5xx: Si supera el 1% en una ventana de 5 minutos.
- Consumo de Recursos: CPU o RAM de la base de datos superior al 85%.
- Eventos de Seguridad: Más de 10 eventos `HASH_MISMATCH` o `RBAC_DENIED` en menos de 10 minutos (posible ataque en curso).
