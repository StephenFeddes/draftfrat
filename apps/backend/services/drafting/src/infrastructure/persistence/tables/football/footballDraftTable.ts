import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { draftTable } from "../draftTable";

export const footballDraftTable = pgTable(
    "football_drafts",
    {
        draft_id: integer().references(() => draftTable.id, {
            onDelete: "cascade",
        }),
        quarterback_spots_count: integer().notNull(),
        running_back_spots_count: integer().notNull(),
        wide_receiver_spots_count: integer().notNull(),
        tight_end_spots_count: integer().notNull(),
        flex_spots_count: integer().notNull(),
        bench_spots_count: integer().notNull(),
        kicker_spots_count: integer().notNull(),
        defense_spots_count: integer().notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.draft_id] }),
    }),
);
