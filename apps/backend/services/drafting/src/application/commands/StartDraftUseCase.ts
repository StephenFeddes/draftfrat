import { DraftRepository } from "../../contracts/repositories/DraftRepository";
import { TurnTimeRepository } from "../../contracts/repositories/TurnTimeRepository";
import { DraftSettings } from "../../domain/value-objects/draft-settings/DraftSettings";
import { StartTurnTimer } from "../../contracts/use-cases/StartTurnTimer";
import { StartDraft } from "../../contracts/use-cases/StartDraft";
import { WebSocket } from "../../contracts/use-cases/WebSocket";

export class StartDraftUseCase implements StartDraft {
    private readonly turnTimeRepository: TurnTimeRepository;

    private readonly draftRepository: DraftRepository;

    private readonly socket: WebSocket;

    private readonly startTurnTimer: StartTurnTimer;

    constructor(
        turnTimeRepository: TurnTimeRepository,
        draftRepository: DraftRepository,
        startTurnTimer: StartTurnTimer,
        socket: WebSocket,
    ) {
        this.turnTimeRepository = turnTimeRepository;
        this.draftRepository = draftRepository;
        this.socket = socket;
        this.startTurnTimer = startTurnTimer;
    }

    async execute(draftId: number): Promise<void> {
        await this.draftRepository.startDraft(draftId);
        await this.turnTimeRepository.setTimeLimit(draftId, 60);
        await this.startTurnTimer.execute(draftId);
        const settings: DraftSettings | null = await this.draftRepository.getDraftSettings(draftId);
        console.log("Draft started:", draftId);
        this.socket.broadcastToRoom(`draft:${draftId}`, "draft:settings", settings?.toJSON());
    }
}
