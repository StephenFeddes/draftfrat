import { eq } from "drizzle-orm";
import { db } from "../connection";
import { DraftOrder } from "../../../domain/value-objects/draft-order/DraftOrder";
import { draftTable, draftPickTable, draftUserTable, footballDraftTable } from "../schema/schema";
import { FootballDraftSettings } from "../../../domain/value-objects/football-draft-settings/FootballDraftSettings";
import { DraftOrderEnum } from "../../../domain/enums/DraftOrderEnum";
import { DraftRepository } from "../../../contracts/repositories/DraftRepository";
import { SportEnum } from "../../../domain/enums/SportEnum";
import { ScoringEnum } from "../../../domain/enums/ScoringEnum";

export class PostgresFootballDraftRepository implements DraftRepository {
    async startDraft(draftId: number): Promise<void> {
        await db
            .update(draftTable)
            .set({ is_started: true })
            .where(eq(draftTable.id, draftId))
            .execute();
    }

    async getDraftSettings(draftId: number): Promise<FootballDraftSettings | null> {
        const result = await db
            .select({
                order_type: draftTable.order_type,
                sport: draftTable.sport,
                team_count: draftTable.team_count,
                pick_time_limit: draftTable.pick_time_limit,
                scoring_type: draftTable.scoring_type,
                is_started: draftTable.is_started,
                created_at: draftTable.created_at,
                quarterback_spots_count: footballDraftTable.quarterback_spots_count,
                running_back_spots_count: footballDraftTable.running_back_spots_count,
                wide_receiver_spots_count: footballDraftTable.wide_receiver_spots_count,
                tight_end_spots_count: footballDraftTable.tight_end_spots_count,
                flex_spots_count: footballDraftTable.flex_spots_count,
                bench_spots_count: footballDraftTable.bench_spots_count,
                kicker_spots_count: footballDraftTable.kicker_spots_count,
                defense_spots_count: footballDraftTable.defense_spots_count,
            })
            .from(footballDraftTable)
            .innerJoin(draftTable, eq(draftTable.id, footballDraftTable.draft_id))
            .where(eq(footballDraftTable.draft_id, draftId))
            .execute();

        // Check if result is empty
        if (!result || result.length === 0) {
            return null; // Return null if no draft settings found
        }

        const settings = result[0];
        return new FootballDraftSettings(
            settings.order_type as DraftOrderEnum,
            settings.sport as SportEnum,
            settings.scoring_type as ScoringEnum,
            settings.team_count,
            settings.pick_time_limit,
            settings.is_started ?? false,
            settings.created_at,
            settings.quarterback_spots_count,
            settings.running_back_spots_count,
            settings.wide_receiver_spots_count,
            settings.tight_end_spots_count,
            settings.flex_spots_count,
            settings.bench_spots_count,
            settings.kicker_spots_count,
            settings.defense_spots_count,
        );
    }

    async createDraft(creatorId: number, settings: FootballDraftSettings): Promise<void> {
        await db.transaction(async (transaction) => {
            try {
                const draftId: number = await transaction
                    .insert(draftTable)
                    .values({
                        order_type: settings.orderType,
                        sport: settings.sport,
                        team_count: settings.teamCount,
                        pick_time_limit: settings.pickTimeLimit,
                        scoring_type: settings.scoringType,
                        created_at: new Date().toISOString(),
                    })
                    .returning({ id: draftTable.id })
                    .execute()
                    .then((result) => result[0]?.id);

                if (!draftId) throw new Error("Failed to create draft");

                await transaction
                    .insert(footballDraftTable)
                    .values({
                        draft_id: draftId,
                        quarterback_spots_count: settings.quarterbackSpotsCount,
                        running_back_spots_count: settings.runningBackSpotsCount,
                        wide_receiver_spots_count: settings.wideReceiverSpotsCount,
                        tight_end_spots_count: settings.tightEndSpotsCount,
                        flex_spots_count: settings.flexSpotsCount,
                        bench_spots_count: settings.benchSpotsCount,
                        kicker_spots_count: settings.kickerSpotsCount,
                        defense_spots_count: settings.defenseSpotsCount,
                    })
                    .execute();

                const playerCountPerTeam: number =
                    settings.quarterbackSpotsCount +
                    settings.runningBackSpotsCount +
                    settings.wideReceiverSpotsCount +
                    settings.tightEndSpotsCount +
                    settings.flexSpotsCount +
                    settings.benchSpotsCount +
                    settings.kickerSpotsCount +
                    settings.defenseSpotsCount;

                const draftOrder: number[] = new DraftOrder(
                    settings.orderType as DraftOrderEnum,
                    playerCountPerTeam,
                    settings.teamCount,
                ).generateDraftOrder();

                await transaction
                    .insert(draftPickTable)
                    .values(
                        draftOrder.map((teamNumber, index) => ({
                            draft_id: draftId,
                            picked_by_user_id: null,
                            player_id: null,
                            picked_by_team_number: teamNumber,
                            pick_number: index + 1,
                        })),
                    )
                    .execute();

                await transaction
                    .insert(draftUserTable)
                    .values({
                        draft_id: draftId,
                        user_id: creatorId,
                        team_number: null,
                        is_auto_drafting: false,
                        is_admin: true,
                    })
                    .execute();
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        });
    }
}
