import { and, eq, notInArray, asc, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { db } from "../../connection";
import { PickRepository } from "../../../../interfaces";
import { footballTeamTable, footballPlayerTable, playerTable, draftPickTable, draftTable } from "../../tables";
import {
    InjuryStatusEnum,
    FootballPlayer,
    DraftPick,
    ScoringEnum,
    DraftPickSchema,
    SportEnum,
    getEligibleFootballPositions,
    FootballPlayerSchema,
} from "../../../../domain";

export class PostgresFootballPickRepository implements PickRepository {
    private readonly client: ReturnType<typeof drizzle>;

    constructor(pool: Pool) {
        this.client = drizzle({ client: pool });
    }

    public async getCurrentDraftPick(draftId: number): Promise<DraftPick | null> {
        this.client
            .select()
            .from(draftPickTable)
            .where(and(eq(draftPickTable.draft_id, draftId), isNull(draftPickTable.player_id)))
            .orderBy(asc(draftPickTable.pick_number))
            .limit(1)
            .execute()
            .then((rows) => {
                if (rows.length === 0) {
                    return null;
                }

                const row = rows[0];

                const draftPick: DraftPick = {
                    draftId: Number(row.draft_id),
                    pickNumber: Number(row.pick_number),
                    teamNumber: row.team_number,
                    player: null,
                };

                DraftPickSchema.parse(draftPick);

                return draftPick;
            });
        return null;
    }

    public async getPlayerById(playerId: number): Promise<FootballPlayer | null> {
        const result = await this.client
            .select()
            .from(playerTable)
            .innerJoin(footballPlayerTable, eq(playerTable.id, footballPlayerTable.player_id))
            .innerJoin(footballTeamTable, eq(footballPlayerTable.team_id, footballTeamTable.id))
            .where(eq(playerTable.id, playerId))
            .execute();

        if (result.length === 0) {
            return null;
        }

        const player: FootballPlayer = {
            id: result[0].players.id,
            firstName: result[0].players.first_name,
            lastName: result[0].players.last_name,
            averageDraftPosition: result[0].players.average_draft_position
                ? parseFloat(result[0].players.average_draft_position)
                : null,
            injuryStatus: result[0].players.injury_status
                ? (result[0].players.injury_status as InjuryStatusEnum)
                : null,
            yearsExperience: result[0].players.years_experience ?? 0,
            headshotUrl: result[0].players.headshot_url,
            team: {
                id: result[0].football_teams.id,
                abbreviation: result[0].football_teams.abbreviation,
                byeWeek: result[0].football_teams.bye_week,
                sport: SportEnum.FOOTBALL,
            },
            pprRank: result[0].football_players.ppr_rank,
            halfPprRank: result[0].football_players.half_ppr_rank,
            standardRank: result[0].football_players.standard_rank,
            projectedRushingAttempts: result[0].football_players.projected_rushing_attempts
                ? parseFloat(result[0].football_players.projected_rushing_attempts)
                : null,
            projectedRushingYards: result[0].football_players.projected_rushing_yards
                ? parseFloat(result[0].football_players.projected_rushing_yards)
                : null,
            projectedRushingTouchdowns: result[0].football_players.projected_rushing_touchdowns
                ? Number(result[0].football_players.projected_rushing_touchdowns)
                : null,
            projectedTargets: result[0].football_players.projected_targets
                ? Number(result[0].football_players.projected_targets)
                : null,
            projectedReceivingYards: result[0].football_players.projected_receiving_yards
                ? Number(result[0].football_players.projected_receiving_yards)
                : null,
            projectedReceivingTouchdowns: result[0].football_players.projected_receiving_touchdowns
                ? Number(result[0].football_players.projected_receiving_touchdowns)
                : null,
            projectedPassingAttempts: result[0].football_players.projected_passing_attempts
                ? Number(result[0].football_players.projected_passing_attempts)
                : null,
            projectedPassingYards: result[0].football_players.projected_passing_yards
                ? Number(result[0].football_players.projected_passing_yards)
                : null,
            projectedPassingTouchdowns: result[0].football_players.projected_passing_touchdowns
                ? Number(result[0].football_players.projected_passing_touchdowns)
                : null,
            projectedStandardFantasyPoints: result[0].football_players.projected_standard_fantasy_points
                ? Number(result[0].football_players.projected_standard_fantasy_points)
                : null,
            projectedHalfPprFantasyPoints: result[0].football_players.projected_half_ppr_fantasy_points
                ? Number(result[0].football_players.projected_half_ppr_fantasy_points)
                : null,
            projectedPprFantasyPoints: result[0].football_players.projected_ppr_fantasy_points
                ? Number(result[0].football_players.projected_ppr_fantasy_points)
                : null,
            positions: getEligibleFootballPositions(
                result[0].football_players.is_quarterback,
                result[0].football_players.is_running_back,
                result[0].football_players.is_wide_receiver,
                result[0].football_players.is_tight_end,
                result[0].football_players.is_kicker,
                result[0].football_players.is_defense,
            ),
        };

        // Validate the queued player data.
        FootballPlayerSchema.parse(player);

        return player;
    }

    public async pickPlayer(draftId: number, playerId: number, pickNumber: number, teamNumber: number): Promise<void> {
        await this.client
            .update(draftPickTable)
            .set({ player_id: playerId })
            .where(
                and(
                    eq(draftPickTable.draft_id, draftId),
                    eq(draftPickTable.pick_number, pickNumber),
                    eq(draftPickTable.team_number, teamNumber),
                ),
            );
    }

    public async getDraftPicks(draftId: number): Promise<DraftPick[]> {
        return (
            await db
                .select()
                .from(draftPickTable)
                .where(eq(draftPickTable.draft_id, draftId))
                .leftJoin(playerTable, eq(draftPickTable.player_id, playerTable.id))
                .leftJoin(footballPlayerTable, eq(playerTable.id, footballPlayerTable.player_id))
                .leftJoin(footballTeamTable, eq(footballPlayerTable.team_id, footballTeamTable.id))
                .orderBy(draftPickTable.pick_number)
                .execute()
        ).map((row) => {
            const player: FootballPlayer | null =
                row.players && row.football_players
                    ? {
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
                          team: row.football_teams
                              ? {
                                    id: row.football_teams.id,
                                    abbreviation: row.football_teams.abbreviation,
                                    byeWeek: row.football_teams.bye_week,
                                    sport: SportEnum.FOOTBALL,
                                }
                              : null,
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
                      }
                    : null;

            const draftPick: DraftPick = {
                draftId: Number(row.draft_picks.draft_id),
                pickNumber: Number(row.draft_picks.pick_number),
                teamNumber: row.draft_picks.team_number,
                player: player,
            };

            return draftPick;
        });
    }

    public async getAvailablePlayers(draftId: number): Promise<FootballPlayer[]> {
        // Fetch the draft settings to determine the scoring type
        const draft = await this.client
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
            await this.client
                .select()
                .from(playerTable)
                .innerJoin(footballPlayerTable, eq(playerTable.id, footballPlayerTable.player_id))
                .innerJoin(footballTeamTable, eq(footballPlayerTable.team_id, footballTeamTable.id))
                .where(
                    notInArray(
                        playerTable.id,
                        this.client
                            .select({ playerId: draftPickTable.player_id })
                            .from(draftPickTable)
                            .where(eq(draftPickTable.draft_id, draftId)),
                    ),
                )
                .orderBy(orderByField) // Dynamically set the order by the scoring type
                .execute()
        ).map((row) => {
            const player: FootballPlayer = {
                id: row.players.id,
                firstName: row.players.first_name,
                lastName: row.players.last_name,
                averageDraftPosition: row.players.average_draft_position
                    ? parseFloat(row.players.average_draft_position)
                    : null,
                injuryStatus: row.players.injury_status ? (row.players.injury_status as InjuryStatusEnum) : null,
                yearsExperience: row.players.years_experience ?? 0,
                headshotUrl: row.players.headshot_url,
                team: row.football_teams
                    ? {
                          id: row.football_teams.id,
                          abbreviation: row.football_teams.abbreviation,
                          byeWeek: row.football_teams.bye_week,
                          sport: SportEnum.FOOTBALL,
                      }
                    : null,
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

            // Validate the player data.
            FootballPlayerSchema.parse(player);

            return player;
        });
    }
}
