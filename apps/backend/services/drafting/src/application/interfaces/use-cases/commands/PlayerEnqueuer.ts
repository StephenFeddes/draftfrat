/**
 * Enqueue player to a queue of players to be picked in a draft for a user.
 * - The player is given the lowest priority when first enqueued.
 */
export interface PlayerEnqueuer {
    /**
     * Enqueues a player to a queue of players to be picked in a draft.
     * - The player is given the lowest priority when first enqueued.
     * - If the player is picked by another team before reaching the front of the queue,
     * then they are removed from the it.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @param playerId The ID of the player.
     * @returns void
     */
    execute(draftId: number, userId: number, playerId: number): Promise<void>;
}
