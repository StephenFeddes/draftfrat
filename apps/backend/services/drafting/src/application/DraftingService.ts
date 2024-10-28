import { DraftRepository } from "../domain/repositories/DraftRepository";
import { DraftSettings } from "../types/types";

export class CreateDraft {
    private draftRepository: DraftRepository;

    constructor(draftRepository: DraftRepository) {
        this.draftRepository = draftRepository;
    }

    async execute(creatorId: number, settings: DraftSettings): Promise<void> {
        await this.draftRepository.createDraft(creatorId, settings);
    }
}
