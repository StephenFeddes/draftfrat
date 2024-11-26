import { eq } from "drizzle-orm";
import { db } from "../../connection";
import { DraftRepository } from "../../../../contracts";
import { footballDraftTable, draftTable, draftUserTable, draftPickTable } from "../../schema";
import {
    ScoringEnum,
    SportEnum,
    DraftOrderEnum,
    FootballDraftSettings,
    DraftSettings,
    DraftPickOrderGeneratorFactory,
    DraftPick,
} from "../../../../domain";

export class PostgresFootballDraftRepository implements DraftRepository {
    public async updateDraftSettings(draftId: number, settings: DraftSettings): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async startDraft(draftId: number): Promise<void> {
        await db.update(draftTable).set({ is_started: true }).where(eq(draftTable.id, draftId)).execute();
    }

    public async getDraftSettings(draftId: number): Promise<FootballDraftSettings> {
        const settings = (
            await db
                .select()
                .from(footballDraftTable)
                .innerJoin(draftTable, eq(draftTable.id, footballDraftTable.draft_id))
                .where(eq(footballDraftTable.draft_id, draftId))
                .execute()
        )[0];

        return new FootballDraftSettings(
            settings.drafts.order_type as DraftOrderEnum,
            settings.drafts.scoring_type as ScoringEnum,
            settings.drafts.team_count,
            settings.drafts.pick_time_limit,
            settings.football_drafts.quarterback_spots_count,
            settings.football_drafts.running_back_spots_count,
            settings.football_drafts.wide_receiver_spots_count,
            settings.football_drafts.tight_end_spots_count,
            settings.football_drafts.flex_spots_count,
            settings.football_drafts.bench_spots_count,
            settings.football_drafts.kicker_spots_count,
            settings.football_drafts.defense_spots_count,
            settings.drafts.created_at,
            settings.drafts.is_started || false,
            settings.drafts.is_complete || false,
        );
    }

    async createDraft(creatorId: number, settings: FootballDraftSettings): Promise<void> {
        await db.transaction(async (transaction) => {
            try {
                const draftId: number = await transaction
                    .insert(draftTable)
                    .values({
                        order_type: settings.orderType,
                        sport: SportEnum.FOOTBALL,
                        pick_time_limit: settings.pickTimeLimit ?? 0,
                        scoring_type: settings.scoringType,
                        team_count: settings.teamCount,
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

                const draftOrder: DraftPick[] = DraftPickOrderGeneratorFactory.create(settings.orderType).generate(
                    draftId,
                    playerCountPerTeam,
                    settings.teamCount,
                );

                await transaction
                    .insert(draftPickTable)
                    .values(
                        draftOrder.map((pick) => ({
                            draft_id: draftId,
                            player_id: null,
                            team_number: pick.teamNumber,
                            pick_number: pick.pickNumber,
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
