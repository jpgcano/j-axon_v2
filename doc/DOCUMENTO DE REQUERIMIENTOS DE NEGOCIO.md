DOCUMENTO DE REQUERIMIENTOS DE NEGOCIO (BRD)
Proyecto: J-axon v2.0.0 (Plataforma de Gobernanza y Mantenimiento Predictivo)
Código de Proyecto: JAX-2024-CORE
Autor y Arquitecto Principal: Juan Pablo Cano
Versión: 1.0
Clasificación: Confidencial / Estratégico

PROPÓSITO DEL DOCUMENTO
El presente Documento de Requerimientos de Negocio (BRD) tiene como finalidad establecer de manera exhaustiva y definitiva las necesidades, justificaciones y objetivos estratégicos que motivan el desarrollo de J-axon v2.0.0. Este artefacto actúa como el contrato fundacional entre las necesidades operativas de la organización y el diseño técnico. Su función es garantizar que toda decisión arquitectónica y de desarrollo posterior esté estrictamente alineada con la mitigación de riesgos operativos y el retorno de inversión (ROI).

DEFINICIÓN DEL PROBLEMA (BUSINESS CASE)
2.1. Estado Actual (As-Is)
Actualmente, la organización administra sus activos físicos y tecnológicos, así como los incidentes asociados, mediante flujos de trabajo fragmentados. Las deficiencias centrales identificadas son:

Arquitectura Monolítica y Acoplada: Los fallos en módulos de interfaz comprometen la disponibilidad del núcleo de datos, resultando en inactividad operativa.

Gestión Reactiva de Activos: El mantenimiento se ejecuta como respuesta a fallas (Break-fix), lo que acelera la depreciación de los activos e incrementa los costos de reparación.

Ausencia de Trazabilidad Criptográfica: Los registros de la base de datos pueden ser alterados directamente, lo que invalida la cadena de custodia ante auditorías internas o revisiones bajo el estándar ISO 27001 e ISO 9001.

Triage Manual de Incidentes: La clasificación y asignación de tickets depende de la intervención humana, generando cuellos de botella y desviaciones en el Nivel de Servicio (SLA).

2.2. Estado Futuro (To-Be) y Justificación Arquitectónica
J-axon v2.0.0 transiciona la operación hacia un modelo predictivo, auditable y automatizado. La justificación de negocio para adoptar una Arquitectura Hexagonal y aislar la Inteligencia Artificial (MCP) radica en la continuidad del negocio: aislar la lógica central garantiza que la organización no dependa de proveedores externos de IA o frameworks de interfaz, protegiendo el núcleo operativo contra obsolescencia tecnológica y vulnerabilidades externas.

OBJETIVOS ESTRATÉGICOS Y MÉTRICAS DE ÉXITO (KPIs)
El sistema no será considerado exitoso a menos que cumpla de forma medible con los siguientes indicadores:

Eficiencia Operativa (OBJ-01): Reducir el tiempo de inactividad de los activos críticos en un 35% durante el primer semestre mediante la implementación de planes de mantenimiento preventivo y predictivo.

Integridad Forense (OBJ-02): Lograr un 100% de cumplimiento en auditorías de control de cambios. Toda transacción de mutación de datos debe estar respaldada por un registro inmutable, eliminando las no conformidades por falta de trazabilidad.

Automatización de Triage (OBJ-03): Disminuir el tiempo de asignación y escalada inicial de tickets de soporte en un 60%, utilizando algoritmos de riesgo (Probabilidad x Consecuencia) para priorización automática.

Innovación Segura (OBJ-04): Integrar capacidades de Inteligencia Artificial para asistencia en diagnósticos técnicos con cero incidentes de exfiltración de datos o mutación no autorizada.

ALCANCE DEL PROYECTO (SCOPE)
4.1. Funcionalidades Dentro del Alcance (In-Scope)
El alcance de la versión 2.0.0 se restringe estrictamente a los siguientes dominios de negocio:

Dominio de Inventario y Activos: Ciclo de vida integral (Alta, Asignación, Mantenimiento, Retiro/Baja).

Dominio de Incidencias (Tickets): Ciclo de vida de reportes de fallas, near-misses y escalada por criticidad.

Dominio de Mantenimiento: Planificación, ejecución y validación de órdenes de trabajo (Preventivo, Correctivo, Predictivo).

Dominio de Auditoría Inmutable: Sistema de registro continuo de eventos con encadenamiento de integridad.

Dominio de Inteligencia Artificial (Asistida): Módulo de consulta aislada donde la IA propone soluciones técnicas bajo validación humana obligatoria.

4.2. Funcionalidades Fuera del Alcance (Out-of-Scope)

Gestión de compras, licitaciones o pasarelas de pago.

Módulos de recursos humanos o cálculo de nómina para técnicos.

Integración telemétrica en tiempo real (IoT/SCADA) directamente a la base de datos sin pasar por API.

REGLAS DE NEGOCIO Y CASOS BORDE ANTICIPADOS
Como analista, he definido las siguientes reglas inquebrantables que regirán el comportamiento del sistema, junto con los casos borde que la arquitectura debe resolver:

Regla 01 (Inmutabilidad): Queda estrictamente prohibida la eliminación física de cualquier registro de activo, ticket o usuario en la base de datos de producción.

Caso Borde Anticipado: Si un activo es creado por error tipográfico y guardado, no se elimina. Se debe crear un flujo de "Anulación por Error de Captura" que cambie su estado a inactivo, conservando el log de la creación y la anulación.

Regla 02 (Escalada de Riesgos): Todo ticket de mantenimiento clasificado con riesgo "Alto" o "Extremo" no puede ser cerrado operativamente por un técnico de Primera Línea.

Caso Borde Anticipado: Si el responsable de Segunda Línea (aprobador) no está disponible en el sistema por más de 4 horas, el sistema debe escalar automáticamente al Chief Risk Officer (CRO) para evitar el bloqueo del SLA.

Regla 03 (Human-in-the-Loop para IA): La Inteligencia Artificial no tiene autoridad de escritura sobre el dominio de negocio. Sus salidas son exclusivamente recomendaciones.

Caso Borde Anticipado: Si el servidor MCP sufre una degradación, genera latencia excesiva o devuelve estructuras de datos no válidas, el sistema principal (J-axon Core) debe aplicar un patrón Circuit Breaker y ocultar el módulo de IA a los usuarios, permitiendo que la operación manual continúe sin interrupciones.

ANÁLISIS DE PARTES INTERESADAS (STAKEHOLDERS)

Comité de Auditoría y Riesgos (ARC): Requiere visibilidad absoluta, reportes de cumplimiento normativo y logs criptográficos. Nivel de influencia: Aprobadores finales.

Chief Risk Officer (CRO): Requiere paneles de control sobre riesgos residuales y alertas en tiempo real de eventos de seguridad.

Jefes de Unidad / Primera Línea: Requieren métricas de disponibilidad de activos y herramientas de asignación rápida de trabajo.

Personal Técnico Operativo: Requiere interfaces de alta velocidad, accesibilidad móvil (lectura de códigos QR) y flujos de trabajo con mínima fricción cognitiva.

SUPUESTOS Y RESTRICCIONES

Supuesto Operativo: La organización proporcionará el hardware necesario (dispositivos móviles) para que los técnicos interactúen con la interfaz en campo.

Restricción Normativa: El sistema debe cumplir con las directivas de protección de datos, lo que obliga a implementar Control de Acceso Basado en Roles (RBAC) con un modelo de privilegios mínimos.

Restricción Tecnológica: La separación física entre el cliente (Frontend) y las reglas de negocio (Backend) es obligatoria desde el día 1 del desarrollo para satisfacer el nivel de disponibilidad requerido.