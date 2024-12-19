import { DraftSettings } from "../../../../domain";

/**
 * Updates the settings of a draft.
 */
export interface DraftSettingsUpdater {
    /**
     * Updates the settings of a draft.
     *
     * @param draftId The ID of the draft.
     * @param settings The new settings for the draft.
     * @returns void
     * @throws An error if the settings are invalid, or the draft has started.
     */
    execute(draftId: number, settings: DraftSettings): Promise<void>;
}
