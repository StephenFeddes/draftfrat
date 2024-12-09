/**
 * Auto-drafts a player for a team.
 */
export interface AutoDraftPlayer {
    /**
     * This method is used to auto-draft a player for a team.
     * - Auto-draft means that the system will automatically draft a player for a team.
     * - Non-user controlled teams will automatically use this service to draft players.
     * - User-controlled teams can enable or disable auto-drafting for their team.
     *
     * @param draftId The ID of the draft.
     * @param pickNumber The number of the pick.
     * @param teamNumber The number of the team.
     * @returns void
     * @throws An error if the player cannot be drafted.
     */
    execute(draftId: number, pickNumber: number, teamNumber: number): Promise<void>;
}
