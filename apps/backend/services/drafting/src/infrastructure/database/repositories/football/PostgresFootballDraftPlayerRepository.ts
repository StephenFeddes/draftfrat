import { and, eq, notInArray, asc, isNull } from "drizzle-orm";
import { db } from "../../connection";
import { DraftPlayerRepository } from "../../../../contracts";
import { footballTeamTable, footballPlayerTable, playerTable, draftPickTable, draftTable, draftPlayerQueueTable } from "../../schema";
import { InjuryStatusEnum, FootballTeam, FootballPlayer, DraftPick, ScoringEnum } from "../../../../domain";

export class PostgresFootballDraftPlayerRepository implements DraftPlayerRepository {
    public async getCurrentDraftPick(draftId: number): Promise<DraftPick | null> {
        db.select()
            .from(draftPickTable)
            .where(and(eq(draftPickTable.draft_id, draftId), isNull(draftPickTable.player_id)))
            .orderBy(asc(draftPickTable.pick_number))
            .limit(1)
            .execute()
            .then((rows) => {
                if (rows.length === 0) {
                    return null;
                }

                return new DraftPick(
                    Number(rows[0].draft_id),
                    Number(rows[0].pick_number),
                    Number(rows[0].team_number),
                    null,
                );
            });
        return null;
    }

    public async getPlayerById(playerId: number): Promise<FootballPlayer | null> {
        db.select()
            .from(playerTable)
            .innerJoin(footballPlayerTable, eq(playerTable.id, footballPlayerTable.player_id))
            .innerJoin(footballTeamTable, eq(footballPlayerTable.team_id, footballTeamTable.id))
            .where(eq(playerTable.id, playerId))
            .execute()
            .then((result) => {
                if (result.length === 0) {
                    return null;
                }

                return new FootballPlayer(
                    Number(result[0].players.id),
                    result[0].players.first_name,
                    result[0].players.last_name,
                    result[0].players.average_draft_position
                        ? parseFloat(result[0].players.average_draft_position)
                        : null,
                    result[0].players.injury_status ? (result[0].players.injury_status as InjuryStatusEnum) : null,
                    result[0].players.years_experience ? result[0].players.years_experience : 0,
                    result[0].players.headshot_url,
                    new FootballTeam(
                        Number(result[0].football_teams.id),
                        result[0].football_teams.abbreviation,
                        Number(result[0].football_teams.bye_week),
                    ),
                    result[0].football_players.ppr_rank,
                    result[0].football_players.half_ppr_rank,
                    result[0].football_players.standard_rank,
                    result[0].football_players.is_quarterback,
                    result[0].football_players.is_running_back,
                    result[0].football_players.is_wide_receiver,
                    result[0].football_players.is_tight_end,
                    result[0].football_players.is_kicker,
                    result[0].football_players.is_defense,
                    result[0].football_players.projected_rushing_attempts
                        ? Number(result[0].football_players.projected_rushing_attempts)
                        : null,
                    result[0].football_players.projected_rushing_yards
                        ? Number(result[0].football_players.projected_rushing_yards)
                        : null,
                    result[0].football_players.projected_rushing_touchdowns
                        ? Number(result[0].football_players.projected_rushing_touchdowns)
                        : null,
                    result[0].football_players.projected_targets
                        ? Number(result[0].football_players.projected_targets)
                        : null,
                    result[0].football_players.projected_receiving_yards
                        ? Number(result[0].football_players.projected_receiving_yards)
                        : null,
                    result[0].football_players.projected_receiving_touchdowns
                        ? Number(result[0].football_players.projected_receiving_touchdowns)
                        : null,
                    result[0].football_players.projected_passing_attempts
                        ? Number(result[0].football_players.projected_passing_attempts)
                        : null,
                    result[0].football_players.projected_passing_yards
                        ? Number(result[0].football_players.projected_passing_yards)
                        : null,
                    result[0].football_players.projected_passing_touchdowns
                        ? Number(result[0].football_players.projected_passing_touchdowns)
                        : null,
                    result[0].football_players.projected_standard_fantasy_points
                        ? Number(result[0].football_players.projected_standard_fantasy_points)
                        : null,
                    result[0].football_players.projected_half_ppr_fantasy_points
                        ? Number(result[0].football_players.projected_half_ppr_fantasy_points)
                        : null,
                    result[0].football_players.projected_ppr_fantasy_points
                        ? Number(result[0].football_players.projected_ppr_fantasy_points)
                        : null,
                );
            });
        return null;
    }

    public async pickPlayer(draftId: number, playerId: number, pickNumber: number, teamNumber: number): Promise<void> {
        db.transaction(async (transaction) => {
            try {
                await transaction
                    .update(draftPickTable)
                    .set({ player_id: playerId })
                    .where(
                        and(
                            eq(draftPickTable.draft_id, draftId),
                            eq(draftPickTable.pick_number, pickNumber),
                            eq(draftPickTable.team_number, teamNumber),
                        ),
                    );

                await transaction.delete(draftPlayerQueueTable).where(eq(draftPlayerQueueTable.player_id, playerId));

            } catch (error) {
                throw new Error(`Failed to pick player with ID ${playerId} for draft with ID ${draftId}.`);
            }
        });
    }

    public async getDraftPicks(draftId: number): Promise<DraftPick[]> {
        db.select()
            .from(draftPickTable)
            .where(eq(draftPickTable.draft_id, draftId))
            .leftJoin(playerTable, eq(draftPickTable.player_id, playerTable.id))
            .leftJoin(footballPlayerTable, eq(playerTable.id, footballPlayerTable.player_id))
            .leftJoin(footballTeamTable, eq(footballPlayerTable.team_id, footballTeamTable.id))
            .orderBy(draftPickTable.pick_number)
            .execute()
            .then((rows) => {
                return rows.map((row) => {
                    return new DraftPick(
                        Number(row.draft_picks.draft_id),
                        Number(row.draft_picks.pick_number),
                        Number(row.draft_picks.team_number),
                        row.players && row.football_players
                            ? new FootballPlayer(
                                  Number(row.players.id),
                                  row.players.first_name,
                                  row.players.last_name,
                                  row.players.average_draft_position
                                      ? parseFloat(row.players.average_draft_position)
                                      : null,
                                  row.players.injury_status ? (row.players.injury_status as InjuryStatusEnum) : null,
                                  row.players.years_experience ? row.players.years_experience : 0,
                                  row.players.headshot_url,
                                  row.football_teams
                                      ? new FootballTeam(
                                            Number(row.football_teams.id),
                                            row.football_teams.abbreviation,
                                            Number(row.football_teams.bye_week),
                                        )
                                      : null,
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
                              )
                            : null,
                    );
                });
            });
        return [];
    }

    public async getAvailablePlayers(draftId: number): Promise<FootballPlayer[]> {
        // Fetch the draft settings to determine the scoring type
        const draft = await db
            .select({ scoringType: draftTable.scoring_type })
            .from(draftTable)
            .where(eq(draftTable.id, draftId))
            .execute();

        if (draft.length === 0) {
            throw new Error(`Draft with ID ${draftId} not found.`);
        }

        const { scoringType } = draft[0];

        // Determine the field to order by based on the scoring type
        let orderByField;
        if (scoringType === ScoringEnum.PPR) {
            orderByField = footballPlayerTable.ppr_rank;
        } else if (scoringType === ScoringEnum.STANDARD) {
            orderByField = footballPlayerTable.standard_rank;
        } else {
            orderByField = footballPlayerTable.half_ppr_rank; // Default to half_ppr if none matches
        }

        // Fetch the available players sorted by the determined field
        return (
            await db
                .select()
                .from(playerTable)
                .innerJoin(footballPlayerTable, eq(playerTable.id, footballPlayerTable.player_id))
                .innerJoin(footballTeamTable, eq(footballPlayerTable.team_id, footballTeamTable.id))
                .where(
                    notInArray(
                        playerTable.id,
                        db
                            .select({ playerId: draftPickTable.player_id })
                            .from(draftPickTable)
                            .where(eq(draftPickTable.draft_id, draftId)),
                    ),
                )
                .orderBy(orderByField) // Dynamically set the order by the scoring type
                .execute()
        ).map(
            (row) =>
                new FootballPlayer(
                    Number(row.players.id),
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
                    row.football_players.projected_targets ? Number(row.football_players.projected_targets) : null,
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
    }
}
