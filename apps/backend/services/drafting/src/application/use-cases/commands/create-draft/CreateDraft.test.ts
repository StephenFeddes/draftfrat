import { CreateDraft } from "./CreateDraft";
import { DraftOrderEnum, DraftSettings, ScoringEnum, SportEnum } from "../../../../domain";
import { DraftRepository } from "../../../interfaces/repositories/DraftRepository";

describe("CreateDraft", () => {
    let mockDraftRepository: jest.Mocked<DraftRepository>;
    let createDraft: CreateDraft;

    beforeEach(() => {
        mockDraftRepository = {
            getDraftByDraftId: jest.fn(),
            createDraft: jest.fn(),
            startDraft: jest.fn(),
            updateDraftSettings: jest.fn(),
            getDrafts: jest.fn(),
            completeDraft: jest.fn(),
        };

        createDraft = new CreateDraft(mockDraftRepository);

        jest.clearAllMocks();
    });

    it("should call draftRepository.createDraft with correct arguments", async () => {
        // Arrange
        const creatorId: number = 1;
        const settings: DraftSettings = {
            draftOrderType: DraftOrderEnum.SNAKE,
            sport: SportEnum.FOOTBALL,
            scoringType: ScoringEnum.PPR,
            teamCount: 1,
            pickTimeLimitSeconds: null,
        };

        // Act
        await createDraft.execute(creatorId, settings);

        // Assert
        expect(mockDraftRepository.createDraft).toHaveBeenCalledWith(creatorId, settings);
    });
});
