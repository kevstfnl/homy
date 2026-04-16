# Tools System - Quick Start Guide

## What's Implemented

✅ **Full Tools CRUD System**
- Create, read, update, delete tools
- Enable/disable tools
- Tool type system (builtin, npm, custom)

✅ **Agent-Tool Assignment**
- Assign multiple tools to agents
- Add/remove individual tools
- Query tools for a specific agent

✅ **Web Search Tool**
- Uses DuckDuckGo API (no API key required)
- Configurable result count (1-10)
- Returns formatted results with titles, snippets, and URLs

✅ **Agent Integration**
- Agents automatically load assigned tools
- Tools are available during agent prompt execution
- Tool results are incorporated into agent responses

✅ **Testing**
- 25 passing tests covering service, repository, and tool logic
- Type-safe implementations with TypeScript

---

## Quick Start

### 1. Start the API Server
```bash
bun dev:api
# Server runs on http://localhost:3000
```

### 2. Create the Web Search Tool
```bash
curl -X POST http://localhost:3000/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "web_search",
    "description": "Search the web for information using DuckDuckGo",
    "type": "builtin",
    "enabled": true
  }'

# Save the returned ID, e.g.: "tool-uuid-here"
```

### 3. Create an Agent
```bash
curl -X POST http://localhost:3000/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research Bot",
    "description": "Searches the web for information",
    "role": "Research Assistant",
    "personality": "Thorough and helpful",
    "model": "anthropic:claude-sonnet-4-20250514"
  }'

# Save the returned ID, e.g.: "agent-uuid-here"
```

### 4. Assign Tool to Agent
```bash
curl -X POST http://localhost:3000/tools/agents/agent-uuid-here/tools \
  -H "Content-Type: application/json" \
  -d '{
    "toolIds": ["tool-uuid-here"]
  }'
```

### 5. Use Agent with Web Search
```bash
curl -X POST http://localhost:3000/agents/agent-uuid-here/prompt \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Search for the latest news about AI and summarize the top 3 results"
  }'

# The agent will use the web_search tool and return:
# {
#   "response": "Based on the web search results...",
#   "usage": { "input": 123, "output": 456, "totalTokens": 579 },
#   "stopReason": "stop"
# }
```

### 6. Stream Results (Optional)
```bash
curl -X POST http://localhost:3000/agents/agent-uuid-here/prompt/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the current trends in AI?"
  }'

# Streams Server-Sent Events with:
# {"type":"delta","text":"The..."}
# {"type":"delta","text":" latest..."}
# {"type":"done","usage":{...},"stopReason":"stop"}
```

---

## API Reference

### Tools Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/tools` | List all tools |
| POST | `/tools` | Create a tool |
| GET | `/tools/:id` | Get tool by ID |
| PATCH | `/tools/:id` | Update tool |
| DELETE | `/tools/:id` | Delete tool |

### Agent-Tool Management

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/tools/agents/:agentId/tools` | List tools for agent |
| POST | `/tools/agents/:agentId/tools` | Assign tools to agent (replace) |
| POST | `/tools/agents/:agentId/tools/:toolId` | Add single tool to agent |
| DELETE | `/tools/agents/:agentId/tools/:toolId` | Remove tool from agent |

---

## How Agents Use Tools

1. **Agent receives a prompt** from the user
2. **Loads assigned tools** from the database
3. **Converts tools to AgentTool instances** using the toolCreator factory
4. **Decides if tools are needed** based on the prompt context
5. **Calls tools as needed** with appropriate parameters
6. **Incorporates results** into its response
7. **Returns final answer** to the user

Example agent decision flow:
```
User: "Find me restaurants in Paris"
  ↓
Agent: "I'll need to search the web for this"
  ↓
Calls: web_search with query="restaurants in Paris"
  ↓
Receives: [{ title: "...", snippet: "...", url: "..." }, ...]
  ↓
Generates: "Based on search results, here are the best restaurants..."
```

---

## File Structure

```
apps/api/
├── src/
│   ├── handlers/tools/
│   │   ├── tool.handler.ts      # API route definitions
│   │   ├── tool.service.ts      # Business logic
│   │   ├── tool.repository.ts   # Database queries
│   │   ├── tool.types.ts        # Validation schemas
│   │   └── tool.*.test.ts       # Tests
│   │
│   ├── libs/tools/
│   │   ├── toolCreator.ts       # Convert DB tools → AgentTools
│   │   ├── toolSearch.ts        # Web search implementation
│   │   └── *.test.ts            # Tests
│   │
│   ├── libs/agents/
│   │   └── agentCreator.ts      # Creates agents with tools
│   │
│   └── libs/database/
│       └── schema/
│           ├── tools.ts         # Tool table definition
│           └── agent-tools.ts   # Junction table
│
├── package.json                 # Added @sinclair/typebox
└── seed.ts                      # Seed database with sample tools
```

---

## Configuration

### Environment Variables
No additional environment variables needed for web search (uses public DuckDuckGo API).

Ensure existing API keys are set:
```bash
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...
# etc.
```

### Database Migrations
Tools schema is pre-defined. Ensure migrations are applied:
```bash
bun db:migrate
```

---

## Testing

### Run All Tests
```bash
bun test:api
```

### Run Specific Test File
```bash
bun test src/handlers/tools/tool.service.test.ts
```

### Test Coverage
```bash
bun test:api --coverage
```

---

## Next Steps

### Extending with More Tools

To add a new tool (e.g., Gmail, Slack, Calculator):

1. **Create tool file** → `src/libs/tools/toolYourTool.ts`
2. **Implement execute logic** using TypeBox for parameters
3. **Register in toolCreator.ts** → add case to `createBuiltinTool()`
4. **Create in database** → POST `/tools` with `type: "builtin"`
5. **Assign to agents** → POST `/tools/agents/:id/tools`
6. **Test it** → use agent with prompt that would trigger tool use

### NPM Tools Support
Allow loading tools dynamically from npm packages:
```typescript
// Future: Install and load @agent-tools/calculator
// type: "npm"
// source: "@agent-tools/calculator"
```

### Custom Tools Support
Allow users to define custom JavaScript/TypeScript tool logic:
```typescript
// Future: User uploads JavaScript file
// type: "custom"
// source: "user-tools/my-custom-tool.ts"
```

---

## Troubleshooting

### Tool Not Found When Creating Agent
- Ensure tool is created and `enabled: true`
- Check tool ID is correct when assigning

### Tool Not Being Called by Agent
- Tool must be assigned to agent via POST `/tools/agents/:id/tools`
- Check agent prompt - agent decides if tool is relevant
- Enable debug logging to see agent decision process

### Web Search Returns No Results
- Check query is not empty
- Try simpler, more specific searches
- DuckDuckGo may rate-limit; consider adding retry logic

### Type Errors When Adding New Tools
- Use `@sinclair/typebox` (Type.Object, Type.String, etc.)
- Match AgentTool interface exactly
- Return { content: [...], details: {...} }

---

## Additional Resources

- Full API documentation: [TOOLS.md](./TOOLS.md)
- Agent documentation: [CLAUDE.md](./CLAUDE.md)
- Pi-AI docs: https://github.com/badlogic/pi-mono
