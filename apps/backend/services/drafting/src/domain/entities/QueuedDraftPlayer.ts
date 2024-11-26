import { Player } from "./Player";

export class QueuedDraftPlayer {
    public readonly draftId: number;

    public readonly userId: number;

    public readonly priority: number;

    public readonly player: Player;

    constructor(draftId: number, userId: number, priority: number, player: Player) {
        this.draftId = draftId;
        this.userId = userId;
        this.priority = priority;
        this.player = player;
    }

    public toJSON(): object {
        return {
            draftId: this.draftId,
            userId: this.userId,
            priority: this.priority,
            player: this.player.toJSON(),
        };
    }
}
