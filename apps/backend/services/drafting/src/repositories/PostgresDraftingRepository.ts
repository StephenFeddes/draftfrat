import { DraftingRepository } from "../interfaces/DraftingRepository";
import { Draft } from "../models/Draft";

export class PostgresDraftingRepository implements DraftingRepository {
    async getDrafts(userId: number): Promise<Draft[]> {
        return [];
    }
}
