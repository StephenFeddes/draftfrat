import {
    Draft,
    DraftEvent,
    DraftEventEnum,
    DraftOrderEnum,
    DraftPick,
    DraftUser,
    FootballDraftSettings,
    RosterPoolFactory,
    ScoringEnum,
    SportEnum,
} from "../../../../domain";
import { EventBus } from "../../../interfaces/event-bus/EventBus";
import { DraftRepository } from "../../../interfaces/repositories/DraftRepository";
import { DraftUserRepository } from "../../../interfaces/repositories/DraftUserRepository";
import { PickRepository } from "../../../interfaces/repositories/PickRepository";
import { UpdateDraftSettings } from "./UpdateDraftSettings";

describe("UpdateDraftSettings", () => {
    let mockedEventBus: jest.Mocked<EventBus>;
    let mockedDraftRepository: jest.Mocked<DraftRepository>;
    let mockedPickRepository: jest.Mocked<PickRepository>;
    let mockedDraftUserRepository: jest.Mocked<DraftUserRepository>;
    let updateDraftSettings: UpdateDraftSettings;

    beforeEach(() => {
        mockedPickRepository = {
            pickPlayer: jest.fn(),
            getDraftPicks: jest.fn(),
            getAvailablePlayers: jest.fn(),
            getPlayerById: jest.fn(),
            getCurrentDraftPick: jest.fn(),
        };
        mockedDraftUserRepository = {
            getDraftUsers: jest.fn(),
            claimTeam: jest.fn(),
            getDraftUserByTeamNumber: jest.fn(),
            setAutoDraftStatus: jest.fn(),
        };
        mockedDraftRepository = {
            getDraftByDraftId: jest.fn(),
            createDraft: jest.fn(),
            startDraft: jest.fn(),
            updateDraftSettings: jest.fn(),
            getDrafts: jest.fn(),
            completeDraft: jest.fn(),
        };

        mockedEventBus = {
            publish: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
            publishAll: jest.fn(),
        };

        updateDraftSettings = new UpdateDraftSettings(
            mockedEventBus,
            mockedDraftRepository,
            mockedPickRepository,
            mockedDraftUserRepository,
        );
    });

    it("should update draft settings and publish an event when all data is valid", async () => {
        // Arrange
        const draftId = 1;
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
        const draftPicks: DraftPick[] = [{ draftId: draftId, pickNumber: 1, teamNumber: 1, player: null }];
        const draftUsers: DraftUser[] = [
            {
                draftId: draftId,
                userId: 1,
                teamNumber: 1,
                teamName: "",
                isAdmin: false,
                isAutoDrafting: false,
            },
        ];
        const rosterPool = RosterPoolFactory.create(draftSettings, draftPicks, draftUsers);
        mockedDraftRepository.getDraftByDraftId.mockResolvedValue(draft);
        mockedPickRepository.getDraftPicks.mockResolvedValue(draftPicks);
        mockedDraftUserRepository.getDraftUsers.mockResolvedValue(draftUsers);

        // Act
        await updateDraftSettings.execute(draftId, draftSettings);

        // Assert
        expect(mockedDraftRepository.updateDraftSettings).toHaveBeenCalledWith(draftId, draftSettings);
        expect(mockedDraftRepository.getDraftByDraftId).toHaveBeenCalledWith(draftId);
        expect(mockedPickRepository.getDraftPicks).toHaveBeenCalledWith(draftId);
        expect(mockedDraftUserRepository.getDraftUsers).toHaveBeenCalledWith(draftId);
        expect(mockedEventBus.publish).toHaveBeenCalledWith(
            new DraftEvent(draftId, DraftEventEnum.DRAFT_SETTINGS_UPDATED, {
                draftId: draftId,
                settings: draftSettings,
                picks: draftPicks,
                rosters: rosterPool.getRosters(),
                users: draftUsers,
            }),
        );
    });

    it("should throw an error if the draft is not found", async () => {
        // Arrange
        const draftId = 1;
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
        mockedDraftRepository.getDraftByDraftId.mockResolvedValue(null);

        // Act & Assert
        await expect(updateDraftSettings.execute(draftId, draftSettings)).rejects.toThrow("Unable to update draft");
        expect(mockedDraftRepository.updateDraftSettings).toHaveBeenCalledWith(draftId, draftSettings);
        expect(mockedDraftRepository.getDraftByDraftId).toHaveBeenCalledWith(draftId);
        expect(mockedPickRepository.getDraftPicks).not.toHaveBeenCalled();
        expect(mockedDraftUserRepository.getDraftUsers).not.toHaveBeenCalled();
        expect(mockedEventBus.publish).not.toHaveBeenCalled();
    });

    it("should throw an error if updating draft settings fails", async () => {
        // Arrange
        const draftId = 1;
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
        mockedDraftRepository.updateDraftSettings.mockRejectedValue(new Error("Database error"));

        // Act & Assert
        await expect(updateDraftSettings.execute(draftId, draftSettings)).rejects.toThrow("Unable to update draft");
        expect(mockedDraftRepository.updateDraftSettings).toHaveBeenCalledWith(draftId, draftSettings);
        expect(mockedDraftRepository.getDraftByDraftId).not.toHaveBeenCalled();
        expect(mockedPickRepository.getDraftPicks).not.toHaveBeenCalled();
        expect(mockedDraftUserRepository.getDraftUsers).not.toHaveBeenCalled();
        expect(mockedEventBus.publish).not.toHaveBeenCalled();
    });

    it("should handle empty picks and users gracefully", async () => {
        // Arrange
        const draftId = 1;
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
        const rosterPool = RosterPoolFactory.create(draftSettings, [], []);
        mockedDraftRepository.updateDraftSettings.mockResolvedValue(undefined);
        mockedDraftRepository.getDraftByDraftId.mockResolvedValue(draft);
        mockedPickRepository.getDraftPicks.mockResolvedValue([]);
        mockedDraftUserRepository.getDraftUsers.mockResolvedValue([]);

        // Act
        await updateDraftSettings.execute(draftId, draftSettings);

        // Assert
        expect(mockedEventBus.publish).toHaveBeenCalledWith(
            new DraftEvent(draftId, DraftEventEnum.DRAFT_SETTINGS_UPDATED, {
                draftId: draftId,
                settings: draftSettings,
                picks: [],
                rosters: rosterPool.getRosters(),
                users: [],
            }),
        );
    });
});
