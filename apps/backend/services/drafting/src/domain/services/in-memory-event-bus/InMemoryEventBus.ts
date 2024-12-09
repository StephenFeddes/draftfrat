import { EventBus } from "../../../interfaces";
import { DraftEvent } from "../..";

export class InMemoryEventBus implements EventBus {
    private handlers: { [eventName: string]: ((event: DraftEvent) => void)[] } = {};

    // Subscribe a handler to an event
    subscribe(eventName: string, handler: (event: DraftEvent) => void): void {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }
        this.handlers[eventName].push(handler);
    }

    // Unsubscribe a handler from an event
    unsubscribe(eventName: string, handler: (event: DraftEvent) => void): void {
        if (this.handlers[eventName]) {
            this.handlers[eventName] = this.handlers[eventName].filter((h) => h !== handler);
        }
    }

    // Publish a single event
    publish(event: DraftEvent): void {
        const eventName = event.getEventName();
        const eventHandlers = this.handlers[eventName] || [];

        eventHandlers.forEach((handler) => handler(event));
    }

    // Publish multiple events
    publishAll(events: DraftEvent[]): void {
        events.forEach((event) => this.publish(event));
    }
}
