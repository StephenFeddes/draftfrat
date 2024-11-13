import { StartDraft } from "../../../contracts/use-cases/StartDraft";

export class StartDraftHandler {
    private readonly socket: WebSocket;

    private readonly startDraft: StartDraft;

    constructor(socket: WebSocket, startDraft: StartDraft) {
        this.socket = socket;
        this.startDraft = startDraft;
    }

    public handle(draftId: number): void {
        this.socket.broadcastToRoom(
            event.getDraftId().toString(),
            event.getEventName(),
            event.getTimeLeft(),
        );
    }
}
