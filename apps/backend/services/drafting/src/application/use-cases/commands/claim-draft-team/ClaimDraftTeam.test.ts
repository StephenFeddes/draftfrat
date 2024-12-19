import { ClaimDraftTeam } from "./ClaimDraftTeam";
import {
    Draft,
    DraftPick,
    DraftUser,
    RosterPoolFactory,
    DraftEvent,
    DraftEventEnum,
    DraftOrderEnum,
    SportEnum,
    ScoringEnum,
    FootballDraftSettings,
} from "../../../../domain";
import { EventBus } from "../../../interfaces/event-bus/EventBus";
import { DraftRepository } from "../../../interfaces/repositories/DraftRepository";
import { DraftUserRepository } from "../../../interfaces/repositories/DraftUserRepository";
import { PickRepository } from "../../../interfaces/repositories/PickRepository";

describe("ClaimDraftTeam", () => {
    let eventBus: EventBus;
    let draftRepository: jest.Mocked<DraftRepository>;
    let pickRepository: jest.Mocked<PickRepository>;
    let draftUserRepository: jest.Mocked<DraftUserRepository>;
    let claimDraftTeam: ClaimDraftTeam;

    beforeEach(() => {
        pickRepository = {
            pickPlayer: jest.fn(),
            getDraftPicks: jest.fn(),
            getAvailablePlayers: jest.fn(),
            getPlayerById: jest.fn(),
            getCurrentDraftPick: jest.fn(),
        };
        draftUserRepository = {
            getDraftUsers: jest.fn(),
            claimTeam: jest.fn(),
            getDraftUserByTeamNumber: jest.fn(),
            setAutoDraftStatus: jest.fn(),
        };
        draftRepository = {
            getDraftByDraftId: jest.fn(),
            createDraft: jest.fn(),
            startDraft: jest.fn(),
            updateDraftSettings: jest.fn(),
            getDrafts: jest.fn(),
            completeDraft: jest.fn(),
        };

        eventBus = {
            publish: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
            publishAll: jest.fn(),
        };

        claimDraftTeam = new ClaimDraftTeam(eventBus, draftRepository, pickRepository, draftUserRepository);

        jest.clearAllMocks();
    });

    it("should claim a team and publish a team-claimed event when valid data is provided", async () => {
        // Arrange
        const draftId = 1;
        const teamNumber = 1;
        const teamName = "Team 1";
        const userId = 1;
        const draftSettings: FootballDraftSettings = {
            draftOrderType: DraftOrderEnum.SNAKE,
            sport: SportEnum.FOOTBALL,
            scoringType: ScoringEnum.STANDARD,
            teamCount: 1,
            pickTimeLimitSeconds: null,
            quarterbackSpotsCount: 1,
            runningBackSpotsCount: 0,
            wideReceiverSpotsCount: 0,
            tightEndSpotsCount: 0,
            flexSpotsCount: 0,
            benchSpotsCount: 0,
            kickerSpotsCount: 0,
            defenseSpotsCount: 0,
        };
        const draft: Draft = {
            id: draftId,
            settings: draftSettings,
            isStarted: false,
            isComplete: false,
            createdAt: null,
        };
        const draftPicks: DraftPick[] = [{ draftId: draftId, pickNumber: 1, teamNumber: teamNumber, player: null }];
        const draftUsers: DraftUser[] = [
            {
                draftId: draftId,
                userId: userId,
                teamNumber: teamNumber,
                teamName: teamName,
                isAdmin: false,
                isAutoDrafting: false,
            },
        ];
        const draftRosterPool = RosterPoolFactory.create(draft.settings, draftPicks, draftUsers);
        draftRepository.getDraftByDraftId.mockResolvedValue(draft);
        pickRepository.getDraftPicks.mockResolvedValue(draftPicks);
        draftUserRepository.getDraftUsers.mockResolvedValue(draftUsers);

        // Act
        await claimDraftTeam.execute(draftId, teamNumber, teamName, userId);

        // Assert
        expect(draftUserRepository.claimTeam).toHaveBeenCalledWith(draftId, teamNumber, teamName, userId);
        expect(eventBus.publish).toHaveBeenCalledWith(
            new DraftEvent(draftId, DraftEventEnum.TEAM_CLAIMED, {
                draftId,
                rosters: draftRosterPool.getRosters(),
                users: draftUsers,
            }),
        );
    });

    it("should throw an error if the draft is not found", async () => {
        // Arrange
        const draftId = 1;
        const teamNumber = 1;
        const teamName: string = "Team 1";
        const userId = 1;
        draftRepository.getDraftByDraftId.mockResolvedValue(null);

        // Act & Assert
        await expect(claimDraftTeam.execute(draftId, teamNumber, teamName, userId)).rejects.toThrow("Draft not found");
    });

    it("should handle empty draft users and picks gracefully", async () => {
        // Arrange
        const draftId = 1;
        const teamNumber = 1;
        const teamName = "Team 1";
        const userId = 1;
        const draftSettings: FootballDraftSettings = {
            draftOrderType: DraftOrderEnum.SNAKE,
            sport: SportEnum.FOOTBALL,
            scoringType: ScoringEnum.STANDARD,
            teamCount: 1,
            pickTimeLimitSeconds: null,
            quarterbackSpotsCount: 1,
            runningBackSpotsCount: 0,
            wideReceiverSpotsCount: 0,
            tightEndSpotsCount: 0,
            flexSpotsCount: 0,
            benchSpotsCount: 0,
            kickerSpotsCount: 0,
            defenseSpotsCount: 0,
        };
        const draft: Draft = {
            id: draftId,
            settings: draftSettings,
            isStarted: false,
            isComplete: false,
            createdAt: null,
        };
        const draftUsers: DraftUser[] = [];
        const draftRosterPool = RosterPoolFactory.create(draft.settings, [], []);
        draftUserRepository.getDraftUsers.mockResolvedValue(draftUsers);
        draftRepository.getDraftByDraftId.mockResolvedValue(draft);
        pickRepository.getDraftPicks.mockResolvedValue([]);
        draftUserRepository.getDraftUsers.mockResolvedValue([]);

        // Act
        await claimDraftTeam.execute(draftId, teamNumber, teamName, userId);

        // Assert
        expect(draftUserRepository.claimTeam).toHaveBeenCalledWith(draftId, teamNumber, teamName, userId);
        expect(eventBus.publish).toHaveBeenCalledWith(
            new DraftEvent(draftId, DraftEventEnum.TEAM_CLAIMED, {
                draftId,
                rosters: draftRosterPool.getRosters(),
                users: [],
            }),
        );
    });
});
