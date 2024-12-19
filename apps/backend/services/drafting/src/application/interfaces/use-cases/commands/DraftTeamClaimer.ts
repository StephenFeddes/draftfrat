/**
 * Claims a team for a user in a draft.
 * - Updates the user-to-team assignment.
 * - Publishes an event to notify other parts of the system of the update.
 */
export interface DraftTeamClaimer {
    /**
     * Claims a team for a user in a draft.
     * - Updates the user-to-team assignment.
     * - Retrieves updated draft users and rosters.
     * - Publishes an event to notify other parts of the system.
     *
     * @param draftId - ID of the draft.
     * @param teamNumber - The number of the team being claimed.
     * @param userId - The user claiming the team.
     */
    execute(draftId: number, teamNumber: number, teamName: string, userId: number): Promise<void>;
}
