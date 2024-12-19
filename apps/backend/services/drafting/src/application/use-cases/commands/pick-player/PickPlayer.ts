import {
    Player,
    DraftPick,
    DraftEvent,
    DraftEventEnum,
    RosterPool,
    DraftUser,
    Roster,
    RosterPoolFactory,
    PlayerQueuePool,
    Draft,
} from "../../../../domain";
import { EventBus } from "../../../interfaces/event-bus/EventBus";
import { DraftRepository } from "../../../interfaces/repositories/DraftRepository";
import { DraftUserRepository } from "../../../interfaces/repositories/DraftUserRepository";
import { PickRepository } from "../../../interfaces/repositories/PickRepository";
import { PlayerQueueRepository } from "../../../interfaces/repositories/PlayerQueueRepository";
import { PlayerPicker } from "../../../interfaces/use-cases/commands/PlayerPicker";

export class PickPlayer implements PlayerPicker {
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

    async execute(draftId: number, playerId: number, teamNumber: number): Promise<void> {
        const draft: Draft | null = await this.draftRepository.getDraftByDraftId(draftId);
        const draftPicks: DraftPick[] = await this.pickRepository.getDraftPicks(draftId);
        draftPicks.sort((a, b) => a.pickNumber - b.pickNumber);
        const currentPick = draftPicks.filter((pick) => pick.player === null)[0];
        const draftUsers: DraftUser[] = await this.draftUserRepository.getDraftUsers(draftId);

        const pickedPlayer: Player | null = await this.pickRepository.getPlayerById(playerId);

        if (!draft?.settings) {
            throw new Error("Draft settings not found");
        } else if (!pickedPlayer) {
            throw new Error("Player not found");
        } else if (!currentPick) {
            throw new Error("No pick available");
        } else if (!draft.isStarted) {
            throw new Error("Draft has not started");
        } else if (currentPick.teamNumber !== teamNumber) {
            throw new Error(`It is not team ${teamNumber}'s turn`);
        }

        const rosterPool: RosterPool = RosterPoolFactory.create(draft.settings, draftPicks, draftUsers);
        const roster: Roster = rosterPool.getRoster(teamNumber);
        if (roster.canAddPlayer(pickedPlayer)) {
            this.pickRepository.pickPlayer(draftId, pickedPlayer.id, currentPick.pickNumber, teamNumber);
            roster.addPlayer(pickedPlayer);

            const availablePlayers: Player[] = await this.pickRepository.getAvailablePlayers(draftId);

            currentPick.player = pickedPlayer;
            draftPicks[currentPick.pickNumber - 1] = currentPick;

            const queuedPlayers = await this.playerQueueRepository.getQueuedDraftPlayers(draftId);
            const draftPlayerQueuePool = new PlayerQueuePool(draftId, queuedPlayers);

            const playerPickedEvent: DraftEvent = new DraftEvent(draftId, DraftEventEnum.PLAYER_PICKED, {
                picks: draftPicks,
                rosters: rosterPool.getRosters(),
                availablePlayers: availablePlayers,
                queues: draftPlayerQueuePool.getQueues(),
            });
            this.eventBus.publish(playerPickedEvent);
        } else {
            throw new Error("Player cannot be picked");
        }
    }
}
