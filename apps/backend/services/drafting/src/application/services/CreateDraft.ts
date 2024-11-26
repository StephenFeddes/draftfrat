import { DraftSettings } from "../../domain";
import { DraftRepository } from "../../contracts";

export class CreateDraft {
    private draftRepository: DraftRepository;

    /**
     * Initializes the CreateDraftUseCase with a draft repository.
     *
     * @param {DraftRepository} draftRepository - The repository used to manage draft operations.
     */
    constructor(draftRepository: DraftRepository) {
        this.draftRepository = draftRepository;
    }

    public async execute(creatorId: number, settings: DraftSettings): Promise<void> {
        await this.draftRepository.createDraft(creatorId, settings);
    }
}
