import { Draft, DraftPick, DraftUser } from "../../../../domain";
import { DraftRepository } from "../../../interfaces/repositories/DraftRepository";
import { DraftUserRepository } from "../../../interfaces/repositories/DraftUserRepository";
import { PickRepository } from "../../../interfaces/repositories/PickRepository";
import { Timeouter } from "../../../interfaces/time/Timeouter";
import { DraftStarter } from "../../../interfaces/use-cases/commands/DraftStarter";
import { PlayerAutoDrafter } from "../../../interfaces/use-cases/commands/PlayerAutoDrafter";
import { QueuedPlayerPicker } from "../../../interfaces/use-cases/commands/QueuedPlayerPicker";
import { TurnTimerStarter } from "../../../interfaces/use-cases/commands/TurnTimerStarter";

export class StartDraft implements DraftStarter {
    private readonly draftRepository: DraftRepository;

    private readonly pickRepository: PickRepository;

    private readonly draftUserRepository: DraftUserRepository;

    private readonly playerAutoDrafter: PlayerAutoDrafter;

    private readonly queuedPlayerPicker: QueuedPlayerPicker;

    private readonly startTurnTimer: TurnTimerStarter;

    private readonly timeouter: Timeouter;

    constructor(
        draftRepository: DraftRepository,
        pickRepository: PickRepository,
        draftUserRepository: DraftUserRepository,
        playerAutoDrafter: PlayerAutoDrafter,
        pickPlayerFromDraftQueue: QueuedPlayerPicker,
        startTurnTimer: TurnTimerStarter,
        timeouter: Timeouter,
    ) {
        this.draftRepository = draftRepository;
        this.pickRepository = pickRepository;
        this.draftUserRepository = draftUserRepository;
        this.playerAutoDrafter = playerAutoDrafter;
        this.queuedPlayerPicker = pickPlayerFromDraftQueue;
        this.startTurnTimer = startTurnTimer;
        this.timeouter = timeouter;
    }

    async execute(draftId: number): Promise<void> {
        // TODO: If the draft is already complete, do not start the draft.
        await this.draftRepository.startDraft(draftId);
        const draft: Draft | null = await this.draftRepository.getDraftByDraftId(draftId);
        const draftPicks: DraftPick[] = await this.pickRepository.getDraftPicks(draftId);

        if (!draft) {
            throw new Error("Draft not found");
        }

        for (let i = 0; i < draftPicks.length; i++) {
            const currentPick: DraftPick = draftPicks[i];
            const currentUser: DraftUser | null = await this.draftUserRepository.getDraftUserByTeamNumber(
                draftId,
                currentPick.teamNumber,
            );
            let turnTimeLeft: number | null = null;

            if (currentUser && !currentUser.isAutoDrafting) {
                // If the user is not auto drafting, start the turn timer.
                turnTimeLeft = await this.startTurnTimer.execute(
                    draftId,
                    currentUser.userId,
                    draft.settings.pickTimeLimitSeconds,
                );
            }

            if (currentUser != null && turnTimeLeft != null && turnTimeLeft <= 0) {
                // If the user has not picked in time, set the user's auto draft status to true.
                this.draftUserRepository.setAutoDraftStatus(draftId, currentUser.userId, true);
                currentUser.isAutoDrafting = true;
            }

            if (!currentUser) {
                // When there is no user, pick a player for the current team.
                this.playerAutoDrafter.execute(draftId, draftPicks[i].pickNumber, draftPicks[i].teamNumber);
            } else if (currentUser.isAutoDrafting) {
                try {
                    // Try to pick a player from the user's queue. Throw an error if a player is not picked from the queue.
                    await this.queuedPlayerPicker.execute(draftId, currentUser.userId, currentPick.teamNumber);
                } catch {
                    this.playerAutoDrafter.execute(draftId, draftPicks[i].pickNumber, draftPicks[i].teamNumber);
                }
            }
            this.timeouter.execute(1000); // Wait for 1 second before moving to the next pick.
        }
        this.draftRepository.completeDraft(draftId);
    }
}
