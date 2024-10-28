import { boolean, integer, pgTable, primaryKey, serial, varchar } from "drizzle-orm/pg-core";

export const draftTable = pgTable("drafts", {
    id: serial().primaryKey(),
    order_type: varchar().notNull(),
    sport: varchar().notNull(),
    pick_time_limit: integer().notNull(),
    team_count: integer().notNull(),
    scoring_type: varchar().notNull(),
    created_at: varchar().notNull(),
    is_started: boolean().default(false),
});

export const draftUserTable = pgTable(
    "draft_users",
    {
        user_id: integer(),
        draft_id: integer().references(() => draftTable.id, {
            onDelete: "cascade",
        }),
        team_number: integer(),
        is_auto_drafting: boolean().default(false),
        is_admin: boolean().default(false),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.user_id, table.draft_id] }),
    }),
);

export const footballDraftTable = pgTable(
    "football_draft",
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

export const playerTable = pgTable("players", {
    id: integer().primaryKey(),
    first_name: varchar(),
    last_name: varchar(),
    age: integer(),
    height: integer(),
    weight: integer(),
    injury_status: varchar(),
    years_experience: integer(),
    rotowire_id: integer(),
    headshot_url: varchar(),
});

export const footballTeamsTable = pgTable("football_teams", {
    id: integer().primaryKey(),
    name: varchar(),
    abbreviation: varchar(),
    city: varchar(),
    division: varchar(),
    conference: varchar(),
    wins: integer(),
    losses: integer(),
    ties: integer(),
    bye_week: integer(),
});

export const footballPlayerTable = pgTable(
    "football_players",
    {
        player_id: integer().references(() => playerTable.id, {
            onUpdate: "cascade",
        }),
        team_id: integer().references(() => footballTeamsTable.id, {
            onUpdate: "cascade",
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
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.player_id] }),
        };
    },
);

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
        picked_by_team_number: integer().notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.draft_id, table.pick_number] }),
    }),
);
