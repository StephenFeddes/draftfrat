import { Player, QueuedDraftPlayer } from "../../domain";

export interface DraftPlayerQueueRepository {
    enqueuePlayer(draftId: number, userId: number, playerId: number): Promise<void>;

    dequeuePlayer(draftId: number, userId: number): Promise<QueuedDraftPlayer | null>;

    swapQueuedPlayerPriorities(draftId: number, userId: number, playerId1: number, playerId2: number): Promise<void>;

    removePlayerFromQueue(draftId: number, userId: number, playerId: number): Promise<void>;

    removePlayersFromQueue(draftId: number, userId: number, playerIds: number[]): Promise<void>;

    getQueuedDraftPlayers(draftId: number): Promise<QueuedDraftPlayer[]>;

    getQueuedDraftPlayersByUserId(draftId: number, userId: number): Promise<QueuedDraftPlayer[]>;
}
