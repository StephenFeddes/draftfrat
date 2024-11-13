export interface TurnTimeRepository {
    setIsTimerRunning(draftId: number, isRunning: boolean): Promise<void>;

    getIsTimerRunning(draftId: number): Promise<boolean>;

    setTimeLimit(draftId: number, time: number): Promise<void>;

    getTimeLimit(draftId: number): Promise<number | null>;

    setTimeRemaining(draftId: number, time: number): Promise<void>;

    getTimeRemaining(draftId: number): Promise<number | null>;
}
