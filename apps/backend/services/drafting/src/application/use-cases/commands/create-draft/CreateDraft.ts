import { DraftSettings } from "../../../../domain";
import { DraftRepository } from "../../../interfaces/repositories/DraftRepository";
import { DraftCreator } from "../../../interfaces/use-cases/commands/DraftCreator";

export class CreateDraft implements DraftCreator {
    private readonly draftRepository: DraftRepository;

    constructor(draftRepository: DraftRepository) {
        this.draftRepository = draftRepository;
    }

    public async execute(creatorId: number, settings: DraftSettings): Promise<void> {
        await this.draftRepository.createDraft(creatorId, settings);
    }
}
