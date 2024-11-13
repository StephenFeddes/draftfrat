import fs from "fs";
import csv from "csv-parser";
import { count } from "drizzle-orm";
import { playerTable, footballPlayerTable, footballTeamTable } from "../schema/schema";
import { db } from "../connection";

async function seedFootballTeamTable() {
    const rowCount: number = (await db.select({ count: count() }).from(footballTeamTable))[0].count;

    if (rowCount > 0) {
        console.log("Football teams table already has data, skipping seeding.");
        return;
    }

    const rows: any[] = [];
    await new Promise<void>((resolve, reject) => {
        fs.createReadStream("./dist/infrastructure/database/seeds/football_teams.csv")
            .pipe(csv())
            .on("data", (row) => {
                rows.push({
                    id: parseInt(row.id, 10),
                    abbreviation: row.abbreviation,
                    bye_week: parseInt(row.bye_week, 10),
                });
            })
            .on("end", async () => {
                try {
                    await db.insert(footballTeamTable).values(rows as any);
                    console.log("Football teams seeded successfully!");
                    resolve();
                } catch (error) {
                    console.error("Error inserting football teams data:", error);
                    reject(error);
                }
            });
    });
}

async function seedPlayerTable() {
    const rowCount: number = (await db.select({ count: count() }).from(playerTable))[0].count;

    if (rowCount > 0) {
        console.log("Players table already has data, skipping seeding.");
        return;
    }

    const rows: any[] = [];
    await new Promise<void>((resolve, reject) => {
        fs.createReadStream("./dist/infrastructure/database/seeds/players.csv")
            .pipe(csv())
            .on("data", (row) => {
                rows.push({
                    id: parseInt(row.id, 10),
                    average_draft_position:
                        row.average_draft_position.length > 0
                            ? parseFloat(row.average_draft_position)
                            : null,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    injury_status: row.injury_status || null,
                    years_experience:
                        row.years_experience.length > 0 ? parseInt(row.years_experience, 10) : null,
                    headshot_url: row.headshot_url,
                });
            })
            .on("end", async () => {
                try {
                    await db.insert(playerTable).values(rows as any);
                    console.log("Players seeded successfully!");
                    resolve();
                } catch (error) {
                    console.error("Error inserting players data:", error);
                    reject(error);
                }
            });
    });
}

async function seedFootballPlayerTable() {
    const rowCount: number = (await db.select({ count: count() }).from(footballPlayerTable))[0]
        .count;

    if (rowCount > 0) {
        console.log("Football players table already has data, skipping seeding.");
        return;
    }

    const rows: any[] = [];
    await new Promise<void>((resolve, reject) => {
        fs.createReadStream("./dist/infrastructure/database/seeds/football_players.csv")
            .pipe(csv())
            .on("data", (row) => {
                rows.push({
                    player_id: parseInt(row.player_id, 10),
                    team_id: parseInt(row.team_id, 10),
                    ppr_rank: parseInt(row.ppr_rank, 10),
                    half_ppr_rank: parseInt(row.half_ppr_rank, 10),
                    standard_rank: parseInt(row.standard_rank, 10),
                    is_quarterback: row.is_quarterback === "True",
                    is_running_back: row.is_running_back === "True",
                    is_wide_receiver: row.is_wide_receiver === "True",
                    is_tight_end: row.is_tight_end === "True",
                    is_kicker: row.is_kicker === "True",
                    is_defense: row.is_defense === "True",
                    projected_rushing_attempts:
                        row.projected_rushing_attempts.length > 0
                            ? parseFloat(row.projected_rushing_attempts)
                            : null,
                    projected_rushing_yards:
                        row.projected_rushing_yards.length > 0
                            ? parseFloat(row.projected_rushing_yards)
                            : null,
                    projected_rushing_touchdowns:
                        row.projected_rushing_touchdowns.length > 0
                            ? parseFloat(row.projected_rushing_touchdowns)
                            : null,
                    projected_targets:
                        row.projected_targets.length > 0 ? parseFloat(row.projected_targets) : null,
                    projected_receiving_yards:
                        row.projected_receiving_yards.length > 0
                            ? parseFloat(row.projected_receiving_yards)
                            : null,
                    projected_receiving_touchdowns:
                        row.projected_receiving_touchdowns.length > 0
                            ? parseFloat(row.projected_receiving_touchdowns)
                            : null,
                    projected_passing_attempts:
                        row.projected_passing_attempts.length > 0
                            ? parseFloat(row.projected_passing_attempts)
                            : null,
                    projected_passing_yards:
                        row.projected_passing_yards.length > 0
                            ? parseFloat(row.projected_passing_yards)
                            : null,
                    projected_passing_touchdowns:
                        row.projected_passing_touchdowns.length > 0
                            ? parseFloat(row.projected_passing_touchdowns)
                            : null,
                    projected_standard_fantasy_points:
                        row.projected_standard_fantasy_points.length > 0
                            ? parseFloat(row.projected_standard_fantasy_points)
                            : null,
                    projected_half_ppr_fantasy_points:
                        row.projected_half_ppr_fantasy_points.length > 0
                            ? parseFloat(row.projected_half_ppr_fantasy_points)
                            : null,
                    projected_ppr_fantasy_points:
                        row.projected_ppr_fantasy_points.length > 0
                            ? parseFloat(row.projected_ppr_fantasy_points)
                            : null,
                });
            })
            .on("end", async () => {
                try {
                    await db.insert(footballPlayerTable).values(rows as any);
                    console.log("Football players seeded successfully!");
                    resolve();
                } catch (error) {
                    console.error("Error inserting football players data:", error);
                    reject(error);
                }
            });
    });
}

// Function to seed data
export async function seedDatabase() {
    await seedFootballTeamTable();
    await seedPlayerTable();
    await seedFootballPlayerTable();
}
