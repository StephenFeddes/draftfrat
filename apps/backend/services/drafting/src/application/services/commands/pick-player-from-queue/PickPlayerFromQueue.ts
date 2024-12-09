import { PlayerQueueRepository } from "../../../../interfaces";
import { QueuedPlayer } from "../../../../domain";
import { PickPlayer } from "../pick-player/PickPlayer";

/**
 * Dequeues a player from the draft queue and adds them to a team's roster,
 * assuming the player is available and able to fit on the team's roster.
 */
export class PickPlayerFromQueue {
    private readonly pickPlayer: PickPlayer;

    private readonly playerQueueRepository: PlayerQueueRepository;

    constructor(pickPlayer: PickPlayer, playerQueueRepository: PlayerQueueRepository) {
        this.pickPlayer = pickPlayer;
        this.playerQueueRepository = playerQueueRepository;
    }

    /**
     * Dequeues a player from the draft queue and adds them to a team's roster.
     * - Only players that are available and able to fit on the team's roster can be picked.
     * - The player is added to the team's roster and removed from the draft queue.
     * - The player is removed from the available player pool.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @param teamNumber The number of the team.
     * @returns void
     */
    async execute(draftId: number, userId: number, teamNumber: number): Promise<void> {
        const queuedPlayers = await this.playerQueueRepository.getQueuedDraftPlayersByUserId(draftId, userId);
        for (let i = 0; i < queuedPlayers.length; i++) {
            const dequeuedPlayer: QueuedPlayer | null = await this.playerQueueRepository.dequeuePlayer(draftId, userId);
            try {
                if (dequeuedPlayer !== null) {
                    this.pickPlayer.execute(draftId, dequeuedPlayer.player.id, teamNumber);
                    return;
                }
            } catch {
                continue;
            }
        }
        throw new Error("Cannot add player from queue");
    }
}
