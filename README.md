# GitHub AI Agent (Gemini & Claude + Aider)

This project is configured to run an Artificial Intelligence Agent as an Autonomous Software Engineer directly from GitHub Actions. It uses [Aider](https://aider.chat/) powered by robust language models (Google Gemini or Anthropic Claude) to resolve Issues and modify repository code unattended based on given specifications.

## How does it work?

We have configured a Github Action (`.github/workflows/aider-bot.yml`) that automatically triggers every time a comment is created on an Issue.

The flow is as follows:
1. An Administrator, Collaborator or Core Member writes a comment on an Issue **that starts with `/aider`**. *(For security, comments from users external to the team are automatically ignored).*
2. Github Actions spins up an environment (Ubuntu) and clones the repository.
3. Python and `aider-chat` are installed.
4. The script checks out a new branch specific to the issue (e.g. `aider/issue-123`).
5. GitHub's official console tool (`gh CLI`) downloads all requirements and the main body of the issue into a file for the AI to use as its definitive Technical Specification.
6. Aider runs with the configured model acting as "Expert Software Architect". It analyzes the requirement, creates files, modifies source code autonomously respecting architectural patterns and terminates code execution (without asking for human confirmation).
7. Finally, Github Actions generates a structured commit that links and closes the issue, proceeding to push back to your remote branch.

## Required Secrets Configuration

For this agent to work, it is mandatory to configure the following variables in the **Secrets and variables > Actions > Repository variables/secrets** of your repository:

- `GEMINI_API_KEY`: Your Google API key (Google AI Studio) if you choose to use Gemini.
- `ANTHROPIC_API_KEY`: Your Anthropic API key, if you choose to use Claude.
- `AIDER_MODEL`: *(Optional)* Exact name of the model to use. E.g: `anthropic/claude-3-5-sonnet-latest` or `gemini/gemini-1.5-pro-latest`. If you don't define anything, it will use gemini-flash-latest by default.

*(Note: the GitHub token `GH_TOKEN` used to manage the repo is already injected securely and automatically by GitHub Actions, you just need to make sure Action has standard read/write permissions).*

### Repository permissions:
Make sure to go to `Settings > Actions > General` in your repository and under the **Workflow permissions** section select the **Read and write permissions** option.
