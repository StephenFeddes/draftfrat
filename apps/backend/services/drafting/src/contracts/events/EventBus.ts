import { DomainEvent } from "../../contracts/events/DomainEvent";
import { DomainEventEnum } from "../../domain/enums/DomainEventEnum";

type EventHandler = (event: DomainEvent) => void;

export interface EventBus {
    subscribe(eventName: DomainEventEnum, handler: EventHandler): void;

    unsubscribe(eventName: DomainEventEnum, handler: EventHandler): void;

    publish(event: DomainEvent): void;

    publishAll(events: DomainEvent[]): void;
}
