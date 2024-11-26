import { integer, pgTable, varchar, numeric } from "drizzle-orm/pg-core";

export const playerTable = pgTable("players", {
    id: integer().primaryKey(),
    first_name: varchar().notNull(),
    last_name: varchar().notNull(),
    injury_status: varchar(),
    years_experience: integer().default(0),
    headshot_url: varchar(),
    average_draft_position: numeric(),
});
