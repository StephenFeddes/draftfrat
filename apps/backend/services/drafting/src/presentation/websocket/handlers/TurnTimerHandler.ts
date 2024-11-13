import { WebSocket } from "../../../contracts/use-cases/WebSocket";
import { TurnTimeTickedEvent } from "../../../domain/events/TurnTimeTickedEvent";

export class TurnTimerHandler {
    private readonly socket: WebSocket;

    constructor(socket: WebSocket) {
        this.socket = socket;
    }

    public handle(event: TurnTimeTickedEvent): void {
        this.socket.broadcastToRoom(
            event.getDraftId().toString(),
            event.getEventName(),
            event.getTimeLeft(),
        );
    }
}
