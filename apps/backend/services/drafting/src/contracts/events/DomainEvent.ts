import { DomainEventEnum } from "../../domain/enums/DomainEventEnum";

export interface DomainEvent {
    getEventName(): DomainEventEnum;
}
