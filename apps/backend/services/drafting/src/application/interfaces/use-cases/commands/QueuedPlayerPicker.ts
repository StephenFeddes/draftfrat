/**
 * Dequeues a player from the draft queue and adds them to a team's roster,
 * assuming the player is available and able to fit on the team's roster.
 */
export interface QueuedPlayerPicker {
    /**
     * Dequeues a player from the draft queue and adds them to a team's roster.
     * - Only players that are available and able to fit on the team's roster can be picked.
     * - The player is added to the team's roster and removed from the draft queue.
     * - The player is removed from the available player pool.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @param teamNumber The number of the team.
     * @returns void
     */
    execute(draftId: number, userId: number, teamNumber: number): Promise<void>;
}
