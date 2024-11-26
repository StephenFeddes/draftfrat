import { EventBus, StartTurnTimer, Timer } from "../../contracts";
import { DraftEvent, DraftEventEnum, DraftUser } from "../../domain";

export class BasicStartTurnTimer implements StartTurnTimer {
    private readonly eventBus: EventBus;

    private readonly timer: Timer;

    constructor(eventBus: EventBus, timer: Timer) {
        this.eventBus = eventBus;
        this.timer = timer;
    }

    async execute(draftId: number, userId: number, timeLimit: number | null): Promise<number | null> {
        const eventProcessed = new Promise<void>((resolve) => {
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
            this.eventBus.subscribe(DraftEventEnum.AUTO_DRAFT_CHANGE, (event: DraftEvent) => {
                if (event.getDraftId() === draftId && event.getEventData().userId === userId) {
                    /**
                     * Returns 0 so that the timer stops. Auto draft will be triggered and the user's 
                     * auto draft status will be set to true because the StartDraft service will see that
                     * the time is 0, meaning the user has not picked a player in time.
                     * */
                    isAutoDrafting = true;
                }
            });
            for (let currentTurnTime = timeLimit; currentTurnTime >= 0; currentTurnTime--) {
                if (isAutoDrafting) {
                    return 0;
                } else if (!isTimerRunning) {
                    return currentTurnTime;
                }
                const timeTickedEvent: DraftEvent = new DraftEvent(
                    draftId,
                    DraftEventEnum.TURN_TIME_TICKED,
                    currentTurnTime,
                );
                this.eventBus.publish(timeTickedEvent);
                await this.timer.wait(1000);
            }
            return 0;
        }

        await eventProcessed;
        return null;
    }
}
