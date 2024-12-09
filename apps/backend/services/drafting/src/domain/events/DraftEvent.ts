import { z } from "zod";
import { DraftEventEnum } from "../enums/DraftEventEnum";

export class DraftEvent {
    private readonly draftId: number;

    private eventName: DraftEventEnum;

    private eventData: any;

    constructor(draftId: number, eventName: DraftEventEnum, eventData: any) {
        this.draftId = draftId;
        this.eventName = eventName;
        this.eventData = eventData;
    }

    public getDraftId(): number {
        return this.draftId;
    }

    public getEventName(): DraftEventEnum {
        return this.eventName;
    }

    public getEventData(): any {
        return this.eventData;
    }
}

export const DraftEventSchema = z.object({
    draftId: z.number().int().positive(),
    eventName: z.nativeEnum(DraftEventEnum),
    eventData: z.unknown(),
});
