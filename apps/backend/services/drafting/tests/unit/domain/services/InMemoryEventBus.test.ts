import { DraftEvent, DraftEventEnum, InMemoryEventBus } from "../../../../src/domain";

describe("InMemoryEventBus", () => {
    let eventBus: InMemoryEventBus;
    let mockHandler1: jest.Mock;
    let mockHandler2: jest.Mock;
    let eventA: DraftEvent;
    let eventB: DraftEvent;

    beforeEach(() => {
        eventBus = new InMemoryEventBus();
        mockHandler1 = jest.fn();
        mockHandler2 = jest.fn();
        eventA = new DraftEvent(1, DraftEventEnum.JOINED_DRAFT, { data: "test" });
        eventB = new DraftEvent(2, DraftEventEnum.PLAYER_PICKED, { data: "test2" });
    });

    test("should subscribe and handle events", () => {
        eventBus.subscribe(DraftEventEnum.JOINED_DRAFT, mockHandler1);
        eventBus.publish(eventA);

        expect(mockHandler1).toHaveBeenCalledTimes(1);
        expect(mockHandler1).toHaveBeenCalledWith(eventA);
    });

    test("should not call unsubscribed handlers", () => {
        eventBus.subscribe(DraftEventEnum.JOINED_DRAFT, mockHandler1);
        eventBus.unsubscribe(DraftEventEnum.JOINED_DRAFT, mockHandler1);
        eventBus.publish(eventA);

        expect(mockHandler1).not.toHaveBeenCalled();
    });

    test("should handle multiple subscribers for the same event", () => {
        eventBus.subscribe(DraftEventEnum.JOINED_DRAFT, mockHandler1);
        eventBus.subscribe(DraftEventEnum.JOINED_DRAFT, mockHandler2);
        eventBus.publish(eventA);

        expect(mockHandler1).toHaveBeenCalledTimes(1);
        expect(mockHandler1).toHaveBeenCalledWith(eventA);
        expect(mockHandler2).toHaveBeenCalledTimes(1);
        expect(mockHandler2).toHaveBeenCalledWith(eventA);
    });

    test("should handle multiple events", () => {
        eventBus.subscribe(DraftEventEnum.JOINED_DRAFT, mockHandler1);
        eventBus.subscribe(DraftEventEnum.PLAYER_PICKED, mockHandler2);

        eventBus.publish(eventA);
        eventBus.publish(eventB);

        expect(mockHandler1).toHaveBeenCalledTimes(1);
        expect(mockHandler1).toHaveBeenCalledWith(eventA);
        expect(mockHandler2).toHaveBeenCalledTimes(1);
        expect(mockHandler2).toHaveBeenCalledWith(eventB);
    });

    test("should publish all events in publishAll()", () => {
        eventBus.subscribe(DraftEventEnum.JOINED_DRAFT, mockHandler1);
        eventBus.subscribe(DraftEventEnum.PLAYER_PICKED, mockHandler2);

        eventBus.publishAll([eventA, eventB]);

        expect(mockHandler1).toHaveBeenCalledTimes(1);
        expect(mockHandler1).toHaveBeenCalledWith(eventA);
        expect(mockHandler2).toHaveBeenCalledTimes(1);
        expect(mockHandler2).toHaveBeenCalledWith(eventB);
    });

    test("should not throw error if no handlers are subscribed for an event", () => {
        expect(() => eventBus.publish(eventA)).not.toThrow();
    });

    test("should only remove the specified handler when unsubscribing", () => {
        eventBus.subscribe(DraftEventEnum.JOINED_DRAFT, mockHandler1);
        eventBus.subscribe(DraftEventEnum.JOINED_DRAFT, mockHandler2);

        eventBus.unsubscribe(DraftEventEnum.JOINED_DRAFT, mockHandler1);
        eventBus.publish(eventA);

        expect(mockHandler1).not.toHaveBeenCalled();
        expect(mockHandler2).toHaveBeenCalledTimes(1);
    });
});
