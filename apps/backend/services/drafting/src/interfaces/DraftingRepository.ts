import { Draft } from "../models/Draft";

export interface DraftingRepository {
    getDrafts(userId: number): Promise<Draft[]>;
}