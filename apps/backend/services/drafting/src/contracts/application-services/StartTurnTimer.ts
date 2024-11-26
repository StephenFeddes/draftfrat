export interface StartTurnTimer {
    execute(draftId: number, userId: number, timeLimit: number | null): Promise<number | null>;
}
