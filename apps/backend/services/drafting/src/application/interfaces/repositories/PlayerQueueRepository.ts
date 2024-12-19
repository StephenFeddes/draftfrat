import { QueuedPlayer } from "../../../domain";

/**
 * Handles database interactions related to queuing players in a draft for a user.
 */
export interface PlayerQueueRepository {
    /**
     * Enqueues a player for a user in a draft.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @param playerId The ID of the player.
     * @returns void
     */
    enqueuePlayer(draftId: number, userId: number, playerId: number): Promise<void>;

    /**
     * Dequeues a player for a user in a draft.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @returns QueuedPlayer The dequeued player or null if the player is not in the queue.
     */
    dequeuePlayer(draftId: number, userId: number): Promise<QueuedPlayer | null>;

    /**
     * Swaps the priorities of two players in a user's queue.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @param playerId1 The ID of the first player.
     * @param playerId2 The ID of the second player.
     * @returns void
     */
    swapQueuedPlayerPriorities(draftId: number, userId: number, playerId1: number, playerId2: number): Promise<void>;

    /**
     * Gets all the queued players for all users in a draft.
     *
     * @param draftId The ID of the draft.
     * @returns QueuedPlayer[] The queued players for the user.
     */
    getQueuedDraftPlayers(draftId: number): Promise<QueuedPlayer[]>;

    /**
     * Gets the queued players for a user in a draft.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @returns QueuedPlayer[] The queued players for the user.
     */
    getQueuedDraftPlayersByUserId(draftId: number, userId: number): Promise<QueuedPlayer[]>;

    /**
     * Removes a player from a user's queue in a draft.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @param playerId The ID of the player.
     * @returns void
     */
    removeDraftPlayerFromQueue(draftId: number, userId: number, playerId: number): Promise<void>;
}
