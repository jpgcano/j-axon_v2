---
name: flujo-trabajo-gitflow-equipo
description: Guía estricta para el agente sobre cómo gestionar ramas, realizar commits pequeños y crear Pull Requests claros usando Gitflow, optimizado para revisión en equipo.
author: Juan Pablo Cano
---

# Habilidad: Flujo de Trabajo Gitflow para el Equipo

Eres un desarrollador experto que ayuda a nuestro equipo a seguir la metodología Gitflow. Cuando se te pida iniciar una tarea, corregir un error o preparar una versión, debes seguir estrictamente estas reglas utilizando tus herramientas de GitHub MCP y Git local. El objetivo principal es mantener un historial limpio y facilitar las revisiones de código (Code Reviews).

## 1. Reglas Principales de las Ramas
* **`main`**: Código estable y listo para producción. NUNCA hagas commits directamente aquí.
* **`develop`**: Rama de integración principal donde se une el trabajo del equipo. NUNCA hagas commits directamente aquí.
* **`feature/*`**: Para nuevas funcionalidades. Nacen de `develop` y se fusionan (merge) en `develop`.
* **`hotfix/*`**: Para emergencias en producción. Nacen de `main` y se fusionan tanto en `main` como en `develop`.
* **`release/*`**: Para preparar pases a producción. Nacen de `develop` y se fusionan en `main` y `develop`.

## 2. Reglas para los Commits (Claros y Comprensibles)
Todo commit debe ser fácil de entender para cualquier miembro del equipo.
* Usa el estándar de **Conventional Commits**:
    * `feat:` para nuevas características (ej. `feat: agregar validación de email en el login`).
    * `fix:` para correcciones de errores (ej. `fix: resolver caída al procesar carrito vacío`).
    * `docs:` para cambios en la documentación.
    * `refactor:` para mejoras de código que no cambian su comportamiento.
    * `chore:` para tareas de mantenimiento o configuración.
* El mensaje debe estar obligatoriamente en **español**, ser directo y explicar *qué* hace el commit. Si el cambio es complejo, añade un cuerpo al mensaje explicando el *por qué*.

## 3. Reglas para los Cambios (Pequeños y Enfocados)
Para evitar que las revisiones de código se conviertan en un cuello de botella:
* **Un commit = Una unidad lógica.** No mezcles la creación de un nuevo componente visual con la reestructuración de la base de datos en el mismo commit.
* **Alcance estricto de la tarea:** Si estás trabajando en una tarea y notas un error en un archivo no relacionado, NO lo corrijas en el mismo Pull Request. Sugiere crear un ticket o una rama nueva para ese problema.
* Revisa siempre los archivos modificados antes de hacer commit para asegurarte de no incluir archivos basura (ej. `.DS_Store`, `console.log` olvidados) ni cambios de formato en código que no tocaba la tarea.

## 4. Pasos de Ejecución para el Agente

### Al iniciar una tarea (Feature):
1. Cambia a la rama `develop` y actualiza con los últimos cambios del equipo (`git pull`).
2. Crea la rama `feature/<nombre-descriptivo-corto>`.
3. Confirma al usuario que el entorno está listo.

### Al guardar cambios (Commits):
1. Analiza las modificaciones y divídelas en varios commits si abordan diferentes aspectos lógicos.
2. Genera los mensajes de commit en español siguiendo las reglas de la sección 2.

### Al terminar la tarea (Crear Pull Request):
1. Sube la rama al repositorio remoto.
2. Utiliza la herramienta MCP de GitHub para crear un PR apuntando a `develop` (NUNCA a `main`).
3. El título del PR debe resumir la funcionalidad. La descripción debe detallar brevemente qué cambió y si hay algún punto crítico que el equipo deba revisar con más atención.