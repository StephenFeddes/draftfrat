import { EventBus, DraftUserRepository } from "../../../../interfaces";
import { DraftEvent, DraftEventEnum, DraftUser } from "../../../../domain";

/**
 * Toggles the auto drafting status of a user in a draft.
 */
export class ToggleAutoDrafting {
    private readonly eventBus: EventBus;

    private readonly draftUserRepository: DraftUserRepository;

    constructor(eventBus: EventBus, draftUserRepository: DraftUserRepository) {
        this.eventBus = eventBus;
        this.draftUserRepository = draftUserRepository;
    }

    /**
     * Toggles the auto drafting status of a user in a draft.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @param isAutoDrafting The auto drafting status of the user.
     * @returns void
     */
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
