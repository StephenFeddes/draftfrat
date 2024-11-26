import { eq, desc, asc, and, inArray } from "drizzle-orm";
import { DraftPlayerQueueRepository } from "../../../../contracts";
import { db } from "../../connection";
import { draftPlayerQueueTable, footballPlayerTable, footballTeamTable, playerTable } from "../../schema";
import { FootballPlayer, FootballTeam, InjuryStatusEnum, Player, QueuedDraftPlayer } from "../../../../domain";

export class PostgresFootballDraftPlayerQueueRepository implements DraftPlayerQueueRepository {
    public async removePlayersFromQueue(draftId: number, userId: number, playerIds: number[]): Promise<void> {
        await db
            .delete(draftPlayerQueueTable)
            .where(
                and(
                    eq(draftPlayerQueueTable.draft_id, draftId),
                    eq(draftPlayerQueueTable.user_id, userId),
                    inArray(draftPlayerQueueTable.player_id, playerIds),
                ),
            )
            .execute();
    }

    public async removePlayerFromQueue(draftId: number, userId: number, playerId: number): Promise<void> {
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

    public async dequeuePlayer(draftId: number, userId: number): Promise<QueuedDraftPlayer | null> {
        await db.transaction(async (transaction) => {
            try {
                const topPriorityPlayerInfo = (
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
                            eq(draftPlayerQueueTable.player_id, topPriorityPlayerInfo.players.id),
                        ),
                    )
                    .execute();

                    return new QueuedDraftPlayer(
                        topPriorityPlayerInfo.draft_player_queues.draft_id,
                        topPriorityPlayerInfo.draft_player_queues.user_id,
                        topPriorityPlayerInfo.draft_player_queues.priority,
                        new FootballPlayer(
                            topPriorityPlayerInfo.players.id,
                            topPriorityPlayerInfo.players.first_name,
                            topPriorityPlayerInfo.players.last_name,
                            topPriorityPlayerInfo.players.average_draft_position
                                ? parseFloat(topPriorityPlayerInfo.players.average_draft_position)
                                : null,
                            topPriorityPlayerInfo.players.injury_status
                                ? (topPriorityPlayerInfo.players.injury_status as InjuryStatusEnum)
                                : null,
                            topPriorityPlayerInfo.players.years_experience
                                ? topPriorityPlayerInfo.players.years_experience
                                : 0,
                            topPriorityPlayerInfo.players.headshot_url,
                            new FootballTeam(
                                Number(topPriorityPlayerInfo.football_teams.id),
                                topPriorityPlayerInfo.football_teams.abbreviation,
                                Number(topPriorityPlayerInfo.football_teams.bye_week),
                            ),
                            topPriorityPlayerInfo.football_players.ppr_rank,
                            topPriorityPlayerInfo.football_players.half_ppr_rank,
                            topPriorityPlayerInfo.football_players.standard_rank,
                            topPriorityPlayerInfo.football_players.is_quarterback,
                            topPriorityPlayerInfo.football_players.is_running_back,
                            topPriorityPlayerInfo.football_players.is_wide_receiver,
                            topPriorityPlayerInfo.football_players.is_tight_end,
                            topPriorityPlayerInfo.football_players.is_kicker,
                            topPriorityPlayerInfo.football_players.is_defense,
                            topPriorityPlayerInfo.football_players.projected_rushing_attempts
                                ? Number(topPriorityPlayerInfo.football_players.projected_rushing_attempts)
                                : null,
                            topPriorityPlayerInfo.football_players.projected_rushing_yards
                                ? Number(topPriorityPlayerInfo.football_players.projected_rushing_yards)
                                : null,
                            topPriorityPlayerInfo.football_players.projected_rushing_touchdowns
                                ? Number(topPriorityPlayerInfo.football_players.projected_rushing_touchdowns)
                                : null,
                            topPriorityPlayerInfo.football_players.projected_targets
                                ? Number(topPriorityPlayerInfo.football_players.projected_targets)
                                : null,
                            topPriorityPlayerInfo.football_players.projected_receiving_yards
                                ? Number(topPriorityPlayerInfo.football_players.projected_receiving_yards)
                                : null,
                            topPriorityPlayerInfo.football_players.projected_receiving_touchdowns
                                ? Number(topPriorityPlayerInfo.football_players.projected_receiving_touchdowns)
                                : null,
                            topPriorityPlayerInfo.football_players.projected_passing_attempts
                                ? Number(topPriorityPlayerInfo.football_players.projected_passing_attempts)
                                : null,
                            topPriorityPlayerInfo.football_players.projected_passing_yards
                                ? Number(topPriorityPlayerInfo.football_players.projected_passing_yards)
                                : null,
                            topPriorityPlayerInfo.football_players.projected_passing_touchdowns
                                ? Number(topPriorityPlayerInfo.football_players.projected_passing_touchdowns)
                                : null,
                            topPriorityPlayerInfo.football_players.projected_standard_fantasy_points
                                ? Number(topPriorityPlayerInfo.football_players.projected_standard_fantasy_points)
                                : null,
                            topPriorityPlayerInfo.football_players.projected_half_ppr_fantasy_points
                                ? Number(topPriorityPlayerInfo.football_players.projected_half_ppr_fantasy_points)
                                : null,
                            topPriorityPlayerInfo.football_players.projected_ppr_fantasy_points
                                ? Number(topPriorityPlayerInfo.football_players.projected_ppr_fantasy_points)
                                : null,
                        ),
                    );
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

    public async getQueuedDraftPlayers(draftId: number): Promise<QueuedDraftPlayer[]> {
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
                    return new QueuedDraftPlayer(
                        row.draft_player_queues.draft_id,
                        row.draft_player_queues.user_id,
                        row.draft_player_queues.priority,
                        new FootballPlayer(
                            row.players.id,
                            row.players.first_name,
                            row.players.last_name,
                            row.players.average_draft_position ? parseFloat(row.players.average_draft_position) : null,
                            row.players.injury_status ? (row.players.injury_status as InjuryStatusEnum) : null,
                            row.players.years_experience ? row.players.years_experience : 0,
                            row.players.headshot_url,
                            new FootballTeam(
                                Number(row.football_teams.id),
                                row.football_teams.abbreviation,
                                Number(row.football_teams.bye_week),
                            ),
                            row.football_players.ppr_rank,
                            row.football_players.half_ppr_rank,
                            row.football_players.standard_rank,
                            row.football_players.is_quarterback,
                            row.football_players.is_running_back,
                            row.football_players.is_wide_receiver,
                            row.football_players.is_tight_end,
                            row.football_players.is_kicker,
                            row.football_players.is_defense,
                            row.football_players.projected_rushing_attempts
                                ? Number(row.football_players.projected_rushing_attempts)
                                : null,
                            row.football_players.projected_rushing_yards
                                ? Number(row.football_players.projected_rushing_yards)
                                : null,
                            row.football_players.projected_rushing_touchdowns
                                ? Number(row.football_players.projected_rushing_touchdowns)
                                : null,
                            row.football_players.projected_targets
                                ? Number(row.football_players.projected_targets)
                                : null,
                            row.football_players.projected_receiving_yards
                                ? Number(row.football_players.projected_receiving_yards)
                                : null,
                            row.football_players.projected_receiving_touchdowns
                                ? Number(row.football_players.projected_receiving_touchdowns)
                                : null,
                            row.football_players.projected_passing_attempts
                                ? Number(row.football_players.projected_passing_attempts)
                                : null,
                            row.football_players.projected_passing_yards
                                ? Number(row.football_players.projected_passing_yards)
                                : null,
                            row.football_players.projected_passing_touchdowns
                                ? Number(row.football_players.projected_passing_touchdowns)
                                : null,
                            row.football_players.projected_standard_fantasy_points
                                ? Number(row.football_players.projected_standard_fantasy_points)
                                : null,
                            row.football_players.projected_half_ppr_fantasy_points
                                ? Number(row.football_players.projected_half_ppr_fantasy_points)
                                : null,
                            row.football_players.projected_ppr_fantasy_points
                                ? Number(row.football_players.projected_ppr_fantasy_points)
                                : null,
                        ),
                    );
                });
            });
    }

    public async getQueuedDraftPlayersByUserId(draftId: number, userId: number): Promise<QueuedDraftPlayer[]> {
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
                    return new QueuedDraftPlayer(
                        row.draft_player_queues.draft_id,
                        row.draft_player_queues.user_id,
                        row.draft_player_queues.priority,
                        new FootballPlayer(
                            row.players.id,
                            row.players.first_name,
                            row.players.last_name,
                            row.players.average_draft_position ? parseFloat(row.players.average_draft_position) : null,
                            row.players.injury_status ? (row.players.injury_status as InjuryStatusEnum) : null,
                            row.players.years_experience ? row.players.years_experience : 0,
                            row.players.headshot_url,
                            new FootballTeam(
                                Number(row.football_teams.id),
                                row.football_teams.abbreviation,
                                Number(row.football_teams.bye_week),
                            ),
                            row.football_players.ppr_rank,
                            row.football_players.half_ppr_rank,
                            row.football_players.standard_rank,
                            row.football_players.is_quarterback,
                            row.football_players.is_running_back,
                            row.football_players.is_wide_receiver,
                            row.football_players.is_tight_end,
                            row.football_players.is_kicker,
                            row.football_players.is_defense,
                            row.football_players.projected_rushing_attempts
                                ? Number(row.football_players.projected_rushing_attempts)
                                : null,
                            row.football_players.projected_rushing_yards
                                ? Number(row.football_players.projected_rushing_yards)
                                : null,
                            row.football_players.projected_rushing_touchdowns
                                ? Number(row.football_players.projected_rushing_touchdowns)
                                : null,
                            row.football_players.projected_targets
                                ? Number(row.football_players.projected_targets)
                                : null,
                            row.football_players.projected_receiving_yards
                                ? Number(row.football_players.projected_receiving_yards)
                                : null,
                            row.football_players.projected_receiving_touchdowns
                                ? Number(row.football_players.projected_receiving_touchdowns)
                                : null,
                            row.football_players.projected_passing_attempts
                                ? Number(row.football_players.projected_passing_attempts)
                                : null,
                            row.football_players.projected_passing_yards
                                ? Number(row.football_players.projected_passing_yards)
                                : null,
                            row.football_players.projected_passing_touchdowns
                                ? Number(row.football_players.projected_passing_touchdowns)
                                : null,
                            row.football_players.projected_standard_fantasy_points
                                ? Number(row.football_players.projected_standard_fantasy_points)
                                : null,
                            row.football_players.projected_half_ppr_fantasy_points
                                ? Number(row.football_players.projected_half_ppr_fantasy_points)
                                : null,
                            row.football_players.projected_ppr_fantasy_points
                                ? Number(row.football_players.projected_ppr_fantasy_points)
                                : null,
                        ),
                    );
                });
            });
    }
}
