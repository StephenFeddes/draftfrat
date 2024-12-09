import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const footballTeamTable = pgTable("football_teams", {
    id: integer().primaryKey(),
    abbreviation: varchar().notNull(),
    bye_week: integer().notNull(),
});
