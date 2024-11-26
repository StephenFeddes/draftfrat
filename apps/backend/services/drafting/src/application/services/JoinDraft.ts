import { DraftRepository, EventBus } from "../../contracts";
import { DraftSettings, DraftEvent, DraftEventEnum } from "../../domain";

export class JoinDraft {
    private readonly eventBus: EventBus;

    private readonly draftRepository: DraftRepository;

    constructor(eventBus: EventBus, draftRepository: DraftRepository) {
        this.eventBus = eventBus;
        this.draftRepository = draftRepository;
    }

    async execute(draftId: number): Promise<void> {
        const settings: DraftSettings | null = await this.draftRepository.getDraftSettings(draftId);
        const event: DraftEvent = new DraftEvent(draftId, DraftEventEnum.JOINED_DRAFT, {
            draftId,
            settings: settings?.toJSON(),
        });
        this.eventBus.publish(event);
    }
}
