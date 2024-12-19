/**
 * Starts a draft.
 */
export interface DraftStarter {
    /**
     * Starts a draft.
     *
     * @param draftId The ID of the draft.
     * @returns void
     */
    execute(draftId: number): Promise<void>;
}
