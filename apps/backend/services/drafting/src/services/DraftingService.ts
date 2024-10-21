import { DraftingRepository } from "../interfaces/DraftingRepository";
import { Draft } from "../models/Draft";

export class DraftingService {
    private draftingRepository: DraftingRepository;

    constructor(draftingRepository: DraftingRepository) {
        this.draftingRepository = draftingRepository;
    }

    async getDrafts(userId: number): Promise<Draft[]> {
        return await this.draftingRepository.getDrafts(userId);
    }
}
