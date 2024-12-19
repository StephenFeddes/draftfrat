import { Draft, DraftSettings } from "../../../domain";

/**
 * Handles database interactions related to the drafts themselves.
 */
export interface DraftRepository {
    /**
     * Creates a draft for a user with the specified draft settings.
     *
     * @param userId The ID of the user creating the draft.
     * @param settings The settings for the draft.
     * @returns void
     */
    createDraft(userId: number, settings: DraftSettings): Promise<void>;

    /**
     * Starts a draft.
     *
     * @param draftId The ID of the draft.
     * @returns void
     */
    startDraft(draftId: number): Promise<void>;

    /**
     * Sets the draft completion status to true.
     *
     * @param draftId The ID of the draft.
     * @returns void
     */
    completeDraft(draftId: number): Promise<void>;

    /**
     * Gets the settings for a draft.
     *
     * @param draftId The ID of the draft.
     * @returns The settings for the draft or null if the draft does not exist.
     */
    getDraftByDraftId(draftId: number): Promise<Draft | null>;

    /**
     * Updates the settings for a draft.
     *
     * @param draftId The ID of the draft.
     * @param settings The new settings for the draft.
     * @returns void
     */
    updateDraftSettings(draftId: number, settings: DraftSettings): Promise<void>;

    /**
     * Gets the drafts that a user is a part of.
     *
     * @param userId The ID of the user.
     * @returns Draft[] The drafts that the user is a part of.
     */
    getDrafts(userId: number): Promise<Draft[]>;
}
