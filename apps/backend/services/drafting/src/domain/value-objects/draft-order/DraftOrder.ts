import { DraftOrderEnum } from "../../enums/DraftOrderEnum";

export class DraftOrder {
    private readonly orderType: DraftOrderEnum;

    private readonly playerCountPerTeam: number;

    private readonly teamCount: number;

    constructor(orderType: DraftOrderEnum, playerCountPerTeam: number, teamCount: number) {
        if (orderType === undefined) {
            throw new Error("order_type is required");
        } else if (!Object.values(DraftOrderEnum).includes(orderType as DraftOrderEnum)) {
            throw new Error(
                `Invalid orderType: ${orderType}. Valid order types are: ${Object.values(DraftOrderEnum)}`,
            );
        }

        if (
            playerCountPerTeam === undefined ||
            playerCountPerTeam < 0 ||
            playerCountPerTeam % 1 !== 0
        ) {
            throw new Error("playerCountPerTeam must be a positive whole number");
        }

        if (teamCount === undefined || teamCount < 0 || teamCount % 1 !== 0) {
            throw new Error("teamCount must be a positive whole number");
        }

        this.orderType = orderType;
        this.playerCountPerTeam = playerCountPerTeam;
        this.teamCount = teamCount;
    }

    public generateDraftOrder(): number[] {
        switch (this.orderType) {
            case DraftOrderEnum.SNAKE:
                return this.generateSnakeOrder();
            case DraftOrderEnum.LINEAR:
                return this.generateLinearOrder();
            default:
                throw new Error(`Invalid draft order type: ${this.orderType}`);
        }
    }

    private generateSnakeOrder(): number[] {
        const draftOrder: number[] = [];
        for (let i = 0; i < this.playerCountPerTeam; i++) {
            if (i % 2 === 0) {
                for (let j = 1; j <= this.teamCount; j++) {
                    draftOrder.push(j);
                }
            } else {
                for (let j = this.teamCount; j >= 1; j--) {
                    draftOrder.push(j);
                }
            }
        }
        return draftOrder;
    }

    private generateLinearOrder(): number[] {
        const draftOrder: number[] = [];
        for (let i = 0; i < this.teamCount * this.playerCountPerTeam; i++) {
            draftOrder.push((i % this.teamCount) + 1);
        }
        return draftOrder;
    }
}
