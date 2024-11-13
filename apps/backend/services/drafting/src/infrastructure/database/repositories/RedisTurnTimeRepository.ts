import { redisClient } from "../connection";
import { TurnTimeRepository } from "../../../contracts/repositories/TurnTimeRepository";

/**
 * Redis implementation of the turn time repository
 */
export class RedisTurnTimeRepository implements TurnTimeRepository {
    private readonly prefix = "draft:";

    /**
     * Set the turn time limit for a draft
     *
     * @param draftId The ID of the draft
     * @param time The time limit in seconds
     */
    public async setIsTimerRunning(draftId: number, isRunning: boolean): Promise<void> {
        await redisClient.set(`${this.prefix}${draftId}:isTimerRunning`, isRunning.toString());
    }

    /**
     * Get the turn time limit for a draft
     *
     * @param draftId The ID of the draft
     * @returns The time limit in seconds, or null if not set
     */
    public async getIsTimerRunning(draftId: number): Promise<boolean> {
        const isRunning = await redisClient.get(`${this.prefix}${draftId}:isTimerRunning`);
        return isRunning === "true";
    }

    /**
     * Set the turn time limit for a draft
     *
     * @param draftId The ID of the draft
     * @param time The time limit in seconds
     */
    public async setTimeLimit(draftId: number, time: number): Promise<void> {
        await redisClient.set(`${this.prefix}${draftId}:turnTimeLimit`, time.toString());
    }

    /**
     * Get the turn time limit for a draft
     *
     * @param draftId The ID of the draft
     * @returns The time limit in seconds, or null if not set
     */
    public async getTimeLimit(draftId: number): Promise<number | null> {
        const time = await redisClient.get(`${this.prefix}${draftId}:turnTimeLimit`);
        return time ? parseInt(time, 10) : null;
    }

    /**
     * Set the remaining time for the current turn in a draft
     *
     * @param draftId The ID of the draft
     * @param time The remaining time in seconds
     */
    public async setTimeRemaining(draftId: number, time: number): Promise<void> {
        await redisClient.set(`${this.prefix}${draftId}:turnTimeRemaining`, time.toString());
    }

    /**
     * Get the remaining time for the current turn in a draft
     *
     * @param draftId The ID of the draft
     * @returns The remaining time in seconds, or null if not set
     */
    public async getTimeRemaining(draftId: number): Promise<number | null> {
        const time = await redisClient.get(`${this.prefix}${draftId}:turnTimeRemaining`);
        return time ? parseInt(time, 10) : null;
    }
}
