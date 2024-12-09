import { DraftUser } from "../../domain";

/**
 * Handles database interactions related to draft users.
 */
export interface DraftUserRepository {
    /**
     * Claims a team for a user in a draft.
     *
     * @param draftId The ID of the draft.
     * @param teamNumber The number of the team to claim.
     * @param userId The ID of the user claiming the team.
     */
    claimTeam(draftId: number, teamNumber: number, teamName: string, userId: number): Promise<void>;

    /**
     * Gets the draft users in a draft.
     *
     * @param draftId The ID of the draft.
     */
    getDraftUsers(draftId: number): Promise<DraftUser[]>;

    /**
     * Gets a draft user in a draft by their team number.
     *
     * @param draftId The ID of the draft.
     * @param teamNumber The number of the user's team.
     */
    getDraftUserByTeamNumber(draftId: number, teamNumber: number): Promise<DraftUser | null>;

    /**
     * Sets the auto-draft status for a user in a draft.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @param isAutoDrafting Whether the user is auto-drafting.
     * @returns void
     */
    setAutoDraftStatus(draftId: number, userId: number, isAutoDrafting: boolean): Promise<void>;
}
