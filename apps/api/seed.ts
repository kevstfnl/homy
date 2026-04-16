import { database } from "./src/libs/database/database";
import { agents, tools } from "./src/libs/database/schema";

async function seed() {
	console.log("🌱 Seeding database...");

	// Create the web search tool
	const webSearchTool = {
		id: crypto.randomUUID(),
		name: "web_search",
		description: "Search the web for information using DuckDuckGo",
		enabled: true,
		type: "builtin" as const,
		source: null,
		config: null,
	};

	await database.insert(tools).values(webSearchTool);
	console.log("✅ Web search tool created");

	// Create a sample agent
	const sampleAgent = {
		id: crypto.randomUUID(),
		name: "Research Assistant",
		description: "An AI agent that can search the web and provide information",
		role: "Research Agent",
		personality: "Helpful and thorough",
		model: "anthropic:claude-sonnet-4-20250514",
	};

	await database.insert(agents).values(sampleAgent);
	console.log("✅ Sample agent created");

	console.log("\n📊 Database seeded successfully!");
	console.log(`Web Search Tool ID: ${webSearchTool.id}`);
	console.log(`Sample Agent ID: ${sampleAgent.id}`);
}

seed().catch((error) => {
	console.error("❌ Seed failed:", error);
	process.exit(1);
});
