# GitHub AI Agent (Gemini & Claude + Aider)

Este proyecto está configurado para ejecutar un Agente de Inteligencia Artificial como un Ingeniero de Software Autónomo directamente desde GitHub Actions. Utiliza [Aider](https://aider.chat/) potenciado por modelos de lenguaje robustos (Google Gemini o Anthropic Claude) para resolver Issues y modificar el código del repositorio de forma desatendida basándose en las especificaciones dadas.

## ¿Cómo funciona?

Hemos configurado un Github Action (`.github/workflows/aider-bot.yml`) que se activa automáticamente cada vez que se crea un comentario en un Issue.

El flujo es el siguiente:
1. Un Administrador, Colaborador o Miembro del core escribe un comentario en un Issue **que inicie con `/aider`**. *(Por seguridad, los comentarios de usuarios externos al equipo son ignorados automáticamente).*
2. Github Actions levanta un entorno (Ubuntu) y clona el repositorio.
3. Se instala Python y `aider-chat`.
4. El script hace un checkout de una nueva rama específica para el issue (ej. `aider/issue-123`).
5. La herramienta oficial de consola de GitHub (`gh CLI`) descarga todos los requerimientos y el cuerpo principal del issue en un archivo para que la IA lo utilice como su Especificación Técnica definitiva.
6. Aider se ejecuta con el modelo configurado actuando como "Arquitecto de Software Experto". Analiza el requerimiento, crea archivos, modifica el código fuente de forma autónoma respetando los patrones arquitectónicos y termina la ejecución de código (sin pedir confirmación humana).
7. Finalmente, Github Actions genera un commit estructurado que vincula y cierra el issue, procediendo a hacer el *push* de vuelta a tu rama remota.

## Configuración de Secretos Requerida

Para que este agente funcione, es obligatorio configurar las siguientes variables en los **Secrets and variables > Actions > Repository variables/secrets** de tu repositorio:

- `GEMINI_API_KEY`: Tu clave de API de Google (Google AI Studio) si optas por usar Gemini.
- `ANTHROPIC_API_KEY`: Tu clave de API de Anthropic, si optas por usar Claude.
- `AIDER_MODEL`: *(Opcional)* Nombre exacto del modelo a utilizar. Ej: `anthropic/claude-3-5-sonnet-latest` o `gemini/gemini-1.5-pro-latest`. Si no defines nada, usará gemini-flash-latest por defecto.

*(Nota: el token de GitHub `GH_TOKEN` empleado para gestionar el repo ya es inyectado de forma segura y automática por GitHub Actions, solo debes asegurarte que Action tenga permisos estándar de lectura/escritura).*

### Permisos del repositorio:
Asegúrate de ir a `Settings > Actions > General` en tu repositorio y bajo la sección **Workflow permissions** seleccionar la opción **Read and write permissions**.
