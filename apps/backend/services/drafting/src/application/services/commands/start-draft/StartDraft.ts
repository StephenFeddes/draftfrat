import { Draft, DraftPick, DraftUser } from "../../../../domain";
import { DraftRepository, PickRepository, DraftUserRepository, AutoDraftPlayer, Timer } from "../../../../interfaces";
import { PickPlayerFromQueue } from "../pick-player-from-queue/PickPlayerFromQueue";
import { StartTurnTimer } from "../start-turn-timer/StartTurnTimer";

/**
 * Starts a draft.
 */
export class StartDraft {
    private readonly draftRepository: DraftRepository;

    private readonly pickRepository: PickRepository;

    private readonly draftUserRepository: DraftUserRepository;

    private readonly autoDraftPlayer: AutoDraftPlayer;

    private readonly pickPlayerFromDraftQueue: PickPlayerFromQueue;

    private readonly startTurnTimer: StartTurnTimer;

    private readonly timer: Timer;

    constructor(
        draftRepository: DraftRepository,
        pickRepository: PickRepository,
        draftUserRepository: DraftUserRepository,
        autoDraftPlayer: AutoDraftPlayer,
        pickPlayerFromDraftQueue: PickPlayerFromQueue,
        startTurnTimer: StartTurnTimer,
        timer: Timer,
    ) {
        this.draftRepository = draftRepository;
        this.pickRepository = pickRepository;
        this.draftUserRepository = draftUserRepository;
        this.autoDraftPlayer = autoDraftPlayer;
        this.pickPlayerFromDraftQueue = pickPlayerFromDraftQueue;
        this.startTurnTimer = startTurnTimer;
        this.timer = timer;
    }

    /**
     * Starts a draft.
     *
     * @param draftId The ID of the draft.
     * @returns void
     */
    async execute(draftId: number): Promise<void> {
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
            let turnTime: number | null = null;

            if (currentUser && !currentUser.isAutoDrafting) {
                // If the user is not auto drafting, start the turn timer.
                turnTime = await this.startTurnTimer.execute(
                    draftId,
                    currentUser.userId,
                    draft.settings.pickTimeLimitSeconds,
                );
            }

            if (currentUser != null && turnTime != null && turnTime <= 0) {
                // If the user has not picked in time, set the user's auto draft status to true.
                this.draftUserRepository.setAutoDraftStatus(draftId, currentUser.userId, true);
                currentUser.isAutoDrafting = true;
            }

            if (!currentUser) {
                // When there is no user, pick a player for the current team.
                this.autoDraftPlayer.execute(draftId, draftPicks[i].pickNumber, draftPicks[i].teamNumber);
            } else if (currentUser.isAutoDrafting) {
                try {
                    // Try to pick a player from the user's queue. Throw an error if a player is not picked from the queue.
                    await this.pickPlayerFromDraftQueue.execute(draftId, currentUser.userId, currentPick.teamNumber);
                } catch {
                    this.autoDraftPlayer.execute(draftId, draftPicks[i].pickNumber, draftPicks[i].teamNumber);
                }
            }
            this.timer.wait(1000); // Wait for 1 second before moving to the next pick.
        }
        this.draftRepository.completeDraft(draftId);
    }
}
