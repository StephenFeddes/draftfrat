import { and, eq, not } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DraftUserRepository } from "../../../interfaces";
import { draftUserTable } from "../tables";
import { DraftUser, DraftUserSchema } from "../../../domain";
import { db } from "../connection";

export class PostgresDraftUserRepository implements DraftUserRepository {
    private readonly client: ReturnType<typeof drizzle>;

    constructor(pool: Pool) {
        this.client = drizzle({ client: pool });
    }

    public async getDraftUserByTeamNumber(draftId: number, teamNumber: number): Promise<DraftUser | null> {
        const result = await this.client
            .select()
            .from(draftUserTable)
            .where(and(eq(draftUserTable.draft_id, draftId), eq(draftUserTable.team_number, teamNumber)))
            .execute();

        if (result.length === 0) {
            return null;
        }

        const draftUser: DraftUser = {
            draftId: Number(result[0].draft_id),
            userId: Number(result[0].user_id),
            teamName: result[0].team_name!,
            teamNumber: result[0].team_number!,
            isAutoDrafting: result[0].is_auto_drafting!,
            isAdmin: result[0].is_admin!,
        };

        // Validate the draft user schema
        DraftUserSchema.parse(draftUser);

        return draftUser;
    }

    public async setAutoDraftStatus(draftId: number, userId: number, isAutoDrafting: boolean): Promise<void> {
        await this.client
            .update(draftUserTable)
            .set({
                is_auto_drafting: isAutoDrafting,
            })
            .where(and(eq(draftUserTable.draft_id, draftId), eq(draftUserTable.user_id, userId)))
            .execute();
    }

    public async getDraftUsers(draftId: number): Promise<DraftUser[]> {
        return this.client
            .select()
            .from(draftUserTable)
            .where(eq(draftUserTable.draft_id, draftId))
            .execute()
            .then((rows) => {
                return rows.map((row) => {
                    const draftUser: DraftUser = {
                        draftId: Number(row.draft_id),
                        userId: Number(row.user_id),
                        teamName: row.team_name!,
                        teamNumber: row.team_number!,
                        isAutoDrafting: row.is_auto_drafting!,
                        isAdmin: row.is_admin!,
                    };

                    // Validate the draft user schema
                    DraftUserSchema.parse(draftUser);

                    return draftUser;
                });
            });
    }

    public async claimTeam(draftId: number, teamNumber: number, teamName: string, userId: number): Promise<void> {
        await db.transaction(async (transaction) => {
            try {
                // Check if the team number is already claimed by another user in the same draft
                const existingTeam = await this.client
                    .select()
                    .from(draftUserTable)
                    .where(
                        and(
                            eq(draftUserTable.draft_id, draftId),
                            eq(draftUserTable.team_number, teamNumber),
                            not(eq(draftUserTable.user_id, userId)),
                        ),
                    )
                    .execute();

                // If there is an existing team with the same team number, throw an error
                if (existingTeam.length > 0) {
                    throw new Error(`Team number ${teamNumber} is already claimed by another user.`);
                }

                // If no conflict, proceed with the insertion or update
                await this.client
                    .insert(draftUserTable)
                    .values({
                        draft_id: draftId,
                        user_id: userId,
                        team_number: teamNumber,
                        team_name: teamName || `Team ${teamNumber}`,
                        is_auto_drafting: false,
                        is_admin: false,
                    })
                    .onConflictDoUpdate({
                        target: [draftUserTable.draft_id, draftUserTable.user_id],
                        set: {
                            team_number: teamNumber,
                        },
                    })
                    .execute();
            } catch (error) {
                // Rollback transaction on error
                await transaction.rollback();
                throw error;
            }
        });
    }
}
