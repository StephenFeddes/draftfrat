import { BasicStartTurnTimer } from "../../../../src/application";
import { StartTurnTimer, Timer } from "../../../../src/contracts";
import { DraftEvent, DraftEventEnum } from "../../../../src/domain";
import { InMemoryEventBus } from "../../../../src/infrastructure";

describe("BasicStartTurnTimer", () => {
    let startTurnTimer: StartTurnTimer;
    let eventBus: InMemoryEventBus;
    let mockTimer: Timer;

    beforeEach(() => {
        eventBus = new InMemoryEventBus();
        mockTimer = { wait: jest.fn().mockResolvedValue(undefined) };
        startTurnTimer = new BasicStartTurnTimer(eventBus, mockTimer);
    });

    it("should tick the timer down", async () => {
        const times: number[] = [];
        const draftId: number = 1;
        const userId: number = 1;

        const eventProcessed = new Promise<void>((resolve) => {
            eventBus.subscribe(DraftEventEnum.TURN_TIME_TICKED, (event: DraftEvent) => {
                const time = event.getEventData();
                times.push(time);
                if (time <= 0) {
                    eventBus.publish(new DraftEvent(draftId, DraftEventEnum.PLAYER_PICKED, null));
                    resolve();
                }
            });
        });

        startTurnTimer.execute(draftId, userId, 5);
        await eventProcessed;

        expect(times).toEqual([5, 4, 3, 2, 1, 0]);
    });

    it("should freeze until a player is picked if the time limit is null", async () => {
        const draftId: number = 1;
        const userId: number = 1;

        // Publish the PLAYER_PICKED event after a slight delay
        const eventPublishPromise = new Promise<void>((resolve) => {
            setImmediate(() => {
                eventBus.publish(new DraftEvent(draftId, DraftEventEnum.PLAYER_PICKED, null));
                resolve();
            });
        });

        // Execute the timer logic
        const executePromise = startTurnTimer.execute(draftId, userId, null);

        // Wait for the PLAYER_PICKED event to be published
        await eventPublishPromise;

        // Then test the result of the timer execution
        const result = await executePromise;

        expect(result).toBeNull();
    });

    it("should start draft and interrupt the turn timer when a user picks a player", async () => {
        const times: number[] = [];
        const draftId: number = 1;
        const userId: number = 1;

        const eventProcessed = new Promise<void>((resolve) => {
            eventBus.subscribe(DraftEventEnum.TURN_TIME_TICKED, (event: DraftEvent) => {
                const time = event.getEventData();
                times.push(time);

                if (time <= 3) {
                    eventBus.publish(new DraftEvent(draftId, DraftEventEnum.PLAYER_PICKED, null));
                    resolve();
                }
            });
        });

        startTurnTimer.execute(draftId, userId, 5);
        await eventProcessed;

        expect(times).toEqual([5, 4, 3]);
    });

    it("should start draft and interrupt the turn timer when a user's auto draft status is changed", async () => {
        const timeLimit: number = 5;
        const times: number[] = [];
        const draftId: number = 1;
        const userId: number = 1;

        const eventProcessed = new Promise<void>((resolve) => {
            eventBus.subscribe(DraftEventEnum.TURN_TIME_TICKED, (event: DraftEvent) => {
                const time = event.getEventData();
                times.push(time);

                if (time <= 3) {
                    eventBus.publish(new DraftEvent(draftId, DraftEventEnum.AUTO_DRAFT_CHANGE, { userId }));
                    resolve();
                }
            });
        });

        const executePromise = startTurnTimer.execute(draftId, userId, timeLimit);

        await eventProcessed;
        const result = await executePromise;

        expect(times).toEqual([5, 4, 3]);
        expect(result).toBe(0);
    });
});
