import { DraftPick, RosterPool, RosterPoolFactory, Player, Draft } from "../../../../domain";
import { RandomIntegerGenerator } from "../../../interfaces/random/RandomIntegerGenerator";
import { DraftRepository } from "../../../interfaces/repositories/DraftRepository";
import { DraftUserRepository } from "../../../interfaces/repositories/DraftUserRepository";
import { PickRepository } from "../../../interfaces/repositories/PickRepository";
import { PlayerAutoDrafter } from "../../../interfaces/use-cases/commands/PlayerAutoDrafter";
import { PickPlayer } from "../pick-player/PickPlayer";

export class AutoDraftPlayer implements PlayerAutoDrafter {
    private readonly pickPlayer: PickPlayer;

    private readonly pickRepository: PickRepository;

    private readonly draftRepository: DraftRepository;

    private readonly draftUserRepository: DraftUserRepository;

    private readonly randomIntegerGenerator: RandomIntegerGenerator;

    constructor(
        pickPlayer: PickPlayer,
        pickRepository: PickRepository,
        draftRepository: DraftRepository,
        draftUserRepository: DraftUserRepository,
        randomIntegerGenerator: RandomIntegerGenerator,
    ) {
        this.pickPlayer = pickPlayer;
        this.pickRepository = pickRepository;
        this.draftRepository = draftRepository;
        this.draftUserRepository = draftUserRepository;
        this.randomIntegerGenerator = randomIntegerGenerator;
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
            const randomIndex = this.randomIntegerGenerator.execute(0, 3);
            const randomPlayer = availablePlayers[randomIndex];

            if (rosterPool.getRoster(teamNumber).canAddPlayer(randomPlayer)) {
                this.pickPlayer.execute(draftId, randomPlayer.id, teamNumber);
                return;
            }

            /**
             * Update the eligible player pool because if the random player cannot be added to the roster,
             * then we know that no other player with the exact same position(s) as the random player can be
             * added to the roster.
             */
            availablePlayers = availablePlayers.filter((player) =>
                player.positions.some((position) => !randomPlayer.positions.includes(position)),
            );
        }
        // If no player can be drafted, throw an error. This should never happen.
        throw new Error("No player could be drafted");
    }
}
