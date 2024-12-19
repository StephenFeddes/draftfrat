import { DraftPickOrderGenerator } from "../../interfaces/DraftPickOrderGenerator";
import { DraftPick } from "../../entities/DraftPick";

/**
 * This service generates a snake draft order of draft picks.
 * A snake order is where the draft order reverses every other round.
 * i.e. an 4-team snake draft would have the following order of team numbers:
 * [1, 2, 3, 4, 4, 3, 2, 1, 1, 2, ...]
 */
export class SnakeDraftPickOrderGenerator implements DraftPickOrderGenerator {
    /**
     * Generates a snake draft order of draft picks.
     * A snake order is where the draft order reverses every other round.
     *
     * @param playerCountPerTeam - The number of players on each team
     * @param teamCount - The number of teams in the draft
     * @returns DraftPick[] - The draft pick order
     *
     * @example generate(2, 3) returns
     * [DraftPick(1, 1), DraftPick(2, 2), DraftPick(3, 3), DraftPick(4, 3), DraftPick(5, 2), DraftPick(6, 1)]
     */
    public generate(draftId: number, playerCountPerTeam: number, teamCount: number): DraftPick[] {
        const draftPickOrder: DraftPick[] = [];
        let pickNumber = 1;

        for (let i = 0; i < playerCountPerTeam; i++) {
            // Generate draft order for each round
            if (i % 2 === 0) {
                // Forward order
                for (let teamNumber = 1; teamNumber <= teamCount; teamNumber++) {
                    draftPickOrder.push({
                        draftId: draftId,
                        pickNumber: pickNumber,
                        teamNumber: teamNumber,
                        player: null,
                    });
                    pickNumber += 1;
                }
            } else {
                // Reverse order
                for (let teamNumber = teamCount; teamNumber >= 1; teamNumber--) {
                    draftPickOrder.push({
                        draftId: draftId,
                        pickNumber: pickNumber,
                        teamNumber: teamNumber,
                        player: null,
                    });
                    pickNumber += 1;
                }
            }
        }
        return draftPickOrder;
    }
}
