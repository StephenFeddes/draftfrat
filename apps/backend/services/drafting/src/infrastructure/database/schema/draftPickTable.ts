import { integer, pgTable, primaryKey, unique } from "drizzle-orm/pg-core";
import { draftTable } from "./draftTable";
import { playerTable } from "./playerTable";

export const draftPickTable = pgTable(
    "draft_picks",
    {
        draft_id: integer().references(() => draftTable.id, {
            onDelete: "cascade",
        }),
        pick_number: integer(),
        player_id: integer().references(() => playerTable.id, {
            onDelete: "set null",
        }),
        team_number: integer().notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.draft_id, table.pick_number] }),
        uniqueDraftPlayer: unique("draft_player").on(table.draft_id, table.player_id),
    }),
);