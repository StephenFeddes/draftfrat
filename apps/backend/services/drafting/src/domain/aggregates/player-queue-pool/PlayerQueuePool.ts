import { QueuedPlayer } from "../../entities/QueuedPlayer";

export class PlayerQueuePool {
    public readonly draftId: number;

    private draftPlayerQueues: Map<number, QueuedPlayer[]> = new Map();

    constructor(draftId: number, queuedDraftPlayers: QueuedPlayer[]) {
        this.draftId = draftId;
        queuedDraftPlayers.forEach((queuedDraftPlayer) => {
            const queue = this.draftPlayerQueues.get(queuedDraftPlayer.userId) || [];
            queue.push(queuedDraftPlayer);
            queue.sort((a, b) => a.priority - b.priority);
            this.draftPlayerQueues.set(queuedDraftPlayer.userId, queue);
        });
    }

    public getQueues(): Record<number, QueuedPlayer[]> {
        return Object.fromEntries(this.draftPlayerQueues) as Record<number, QueuedPlayer[]>;
    }
}
