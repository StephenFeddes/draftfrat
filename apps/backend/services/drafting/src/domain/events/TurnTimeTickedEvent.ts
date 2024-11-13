import { DomainEvent } from "../../contracts/events/DomainEvent";
import { DomainEventEnum } from "../enums/DomainEventEnum";

export class TurnTimeTickedEvent implements DomainEvent {
    private readonly draftId: number;

    private readonly timeLeft: number;

    constructor(draftId: number, timeLeft: number) {
        this.draftId = draftId;
        this.timeLeft = timeLeft;
    }

    public getDraftId(): number {
        return this.draftId;
    }

    public getTimeLeft(): number {
        return this.timeLeft;
    }

    public getEventName(): DomainEventEnum {
        return DomainEventEnum.TURN_TIME_TICKED;
    }
}
