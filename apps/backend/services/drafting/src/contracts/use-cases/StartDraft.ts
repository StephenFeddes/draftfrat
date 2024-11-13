export interface StartDraft {
    execute(draftId: number): Promise<void>;
}
