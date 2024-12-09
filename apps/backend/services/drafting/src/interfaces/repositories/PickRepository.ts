import { DraftPick, Player } from "../../domain";

/**
 * Handles database interactions related to draft picks.
 */
export interface PickRepository {
    /**
     * Gets the draft picks in a draft.
     *
     * @param draftId The ID of the draft.
     * @returns DraftPick[] The draft picks in the draft.
     */
    getDraftPicks(draftId: number): Promise<DraftPick[]>;

    /**
     * Picks a player for a team in a draft.
     *
     * @param draftId The ID of the draft.
     * @param playerId The ID of the player.
     * @param pickNumber The number of the pick.
     * @param teamNumber The number of the team.
     * @returns void
     */
    pickPlayer(draftId: number, playerId: number, pickNumber: number, teamNumber: number): Promise<void>;

    /**
     * Gets the available players in a draft that have not been picked.
     *
     * @param draftId The ID of the draft.
     * @returns Player[] The available players.
     */
    getAvailablePlayers(draftId: number): Promise<Player[]>;

    /**
     * Gets a player by their ID.
     *
     * @param playerId The ID of the player.
     * @returns The player or null if the player does not exist.
     */
    getPlayerById(playerId: number): Promise<Player | null>;

    /**
     * Gets the current draft pick in a draft.
     *
     * @param draftId The ID of the draft.
     * @returns The current draft pick or null if the draft is over.
     */
    getCurrentDraftPick(draftId: number): Promise<DraftPick | null>;
}
