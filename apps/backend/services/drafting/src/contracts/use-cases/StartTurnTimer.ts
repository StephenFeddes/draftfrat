export interface StartTurnTimer {
    execute(draftId: number): Promise<void>;
}
