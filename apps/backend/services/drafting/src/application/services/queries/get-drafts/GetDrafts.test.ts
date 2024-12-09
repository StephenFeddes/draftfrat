import { DraftRepository } from "../../../../interfaces";
import { Draft, DraftOrderEnum, FootballDraftSettings, ScoringEnum, SportEnum } from "../../../../domain";
import { GetDrafts } from "./GetDrafts";

describe("GetDrafts", () => {
    let draftRepository: jest.Mocked<DraftRepository>;
    let getDrafts: GetDrafts;

    beforeEach(() => {
        draftRepository = {
            getDraftByDraftId: jest.fn(),
            createDraft: jest.fn(),
            startDraft: jest.fn(),
            updateDraftSettings: jest.fn(),
            getDrafts: jest.fn(),
            completeDraft: jest.fn(),
        };

        getDrafts = new GetDrafts(draftRepository);
    });

    it("should call draftRepository.getDrafts with the correct userId", async () => {
        // Arrange
        const userId: number = 1;
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
            id: 1,
            settings: draftSettings,
            isStarted: false,
            isComplete: false,
            createdAt: null,
        };
        const drafts: Draft[] = [draft];
        draftRepository.getDrafts.mockResolvedValue(drafts);

        // Act
        const result = await getDrafts.execute(userId);

        // Assert
        expect(draftRepository.getDrafts).toHaveBeenCalledWith(userId);
        expect(result).toEqual(drafts);
    });

    it("should return an empty array if no drafts are found", async () => {
        // Arrange
        const userId = 2;
        draftRepository.getDrafts.mockResolvedValue([]);

        // Act
        const result = await getDrafts.execute(userId);

        // Assert
        expect(draftRepository.getDrafts).toHaveBeenCalledWith(userId);
        expect(result).toEqual([]);
    });
});
