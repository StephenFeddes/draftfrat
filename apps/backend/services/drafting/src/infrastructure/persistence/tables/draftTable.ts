import { boolean, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const draftTable = pgTable("drafts", {
    id: serial().primaryKey(),
    draft_order_type: varchar().notNull(),
    sport: varchar().notNull(),
    pick_time_limit_seconds: integer(),
    team_count: integer().notNull(),
    scoring_type: varchar().notNull(),
    created_at: varchar(),
    is_started: boolean().default(false),
    is_complete: boolean().default(false),
});
