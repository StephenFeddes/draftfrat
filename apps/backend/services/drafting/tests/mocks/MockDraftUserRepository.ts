import { DraftUserRepository } from "../../src/contracts";
import { DraftUser } from "../../src/domain";

export class MockDraftUserRepository implements DraftUserRepository {
    private draftUsers: DraftUser[];

    public constructor(draftUsers: DraftUser[]) {
        this.draftUsers = draftUsers;
    }

    public async addDraftUsers(draftUsers: DraftUser[]): Promise<void> {
        this.draftUsers.push(...draftUsers);
    }

    public async getDraftUsers(draftId: number): Promise<DraftUser[]> {
        return this.draftUsers.filter((draftUser) => draftUser.draftId === draftId);
    }

    public async claimTeam(draftId: number, teamNumber: number, userId: number): Promise<void> {
        this.draftUsers[
            this.draftUsers.findIndex((draftUser) => draftUser.draftId === draftId && draftUser.userId === userId)
        ].setTeamNumber(teamNumber);
    }

    public async setAutoDraftStatus(draftId: number, userId: number, isAutoDrafting: boolean): Promise<void> {
        this.draftUsers[
            this.draftUsers.findIndex((draftUser) => draftUser.draftId === draftId && draftUser.userId === userId)
        ].setIsAutoDrafting(isAutoDrafting);
    }
}
