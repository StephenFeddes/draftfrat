export interface AutoDraftPlayer {
    execute(draftId: number, pickNumber: number, teamNumber: number): Promise<void>;
}
