/**
 * Starts a turn timer for a user in a draft.
 */
export interface TurnTimerStarter {
    /**
     * Starts a turn timer for a user in a draft.
     * - Is interrupted if the user picks a player before the timer expires or auto-draft is enabled.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @param timeLimit The time limit in seconds.
     * @returns The time remaining in seconds when the timer expires or was interrupted.
     * Returns null if the time limit is null.
     */
    execute(draftId: number, userId: number, timeLimit: number | null): Promise<number | null>;
}
