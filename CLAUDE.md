# CLAUDE.md — Homy Project Guide

**Project**: Homy — Self-hostable AI agent orchestration platform  
**Stack**: Bun + Hono (API) + SolidJS (Web) + discord.js (Bot)  
**Architecture**: Monorepo with 3 apps (api, web, discord)

---

## Project Overview

**Homy** enables users to create, configure, and orchestrate specialized AI agents with:
- Agent Manager — CRUD and execution
- Tool Manager — provide agents with capabilities
- Skill Manager — domain expertise via markdown
- Memory Manager — learning and adaptation
- Agent Orchestration — workflows and cron jobs
- Discord Interface — agent interaction

**Current Status**: Early stage (5 commits), structure in place, backend handlers being prepared

---

## Code Organization

### API (`apps/api/`)
- **Tech**: Hono (router) + Drizzle (ORM)
- **Handlers**: `agents/`, `crons/`, `memories/`, `skills/`, `tools/`
- Each handler follows pattern: `.handler.ts`, `.service.ts`, `.repository.ts`, `.types.ts`
- **Database**: Drizzle migrations and schema in `libs/database/`

### Web (`apps/web/`)
- **Tech**: SolidJS (reactive) + Vite (build)
- **Pages**: agents, tools, crons, logs
- **Components**: UI for management interfaces

### Discord (`apps/discord/`)
- **Tech**: discord.js for bot interaction
- **Structure**: message routing and slash commands

---

## Development Workflow

```bash
bun dev          # All packages in parallel
bun dev:api      # API only (with --hot reloading)
bun dev:web      # Frontend only
bun dev:discord  # Bot only
```

**Linting & Formatting**: Biome (ESLint + Prettier replacement)
```bash
bun check        # Lint + format check
bun check:fix    # Auto-fix
bun typecheck    # TypeScript validation
```

---

## Key Decisions & Conventions

### ✅ Established

**Code Style**
- Follow existing pattern: `handler.ts` → `service.ts` → `repository.ts` → `types.ts`
- No custom conventions needed; inherit from codebase

**Testing**
- Use Bun's built-in test runner (`bun:test`)
- Tests live alongside source: `*.test.ts`
- Minimal setup, no external dependencies

**Development Scope**
- **Single-user, self-hosted** — no multi-tenant concerns
- Schema, permissions, and architecture can stay simple
- Focus: robust single-user workflows

**Immediate Priority**
- **Agents CRUD complete** — before tools, memory, or Discord
- Full API endpoints for create, read, update, delete agents
- Basic database schema in place

**PR Strategy**
- One PR per feature (agents CRUD = one PR)
- Keep commits organized with clear messages

---

## Quick Answers Needed

### Development Preferences
1. **Code Style**: Do you have specific conventions for naming, file organization, or patterns you want enforced?
2. **Testing**: Should I write tests? What framework (Bun's built-in, Vitest, other)?
3. **PR Strategy**: When implementing features—single PR per feature, or bundle small related changes?
4. **Error Handling**: How should errors be handled? (throw, custom error objects, validation pipes?)

### Architecture & Scope
5. **Agent Provider Flexibility**: Should agents support multiple LLM providers (OpenAI, Anthropic, etc.) from day one, or start with one?
6. **Tool Extensibility**: Should tools be npm packages, locally defined, or both? Any limits?
7. **Database Scale**: Is Homy designed for single-user, small teams, or production multi-tenant? Affects schema & permissions.

### Current Work
8. **Immediate Priority**: What's the next feature after folder/handler structure? (agents CRUD, tool registration, memory system, Discord integration?)
9. **Blockers**: Are there any design decisions or dependencies you're unsure about?

---

## Current Agent Implementation

**Status**: 80% done, needs Polish

### Schema (Drizzle SQLite)
```
agents (id, name, description, role, personality, model, useMemory, useProfile, createdAt)
  ├─→ agentTools (M2M with tools)
  ├─→ agentAgents (M2M for agent-to-agent orchestration)
  ├─→ learnings (memories)
  ├─→ conversations (history)
  └─→ crons (scheduled tasks)
```

### Routes (Hono)
| Method | Path | Status |
|--------|------|--------|
| GET | `/agents` | ✅ Working |
| POST | `/agents` | ✅ Working |
| GET | `/agents/:id` | ✅ Working |
| PATCH | `/agents/:id` | ⚠️ Bug: missing `/` in handler |
| DELETE | `/agents/:id` | ❌ Empty (needs impl) |

### Validation (Valibot)
```ts
Create: name, description, role, personality, model, useMemory?, useProfile?
Update: partial(Create)
```

### Status (Latest)
✅ **PATCH** — Fixed missing `/` in route  
✅ **DELETE** — Implemented with validation  
✅ **Tests** — Added agent.service.test.ts & agent.handler.test.ts (Bun test runner)  
✅ **Validation** — All routes use Valibot + Hono validator

---

## Architecture Notes

**Agent ↔ LLM Integration**
- ✅ Integrated: `@mariozechner/pi-ai` + `@mariozechner/pi-agent-core` packages
- Agents store `model` as `provider:modelId` (e.g., `anthropic:claude-sonnet-4-20250514`)
- `libs/agents/agentCreator.ts` — factory that creates configured pi-agent-core Agent instances
- System prompt auto-composed from agent `name`, `description`, `role`, `personality`

**Agent Execution Endpoints**
```
POST /agents/:id/prompt
  → Send prompt, wait for complete response (JSON)
  → Returns { response, usage, stopReason }

POST /agents/:id/prompt/stream
  → Send prompt, stream tokens via SSE
  → Emits { type: "delta", text } then { type: "done", usage, stopReason }
```

**Multi-Platform Execution**
1. **Discord** — Bot channels/mentions trigger agent execution
2. **Web (SolidJS)** — Manual agent creation/testing UI + prompt sending
3. **Backend (Hono)** — Centralized orchestration + LLM execution + tools/skills access

**Agent Model Format**
- DB column: `agents.model` (text)
- Format: `provider:modelId` (e.g., `anthropic:claude-sonnet-4-20250514`, `openai:gpt-4o`)
- Supported providers: anthropic, openai, google, groq, xai, mistral, and many more (see pi-ai docs)
- API key auto-resolved from env vars (e.g., `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`)

---

## Quick Start — Create & Prompt an Agent

### 1. Create an Agent

```bash
curl -X POST http://localhost:3000/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CodeHelper",
    "description": "An expert at writing and reviewing code",
    "role": "coding assistant",
    "personality": "friendly and thorough",
    "model": "anthropic:claude-sonnet-4-20250514"
  }'
# Returns: { id: "uuid", name: "CodeHelper", ... }
```

### 2. Send a Prompt (JSON Response)

```bash
AGENT_ID="<uuid-from-create>"
curl -X POST "http://localhost:3000/agents/$AGENT_ID/prompt" \
  -H "Content-Type: application/json" \
  -d '{"message": "Write a hello world function in TypeScript"}'
# Returns: { response: "...", usage: {...}, stopReason: "stop" }
```

### 3. Send a Prompt (Streaming SSE)

```bash
curl -X POST "http://localhost:3000/agents/$AGENT_ID/prompt/stream" \
  -H "Content-Type: application/json" \
  -d '{"message": "Write a hello world function in TypeScript"}'
# Streams: data: {"type":"delta","text":"function"}\n
#          data: {"type":"delta","text":" hello"}\n
#          data: {"type":"done","usage":{...}}\n
```

---

## Environment Setup

### Option 1: CLI (Recommended for Development)

Pass API keys directly when running the API:

```bash
OPENAI_API_KEY=sk-your-key ANTHROPIC_API_KEY=sk-ant-your-key bun run --filter @homy/api dev
```

### Option 2: .env File

Create `.env` file at project root:

```bash
# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI
OPENAI_API_KEY=sk-...

# Google
GEMINI_API_KEY=...

# Groq
GROQ_API_KEY=...

# Local Lemonade Server (use any dummy value)
# Lemonade runs on http://localhost:13305 and doesn't need real API keys
# Just define OPENAI_API_KEY with a dummy value
```

### Special Case: Lemonade (Local LLM Server)

If using models with `lemonade:` prefix (e.g., `lemonade:Qwen3.5-0.8B-GGUF`):
- Lemonade server must be running on `http://localhost:13305`
- Set `OPENAI_API_KEY=sk-local` or any value (not validated since it's local)
- The model will use Lemonade's local inference instead of remote APIs

Then start the API:
```bash
bun dev:api
```

---

## Testing Approach

**Framework**: Bun's built-in test runner (`bun:test`)  
**Location**: `*.test.ts` files alongside source  

**Run Tests**:
```bash
bun test              # All tests across monorepo
bun test:api         # API tests only
bun test --coverage  # Coverage report
```

**Coverage Strategy**
- Unit tests for services (business logic)
- Integration tests for routes (via mocked service)
- No external DB mocking needed for single-user app

---

## Useful Commands

```bash
# Database
bun db:generate    # Generate migrations
bun db:migrate     # Apply migrations
bun db:studio      # Drizzle Studio (visual DB editor)

# Build & Deploy
bun build          # All packages
bun build:api      # API only (tsup)
bun typecheck      # Pre-commit check

# Cleanup
bun clean          # Remove dist folders
```

---

## Notes & Reminders

- **Monorepo**: Use `bun run --filter <app>` or `bun run --workspaces`
- **RTK Integration**: Global RTK token-optimization enabled; see `~/.claude/RTK.md`
- **Context7**: Use for library docs (Hono, Drizzle, SolidJS, discord.js)
- **Agents are context-agnostic**: Provider-specific logic lives in backend, not shared packages
