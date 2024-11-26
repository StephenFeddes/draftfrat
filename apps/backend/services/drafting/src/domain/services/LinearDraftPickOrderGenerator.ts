import { DraftPickOrderGenerator } from "../../contracts";
import { DraftPick } from "../entities/DraftPick";

/**
 * This service generates a linear draft order of draft picks.
 * A linear order is where the draft order is the same every round.
 * i.e. an 3-team linear draft would have the following order of team numbers:
 * [1, 2, 3, 1, 2, 3, 1, 2, 3, ...]
 */
export class LinearDraftPickOrderGenerator implements DraftPickOrderGenerator {
    /**
     * Generates a linear draft order of draft picks.
     *
     * @param playerCountPerTeam - The number of players on each team
     * @param teamCount - The number of teams in the draft
     * @returns DraftPick[] - The draft pick order
     *
     * @example generate(2, 3) returns
     * [DraftPick(1, 1), DraftPick(2, 2), DraftPick(3, 3), DraftPick(4, 1), DraftPick(5, 2), DraftPick(6, 3)]
     */
    public generate(draftId: number, playerCountPerTeam: number, teamCount: number): DraftPick[] {
        const draftPickOrder: DraftPick[] = [];
        let pickNumber = 1;

        // Generate draft order for each round. The modulo operator makes the team numbers repeat each round.
        for (let i = 0; i < teamCount * playerCountPerTeam; i++) {
            const teamNumber = (i % teamCount) + 1;
            draftPickOrder.push(new DraftPick(draftId, pickNumber, teamNumber, null));
            pickNumber += 1;
        }
        return draftPickOrder;
    }
}
