import { DraftSettings } from "./DraftSettings";
import { DraftOrderEnum } from "../../enums/DraftOrderEnum";
import { ScoringEnum } from "../../enums/ScoringEnum";
import { SportEnum } from "../../enums/SportEnum";

// Sample valid data
const validData = {
    orderType: DraftOrderEnum.SNAKE,
    sport: SportEnum.Football,
    scoringType: ScoringEnum.PPR,
    teamCount: 10,
    pickTimeLimit: 60,
    isStarted: false,
    createdAt: "2023-01-01T00:00:00Z",
    quarterbackSpotsCount: 1,
    runningBackSpotsCount: 2,
    wideReceiverSpotsCount: 2,
    tightEndSpotsCount: 1,
    flexSpotsCount: 1,
    benchSpotsCount: 5,
    kickerSpotsCount: 1,
    defenseSpotsCount: 1,
};

describe("DraftSettings", () => {
    test("should create an instance with valid input", () => {
        const draftSettings = new DraftSettings(
            validData.orderType,
            validData.sport,
            validData.scoringType,
            validData.teamCount,
            validData.pickTimeLimit,
            validData.isStarted,
            validData.createdAt,
        );
        expect(draftSettings).toBeInstanceOf(DraftSettings);
    });

    test("should throw an error if orderType is invalid", () => {
        const createInvalidDraftSettings = () =>
            new DraftSettings(
                null as any as DraftOrderEnum,
                validData.sport,
                validData.scoringType,
                validData.teamCount,
                validData.pickTimeLimit,
                validData.isStarted,
                validData.createdAt,
            );
        expect(createInvalidDraftSettings).toThrow("Valid orderType is required.");
    });

    // Repeat similar tests for other fields, e.g., sport, scoringType, etc.

    test("should be immutable", () => {
        const draftSettings = new DraftSettings(
            validData.orderType,
            validData.sport,
            validData.scoringType,
            validData.teamCount,
            validData.pickTimeLimit,
            validData.isStarted,
            validData.createdAt,
        );
        expect(() => {
            (draftSettings as any).teamCount = 20;
        }).toThrow();
    });

    test("should return correct JSON representation", () => {
        const draftSettings = new DraftSettings(
            validData.orderType,
            validData.sport,
            validData.scoringType,
            validData.teamCount,
            validData.pickTimeLimit,
            validData.isStarted,
            validData.createdAt,
        );

        const json = draftSettings.toJSON();
        expect(json).toEqual(validData);
    });
});
