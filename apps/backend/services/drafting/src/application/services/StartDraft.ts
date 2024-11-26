import { DraftPick, DraftSettings, DraftUser } from "../../domain";
import {
    DraftRepository,
    DraftPlayerRepository,
    DraftUserRepository,
    AutoDraftPlayer,
    StartTurnTimer,
    Timer,
} from "../../contracts";

export class StartDraft {
    private readonly draftRepository: DraftRepository;

    private readonly draftPlayerRepository: DraftPlayerRepository;

    private readonly draftUserRepository: DraftUserRepository;

    private readonly autoDraftPlayer: AutoDraftPlayer;

    private readonly startTurnTimer: StartTurnTimer;

    private readonly timer: Timer;

    constructor(
        draftRepository: DraftRepository,
        draftPlayerRepository: DraftPlayerRepository,
        draftUserRepository: DraftUserRepository,
        autoDraftPlayer: AutoDraftPlayer,
        startTurnTimer: StartTurnTimer,
        timer: Timer,
    ) {
        this.draftRepository = draftRepository;
        this.draftPlayerRepository = draftPlayerRepository;
        this.draftUserRepository = draftUserRepository;
        this.autoDraftPlayer = autoDraftPlayer;
        this.startTurnTimer = startTurnTimer;
        this.timer = timer;
    }

    async execute(draftId: number): Promise<void> {
        await this.draftRepository.startDraft(draftId);
        const draftSettings: DraftSettings | null = await this.draftRepository.getDraftSettings(draftId);
        const draftPicks: DraftPick[] = await this.draftPlayerRepository.getDraftPicks(draftId);

        if (!draftSettings) {
            return;
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
                turnTime = await this.startTurnTimer.execute(draftId, currentUser.userId, draftSettings.pickTimeLimit);
            }

            if (currentUser && turnTime && turnTime <= 0) {
                // If the user has not picked in time, set the user's auto draft status to true.
                this.draftUserRepository.setAutoDraftStatus(draftId, currentUser.userId, false);
                currentUser.setIsAutoDrafting(true);
            }

            if (!currentUser || currentUser.isAutoDrafting) {
                // When there is no user, or the user is auto drafting, pick a player for the current team.
                this.autoDraftPlayer.execute(draftId, draftPicks[i].pickNumber, draftPicks[i].teamNumber);
            }
            this.timer.wait(1000); // Wait for 1 second before moving to the next pick.
        }
    }
}
