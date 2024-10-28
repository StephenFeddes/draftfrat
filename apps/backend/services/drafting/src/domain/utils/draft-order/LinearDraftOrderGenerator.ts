import { DraftOrderGenerator } from "../../interfaces/DraftOrderGenerator";

export class LinearDraftOrderGenerator implements DraftOrderGenerator {
    generate(playerCountPerTeam: number, teamCount: number): number[] {
        const draftOrder: number[] = [];
        for (let i = 0; i < teamCount * playerCountPerTeam; i++) {
            draftOrder.push((i % teamCount) + 1);
        }
        return draftOrder;
    }
}
