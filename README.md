# GitHub AI Agent (Gemini + Aider)

Este proyecto está configurado para ejecutar un agente de Inteligencia Artificial directamente desde GitHub Actions. Utiliza [Aider](https://aider.chat/) potenciado por los modelos de Google Gemini para modificar el código del repositorio de forma autónoma basándose en las instrucciones dadas.

## ¿Cómo funciona?

Hemos configurado un Github Action (`.github/workflows/aider-bot.yml`) que se activa automáticamente cada vez que se crea un comentario en un Issue o en un Pull Request.

El flujo es el siguiente:
1. Alguien realiza un comentario en un Issue o Pull Request **que inicie con `/aider`**.
2. Github Actions levanta un entorno (Ubuntu) y clona el repositorio.
3. Se instala Python y `aider-install`, además del servidor **MCP de Github** (`@modelcontextprotocol/server-github`).
4. Se crea o se hace checkout de una nueva rama específica para el issue (ej. `aider/issue-123`).
5. Aider se ejecuta con el modelo Gemini (`gemini/gemini-1.5-pro-latest`). Al tener el servidor MCP de GitHub configurado, lee automáticamente el contenido del Issue o PR para tener todo el contexto.
6. Aider analiza el repositorio, realiza las modificaciones solicitadas basándose en el issue y el comentario, crea un commit automático y lo *pushea* de vuelta a la rama recién creada.

## Configuración Requerida

Para que este agente funcione, es necesario configurar en los **Secrets** de tu repositorio de GitHub:

- `GEMINI_API_KEY`: Tu clave de API de Google Gemini (Google AI Studio).
- *(El token de GitHub ya es inyectado de forma segura y automática por GitHub Actions, solo debes asegurarte que Action tenga permisos de escritura).*

### Permisos del repositorio:
Asegúrate de ir a `Settings > Actions > General` en tu repositorio y bajo "Workflow permissions" selecciona **Read and write permissions**.
