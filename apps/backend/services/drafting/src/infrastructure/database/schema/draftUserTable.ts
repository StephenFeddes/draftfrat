import { boolean, integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { draftTable } from "./draftTable";

export const draftUserTable = pgTable(
    "draft_users",
    {
        user_id: integer(),
        draft_id: integer().references(() => draftTable.id, {
            onDelete: "cascade",
        }),
        team_name: varchar(),
        team_number: integer(),
        is_auto_drafting: boolean().default(false),
        is_admin: boolean().default(false),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.user_id, table.draft_id] }),
    }),
);
