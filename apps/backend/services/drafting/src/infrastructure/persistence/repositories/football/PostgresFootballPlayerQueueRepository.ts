import { eq, desc, asc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { PlayerQueueRepository } from "../../../../interfaces";
import { db } from "../../connection";
import { draftPlayerQueueTable, footballPlayerTable, footballTeamTable, playerTable } from "../../tables";
import {
    FootballPlayer,
    FootballPlayerSchema,
    getEligibleFootballPositions,
    InjuryStatusEnum,
    QueuedPlayer,
    QueuedPlayerSchema,
    SportEnum,
} from "../../../../domain";

export class PostgresFootballPlayerQueueRepository implements PlayerQueueRepository {
    private readonly client: ReturnType<typeof drizzle>;

    constructor(pool: Pool) {
        this.client = drizzle({ client: pool });
    }

    public async removeDraftPlayerFromQueue(draftId: number, userId: number, playerId: number): Promise<void> {
        await db
            .delete(draftPlayerQueueTable)
            .where(
                and(
                    eq(draftPlayerQueueTable.draft_id, draftId),
                    eq(draftPlayerQueueTable.user_id, userId),
                    eq(draftPlayerQueueTable.player_id, playerId),
                ),
            )
            .execute();
    }

    public async enqueuePlayer(draftId: number, userId: number, playerId: number): Promise<void> {
        const lowestPriorityResult = await db
            .select({ priority: draftPlayerQueueTable.priority })
            .from(draftPlayerQueueTable)
            .where(eq(draftPlayerQueueTable.draft_id, draftId))
            .orderBy(desc(draftPlayerQueueTable.priority))
            .limit(1)
            .execute();
        const lowestPriority: number = lowestPriorityResult.length > 0 ? lowestPriorityResult[0].priority : 1;

        db.insert(draftPlayerQueueTable)
            .values({
                draft_id: draftId,
                user_id: userId,
                player_id: playerId,
                priority: lowestPriority + 1,
            })
            .execute();
    }

    public async dequeuePlayer(draftId: number, userId: number): Promise<QueuedPlayer | null> {
        await db.transaction(async (transaction) => {
            try {
                const result = (
                    await db
                        .select()
                        .from(draftPlayerQueueTable)
                        .innerJoin(playerTable, eq(draftPlayerQueueTable.player_id, playerTable.id))
                        .innerJoin(footballPlayerTable, eq(playerTable.id, footballPlayerTable.player_id))
                        .innerJoin(footballTeamTable, eq(footballPlayerTable.team_id, footballTeamTable.id))
                        .where(
                            and(eq(draftPlayerQueueTable.draft_id, draftId), eq(draftPlayerQueueTable.user_id, userId)),
                        )
                        .orderBy(asc(draftPlayerQueueTable.priority))
                        .limit(1)
                        .execute()
                )[0];

                await transaction
                    .delete(draftPlayerQueueTable)
                    .where(
                        and(
                            eq(draftPlayerQueueTable.draft_id, draftId),
                            eq(draftPlayerQueueTable.user_id, userId),
                            eq(draftPlayerQueueTable.player_id, result.players.id),
                        ),
                    )
                    .execute();

                const player: FootballPlayer = {
                    id: result.players.id,
                    firstName: result.players.first_name,
                    lastName: result.players.last_name,
                    averageDraftPosition: result.players.average_draft_position
                        ? parseFloat(result.players.average_draft_position)
                        : null,
                    injuryStatus: result.players.injury_status
                        ? (result.players.injury_status as InjuryStatusEnum)
                        : null,
                    yearsExperience: result.players.years_experience ?? 0,
                    headshotUrl: result.players.headshot_url,
                    team: result.football_teams
                        ? {
                              id: result.football_teams.id,
                              abbreviation: result.football_teams.abbreviation,
                              byeWeek: result.football_teams.bye_week,
                              sport: SportEnum.FOOTBALL,
                          }
                        : null,
                    pprRank: result.football_players.ppr_rank,
                    halfPprRank: result.football_players.half_ppr_rank,
                    standardRank: result.football_players.standard_rank,
                    projectedRushingAttempts: result.football_players.projected_rushing_attempts
                        ? parseFloat(result.football_players.projected_rushing_attempts)
                        : null,
                    projectedRushingYards: result.football_players.projected_rushing_yards
                        ? parseFloat(result.football_players.projected_rushing_yards)
                        : null,
                    projectedRushingTouchdowns: result.football_players.projected_rushing_touchdowns
                        ? Number(result.football_players.projected_rushing_touchdowns)
                        : null,
                    projectedTargets: result.football_players.projected_targets
                        ? Number(result.football_players.projected_targets)
                        : null,
                    projectedReceivingYards: result.football_players.projected_receiving_yards
                        ? Number(result.football_players.projected_receiving_yards)
                        : null,
                    projectedReceivingTouchdowns: result.football_players.projected_receiving_touchdowns
                        ? Number(result.football_players.projected_receiving_touchdowns)
                        : null,
                    projectedPassingAttempts: result.football_players.projected_passing_attempts
                        ? Number(result.football_players.projected_passing_attempts)
                        : null,
                    projectedPassingYards: result.football_players.projected_passing_yards
                        ? Number(result.football_players.projected_passing_yards)
                        : null,
                    projectedPassingTouchdowns: result.football_players.projected_passing_touchdowns
                        ? Number(result.football_players.projected_passing_touchdowns)
                        : null,
                    projectedStandardFantasyPoints: result.football_players.projected_standard_fantasy_points
                        ? Number(result.football_players.projected_standard_fantasy_points)
                        : null,
                    projectedHalfPprFantasyPoints: result.football_players.projected_half_ppr_fantasy_points
                        ? Number(result.football_players.projected_half_ppr_fantasy_points)
                        : null,
                    projectedPprFantasyPoints: result.football_players.projected_ppr_fantasy_points
                        ? Number(result.football_players.projected_ppr_fantasy_points)
                        : null,
                    positions: getEligibleFootballPositions(
                        result.football_players.is_quarterback,
                        result.football_players.is_running_back,
                        result.football_players.is_wide_receiver,
                        result.football_players.is_tight_end,
                        result.football_players.is_kicker,
                        result.football_players.is_defense,
                    ),
                };

                const queuedPlayer: QueuedPlayer = {
                    draftId: result.draft_player_queues.draft_id,
                    userId: result.draft_player_queues.user_id,
                    priority: result.draft_player_queues.priority,
                    player: player,
                };

                // Validate the queued player data.
                QueuedPlayerSchema.parse(queuedPlayer);

                return queuedPlayer;
            } catch {
                await transaction.rollback();
                return null;
            }
        });
        return null;
    }

    public async swapQueuedPlayerPriorities(
        draftId: number,
        userId: number,
        playerId1: number,
        playerId2: number,
    ): Promise<void> {
        await db.transaction(async (transaction) => {
            try {
                const player1 = (
                    await db
                        .select({ priority: draftPlayerQueueTable.priority })
                        .from(draftPlayerQueueTable)
                        .where(
                            and(
                                eq(draftPlayerQueueTable.draft_id, draftId),
                                eq(draftPlayerQueueTable.user_id, userId),
                                eq(draftPlayerQueueTable.player_id, playerId1),
                            ),
                        )
                        .execute()
                )[0];
                const player2 = (
                    await db
                        .select({ priority: draftPlayerQueueTable.priority })
                        .from(draftPlayerQueueTable)
                        .where(
                            and(
                                eq(draftPlayerQueueTable.draft_id, draftId),
                                eq(draftPlayerQueueTable.user_id, userId),
                                eq(draftPlayerQueueTable.player_id, playerId2),
                            ),
                        )
                        .execute()
                )[0];

                if (!player1 || !player2) throw new Error("Players not found in queue");

                await transaction
                    .update(draftPlayerQueueTable)
                    .set({ priority: player2.priority })
                    .where(
                        and(
                            eq(draftPlayerQueueTable.draft_id, draftId),
                            eq(draftPlayerQueueTable.user_id, userId),
                            eq(draftPlayerQueueTable.player_id, playerId1),
                        ),
                    )
                    .execute();

                await transaction
                    .update(draftPlayerQueueTable)
                    .set({ priority: player1.priority })
                    .where(
                        and(
                            eq(draftPlayerQueueTable.draft_id, draftId),
                            eq(draftPlayerQueueTable.user_id, userId),
                            eq(draftPlayerQueueTable.player_id, playerId2),
                        ),
                    )
                    .execute();
            } catch {
                await transaction.rollback();
            }
        });
    }

    public async getQueuedDraftPlayers(draftId: number): Promise<QueuedPlayer[]> {
        return db
            .select()
            .from(draftPlayerQueueTable)
            .innerJoin(playerTable, eq(draftPlayerQueueTable.player_id, playerTable.id))
            .innerJoin(footballPlayerTable, eq(playerTable.id, footballPlayerTable.player_id))
            .innerJoin(footballTeamTable, eq(footballPlayerTable.team_id, footballTeamTable.id))
            .where(eq(draftPlayerQueueTable.draft_id, draftId))
            .orderBy(asc(draftPlayerQueueTable.priority))
            .execute()
            .then((rows) => {
                return rows.map((row) => {
                    const player: FootballPlayer = {
                        id: row.players.id,
                        firstName: row.players.first_name,
                        lastName: row.players.last_name,
                        averageDraftPosition: row.players.average_draft_position
                            ? parseFloat(row.players.average_draft_position)
                            : null,
                        injuryStatus: row.players.injury_status
                            ? (row.players.injury_status as InjuryStatusEnum)
                            : null,
                        yearsExperience: row.players.years_experience ?? 0,
                        headshotUrl: row.players.headshot_url,
                        team: {
                            id: row.football_teams.id,
                            abbreviation: row.football_teams.abbreviation,
                            byeWeek: row.football_teams.bye_week,
                            sport: SportEnum.FOOTBALL,
                        },
                        pprRank: row.football_players.ppr_rank,
                        halfPprRank: row.football_players.half_ppr_rank,
                        standardRank: row.football_players.standard_rank,
                        projectedRushingAttempts: row.football_players.projected_rushing_attempts
                            ? parseFloat(row.football_players.projected_rushing_attempts)
                            : null,
                        projectedRushingYards: row.football_players.projected_rushing_yards
                            ? parseFloat(row.football_players.projected_rushing_yards)
                            : null,
                        projectedRushingTouchdowns: row.football_players.projected_rushing_touchdowns
                            ? Number(row.football_players.projected_rushing_touchdowns)
                            : null,
                        projectedTargets: row.football_players.projected_targets
                            ? Number(row.football_players.projected_targets)
                            : null,
                        projectedReceivingYards: row.football_players.projected_receiving_yards
                            ? Number(row.football_players.projected_receiving_yards)
                            : null,
                        projectedReceivingTouchdowns: row.football_players.projected_receiving_touchdowns
                            ? Number(row.football_players.projected_receiving_touchdowns)
                            : null,
                        projectedPassingAttempts: row.football_players.projected_passing_attempts
                            ? Number(row.football_players.projected_passing_attempts)
                            : null,
                        projectedPassingYards: row.football_players.projected_passing_yards
                            ? Number(row.football_players.projected_passing_yards)
                            : null,
                        projectedPassingTouchdowns: row.football_players.projected_passing_touchdowns
                            ? Number(row.football_players.projected_passing_touchdowns)
                            : null,
                        projectedStandardFantasyPoints: row.football_players.projected_standard_fantasy_points
                            ? Number(row.football_players.projected_standard_fantasy_points)
                            : null,
                        projectedHalfPprFantasyPoints: row.football_players.projected_half_ppr_fantasy_points
                            ? Number(row.football_players.projected_half_ppr_fantasy_points)
                            : null,
                        projectedPprFantasyPoints: row.football_players.projected_ppr_fantasy_points
                            ? Number(row.football_players.projected_ppr_fantasy_points)
                            : null,
                        positions: getEligibleFootballPositions(
                            row.football_players.is_quarterback,
                            row.football_players.is_running_back,
                            row.football_players.is_wide_receiver,
                            row.football_players.is_tight_end,
                            row.football_players.is_kicker,
                            row.football_players.is_defense,
                        ),
                    };
                    const queuedPlayer: QueuedPlayer = {
                        draftId: row.draft_player_queues.draft_id,
                        userId: row.draft_player_queues.user_id,
                        priority: row.draft_player_queues.priority,
                        player: player,
                    };

                    // Validate the queued player data.
                    FootballPlayerSchema.parse(player);
                    QueuedPlayerSchema.parse(queuedPlayer);

                    return queuedPlayer;
                });
            });
    }

    public async getQueuedDraftPlayersByUserId(draftId: number, userId: number): Promise<QueuedPlayer[]> {
        return db
            .select()
            .from(draftPlayerQueueTable)
            .innerJoin(playerTable, eq(draftPlayerQueueTable.player_id, playerTable.id))
            .innerJoin(footballPlayerTable, eq(playerTable.id, footballPlayerTable.player_id))
            .innerJoin(footballTeamTable, eq(footballPlayerTable.team_id, footballTeamTable.id))
            .where(and(eq(draftPlayerQueueTable.draft_id, draftId), eq(draftPlayerQueueTable.user_id, userId)))
            .orderBy(asc(draftPlayerQueueTable.priority))
            .execute()
            .then((rows) => {
                return rows.map((row) => {
                    const player: FootballPlayer = {
                        id: row.players.id,
                        firstName: row.players.first_name,
                        lastName: row.players.last_name,
                        averageDraftPosition: row.players.average_draft_position
                            ? parseFloat(row.players.average_draft_position)
                            : null,
                        injuryStatus: row.players.injury_status
                            ? (row.players.injury_status as InjuryStatusEnum)
                            : null,
                        yearsExperience: row.players.years_experience ?? 0,
                        headshotUrl: row.players.headshot_url,
                        team: {
                            id: row.football_teams.id,
                            abbreviation: row.football_teams.abbreviation,
                            byeWeek: row.football_teams.bye_week,
                            sport: SportEnum.FOOTBALL,
                        },
                        pprRank: row.football_players.ppr_rank,
                        halfPprRank: row.football_players.half_ppr_rank,
                        standardRank: row.football_players.standard_rank,
                        projectedRushingAttempts: row.football_players.projected_rushing_attempts
                            ? parseFloat(row.football_players.projected_rushing_attempts)
                            : null,
                        projectedRushingYards: row.football_players.projected_rushing_yards
                            ? parseFloat(row.football_players.projected_rushing_yards)
                            : null,
                        projectedRushingTouchdowns: row.football_players.projected_rushing_touchdowns
                            ? Number(row.football_players.projected_rushing_touchdowns)
                            : null,
                        projectedTargets: row.football_players.projected_targets
                            ? Number(row.football_players.projected_targets)
                            : null,
                        projectedReceivingYards: row.football_players.projected_receiving_yards
                            ? Number(row.football_players.projected_receiving_yards)
                            : null,
                        projectedReceivingTouchdowns: row.football_players.projected_receiving_touchdowns
                            ? Number(row.football_players.projected_receiving_touchdowns)
                            : null,
                        projectedPassingAttempts: row.football_players.projected_passing_attempts
                            ? Number(row.football_players.projected_passing_attempts)
                            : null,
                        projectedPassingYards: row.football_players.projected_passing_yards
                            ? Number(row.football_players.projected_passing_yards)
                            : null,
                        projectedPassingTouchdowns: row.football_players.projected_passing_touchdowns
                            ? Number(row.football_players.projected_passing_touchdowns)
                            : null,
                        projectedStandardFantasyPoints: row.football_players.projected_standard_fantasy_points
                            ? Number(row.football_players.projected_standard_fantasy_points)
                            : null,
                        projectedHalfPprFantasyPoints: row.football_players.projected_half_ppr_fantasy_points
                            ? Number(row.football_players.projected_half_ppr_fantasy_points)
                            : null,
                        projectedPprFantasyPoints: row.football_players.projected_ppr_fantasy_points
                            ? Number(row.football_players.projected_ppr_fantasy_points)
                            : null,
                        positions: getEligibleFootballPositions(
                            row.football_players.is_quarterback,
                            row.football_players.is_running_back,
                            row.football_players.is_wide_receiver,
                            row.football_players.is_tight_end,
                            row.football_players.is_kicker,
                            row.football_players.is_defense,
                        ),
                    };

                    const queuedPlayer: QueuedPlayer = {
                        draftId: row.draft_player_queues.draft_id,
                        userId: row.draft_player_queues.user_id,
                        priority: row.draft_player_queues.priority,
                        player: player,
                    };

                    // Validate the queued player data.
                    FootballPlayerSchema.parse(player);
                    QueuedPlayerSchema.parse(queuedPlayer);

                    return queuedPlayer;
                });
            });
    }
}
