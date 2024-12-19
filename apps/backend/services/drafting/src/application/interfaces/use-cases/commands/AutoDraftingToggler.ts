/**
 * Toggles the auto drafting status of a user in a draft.
 */
export interface AutoDraftingToggler {
    /**
     * Toggles the auto drafting status of a user in a draft.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @param isAutoDrafting The auto drafting status of the user.
     * @returns void
     */
    execute(draftId: number, userId: number, isAutoDrafting: boolean): Promise<void>;
}
