import { DraftEvent, DraftEventEnum } from "../../../../domain";
import { EventBus } from "../../../interfaces/event-bus/EventBus";
import { Timeouter } from "../../../interfaces/time/Timeouter";
import { TurnTimerStarter } from "../../../interfaces/use-cases/commands/TurnTimerStarter";

export class StartTurnTimer implements TurnTimerStarter {
    private readonly eventBus: EventBus;

    private readonly timeout: Timeouter;

    constructor(eventBus: EventBus, timeout: Timeouter) {
        this.eventBus = eventBus;
        this.timeout = timeout;
    }

    async execute(draftId: number, userId: number, timeLimit: number | null): Promise<number | null> {
        const waitForPlayerPick: Promise<void> = new Promise<void>((resolve) => {
            this.eventBus.subscribe(DraftEventEnum.PLAYER_PICKED, (event: DraftEvent) => {
                if (event.getDraftId() === draftId) {
                    resolve();
                }
            });
        });

        if (timeLimit) {
            let isTimerRunning = true;
            let isAutoDrafting = false;

            this.eventBus.subscribe(DraftEventEnum.PLAYER_PICKED, (event: DraftEvent) => {
                if (event.getDraftId() === draftId) {
                    isTimerRunning = false;
                }
            });

            this.eventBus.subscribe(DraftEventEnum.AUTO_DRAFTING_CHANGED, (event: DraftEvent) => {
                if (event.getDraftId() === draftId && event.getEventData().userId === userId) {
                    isAutoDrafting = true;
                }
            });

            for (let currentTurnTime = timeLimit; currentTurnTime >= 0; currentTurnTime--) {
                if (isAutoDrafting) {
                    // When auto-drafting is enabled for a user, the timer returns 0 so that the auto-drafter can pick a player.
                    return 0;
                }
                if (!isTimerRunning) {
                    return currentTurnTime; // Return the time remaining when the user picks a player
                }

                const timeTickedEvent: DraftEvent = new DraftEvent(
                    draftId,
                    DraftEventEnum.TURN_TIME_TICKED,
                    currentTurnTime,
                );
                this.eventBus.publish(timeTickedEvent);
                await this.timeout.execute(1000);
            }
            return 0; // Return 0 when the timer expires, indicating that the user has not picked a player in time.
        }

        await waitForPlayerPick; // When there is no time limit, wait for the player to pick a player.
        return null; // Returning null means that there is no time remaining returned because there was no time limit.
    }
}
