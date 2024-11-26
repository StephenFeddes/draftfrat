import { DraftUser } from "../../domain";

export interface DraftUserRepository {
    claimTeam(draftId: number, teamNumber: number, userId: number): Promise<void>;

    getDraftUsers(draftId: number): Promise<DraftUser[]>;

    getDraftUserByTeamNumber(draftId: number, teamNumber: number): Promise<DraftUser | null>;

    setAutoDraftStatus(draftId: number, userId: number, isAutoDrafting: boolean): Promise<void>;
}
