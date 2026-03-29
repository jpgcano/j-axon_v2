DOCUMENTO DE ESPECIFICACIÓN DE INTERFAZ DE USUARIO Y GESTIÓN DE ESTADO (UI/UX & STATE SPEC)
Proyecto: J-axon v2.0.0 (Plataforma de Gobernanza y Mantenimiento Predictivo)
Código de Proyecto: JAX-2024-CORE
Autor y Arquitecto Principal: Juan Pablo Cano
Versión: 1.0
Clasificación: Confidencial / Técnico - Frontend

1. PROPÓSITO DEL DOCUMENTO
Este documento establece las directrices arquitectónicas y de diseño para la construcción de la aplicación cliente (Frontend) de J-axon v2.0.0. Actúa como el manual normativo para los ingenieros de Frontend y especialistas en UI/UX, definiendo la estructura de componentes, la gestión del estado global y asíncrono, los estándares de accesibilidad y el manejo de errores en la interfaz. El objetivo es asegurar una experiencia de usuario (UX) predecible, resiliente y de alto rendimiento.

2. ARQUITECTURA DEL FRONTEND (NEXT.JS)
El cliente se construirá utilizando el framework React mediante Next.js (App Router). La elección de esta tecnología responde a la necesidad de optimizar el rendimiento y aplicar renderizado híbrido.

2.1. Estrategia de Renderizado
- Server-Side Rendering (SSR): Se utilizará para los paneles de control (Dashboards) del Administrador y el CRO, donde la visualización de datos en tiempo real y la seguridad de la primera carga son críticas.
- Client-Side Rendering (CSR): Se limitará a componentes altamente interactivos, como el calendario de mantenimiento (Drag & Drop) y los formularios de mutación de datos (Alta de Activos, Cierre de Tickets).

2.2. Estructura del Repositorio Cliente
El proyecto Frontend debe respetar la siguiente jerarquía basada en responsabilidades:
- `/app`: Definición de rutas, layouts (plantillas maestras) y páginas.
- `/components`: Componentes visuales aislados, divididos bajo la metodología Atomic Design (Átomos, Moléculas, Organismos).
- `/lib`: Clientes de API (Axios/Fetch configurados), utilidades de formateo (fechas, monedas) y esquemas de validación Zod compartidos o replicados del backend.
- `/store`: Definición de los almacenes de estado global.
- `/hooks`: Custom hooks de React para encapsular lógica de negocio y llamadas a la API (ej. `useAssets`, `useTicketEscalation`).

3. SISTEMA DE DISEÑO Y COMPONENTES (DESIGN SYSTEM)
Para garantizar consistencia visual y velocidad de desarrollo, se implementará un sistema de diseño estricto.

3.1. Estilos y CSS
- Framework Obligatorio: Tailwind CSS.
- Restricción: Queda estrictamente prohibido el uso de CSS en línea (inline styles) o la creación de archivos `.css` personalizados, a excepción del archivo de configuración global de Tailwind. Toda personalización de tema (colores corporativos, tipografía) debe inyectarse a través del archivo `tailwind.config.js`.

3.2. Metodología de Componentes Visuales
- Aislamiento (Dumb Components): Los componentes puramente visuales (botones, tarjetas de activos, inputs) no deben tener dependencias de red ni conocer el estado global. Deben recibir datos e invocar acciones exclusivamente mediante "props".
- Componentes Contenedores (Smart Components): Serán los únicos responsables de interactuar con los hooks de la API y despachar acciones al estado global, pasando los datos procesados a los componentes visuales.

3.3. Estándares de Accesibilidad (a11y)
El sistema será utilizado en entornos industriales e iluminación variable, por lo que debe cumplir con el nivel AA de las pautas WCAG 2.1:
- Contraste mínimo de 4.5:1 para texto normal.
- Soporte total para navegación por teclado en todos los formularios y tablas de datos.
- Uso obligatorio de etiquetas ARIA (`aria-label`, `aria-hidden`) en elementos interactivos no estándar y notificaciones dinámicas.

4. GESTIÓN DE ESTADO (STATE MANAGEMENT)
La aplicación manejará tres tipos de estado, cada uno con una tecnología y flujo de vida específico, evitando el antipatrón de almacenar todo en un único repositorio global.

4.1. Estado de Servidor (Asíncrono)
- Tecnología: TanStack Query (React Query) o SWR.
- Propósito: Manejar el caché, la sincronización, el reintento de peticiones y la paginación de los datos que provienen del Backend (ej. Lista de Activos, Historial de Tickets).
- Regla: Los datos de la base de datos nunca deben duplicarse en el estado global del cliente.

4.2. Estado Global (Síncrono)
- Tecnología: Zustand o Context API (solo para datos de baja frecuencia de cambio).
- Propósito: Almacenar datos de sesión del usuario (UUID, Rol, Permisos locales) y preferencias de interfaz (modo oscuro, estado de colapso de la barra lateral).

4.3. Estado Local
- Tecnología: `useState` o `useReducer` de React.
- Propósito: Manejar el estado transitorio de la interfaz, como el texto ingresado en un input de búsqueda antes de enviarlo o la apertura/cierre de un modal.

5. FLUJOS DE INTERACCIÓN Y MANEJO DE ERRORES
La interfaz debe proteger al usuario de la incertidumbre técnica y manejar las excepciones del Backend con gracia.

5.1. Feedback Transaccional
- Toda mutación de datos (POST, PUT, PATCH) debe deshabilitar inmediatamente el botón de envío y mostrar un indicador de carga local (Spinner) para prevenir envíos duplicados.
- Optimistic UI: Para operaciones no críticas (ej. marcar un ticket como leído), la interfaz se actualizará inmediatamente antes de recibir la confirmación del servidor. Si el servidor retorna un error, la interfaz debe revertir el cambio de forma transparente (Rollback) y notificar al usuario.

5.2. Manejo de Errores de API
El cliente HTTP base (Axios interceptor) capturará los códigos de estado del contrato de API y ejecutará acciones estandarizadas:
- 400 Bad Request: Extraerá el array de errores de validación de Zod y los inyectará debajo del campo de formulario correspondiente en color rojo.
- 401 Unauthorized: Destruirá la sesión local y redirigirá forzosamente a la pantalla de Login.
- 403 Forbidden: Mostrará un modal de "Acceso Denegado" sin alterar la ruta actual, informando al usuario que su rol no posee los privilegios necesarios.
- 409 Conflict: Mostrará una alerta crítica: "El registro ha sido modificado por otro usuario. Por favor, recargue la página para obtener la versión más reciente".

6. INTEGRACIÓN CON IA (MCP UI)
El módulo de asistencia mediante Inteligencia Artificial requiere un diseño específico de UI/UX para asegurar la premisa de "Human-in-the-loop":
- Identidad Visual Separada: Las sugerencias provenientes del servidor MCP deben renderizarse con un diseño visual distinto (ej. bordes o fondos con el branding de la IA) para que el técnico sepa instantáneamente que está leyendo una predicción y no un dato determinista de la base de datos.
- Aprobación Explícita: Todo objeto de sugerencia devuelto por la IA debe incluir una casilla de verificación o botón de confirmación ("Aplicar Recomendación") que el usuario debe presionar para transformar la sugerencia en una acción de escritura hacia la API Core.
