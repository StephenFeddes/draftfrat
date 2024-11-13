import { DraftSettings } from "../../domain/value-objects/draft-settings/DraftSettings";

export interface CreateDraft {
    execute(creatorId: number, settings: DraftSettings): Promise<void>;
}
