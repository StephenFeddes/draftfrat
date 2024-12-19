/**
 * Pick a player from the draft and add them to a team's roster.
 * - The player is removed from the available player pool.
 */
export interface PlayerPicker {
    /**
     * Picks a player from the draft and adds them to a team's roster.
     * - The player is added to the team's roster and removed from the available player pool.
     * - Only players that are available and able to fit on the team's roster can be picked.
     *
     * @param draftId The ID of the draft.
     * @param playerId The ID of the player.
     * @param teamNumber The number of the team.
     * @returns void
     */
    execute(draftId: number, playerId: number, teamNumber: number): Promise<void>;
}
