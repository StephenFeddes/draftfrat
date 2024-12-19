import { StartTurnTimer } from "./StartTurnTimer";
import { DraftEvent, DraftEventEnum } from "../../../../domain";
import { Timeouter } from "../../../interfaces/time/Timeouter";
import { InMemoryEventBus } from "../../../../infrastructure/event-bus/InMemoryEventBus";

describe("StartTurnTimer", () => {
    let startTurnTimer: StartTurnTimer;
    let eventBus: InMemoryEventBus;
    let timeout: Timeouter;

    beforeEach(() => {
        eventBus = new InMemoryEventBus();
        timeout = { execute: jest.fn() };
        startTurnTimer = new StartTurnTimer(eventBus, timeout);
    });

    it("should tick the timer down", async () => {
        // Arrange
        const draftId: number = 1;
        const userId: number = 1;

        // Act
        const times: number[] = [];
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

        // Assert
        expect(times).toEqual([5, 4, 3, 2, 1, 0]);
    });

    it("should freeze until a player is picked if the time limit is null", async () => {
        // Arrange
        const draftId: number = 1;
        const userId: number = 1;

        // Act
        const eventPublishPromise = new Promise<void>((resolve) => {
            setImmediate(() => {
                eventBus.publish(new DraftEvent(draftId, DraftEventEnum.PLAYER_PICKED, null));
                resolve();
            });
        }); // This is to simulate the event being published after the timer has started
        const executePromise = startTurnTimer.execute(draftId, userId, null);
        await eventPublishPromise; // Wait for the event to be published
        const result = await executePromise; // Get the result after the event is published

        // Assert
        expect(result).toBeNull();
    });

    it("should interrupt the turn timer when a user picks a player", async () => {
        // Arrange
        const draftId: number = 1;
        const userId: number = 1;

        // Act
        const times: number[] = [];
        const eventProcessed = new Promise<void>((resolve) => {
            eventBus.subscribe(DraftEventEnum.TURN_TIME_TICKED, (event: DraftEvent) => {
                const time = event.getEventData();
                times.push(time);

                if (time <= 3) {
                    eventBus.publish(new DraftEvent(draftId, DraftEventEnum.PLAYER_PICKED, null));
                    resolve();
                }
            });
        }); // This is to simulate the event being published after the timer has started
        await startTurnTimer.execute(draftId, userId, 5); // Start the timer
        await eventProcessed; // Wait for the timer to be interrupted

        expect(times).toEqual([5, 4, 3]);
    });

    it("should interrupt the turn timer when a user's auto draft status is changed", async () => {
        // Arrange
        const timeLimit: number = 5;
        const draftId: number = 1;
        const userId: number = 1;

        // Act
        const times: number[] = [];
        const eventProcessed = new Promise<void>((resolve) => {
            eventBus.subscribe(DraftEventEnum.TURN_TIME_TICKED, (event: DraftEvent) => {
                const time = event.getEventData();
                times.push(time);

                if (time <= 3) {
                    eventBus.publish(new DraftEvent(draftId, DraftEventEnum.AUTO_DRAFTING_CHANGED, { userId }));
                    resolve();
                }
            });
        }); // This is to simulate the event being published after the timer has started
        const executePromise = startTurnTimer.execute(draftId, userId, timeLimit);
        await eventProcessed; // Wait for the auto draft status to be changed
        const result = await executePromise; // Get the result after the auto draft status is changed

        // Assert
        expect(times).toEqual([5, 4, 3]);
        expect(result).toBe(0);
    });
});
