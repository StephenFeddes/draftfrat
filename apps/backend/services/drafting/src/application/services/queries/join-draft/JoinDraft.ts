import {
    PlayerQueueRepository,
    PickRepository,
    DraftRepository,
    DraftUserRepository,
    EventBus,
} from "../../../../interfaces";
import {
    DraftEvent,
    DraftEventEnum,
    DraftPick,
    DraftUser,
    RosterPool,
    Player,
    RosterPoolFactory,
    PlayerQueuePool,
    Draft,
} from "../../../../domain";

/**
 * Joins a user to a draft and sends the current draft state to the user.
 */
export class JoinDraft {
    private readonly eventBus: EventBus;

    private readonly playerQueueRepository: PlayerQueueRepository;

    private readonly pickRepository: PickRepository;

    private readonly draftUserRepository: DraftUserRepository;

    private readonly draftRepository: DraftRepository;

    constructor(
        eventBus: EventBus,
        playerQueueRepository: PlayerQueueRepository,
        pickRepository: PickRepository,
        draftRepository: DraftRepository,
        draftUserRepository: DraftUserRepository,
    ) {
        this.eventBus = eventBus;
        this.playerQueueRepository = playerQueueRepository;
        this.pickRepository = pickRepository;
        this.draftRepository = draftRepository;
        this.draftUserRepository = draftUserRepository;
    }

    /**
     * Joins a user to a draft.
     * - Updates the draft state to include the new user.
     * - The new user is sent the current draft state.
     *
     * @param draftId The ID of the draft.
     * @returns void
     */
    async execute(draftId: number): Promise<void> {
        const draftPicks: DraftPick[] = await this.pickRepository.getDraftPicks(draftId);
        const draft: Draft | null = await this.draftRepository.getDraftByDraftId(draftId);
        if (!draft) {
            throw new Error("Draft not found");
        }
        const draftUsers: DraftUser[] = await this.draftUserRepository.getDraftUsers(draftId);

        // Get all the rosters for the draft teams, regardless of whether a user has claimed a team roster or not.
        const rosterPool: RosterPool = RosterPoolFactory.create(draft.settings, draftPicks, draftUsers);
        const availablePlayers: Player[] = await this.pickRepository.getAvailablePlayers(draftId);

        // Get each user's queue of players that they have queued up to draft.
        const queuedPlayers = await this.playerQueueRepository.getQueuedDraftPlayers(draftId);
        const draftPlayerQueuePool = new PlayerQueuePool(draftId, queuedPlayers);

        const event: DraftEvent = new DraftEvent(draftId, DraftEventEnum.JOINED_DRAFT, {
            draftId,
            settings: draft.settings,
            picks: draftPicks,
            rosters: rosterPool.getRosters(),
            availablePlayers: availablePlayers,
            users: draftUsers,
            queues: draftPlayerQueuePool.getQueues(),
        });
        this.eventBus.publish(event);
    }
}
