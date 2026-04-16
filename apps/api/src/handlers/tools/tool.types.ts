import * as v from "valibot";

export namespace ToolTypes {
	export const createSchema = v.object({
		name: v.pipe(v.string(), v.minLength(1, "Name is required")),
		description: v.optional(v.string()),
		enabled: v.optional(v.boolean(), true),
		type: v.union([v.literal("builtin"), v.literal("npm"), v.literal("custom")]),
		source: v.optional(v.string()),
		config: v.optional(v.record(v.string(), v.any())),
	});

	export const updateSchema = v.partial(createSchema);

	export type Create = v.InferOutput<typeof createSchema>;
	export type Update = v.InferOutput<typeof updateSchema>;

	// Tool assignment to agent
	export const assignSchema = v.object({
		toolIds: v.array(v.string()),
	});

	export type Assign = v.InferOutput<typeof assignSchema>;

	// Response type
	export type Tool = {
		id: string;
		name: string;
		description?: string | null;
		enabled: boolean;
		type: "builtin" | "npm" | "custom";
		source?: string | null;
		config?: Record<string, unknown> | null;
		createdAt: Date;
	};

	export type ToolWithAgents = Tool & {
		agents: Array<{ agentId: string }>;
	};
}
