import { DraftOrderGenerator } from "../../interfaces/DraftOrderGenerator";

export class SnakeDraftOrderGenerator implements DraftOrderGenerator {
    generate(playerCountPerTeam: number, teamCount: number): number[] {
        const draftOrder: number[] = [];
        for (let i = 0; i < playerCountPerTeam; i++) {
            if (i % 2 === 0) {
                for (let j = 1; j <= teamCount; j++) {
                    draftOrder.push(j);
                }
            } else {
                for (let j = teamCount; j >= 1; j--) {
                    draftOrder.push(j);
                }
            }
        }
        return draftOrder;
    }
}
