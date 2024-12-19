import { DraftSettings } from "../../../../domain";

/**
 * Creates a draft for a user with the specified draft settings.
 */
export interface DraftCreator {
    /**
     * Creates a draft with the specified settings.
     * - The creator of the draft is the first user to join the draft.
     * - The creator can set the draft settings and are given admin privileges.
     * - Admin privileges allow the creator to start the draft.
     *
     * @param creatorId The ID of the user who is creating the draft.
     * @param settings The settings for the draft.
     * @returns void
     * @throws An error if the draft cannot be created.
     */
    execute(creatorId: number, settings: DraftSettings): Promise<void>;
}
