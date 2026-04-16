import { Type } from "@sinclair/typebox";
import type { AgentTool } from "@mariozechner/pi-agent-core";

/**
 * Web Search Tool - Uses DuckDuckGo API for searching
 * Returns top results with title, snippet, and URL
 */
export function createWebSearchTool(): AgentTool {
	return {
		name: "web_search",
		label: "Web Search",
		description: "Search the web for information. Returns top results with titles, snippets, and URLs.",
		parameters: Type.Object({
			query: Type.String({ description: "The search query to execute" }),
			max_results: Type.Optional(
				Type.Number({ description: "Maximum number of results to return (default: 5, max: 10)" }),
			),
		}),
		execute: async (_toolCallId: string, params: unknown) => {
			try {
				const { query, max_results = 5 } = params as { query: string; max_results?: number };
				const limit = Math.min(max_results, 10);

				// Use DuckDuckGo search API (simple, no key required)
				const response = await fetch(
					`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&max_results=${limit}`,
				);

				if (!response.ok) {
					return {
						content: [
							{
								type: "text" as const,
								text: `Search failed with status ${response.status}`,
							},
						],
						details: { error: true },
					};
				}

				const data = (await response.json()) as {
					Results?: Array<{
						FirstURL?: string;
						Result?: string;
						Text?: string;
					}>;
				};

				const results =
					data.Results?.slice(0, limit).map((result) => ({
						title: result.Result || "No title",
						snippet: result.Text || "No description available",
						url: result.FirstURL || "",
					})) || [];

				const resultText = results.map((r) => `**${r.title}**\n${r.snippet}\n${r.url}`).join("\n\n");

				return {
					content: [
						{
							type: "text" as const,
							text: resultText || "No results found",
						},
					],
					details: {
						query,
						resultCount: results.length,
						results,
					},
				};
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : String(error);
				return {
					content: [
						{
							type: "text" as const,
							text: `Web search failed: ${errorMsg}`,
						},
					],
					details: { error: true, message: errorMsg },
				};
			}
		},
	};
}
