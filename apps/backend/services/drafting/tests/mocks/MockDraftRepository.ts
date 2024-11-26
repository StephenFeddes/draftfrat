import { DraftRepository } from "../../src/contracts";
import { Draft, DraftSettings } from "../../src/domain";

export class MockDraftRepository implements DraftRepository {
    private drafts: Draft[] = [];

    public async updateDraftSettings(draftId: number, settings: DraftSettings): Promise<void> {
        this.drafts[this.drafts.findIndex((draft) => draft.id === draftId)].setSettings(settings);
    }

    public async startDraft(draftId: number): Promise<void> {
        this.drafts[this.drafts.findIndex((draft) => draft.id === draftId)].settings.isStarted = true;
    }

    public async getDraftSettings(draftId: number): Promise<DraftSettings | null> {
        const foundDraft = this.drafts.find((draft) => draft.id === draftId);
        return foundDraft ? foundDraft.settings : null;
    }

    async createDraft(creatorId: number, settings: DraftSettings): Promise<void> {
        this.drafts.push(new Draft(creatorId, settings));
    }
}
