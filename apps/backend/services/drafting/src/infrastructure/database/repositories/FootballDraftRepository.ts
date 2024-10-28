import { DraftRepository } from "../../../domain/repositories/DraftRepository";
import { FootballDraftSettings } from "../../../types/types";
import { db } from "../config/database";
import { DraftOrderGeneratorFactory } from "../../../domain/utils/draft-order/DraftOrderGeneratorFactory";
import { draftTable, draftPickTable, draftUserTable, footballDraftTable } from "../schema";

export class FootballDraftRepository implements DraftRepository {
    async createDraft(creatorId: number, settings: FootballDraftSettings): Promise<void> {
        // Create basic draft record and get the resulting draft ID.
        const draftId: number = await db
            .insert(draftTable)
            .values({
                order_type: settings.order_type,
                sport: settings.sport,
                team_count: settings.team_count,
                pick_time_limit: settings.pick_time_limit,
                scoring_type: settings.scoring_type,
                created_at: new Date().toISOString(),
            })
            .returning({ id: draftTable.id })
            .execute()
            .then((result) => result[0].id);

        await db
            .insert(footballDraftTable)
            .values({
                draft_id: draftId,
                quarterback_spots_count: settings.quarterback_spots_count,
                running_back_spots_count: settings.running_back_spots_count,
                wide_receiver_spots_count: settings.wide_receiver_spots_count,
                tight_end_spots_count: settings.tight_end_spots_count,
                flex_spots_count: settings.flex_spots_count,
                bench_spots_count: settings.bench_spots_count,
                kicker_spots_count: settings.kicker_spots_count,
                defense_spots_count: settings.defense_spots_count,
            })
            .execute();

        // Calculate the number of player slots per team in the draft.
        const playerCountPerTeam: number =
            settings.quarterback_spots_count +
            settings.running_back_spots_count +
            settings.wide_receiver_spots_count +
            settings.tight_end_spots_count +
            settings.flex_spots_count +
            settings.bench_spots_count +
            settings.kicker_spots_count +
            settings.defense_spots_count;

        // Generate draft order based on the order type, should look like [1,2 3, 3, 2, 1...]
        const draftOrder: number[] = DraftOrderGeneratorFactory.create(
            settings.order_type,
        ).generate(playerCountPerTeam, settings.team_count);

        // Initialize draft picks for each team in the draft.
        await db
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

        // Insert the draft creator as an admin user in the draft.
        await db
            .insert(draftUserTable)
            .values({
                draft_id: draftId,
                user_id: creatorId,
                team_number: null,
                is_auto_drafting: false,
                is_admin: true,
            })
            .execute();
    }
}
