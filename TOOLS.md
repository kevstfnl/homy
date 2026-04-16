# Tools System - Homy

## Overview

The tools system allows agents to interact with external capabilities. Each tool:
- Has a unique ID, name, description, and type
- Can be enabled/disabled
- Can be assigned to multiple agents
- Is executed within the context of an agent prompt

## Supported Tool Types

### Built-in Tools
Pre-implemented tools available without configuration:
- **web_search** - Search the web using DuckDuckGo
  - Parameters: `query` (required), `max_results` (optional, default: 5)
  - Returns: Formatted search results with titles, snippets, and URLs

### NPM Tools (TODO)
Dynamically loaded from npm packages.

### Custom Tools (TODO)
User-defined tools with custom logic.

---

## API Endpoints

### Tools Management

#### List All Tools
```bash
GET /tools
```

Response:
```json
[
  {
    "id": "uuid",
    "name": "web_search",
    "description": "Search the web for information...",
    "enabled": true,
    "type": "builtin",
    "source": null,
    "config": null,
    "createdAt": "2024-04-16T10:00:00Z",
    "agents": []
  }
]
```

#### Create a Tool
```bash
POST /tools
Content-Type: application/json

{
  "name": "custom_tool_name",
  "description": "What this tool does",
  "type": "builtin",
  "enabled": true,
  "source": null,
  "config": {}
}
```

#### Get Tool by ID
```bash
GET /tools/:id
```

#### Update Tool
```bash
PATCH /tools/:id
Content-Type: application/json

{
  "enabled": false,
  "description": "Updated description"
}
```

#### Delete Tool
```bash
DELETE /tools/:id
```

---

## Agent-Tool Assignment

### Get Tools for an Agent
```bash
GET /tools/agents/:agentId/tools
```

Response:
```json
[
  {
    "agentId": "agent-uuid",
    "toolId": "tool-uuid",
    "tool": {
      "id": "tool-uuid",
      "name": "web_search",
      "description": "Search the web for information...",
      "enabled": true,
      "type": "builtin",
      "source": null,
      "config": null,
      "createdAt": "2024-04-16T10:00:00Z"
    }
  }
]
```

### Assign Tools to an Agent
Replace all tools for an agent (replaces previous assignments):
```bash
POST /tools/agents/:agentId/tools
Content-Type: application/json

{
  "toolIds": ["tool-uuid-1", "tool-uuid-2"]
}
```

### Add Single Tool to Agent
```bash
POST /tools/agents/:agentId/tools/:toolId
```

### Remove Tool from Agent
```bash
DELETE /tools/agents/:agentId/tools/:toolId
```

---

## Using Tools with Agents

### 1. Create a Web Search Tool

```bash
curl -X POST http://localhost:3000/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "web_search",
    "description": "Search the web for information using DuckDuckGo",
    "type": "builtin",
    "enabled": true
  }'
# Returns: { "id": "tool-uuid", ... }
```

### 2. Create an Agent
```bash
curl -X POST http://localhost:3000/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research Bot",
    "description": "An agent that can search the web",
    "role": "Research Assistant",
    "personality": "Thorough and helpful",
    "model": "anthropic:claude-sonnet-4-20250514"
  }'
# Returns: { "id": "agent-uuid", ... }
```

### 3. Assign Tool to Agent
```bash
curl -X POST http://localhost:3000/tools/agents/AGENT_UUID/tools \
  -H "Content-Type: application/json" \
  -d '{
    "toolIds": ["TOOL_UUID"]
  }'
```

### 4. Send a Prompt to Agent with Tool Access
```bash
curl -X POST http://localhost:3000/agents/AGENT_UUID/prompt \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Search for information about Claude AI and provide the top 3 results"
  }'
```

The agent will:
1. Parse your message
2. Decide to use the web_search tool if helpful
3. Call the tool with appropriate parameters
4. Incorporate the results into its response
5. Return the final answer

---

## Implementation Details

### Tool Execution Flow

1. **Agent receives prompt** → POST /agents/:id/prompt
2. **Service loads agent from DB** with associated tools
3. **Tools are converted to AgentTool instances** (via `createAgentToolsFromDB`)
4. **Agent is created with tools** → `createAgent(dbAgent, agentTools)`
5. **Agent processes prompt** and calls tools as needed
6. **Tool results are incorporated** into agent response
7. **Response is returned** to client

### File Structure
- `apps/api/src/handlers/tools/` - API handlers and types
  - `tool.handler.ts` - Route definitions
  - `tool.service.ts` - Business logic
  - `tool.repository.ts` - Database queries
  - `tool.types.ts` - Validation schemas
- `apps/api/src/libs/tools/` - Tool implementations
  - `toolCreator.ts` - Factory to convert DB tools to AgentTools
  - `toolSearch.ts` - Web search tool implementation
- `apps/api/src/libs/agents/`
  - `agentCreator.ts` - Creates Agent instances with tools

### Database Schema
- `tools` table - Tool definitions
- `agent_tools` junction table - Many-to-many relationship between agents and tools
- Relations defined in `src/libs/database/relations.ts`

---

## Adding New Tools

### 1. Create a new tool file
```typescript
// apps/api/src/libs/tools/toolExample.ts
import { Type } from "@sinclair/typebox";
import type { AgentTool } from "@mariozechner/pi-agent-core";

export function createExampleTool(): AgentTool {
  return {
    name: "example_tool",
    label: "Example Tool",
    description: "Describes what the tool does",
    parameters: Type.Object({
      param1: Type.String({ description: "First parameter" }),
    }),
    execute: async (_toolCallId: string, params: unknown) => {
      const { param1 } = params as { param1: string };
      
      // Tool logic here
      
      return {
        content: [{ type: "text" as const, text: "Result" }],
        details: { /* metadata */ },
      };
    },
  };
}
```

### 2. Register in toolCreator.ts
```typescript
function createBuiltinTool(name: string): AgentTool | null {
  switch (name) {
    case "web_search":
      return createWebSearchTool();
    case "example_tool":  // Add here
      return createExampleTool();
    default:
      return null;
  }
}
```

### 3. Create tool in database
```bash
curl -X POST http://localhost:3000/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "example_tool",
    "description": "Describes what the tool does",
    "type": "builtin",
    "enabled": true
  }'
```

---

## Testing

### Run tests
```bash
bun test:api
```

### Seed database with sample tools
```bash
bun run seed.ts
```

---

## Future Enhancements

- [ ] NPM tool support (load tools from packages)
- [ ] Custom tool configuration validation
- [ ] Tool versioning
- [ ] Tool usage analytics/logging
- [ ] Tool retry logic and error handling
- [ ] Async tool result polling
- [ ] Streaming tool results
