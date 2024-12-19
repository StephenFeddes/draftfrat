/**
 * Joins a user to a draft and sends the current draft state to the user.
 */
export interface QueuedPlayerPrioritySwapper {
    /**
     * Swaps the priority of two players in a user's player queue within a draft.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @param playerId1 The ID of the first player.
     * @param playerId2 The ID of the second player.
     * @returns void
     */
    execute(draftId: number, userId: number, playerId1: number, playerId2: number): Promise<void>;
}
