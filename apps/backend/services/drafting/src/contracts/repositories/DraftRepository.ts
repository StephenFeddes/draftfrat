import { DraftSettings } from "../../domain/value-objects/draft-settings/DraftSettings";

export interface DraftRepository {
    createDraft(userId: number, settings: DraftSettings): Promise<void>;

    startDraft(draftId: number): Promise<void>;

    getDraftSettings(draftId: number): Promise<DraftSettings | null>;
}
