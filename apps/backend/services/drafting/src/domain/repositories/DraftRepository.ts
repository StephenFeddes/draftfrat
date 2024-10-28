import { DraftSettings } from "../../types/types";

export interface DraftRepository {
    createDraft(userId: number, settings: DraftSettings): Promise<void>;
}
