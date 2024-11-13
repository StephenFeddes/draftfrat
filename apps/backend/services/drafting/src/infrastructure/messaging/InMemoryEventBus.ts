import { DomainEvent } from "../../contracts/events/DomainEvent";

export class EventBus {
    // eslint-disable-next-line no-use-before-define
    private static instance: EventBus;

    private handlers: { [eventName: string]: ((event: DomainEvent) => void)[] } = {};

    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    // Subscribe a handler to an event
    subscribe(eventName: string, handler: (event: DomainEvent) => void): void {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }
        this.handlers[eventName].push(handler);
    }

    // Unsubscribe a handler from an event
    unsubscribe(eventName: string, handler: (event: DomainEvent) => void): void {
        if (this.handlers[eventName]) {
            this.handlers[eventName] = this.handlers[eventName].filter((h) => h !== handler);
        }
    }

    // Publish a single event
    publish(event: DomainEvent): void {
        const eventName = event.getEventName();
        const eventHandlers = this.handlers[eventName] || [];

        eventHandlers.forEach((handler) => handler(event));
    }

    // Publish multiple events
    publishAll(events: DomainEvent[]): void {
        events.forEach((event) => this.publish(event));
    }
}
