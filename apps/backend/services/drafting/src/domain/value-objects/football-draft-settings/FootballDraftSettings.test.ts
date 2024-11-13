import { FootballDraftSettings } from "./FootballDraftSettings";
import { DraftOrderEnum } from "../../enums/DraftOrderEnum";
import { ScoringEnum } from "../../enums/ScoringEnum";
import { SportEnum } from "../../enums/SportEnum";
import { FootballDraftSettingsDTO } from "../../dto/FootballDraftSettingsDTO";

describe("FootballDraftSettings", () => {
    const mockOrderType = DraftOrderEnum.SNAKE;
    const mockSport = SportEnum.Football;
    const mockScoringType = ScoringEnum.PPR;
    const mockTeamCount = 12;
    const mockPickTimeLimit = 60;
    const mockIsStarted = false;
    const mockCreatedAt = "2024-11-09T12:00:00Z";

    const validCounts = {
        quarterbackSpotsCount: 1,
        runningBackSpotsCount: 2,
        wideReceiverSpotsCount: 2,
        tightEndSpotsCount: 1,
        flexSpotsCount: 1,
        benchSpotsCount: 5,
        kickerSpotsCount: 1,
        defenseSpotsCount: 1,
    };

    it("should initialize correctly with valid inputs", () => {
        const settings = new FootballDraftSettings(
            mockOrderType,
            mockSport,
            mockScoringType,
            mockTeamCount,
            mockPickTimeLimit,
            mockIsStarted,
            mockCreatedAt,
            validCounts.quarterbackSpotsCount,
            validCounts.runningBackSpotsCount,
            validCounts.wideReceiverSpotsCount,
            validCounts.tightEndSpotsCount,
            validCounts.flexSpotsCount,
            validCounts.benchSpotsCount,
            validCounts.kickerSpotsCount,
            validCounts.defenseSpotsCount,
        );

        expect(settings.quarterbackSpotsCount).toBe(validCounts.quarterbackSpotsCount);
        expect(settings.runningBackSpotsCount).toBe(validCounts.runningBackSpotsCount);
        expect(settings.wideReceiverSpotsCount).toBe(validCounts.wideReceiverSpotsCount);
        expect(settings.tightEndSpotsCount).toBe(validCounts.tightEndSpotsCount);
        expect(settings.flexSpotsCount).toBe(validCounts.flexSpotsCount);
        expect(settings.benchSpotsCount).toBe(validCounts.benchSpotsCount);
        expect(settings.kickerSpotsCount).toBe(validCounts.kickerSpotsCount);
        expect(settings.defenseSpotsCount).toBe(validCounts.defenseSpotsCount);
    });

    it("should throw an error if any position spot count is negative", () => {
        expect(() => {
            new FootballDraftSettings(
                mockOrderType,
                mockSport,
                mockScoringType,
                mockTeamCount,
                mockPickTimeLimit,
                mockIsStarted,
                mockCreatedAt,
                -1,
                validCounts.runningBackSpotsCount,
                validCounts.wideReceiverSpotsCount,
                validCounts.tightEndSpotsCount,
                validCounts.flexSpotsCount,
                validCounts.benchSpotsCount,
                validCounts.kickerSpotsCount,
                validCounts.defenseSpotsCount,
            );
        }).toThrow("quarterbackSpotsCount is required and must be a non-negative whole number");
    });

    it("should throw an error if any position spot count is not an integer", () => {
        expect(() => {
            new FootballDraftSettings(
                mockOrderType,
                mockSport,
                mockScoringType,
                mockTeamCount,
                mockPickTimeLimit,
                mockIsStarted,
                mockCreatedAt,
                1.5,
                validCounts.runningBackSpotsCount,
                validCounts.wideReceiverSpotsCount,
                validCounts.tightEndSpotsCount,
                validCounts.flexSpotsCount,
                validCounts.benchSpotsCount,
                validCounts.kickerSpotsCount,
                validCounts.defenseSpotsCount,
            );
        }).toThrow("quarterbackSpotsCount is required and must be a non-negative whole number");
    });

    it("should be frozen after instantiation", () => {
        const settings = new FootballDraftSettings(
            mockOrderType,
            mockSport,
            mockScoringType,
            mockTeamCount,
            mockPickTimeLimit,
            mockIsStarted,
            mockCreatedAt,
            validCounts.quarterbackSpotsCount,
            validCounts.runningBackSpotsCount,
            validCounts.wideReceiverSpotsCount,
            validCounts.tightEndSpotsCount,
            validCounts.flexSpotsCount,
            validCounts.benchSpotsCount,
            validCounts.kickerSpotsCount,
            validCounts.defenseSpotsCount,
        );

        expect(Object.isFrozen(settings)).toBe(true);
    });

    it("should correctly convert to JSON", () => {
        const settings = new FootballDraftSettings(
            mockOrderType,
            mockSport,
            mockScoringType,
            mockTeamCount,
            mockPickTimeLimit,
            mockIsStarted,
            mockCreatedAt,
            validCounts.quarterbackSpotsCount,
            validCounts.runningBackSpotsCount,
            validCounts.wideReceiverSpotsCount,
            validCounts.tightEndSpotsCount,
            validCounts.flexSpotsCount,
            validCounts.benchSpotsCount,
            validCounts.kickerSpotsCount,
            validCounts.defenseSpotsCount,
        );

        const expectedJson: FootballDraftSettingsDTO = {
            orderType: mockOrderType,
            sport: mockSport,
            scoringType: mockScoringType,
            teamCount: mockTeamCount,
            pickTimeLimit: mockPickTimeLimit,
            isStarted: mockIsStarted,
            createdAt: mockCreatedAt,
            quarterbackSpotsCount: validCounts.quarterbackSpotsCount,
            runningBackSpotsCount: validCounts.runningBackSpotsCount,
            wideReceiverSpotsCount: validCounts.wideReceiverSpotsCount,
            tightEndSpotsCount: validCounts.tightEndSpotsCount,
            flexSpotsCount: validCounts.flexSpotsCount,
            benchSpotsCount: validCounts.benchSpotsCount,
            kickerSpotsCount: validCounts.kickerSpotsCount,
            defenseSpotsCount: validCounts.defenseSpotsCount,
        };

        expect(settings.toJSON()).toEqual(expectedJson);
    });
});
