import { integer, pgTable } from "drizzle-orm/pg-core";
import { draftTable } from "./draftTable";
import { playerTable } from "./playerTable";
import { draftUserTable } from "./draftUserTable";

export const draftPlayerQueueTable = pgTable("draft_player_queues", {
    draft_id: integer()
        .notNull()
        .references(() => draftTable.id, {
            onDelete: "cascade",
        }),
    player_id: integer()
        .notNull()
        .references(() => playerTable.id, {
            onDelete: "cascade",
        }),
    user_id: integer()
        .notNull()
        .references(() => draftUserTable.user_id, {
            onDelete: "cascade",
        }),
    priority: integer().notNull(),
});
