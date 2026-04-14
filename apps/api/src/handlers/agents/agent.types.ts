import * as v from "valibot";

export namespace AgentTypes {
	export const createSchema = v.object({
		name: v.string(),
		description: v.optional(v.string()),
		role: v.string(),
		personality: v.string(),
		model: v.string(),
		useMemory: v.optional(v.boolean(), false),
		useProfile: v.optional(v.boolean(), true),
	});

	export const updateSchema = v.partial(createSchema);
	export type Create = v.InferOutput<typeof createSchema>;
	export type Update = v.InferOutput<typeof updateSchema>;

	// Prompt endpoint schemas
	export const promptSchema = v.object({
		message: v.pipe(v.string(), v.minLength(1, "Message cannot be empty")),
	});
	export type Prompt = v.InferOutput<typeof promptSchema>;

	// Response types
	export type PromptResponse = {
		response: string;
		usage: {
			input: number;
			output: number;
			totalTokens: number;
			cost?: number;
		};
		stopReason: string;
	};

	export type PromptStreamEvent =
		| { type: "delta"; text: string }
		| { type: "done"; usage: { input: number; output: number; totalTokens: number }; stopReason: string }
		| { type: "error"; error: string };
}
