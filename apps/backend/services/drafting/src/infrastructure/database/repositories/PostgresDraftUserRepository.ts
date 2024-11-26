import { and, eq } from "drizzle-orm";
import { DraftUserRepository } from "../../../contracts";
import { draftUserTable } from "../schema";
import { DraftUser } from "../../../domain";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

export class PostgresDraftUserRepository implements DraftUserRepository {
    private readonly client: ReturnType<typeof drizzle>;

    constructor(pool: Pool) {
        this.client = drizzle({ client: pool });
    }

    getDraftUserByTeamNumber(draftId: number, teamNumber: number): Promise<DraftUser | null> {
        return this.client
            .select()
            .from(draftUserTable)
            .where(and(eq(draftUserTable.draft_id, draftId), eq(draftUserTable.team_number, teamNumber)))
            .execute()
            .then((rows) => {
                if (rows.length === 0) {
                    return null;
                }

                const row = rows[0];
                return new DraftUser(
                    row.draft_id!,
                    row.user_id!,
                    row.team_name!,
                    row.team_number!,
                    row.is_auto_drafting!,
                    row.is_admin!,
                );
            });
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
                    return new DraftUser(
                        row.draft_id!,
                        row.user_id!,
                        row.team_name!,
                        row.team_number!,
                        row.is_auto_drafting!,
                        row.is_admin!,
                    );
                });
            });
    }

    public async claimTeam(draftId: number, teamNumber: number, userId: number): Promise<void> {
        await this.client
            .insert(draftUserTable)
            .values({
                draft_id: draftId,
                user_id: userId,
                team_number: teamNumber,
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
    }
}
