CREATE TABLE IF NOT EXISTS "draft_picks" (
	"draft_id" integer,
	"pick_number" integer,
	"player_id" integer,
	"picked_by_team_number" integer NOT NULL,
	CONSTRAINT "draft_picks_draft_id_pick_number_pk" PRIMARY KEY("draft_id","pick_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "drafts" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_type" varchar NOT NULL,
	"sport" varchar NOT NULL,
	"pick_time_limit" integer NOT NULL,
	"team_count" integer NOT NULL,
	"scoring_type" varchar NOT NULL,
	"created_at" varchar NOT NULL,
	"is_started" boolean DEFAULT false,
	"is_complete" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "draft_users" (
	"user_id" integer,
	"draft_id" integer,
	"team_name" varchar,
	"team_number" integer,
	"is_auto_drafting" boolean DEFAULT false,
	"is_admin" boolean DEFAULT false,
	CONSTRAINT "draft_users_user_id_draft_id_pk" PRIMARY KEY("user_id","draft_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "football_drafts" (
	"draft_id" integer,
	"quarterback_spots_count" integer NOT NULL,
	"running_back_spots_count" integer NOT NULL,
	"wide_receiver_spots_count" integer NOT NULL,
	"tight_end_spots_count" integer NOT NULL,
	"flex_spots_count" integer NOT NULL,
	"bench_spots_count" integer NOT NULL,
	"kicker_spots_count" integer NOT NULL,
	"defense_spots_count" integer NOT NULL,
	CONSTRAINT "football_drafts_draft_id_pk" PRIMARY KEY("draft_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "football_players" (
	"player_id" integer,
	"team_id" integer,
	"ppr_rank" integer NOT NULL,
	"half_ppr_rank" integer NOT NULL,
	"standard_rank" integer NOT NULL,
	"is_quarterback" boolean NOT NULL,
	"is_running_back" boolean NOT NULL,
	"is_wide_receiver" boolean NOT NULL,
	"is_tight_end" boolean NOT NULL,
	"is_kicker" boolean NOT NULL,
	"is_defense" boolean NOT NULL,
	"projected_rushing_attempts" numeric,
	"projected_rushing_yards" numeric,
	"projected_rushing_touchdowns" numeric,
	"projected_targets" numeric,
	"projected_receiving_yards" numeric,
	"projected_receiving_touchdowns" numeric,
	"projected_passing_attempts" numeric,
	"projected_passing_yards" numeric,
	"projected_passing_touchdowns" numeric,
	"projected_standard_fantasy_points" numeric,
	"projected_half_ppr_fantasy_points" numeric,
	"projected_ppr_fantasy_points" numeric,
	CONSTRAINT "football_players_player_id_pk" PRIMARY KEY("player_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "football_teams" (
	"id" integer PRIMARY KEY NOT NULL,
	"abbreviation" varchar NOT NULL,
	"bye_week" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"id" integer PRIMARY KEY NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"injury_status" varchar,
	"years_experience" integer DEFAULT 0,
	"headshot_url" varchar,
	"average_draft_position" numeric
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "draft_picks" ADD CONSTRAINT "draft_picks_draft_id_drafts_id_fk" FOREIGN KEY ("draft_id") REFERENCES "public"."drafts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "draft_picks" ADD CONSTRAINT "draft_picks_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "draft_users" ADD CONSTRAINT "draft_users_draft_id_drafts_id_fk" FOREIGN KEY ("draft_id") REFERENCES "public"."drafts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "football_drafts" ADD CONSTRAINT "football_drafts_draft_id_drafts_id_fk" FOREIGN KEY ("draft_id") REFERENCES "public"."drafts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "football_players" ADD CONSTRAINT "football_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "football_players" ADD CONSTRAINT "football_players_team_id_football_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."football_teams"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
