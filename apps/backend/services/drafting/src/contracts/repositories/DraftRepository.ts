import { DraftSettings } from "../../domain/value-objects/DraftSettings";

export interface DraftRepository {
    createDraft(userId: number, settings: DraftSettings): Promise<void>;

    startDraft(draftId: number): Promise<void>;

    getDraftSettings(draftId: number): Promise<DraftSettings | null>;

    updateDraftSettings(draftId: number, settings: DraftSettings): Promise<void>;
}
