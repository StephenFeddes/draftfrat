import { DraftRepository } from "../../../../interfaces";
import { Draft } from "../../../../domain";

/**
 * Gets all drafts a user is participating in.
 */
export class GetDrafts {
    private readonly draftRepository: DraftRepository;

    constructor(draftRepository: DraftRepository) {
        this.draftRepository = draftRepository;
    }

    /**
     * Gets all drafts a user is participating in.
     *
     * @param userId The ID of the user.
     * @returns Draft[] The drafts the user is participating in.
     */
    public async execute(userId: number): Promise<Draft[]> {
        const drafts: Draft[] = await this.draftRepository.getDrafts(userId);
        return drafts;
    }
}
