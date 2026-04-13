<p align="center">
  <img src="../images/banner.svg" alt="Homy" width="100%">
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
  <a href="../../README.md">English</a> &nbsp;·&nbsp;
  <a href="./README.fr.md">Français</a>
</p>

---

**Homy** est une plateforme self-hostable conçue pour tourner sur des machines légères comme le Raspberry Pi 5. Elle permet de créer, orchestrer et gérer des agents IA spécialisés ainsi que leurs outils, afin d'automatiser toute sorte de tâches depuis diverses plateformes comme Discord.

## Fonctionnalités

- **Gestionnaire d'agents** · Créez des agents spécialisés, attribuez-leur des capacités, des outils et définissez leurs interactions avec d'autres agents.
- **Gestionnaire d'outils** · Mettez à disposition des agents des outils prêts à l'emploi (recherche web, navigation, appels HTTP, ...) ou importez-en depuis npm.
- **Gestionnaire de skills** · Donnez aux agents des compétences métier précises via des instructions markdown chargées à la demande.
- **Gestionnaire de mémoire** · Les agents apprennent de leurs erreurs, retiennent les bonnes pratiques et s'adaptent au profil de chaque utilisateur.
- **Orchestration d'agents** · Définissez des workflows multi-agents, des pipelines de tâches et des automatisations planifiées via des crons.
- **Interface Discord** · Interagissez avec vos agents directement depuis Discord, par channel ou par mention.

## Architecture
```
homy/
├── packages/
│   ├── api/                        # Backend — Bun + Hono + Drizzle
│   │   └── src/
│   │       ├── handlers/
│   │       │   ├── agents/         # CRUD et exécution des agents
│   │       │   ├── tools/          # Gestion des outils
│   │       │   ├── memory/         # Apprentissage et profils utilisateur
│   │       │   └── crons/          # Tâches planifiées
│   │       └── libs/
│   │           └── database/       # Schéma et migrations Drizzle
│   │
│   ├── web/                        # Frontend — Vite + SolidJS + UnoCSS
│   │   └── src/
│   │       ├── pages/              # Agents, outils, crons, logs
│   │       └── components/
│   │
│   └── discord/                    # Bot Discord — discord.js
│       └── src/
│           ├── handlers/           # Routing messages et streaming
│           └── commands/           # Slash commands
│
├── biome.json
├── bunfig.toml
├── tsconfig.json
└── package.json
```
## Prérequis

- [Bun](https://bun.sh) >= 1.x
- [Docker](https://www.docker.com) (optionnel, pour le déploiement)

## Installation

```bash
git clone https://github.com/yourname/homy
cd homy
bun install
```

## Développement

```bash
bun dev          # Lance tous les packages en parallèle
bun dev:api      # Backend uniquement
bun dev:web      # Frontend uniquement
bun dev:discord  # Bot Discord uniquement
```

## Licence

MIT — voir [LICENSE](../../LICENSE)