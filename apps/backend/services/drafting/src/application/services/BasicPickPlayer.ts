import {
    DraftRepository,
    EventBus,
    DraftPlayerRepository,
    DraftUserRepository,
    DraftPlayerQueueRepository,
    PickPlayer,
} from "../../contracts";
import {
    Player,
    DraftPick,
    DraftSettings,
    DraftEvent,
    DraftEventEnum,
    DraftRosterPool,
    DraftUser,
    DraftRoster,
    DraftRosterPoolFactory,
    DraftPlayerQueuePool,
} from "../../domain";

export class BasicPickPlayer implements PickPlayer {
    private readonly eventBus: EventBus;

    private readonly draftPlayerQueueRepository: DraftPlayerQueueRepository;

    private readonly draftPlayerRepository: DraftPlayerRepository;

    private readonly draftUserRepository: DraftUserRepository;

    private readonly draftRepository: DraftRepository;

    constructor(
        eventBus: EventBus,
        draftPlayerQueueRepository: DraftPlayerQueueRepository,
        draftPlayerRepository: DraftPlayerRepository,
        draftRepository: DraftRepository,
        draftUserRepository: DraftUserRepository,
    ) {
        this.eventBus = eventBus;
        this.draftPlayerQueueRepository = draftPlayerQueueRepository;
        this.draftPlayerRepository = draftPlayerRepository;
        this.draftRepository = draftRepository;
        this.draftUserRepository = draftUserRepository;
    }

    async execute(draftId: number, playerId: number, teamNumber: number): Promise<void> {
        const draftSettings: DraftSettings | null = await this.draftRepository.getDraftSettings(draftId);
        const draftPicks: DraftPick[] = await this.draftPlayerRepository.getDraftPicks(draftId);
        draftPicks.sort((a, b) => a.pickNumber - b.pickNumber);
        const currentPick = draftPicks.filter((pick) => pick.player === null)[0];
        const draftUsers: DraftUser[] = await this.draftUserRepository.getDraftUsers(draftId);

        const pickedPlayer: Player | null = await this.draftPlayerRepository.getPlayerById(playerId);

        if (!draftSettings || !pickedPlayer || !currentPick || currentPick?.teamNumber !== teamNumber) {
            return;
        }

        const draftRosterPool: DraftRosterPool = DraftRosterPoolFactory.create(draftSettings, draftPicks, draftUsers);
        const draftRoster: DraftRoster = draftRosterPool.getRoster(teamNumber);
        if (pickedPlayer && currentPick && draftSettings.isStarted && draftRoster.canAddPlayer(pickedPlayer)) {
            draftRoster.addPlayer(pickedPlayer);
            this.draftPlayerRepository.pickPlayer(draftId, pickedPlayer.id, currentPick.pickNumber, teamNumber);
            const playersLeft: Player[] = await this.draftPlayerRepository.getAvailablePlayers(draftId);
            currentPick.player = pickedPlayer;
            draftPicks[currentPick.pickNumber - 1] = currentPick;
            const queuedPlayers = await this.draftPlayerQueueRepository.getQueuedDraftPlayers(draftId);
            const draftPlayerQueuePool = new DraftPlayerQueuePool(draftId, queuedPlayers);

            const playerPickedEvent: DraftEvent = new DraftEvent(draftId, DraftEventEnum.PLAYER_PICKED, {
                picks: draftPicks.map((pick) => pick.toJSON()),
                rosters: draftRosterPool.toJSON(),
                playersAvailable: playersLeft.map((player) => player.toJSON()),
                queues: draftPlayerQueuePool.toJSON(),
            });
            this.eventBus.publish(playerPickedEvent);
        } else {
            throw new Error("Player cannot be picked");
        }
    }
}
