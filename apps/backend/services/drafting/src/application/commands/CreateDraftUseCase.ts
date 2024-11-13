import { DraftRepository } from "../../contracts/repositories/DraftRepository";
import { DraftSettings } from "../../domain/value-objects/draft-settings/DraftSettings";
import { CreateDraft } from "../../contracts/use-cases/CreateDraft";

export class CreateDraftUseCase implements CreateDraft {
    private draftRepository: DraftRepository;

    constructor(draftRepository: DraftRepository) {
        this.draftRepository = draftRepository;
    }

    async execute(creatorId: number, settings: DraftSettings): Promise<void> {
        await this.draftRepository.createDraft(creatorId, settings);
    }
}
