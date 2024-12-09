import { DraftSettings } from "../../../../domain";
import { DraftRepository } from "../../../../interfaces";

/**
 * Creates a draft for a user with the specified draft settings.
 */
export class CreateDraft {
    private readonly draftRepository: DraftRepository;

    constructor(draftRepository: DraftRepository) {
        this.draftRepository = draftRepository;
    }

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
    public async execute(creatorId: number, settings: DraftSettings): Promise<void> {
        await this.draftRepository.createDraft(creatorId, settings);
    }
}
