import {
    Draft,
    DraftEvent,
    DraftEventEnum,
    DraftPick,
    DraftSettings,
    DraftUser,
    RosterPool,
    RosterPoolFactory,
} from "../../../../domain";
import { DraftRepository, DraftUserRepository, EventBus, PickRepository } from "../../../../interfaces";

/**
 * Updates the settings of a draft.
 */
export class UpdateDraftSettings {
    private readonly eventBus: EventBus;

    private readonly draftRepository: DraftRepository;

    private readonly pickRepository: PickRepository;

    private readonly draftUserRepository: DraftUserRepository;

    constructor(
        eventBus: EventBus,
        draftRepository: DraftRepository,
        pickRepository: PickRepository,
        draftUserRepository: DraftUserRepository,
    ) {
        this.eventBus = eventBus;
        this.draftRepository = draftRepository;
        this.pickRepository = pickRepository;
        this.draftUserRepository = draftUserRepository;
    }

    /**
     * Updates the settings of a draft.
     *
     * @param draftId The ID of the draft.
     * @param settings The new settings for the draft.
     * @returns void
     * @throws An error if the settings are invalid, or the draft has started.
     */
    public async execute(draftId: number, settings: DraftSettings): Promise<void> {
        try {
            await this.draftRepository.updateDraftSettings(draftId, settings);

            // Get draft settings. If not found, throw an error.
            const draft: Draft | null = await this.draftRepository.getDraftByDraftId(draftId);
            if (!draft) {
                throw new Error();
            }

            const draftPicks: DraftPick[] = await this.pickRepository.getDraftPicks(draftId);

            // Get all the users that are part of the draft.
            const draftUsers: DraftUser[] = await this.draftUserRepository.getDraftUsers(draftId);

            // Get all the rosters for the draft teams, regardless of whether a user has claimed a team roster or not.
            const rosterPool: RosterPool = RosterPoolFactory.create(draft.settings, draftPicks, draftUsers);

            // Publish the draft details to the event bus, so that the data can be broadcasted from the web socket to the client.
            const event: DraftEvent = new DraftEvent(draftId, DraftEventEnum.DRAFT_SETTINGS_UPDATED, {
                draftId: draftId,
                settings: draft.settings,
                picks: draftPicks,
                rosters: rosterPool.getRosters(),
                users: draftUsers,
            });
            this.eventBus.publish(event);
        } catch {
            throw new Error("Unable to update draft");
        }
    }
}
