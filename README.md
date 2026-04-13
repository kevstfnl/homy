<p align="center">
  <img src=".github/images/banner.svg" alt="Homy" width="100%">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Bun-1.x-F9F1E1?style=flat-square&logo=bun&logoColor=black" alt="Bun"/>
  <img src="https://img.shields.io/badge/Hono-4.x-E36002?style=flat-square&logo=hono&logoColor=white" alt="Hono"/>
  <img src="https://img.shields.io/badge/SolidJS-1.x-1DB483?style=flat-square&logo=solid&logoColor=white" alt="SolidJS"/>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black" alt="Drizzle"/>
  <img src="https://img.shields.io/badge/licence-MIT-22c55e?style=flat-square" alt="Licence"/>
</p>

<p align="center">
  <a href="./README.md">English</a> &nbsp;·&nbsp;
  <a href=".github/docs/README.fr.md">Français</a>
</p>

---

**Homy** is a self-hostable platform designed to run on lightweight machines such as the Raspberry Pi 5. It lets you create, orchestrate, and manage specialized AI agents and their tools to automate all kinds of tasks across multiple platforms like Discord.

## Features

- **Agent Manager** · Create specialized agents, assign them capabilities and tools, and define how they interact with one another.
- **Tool Manager** · Provide agents with ready-to-use tools (web search, browsing, HTTP calls, ...) or import any tool from npm.
- **Skill Manager** · Give agents precise domain expertise through markdown instructions loaded on demand.
- **Memory Manager** · Agents learn from their mistakes, retain best practices, and adapt to each user's profile over time.
- **Agent Orchestration** · Define multi-agent workflows, task pipelines, and scheduled automations via cron jobs.
- **Discord Interface** · Interact with your agents directly from Discord, by channel or by mention.

## Architecture
```
homy/
├── packages/
│   ├── api/                        # Backend — Bun + Hono + Drizzle
│   │   └── src/
│   │       ├── handlers/
│   │       │   ├── agents/         # Agent CRUD and execution
│   │       │   ├── tools/          # Tool management
│   │       │   ├── memory/         # Learning and user profiles
│   │       │   └── crons/          # Scheduled tasks
│   │       └── libs/
│   │           └── database/       # Drizzle schema and migrations
│   │
│   ├── web/                        # Frontend — Vite + SolidJS + UnoCSS
│   │   └── src/
│   │       ├── pages/              # Agents, tools, crons, logs
│   │       └── components/
│   │
│   └── discord/                    # Discord bot — discord.js
│       └── src/
│           ├── handlers/           # Message routing and streaming
│           └── commands/           # Slash commands
│
├── biome.json
├── bunfig.toml
├── tsconfig.json
└── package.json
```
## Requirements

- [Bun](https://bun.sh) >= 1.x
- [Docker](https://www.docker.com) (optional, for deployment) // Soon

## Getting Started

```bash
git clone https://github.com/kevstfnl/homy
cd homy
bun install
```

## Development

```bash
bun dev          # Start all packages in parallel
bun dev:api      # API only
bun dev:web      # Frontend only
bun dev:discord  # Discord bot only
```

## License

MIT — see [LICENSE](./LICENSE)