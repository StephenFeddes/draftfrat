import { boolean, integer, pgTable, primaryKey, numeric } from "drizzle-orm/pg-core";
import { playerTable } from "../playerTable";
import { footballTeamTable } from "./footballTeamTable";

export const footballPlayerTable = pgTable(
    "football_players",
    {
        player_id: integer().references(() => playerTable.id, {
            onUpdate: "cascade",
            onDelete: "cascade",
        }),
        team_id: integer().references(() => footballTeamTable.id, {
            onUpdate: "cascade",
            onDelete: "set null",
        }),
        ppr_rank: integer().notNull(),
        half_ppr_rank: integer().notNull(),
        standard_rank: integer().notNull(),
        is_quarterback: boolean().notNull(),
        is_running_back: boolean().notNull(),
        is_wide_receiver: boolean().notNull(),
        is_tight_end: boolean().notNull(),
        is_kicker: boolean().notNull(),
        is_defense: boolean().notNull(),
        projected_rushing_attempts: numeric(),
        projected_rushing_yards: numeric(),
        projected_rushing_touchdowns: numeric(),
        projected_targets: numeric(),
        projected_receiving_yards: numeric(),
        projected_receiving_touchdowns: numeric(),
        projected_passing_attempts: numeric(),
        projected_passing_yards: numeric(),
        projected_passing_touchdowns: numeric(),
        projected_standard_fantasy_points: numeric(),
        projected_half_ppr_fantasy_points: numeric(),
        projected_ppr_fantasy_points: numeric(),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.player_id] }),
        };
    },
);
