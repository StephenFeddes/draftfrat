import {
    DraftEvent,
    DraftEventEnum,
    DraftPick,
    DraftRosterPool,
    DraftRosterPoolFactory,
    DraftSettings,
    Player,
} from "../../domain";
import {
    AutoDraftPlayer,
    DraftPlayerRepository,
    DraftRepository,
    DraftUserRepository,
    PickPlayer,
    RandomIndexGenerator,
} from "../../contracts";

export class RandomAutoDraftPlayer implements AutoDraftPlayer {
    private readonly pickPlayer: PickPlayer;

    private readonly draftPlayerRepository: DraftPlayerRepository;

    private readonly draftRepository: DraftRepository;

    private readonly draftUserRepository: DraftUserRepository;

    private readonly randomIndexGenerator: RandomIndexGenerator;

    constructor(
        pickPlayer: PickPlayer,
        draftPlayerRepository: DraftPlayerRepository,
        draftRepository: DraftRepository,
        draftUserRepository: DraftUserRepository,
        randomIndexGenerator: RandomIndexGenerator,
    ) {
        this.pickPlayer = pickPlayer;
        this.draftPlayerRepository = draftPlayerRepository;
        this.draftRepository = draftRepository;
        this.draftUserRepository = draftUserRepository;
        this.randomIndexGenerator = randomIndexGenerator;
    }

    async execute(draftId: number, pickNumber: number, teamNumber: number): Promise<void> {
        let availablePlayers: Player[] = await this.draftPlayerRepository.getAvailablePlayers(draftId);
        const draftPicks: DraftPick[] = await this.draftPlayerRepository.getDraftPicks(draftId);
        const currentPick: DraftPick | undefined = draftPicks.find(
            (pick) => pick.pickNumber === pickNumber && pick.teamNumber === teamNumber,
        );
        const settings: DraftSettings | null = await this.draftRepository.getDraftSettings(draftId);

        if (!settings || !currentPick) {
            return;
        }

        const rosterPool: DraftRosterPool = DraftRosterPoolFactory.create(
            settings,
            await draftPicks,
            await this.draftUserRepository.getDraftUsers(draftId),
        );

        // Randomly select a player from the available players list.
        // Randomly choose one from the top 3. If the player can't be added, filter similar players out.
        for (let i = 0; i < availablePlayers.length; i++) {
            const randomIndex = this.randomIndexGenerator.generate(3); // Generate random index once
            const randomPlayer = availablePlayers[randomIndex]; // Use the index to get the player

            if (rosterPool.getRoster(teamNumber).canAddPlayer(randomPlayer)) {
                this.pickPlayer.execute(draftId, randomPlayer.id, pickNumber, teamNumber);
                break;
            } else {
                /**
                 * Update the eligible player pool because if the random player cannot be added to the roster,
                 * then we know that no other player with the exact same position(s) as the random player can be
                 * added to the roster.
                 */
                availablePlayers = availablePlayers.filter((player) =>
                    player.getPositions().some((position) => !randomPlayer.getPositions().includes(position)),
                );
            }
        }
    }
}
