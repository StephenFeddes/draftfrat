import { TurnTimeRepository } from "../../contracts/repositories/TurnTimeRepository";
import { StartTurnTimer } from "../../contracts/use-cases/StartTurnTimer";
import { EventBus } from "../../contracts/events/EventBus";
import { TurnTimeTickedEvent } from "../../domain/events/TurnTimeTickedEvent";

export class StartTurnTimerUseCase implements StartTurnTimer {
    private eventBus: EventBus;

    private readonly turnTimeRepository: TurnTimeRepository;

    constructor(eventBus: EventBus, turnTimeRepository: TurnTimeRepository) {
        this.turnTimeRepository = turnTimeRepository;
        this.eventBus = eventBus;
    }

    async execute(draftId: number): Promise<void> {
        let time = await this.turnTimeRepository.getTimeLimit(draftId);
        if (time === null) {
            time = 60;
        }

        for (let i = time; i >= 0; i--) {
            setTimeout(() => {
                const timeTickedEvent: TurnTimeTickedEvent = new TurnTimeTickedEvent(draftId, i);
                this.eventBus.publish(timeTickedEvent);
            }, 1000);
        }
    }
}
