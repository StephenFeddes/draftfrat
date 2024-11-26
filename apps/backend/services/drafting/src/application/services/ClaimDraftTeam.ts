import { EventBus, DraftRepository } from "../../contracts";

export class ClaimDraftTeam {
    private readonly eventBus: EventBus;

    private readonly draftRepository: DraftRepository;

    constructor(eventBus: EventBus, draftRepository: DraftRepository) {
        this.eventBus = eventBus;
        this.draftRepository = draftRepository;
    }

    execute(draftId: number, teamNumber: number, userId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
