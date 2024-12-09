import { DraftPick, RosterPool, RosterPoolFactory, Player, Draft } from "../../../../domain";
import {
    AutoDraftPlayer,
    PickRepository,
    DraftRepository,
    DraftUserRepository,
    RandomIndexGenerator,
} from "../../../../interfaces";
import { PickPlayer } from "../pick-player/PickPlayer";

export class RandomAutoDraftPlayer implements AutoDraftPlayer {
    private readonly pickPlayer: PickPlayer;

    private readonly pickRepository: PickRepository;

    private readonly draftRepository: DraftRepository;

    private readonly draftUserRepository: DraftUserRepository;

    private readonly randomIndexGenerator: RandomIndexGenerator;

    constructor(
        pickPlayer: PickPlayer,
        pickRepository: PickRepository,
        draftRepository: DraftRepository,
        draftUserRepository: DraftUserRepository,
        randomIndexGenerator: RandomIndexGenerator,
    ) {
        this.pickPlayer = pickPlayer;
        this.pickRepository = pickRepository;
        this.draftRepository = draftRepository;
        this.draftUserRepository = draftUserRepository;
        this.randomIndexGenerator = randomIndexGenerator;
    }

    async execute(draftId: number, pickNumber: number, teamNumber: number): Promise<void> {
        let availablePlayers: Player[] = await this.pickRepository.getAvailablePlayers(draftId);
        const draftPicks: DraftPick[] = await this.pickRepository.getDraftPicks(draftId);
        const currentPick: DraftPick | undefined = draftPicks.find(
            (pick) => pick.pickNumber === pickNumber && pick.teamNumber === teamNumber,
        );
        const draft: Draft | null = await this.draftRepository.getDraftByDraftId(draftId);

        if (!draft || !currentPick) {
            return;
        }

        const rosterPool: RosterPool = RosterPoolFactory.create(
            draft.settings,
            draftPicks,
            await this.draftUserRepository.getDraftUsers(draftId),
        );

        // Randomly select a player from the available players list.
        // Randomly choose one from the top 3. If the player can't be added, filter similar players out.
        for (let i = 0; i < availablePlayers.length; i++) {
            const randomIndex = this.randomIndexGenerator.generate(0, 3); // Generate random index once
            const randomPlayer = availablePlayers[randomIndex]; // Use the index to get the player

            if (rosterPool.getRoster(teamNumber).canAddPlayer(randomPlayer)) {
                this.pickPlayer.execute(draftId, randomPlayer.id, teamNumber);
                break;
            } else {
                /**
                 * Update the eligible player pool because if the random player cannot be added to the roster,
                 * then we know that no other player with the exact same position(s) as the random player can be
                 * added to the roster.
                 */
                availablePlayers = availablePlayers.filter((player) =>
                    player.positions.some((position) => !randomPlayer.positions.includes(position)),
                );
            }
        }
    }
}
