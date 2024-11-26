import { QueuedDraftPlayer } from "../entities/QueuedDraftPlayer";

export class DraftPlayerQueuePool {
    public readonly draftId: number;

    private draftPlayerQueues: Map<number, QueuedDraftPlayer[]> = new Map();

    constructor(draftId: number, queuedDraftPlayers: QueuedDraftPlayer[]) {
        this.draftId = draftId;
        queuedDraftPlayers.forEach((queuedDraftPlayer) => {
            const queue = this.draftPlayerQueues.get(queuedDraftPlayer.userId) || [];
            queue.push(queuedDraftPlayer);
            queue.sort((a, b) => a.priority - b.priority);
            this.draftPlayerQueues.set(queuedDraftPlayer.userId, queue);
        });
    }

    public toJSON(): object {
        const queues: { [key: number]: any } = {};
        for (const [userId, queue] of this.draftPlayerQueues) {
            queues[userId] = queue.map((queuedDraftPlayer) => queuedDraftPlayer.toJSON());
        }
        return queues;
    }
}
