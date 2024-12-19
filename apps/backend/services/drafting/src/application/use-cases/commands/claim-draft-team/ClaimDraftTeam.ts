import {
    DraftEvent,
    DraftEventEnum,
    DraftPick,
    RosterPool,
    RosterPoolFactory,
    DraftUser,
    Draft,
} from "../../../../domain";
import { EventBus } from "../../../interfaces/event-bus/EventBus";
import { DraftRepository } from "../../../interfaces/repositories/DraftRepository";
import { DraftUserRepository } from "../../../interfaces/repositories/DraftUserRepository";
import { PickRepository } from "../../../interfaces/repositories/PickRepository";
import { DraftTeamClaimer } from "../../../interfaces/use-cases/commands/DraftTeamClaimer";

export class ClaimDraftTeam implements DraftTeamClaimer {
    private readonly eventBus: EventBus;

    private readonly draftRepository: DraftRepository;

    private readonly pickRepository: PickRepository;

    private readonly draftUserRepository: DraftUserRepository;

    constructor(
        eventBus: EventBus,
        draftRepository: DraftRepository,
        pickRepository: PickRepository,
        draftUserRepository: DraftUserRepository,
    ) {
        this.eventBus = eventBus;
        this.draftRepository = draftRepository;
        this.pickRepository = pickRepository;
        this.draftUserRepository = draftUserRepository;
    }

    public async execute(draftId: number, teamNumber: number, teamName: string, userId: number): Promise<void> {
        /**
         *  Updates the user's team number to indicate they have claimed the team.
         * - If the user was not in the draft, then they are added. Otherwise, their team number is updated.
         */
        this.draftUserRepository.claimTeam(draftId, teamNumber, teamName, userId);

        // Ensure the draft exists; throw an error otherwise.
        const draft: Draft | null = await this.draftRepository.getDraftByDraftId(draftId);
        if (!draft) {
            throw new Error("Draft not found");
        }

        /**
         * Retrieve draft picks and users for roster generation.
         * - These updated draft users are also sent in the event.
         */
        const draftPicks: DraftPick[] = await this.pickRepository.getDraftPicks(draftId);
        const draftUsers: DraftUser[] = await this.draftUserRepository.getDraftUsers(draftId);

        /**
         * Generate a roster pool:
         * - Maps team numbers to their respective rosters.
         * - Uses a factory to encapsulate instantiation logic and allow polymorphism for different sports.
         */
        const draftRosterPool: RosterPool = RosterPoolFactory.create(draft.settings, draftPicks, draftUsers);

        /**
         * Create and publish a draft event for subscribers to consume.
         * - For example, a subscriber could have a websocket broadcast the
         * updated users and rosters to connected clients.
         * - For testing purposes, a subscriber could append the event to
         * an array to verify the event was published at the appropriate moment.
         */
        const event: DraftEvent = new DraftEvent(draftId, DraftEventEnum.TEAM_CLAIMED, {
            draftId,
            rosters: draftRosterPool.getRosters(),
            users: draftUsers,
        });
        this.eventBus.publish(event);
    }
}
