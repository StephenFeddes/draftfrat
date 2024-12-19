import { DraftPick } from "..";

/**
 * Generates the order of draft picks for a draft.
 */
export interface DraftPickOrderGenerator {
    /**
     * Generates the order of draft picks for a draft.
     *
     * @param draftId The ID of the draft.
     * @param playersPerTeam The number of players per team.
     * @param teamCount The number of teams in the draft.
     * @returns DraftPick[] The order of draft picks.
     */
    generate(draftId: number, playersPerTeam: number, teamCount: number): DraftPick[];
}
