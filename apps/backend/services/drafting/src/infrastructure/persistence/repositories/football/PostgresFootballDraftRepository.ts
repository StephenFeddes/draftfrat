import { and, eq, gt } from "drizzle-orm";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { db } from "../../connection";
import { DraftRepository } from "../../../../interfaces";
import { footballDraftTable, draftTable, draftUserTable, draftPickTable } from "../../tables";
import {
    ScoringEnum,
    SportEnum,
    DraftOrderEnum,
    FootballDraftSettings,
    DraftPickOrderGeneratorFactory,
    DraftPick,
    Draft,
    DraftSchema,
} from "../../../../domain";

export class PostgresFootballDraftRepository implements DraftRepository {
    private readonly client: ReturnType<typeof drizzle>;

    constructor(pool: Pool) {
        this.client = drizzle({ client: pool });
    }

    public async getDrafts(userId: number): Promise<Draft[]> {
        const drafts: Draft[] = (
            await db
                .select()
                .from(draftUserTable)
                .innerJoin(draftTable, eq(draftTable.id, draftUserTable.draft_id))
                .where(eq(draftUserTable.user_id, userId))
                .execute()
        ).map((result) => ({
            id: result.drafts.id,
            settings: {
                sport: result.drafts.sport as SportEnum,
                draftOrderType: result.drafts.draft_order_type as DraftOrderEnum,
                scoringType: result.drafts.scoring_type as ScoringEnum,
                teamCount: result.drafts.team_count,
                pickTimeLimitSeconds: result.drafts.pick_time_limit_seconds,
            },
            createdAt: result.drafts.created_at,
            isStarted: result.drafts.is_started ?? false,
            isComplete: result.drafts.is_complete ?? false,
        }));

        return drafts;
    }

    public async updateDraftSettings(draftId: number, settings: FootballDraftSettings): Promise<void> {
        await db.transaction(async (transaction) => {
            try {
                const isDraftStarted: boolean | null = await transaction
                    .select({
                        is_started: draftTable.is_started,
                    })
                    .from(draftTable)
                    .where(eq(draftTable.id, draftId))
                    .execute()
                    .then((result) => result[0].is_started);

                if (isDraftStarted) {
                    throw new Error("Cannot update draft settings after draft has started");
                }

                await transaction
                    .update(draftTable)
                    .set({
                        draft_order_type: settings.draftOrderType,
                        pick_time_limit_seconds: settings.pickTimeLimitSeconds,
                        scoring_type: settings.scoringType,
                        team_count: settings.teamCount,
                    })
                    .where(eq(draftTable.id, draftId))
                    .execute();

                await transaction
                    .update(footballDraftTable)
                    .set({
                        quarterback_spots_count: settings.quarterbackSpotsCount,
                        running_back_spots_count: settings.runningBackSpotsCount,
                        wide_receiver_spots_count: settings.wideReceiverSpotsCount,
                        tight_end_spots_count: settings.tightEndSpotsCount,
                        flex_spots_count: settings.flexSpotsCount,
                        bench_spots_count: settings.benchSpotsCount,
                        kicker_spots_count: settings.kickerSpotsCount,
                        defense_spots_count: settings.defenseSpotsCount,
                    })
                    .where(eq(footballDraftTable.draft_id, draftId))
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

                const draftOrder: DraftPick[] = DraftPickOrderGeneratorFactory.create(settings.draftOrderType).generate(
                    draftId,
                    playerCountPerTeam,
                    settings.teamCount,
                );

                await transaction
                    .update(draftUserTable)
                    .set({ team_number: null })
                    .where(
                        and(eq(draftUserTable.draft_id, draftId), gt(draftUserTable.team_number, settings.teamCount)),
                    )
                    .execute();

                await transaction.delete(draftPickTable).where(eq(draftPickTable.draft_id, draftId)).execute();

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
            } catch (error) {
                transaction.rollback();
                throw error;
            }
        });
    }

    public async startDraft(draftId: number): Promise<void> {
        await db.update(draftTable).set({ is_started: true }).where(eq(draftTable.id, draftId)).execute();
    }

    public async completeDraft(draftId: number): Promise<void> {
        await db.update(draftTable).set({ is_complete: true }).where(eq(draftTable.id, draftId)).execute();
    }

    public async getDraftByDraftId(draftId: number): Promise<Draft> {
        const result = (
            await db
                .select()
                .from(footballDraftTable)
                .innerJoin(draftTable, eq(draftTable.id, footballDraftTable.draft_id))
                .where(eq(footballDraftTable.draft_id, draftId))
                .execute()
        )[0];

        const draftSettings: FootballDraftSettings = {
            sport: SportEnum.FOOTBALL,
            draftOrderType: result.drafts.draft_order_type as DraftOrderEnum,
            scoringType: result.drafts.scoring_type as ScoringEnum,
            teamCount: result.drafts.team_count,
            pickTimeLimitSeconds: result.drafts.pick_time_limit_seconds,
            quarterbackSpotsCount: result.football_drafts.quarterback_spots_count,
            runningBackSpotsCount: result.football_drafts.running_back_spots_count,
            wideReceiverSpotsCount: result.football_drafts.wide_receiver_spots_count,
            tightEndSpotsCount: result.football_drafts.tight_end_spots_count,
            flexSpotsCount: result.football_drafts.flex_spots_count,
            benchSpotsCount: result.football_drafts.bench_spots_count,
            kickerSpotsCount: result.football_drafts.kicker_spots_count,
            defenseSpotsCount: result.football_drafts.defense_spots_count,
        };

        const draft: Draft = {
            id: result.drafts.id,
            settings: draftSettings,
            isStarted: result.drafts.is_started ?? false,
            isComplete: result.drafts.is_complete ?? false,
            createdAt: result.drafts.created_at,
        };

        DraftSchema.parse(draft);

        return draft;
    }

    async createDraft(creatorId: number, settings: FootballDraftSettings): Promise<void> {
        await db.transaction(async (transaction) => {
            try {
                const draftId: number = await transaction
                    .insert(draftTable)
                    .values({
                        draft_order_type: settings.draftOrderType,
                        sport: SportEnum.FOOTBALL,
                        pick_time_limit_seconds: settings.pickTimeLimitSeconds ?? 0,
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

                const draftOrder: DraftPick[] = DraftPickOrderGeneratorFactory.create(settings.draftOrderType).generate(
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
                transaction.rollback();
                throw error;
            }
        });
    }
}
