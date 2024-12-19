/**
 * Removes a player from a user's draft queue
 */
export interface QueuedPlayerRemover {
    /**
     * Removes a player from a user's draft queue.
     * - The player is removed from the draft queue and added back to the available player pool.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @param playerId The ID of the player.
     * @returns void
     */
    execute(draftId: number, userId: number, playerId: number): Promise<void>;
}
