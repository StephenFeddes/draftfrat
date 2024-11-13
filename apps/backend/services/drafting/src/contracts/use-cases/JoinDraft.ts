export interface JoinDraft {
    execute(draftId: number): Promise<void>;
}
