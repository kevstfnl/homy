import { eq } from "drizzle-orm";
import { database } from "../../libs/database/database";
import { agents } from "../../libs/database/schema";
import type { AgentTypes } from "./agent.types";

export namespace AgentRepository {
	export const findAll = () => database.query.agents.findMany();

	export const findById = (id: string) =>
		database.query.agents.findFirst({
			where: { id },
			with: { tools: true, learnings: true },
		});

	export const create = (data: AgentTypes.Create) =>
		database
			.insert(agents)
			.values({ id: crypto.randomUUID(), ...data })
			.returning();

	export const update = (id: string, data: AgentTypes.Update) =>
		database.update(agents).set(data).where(eq(agents.id, id)).returning();

	export const remove = (id: string) => database.delete(agents).where(eq(agents.id, id)).returning();
}
