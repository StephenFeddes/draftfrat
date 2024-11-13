import { WebSocket } from "../../contracts/use-cases/WebSocket";
import { StartDraft } from "../../contracts/use-cases/StartDraft";

export class StartDraftUseCase implements StartDraft {
    private readonly socket: WebSocket;

    constructor(socket: WebSocket) {
        this.socket = socket;
    }

    async execute(draftId: number): Promise<void> {
        this.socket.join(`draft:${draftId}`);
    }
}
