import { DraftEvent, DraftEventEnum, DraftUser } from "../../../../domain";
import { EventBus } from "../../../interfaces/event-bus/EventBus";
import { DraftUserRepository } from "../../../interfaces/repositories/DraftUserRepository";
import { AutoDraftingToggler } from "../../../interfaces/use-cases/commands/AutoDraftingToggler";

export class ToggleAutoDrafting implements AutoDraftingToggler {
    private readonly eventBus: EventBus;

    private readonly draftUserRepository: DraftUserRepository;

    constructor(eventBus: EventBus, draftUserRepository: DraftUserRepository) {
        this.eventBus = eventBus;
        this.draftUserRepository = draftUserRepository;
    }

    public async execute(draftId: number, userId: number, isAutoDrafting: boolean): Promise<void> {
        this.draftUserRepository.setAutoDraftStatus(draftId, userId, isAutoDrafting);

        const draftUsers: DraftUser[] = await this.draftUserRepository.getDraftUsers(draftId);
        const event: DraftEvent = new DraftEvent(draftId, DraftEventEnum.AUTO_DRAFTING_CHANGED, {
            draftId,
            users: draftUsers,
        });
        this.eventBus.publish(event);
    }
}
