
# DOCUMENTO DE ARQUITECTURA DE COMPONENTES Y ECOSISTEMA REACT (FRONTEND SPEC)
**Proyecto:** J-axon v2.0.0 (Plataforma de Gobernanza y Mantenimiento Predictivo)
**Código de Proyecto:** JAX-2024-CORE
**Autor y Rol:** Arquitecto Frontend / Tech Lead
**Versión:** 1.0
**Clasificación:** Confidencial / Técnico - Desarrollo Frontend

## 1. PROPÓSITO DEL DOCUMENTO
Este documento define los patrones de diseño, las reglas de composición y las políticas de gestión de estado exclusivas para el desarrollo en la biblioteca **React 18+**. Actúa como la directriz inquebrantable para prevenir la degradación del rendimiento (re-renders innecesarios), evitar el "Prop Drilling" (paso excesivo de propiedades) y asegurar que el código UI sea predecible, testeable y alineado con los principios SOLID adaptados a funciones.

## 2. PATRÓN DE ARQUITECTURA DE COMPONENTES
Se prohíbe el desarrollo de componentes monolíticos (componentes que manejan peticiones HTTP, estado global y renderizado de UI al mismo tiempo). El equipo implementará estrictamente el patrón **Container / Presentational (Smart vs. Dumb Components)**.

### 2.1. Componentes Presentacionales (Dumb / UI Components)
* **Responsabilidad:** Renderizar la interfaz visual y disparar eventos a través de callbacks.
* **Restricciones:** * No pueden ejecutar *Custom Hooks* que realicen llamadas a la API (Ej. prohibido usar `useQuery` dentro de un botón o tarjeta).
    * No tienen noción del estado global (Zustand/Redux).
    * Toda la información que reciben debe entrar exclusivamente por las `props`.
* **Ejemplo:** `AssetCard.tsx`, `RiskBadge.tsx`, `TicketFormUI.tsx`.

### 2.2. Componentes Contenedores (Smart Components)
* **Responsabilidad:** Gestionar la lógica de negocio del lado del cliente, interactuar con el estado global/servidor y orquestar a los componentes presentacionales.
* **Restricciones:** * No deben contener estilos complejos de Tailwind ni etiquetas HTML estructurales profundas. Su salida principal es renderizar componentes presentacionales inyectándoles las `props`.
* **Ejemplo:** `AssetDashboardContainer.tsx`, `EscalateTicketLogic.tsx`.

## 3. COMPOSICIÓN Y ATOMIC DESIGN EN REACT
La estructura de carpetas `src/components` se regirá por una adaptación de Atomic Design para maximizar la reutilización.

* **Átomos (`/components/atoms`):** Bloques indivisibles. Botones, Inputs, Badges de Riesgo, Spinners. Deben ser funciones puras.
* **Moléculas (`/components/molecules`):** Combinación de átomos. Un campo de formulario completo (Label + Input + Mensaje de Error Zod), una fila de tabla de auditoría.
* **Organismos (`/components/organisms`):** Secciones funcionales independientes. Un formulario de alta de activos completo, una barra de navegación (Navbar) conectada al estado de sesión, un modal de IA (MCP Sidecar).
* **Plantillas (`/components/templates`):** Layouts que dictan la estructura de la página sin inyectar datos reales (esqueletos).

## 4. GESTIÓN DE ESTADO REACTIVO (HOOKS)
El manejo del ciclo de vida y la reactividad debe aislarse. Se prohíbe el uso de componentes de clase (`class components`); todo el desarrollo será funcional utilizando Hooks.

### 4.1. Reglas Estrictas para `useEffect`
El abuso de `useEffect` es la principal causa de deuda técnica y bugs de carrera en React.
* **Prohibición de Sincronización de Estado:** Queda prohibido usar `useEffect` para actualizar un estado basado en el cambio de otro estado (Derived State). Si un valor puede calcularse durante el renderizado a partir de las props o el estado actual, debe declararse como una constante regular.
* **Fetching de Datos:** Queda prohibido realizar `fetch` o llamadas a Axios directamente dentro de un `useEffect` suelto. Toda petición asíncrona de datos debe encapsularse en la librería de Server State (React Query/SWR) o en Custom Hooks dedicados.

### 4.2. Custom Hooks como Casos de Uso del Frontend
Toda lógica compleja debe extraerse de los componentes hacia *Custom Hooks* (`use...`).
* **Ejemplo de Dominio:** En lugar de tener la lógica de evaluación de permisos dentro del componente visual, se debe crear `useRBAC()`, que consuma el JWT decodificado y exponga una función `can('ticket:escalate')`.
* **Ejemplo de IA:** `useMCPSuggestions(assetId)`, encargado de manejar el estado de carga, error y resolución de las predicciones del sidecar.

## 5. OPTIMIZACIÓN DE RENDIMIENTO Y RENDERIZADO
Dada la cantidad de datos tabulares (Inventario, Logs de Auditoría), el rendimiento de renderizado es crítico (NFR-04).

* **Memoización (`React.memo`):** Solo se aplicará a componentes puros (Átomos y Moléculas) que reciban props pesadas o se rendericen dentro de listas largas (ej. filas de la tabla `AuditLog_Table`).
* **Estabilidad de Referencias (`useCallback` y `useMemo`):** Toda función pasada como propiedad (prop) a un componente hijo memoizado debe envolverse en `useCallback` para evitar romper la memoización. Todo cálculo pesado de filtrado de tablas en el cliente debe envolverse en `useMemo`.
* **Virtualización de Listas:** Para la renderización de la tabla de `Audit_Logs` o inventarios con más de 100 registros, es obligatorio el uso de bibliotecas de virtualización (ej. `@tanstack/react-virtual`) para renderizar únicamente los nodos del DOM visibles en el viewport.

## 6. MANEJO DE EXCEPCIONES: ERROR BOUNDARIES
El fallo de un componente React no debe provocar el colapso de la pantalla completa del usuario ("White Screen of Death").

* **Implementación:** Se deben envolver los componentes críticos (Organismos de la jerarquía) en un componente `ErrorBoundary`.
* **Ejemplo:** Si el módulo de predicción IA (MCP) falla al intentar parsear un JSON corrupto, el `ErrorBoundary` encapsulará el fallo, mostrando un mensaje ("Servicio de IA temporalmente no disponible"), pero permitiendo que el Técnico continúe interactuando con el CRUD de Activos o el sistema de Tickets en el resto de la pantalla.

***

