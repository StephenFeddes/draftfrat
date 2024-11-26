import { Player } from "./Player";

export class DraftPick {
    public readonly draftId: number;

    public readonly pickNumber: number;

    public readonly teamNumber: number;

    public player: Player | null;

    constructor(draftId: number, pickNumber: number, teamNumber: number, player: Player | null = null) {
        this.draftId = draftId;
        this.pickNumber = pickNumber;
        this.teamNumber = teamNumber;
        this.player = player;
    }

    public toJSON(): object {
        return {
            draftId: this.draftId,
            pickNumber: this.pickNumber,
            teamNumber: this.teamNumber,
            player: this.player ? this.player.toJSON() : null,
        };
    }
}
