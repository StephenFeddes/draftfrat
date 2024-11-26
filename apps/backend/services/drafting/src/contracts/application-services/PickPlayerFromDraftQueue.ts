export interface PickPlayerFromDraftQueue {
    execute(draftId: number, userId: number, pickNumber: number, teamNumber: number): Promise<void>;
}
