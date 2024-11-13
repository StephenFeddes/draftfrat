import { JoinDraft } from "../../../contracts/use-cases/JoinDraft";

export class JoinDraftHandler {
    private readonly joinDraft: JoinDraft;

    constructor(joinDraft: JoinDraft) {
        this.joinDraft = joinDraft;
    }

    public handle(data: any): void {
        try {
            this.joinDraft.execute(data.draftId);
        } catch (error) {
            console.log(error);
        }
    }
}
