import {
    Draft,
    DraftOrderEnum,
    FootballDraftSettings,
    FootballPositionEnum,
    ScoringEnum,
    SportEnum,
} from "../../../../domain";
import { createFootballPlayer } from "../../../../../tests/test-utils";
import { AutoDraftPlayer } from "./AutoDraftPlayer";
import { PickPlayer } from "../pick-player/PickPlayer";
import { PickRepository } from "../../../interfaces/repositories/PickRepository";
import { DraftRepository } from "../../../interfaces/repositories/DraftRepository";
import { DraftUserRepository } from "../../../interfaces/repositories/DraftUserRepository";
import { RandomIntegerGenerator } from "../../../interfaces/random/RandomIntegerGenerator";

describe("AutoDraftPlayer", () => {
    let autoDraftPlayer: AutoDraftPlayer;
    let pickPlayer: jest.Mocked<PickPlayer>;
    let pickRepository: jest.Mocked<PickRepository>;
    let draftRepository: jest.Mocked<DraftRepository>;
    let draftUserRepository: jest.Mocked<DraftUserRepository>;
    let randomIndexGenerator: jest.Mocked<RandomIntegerGenerator>;

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

        randomIndexGenerator = {
            execute: jest.fn().mockReturnValue(0),
        };
        pickPlayer = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<PickPlayer>;

        autoDraftPlayer = new AutoDraftPlayer(
            pickPlayer,
            pickRepository,
            draftRepository,
            draftUserRepository,
            randomIndexGenerator,
        );
    });

    it("should select a player randomly from the top 3 available players", async () => {
        // Arrange
        const draftId: number = 1;
        const pickNumber: number = 1;
        const teamNumber: number = 1;
        const playerId: number = 2;
        pickRepository.getAvailablePlayers.mockResolvedValue([
            createFootballPlayer(1, [FootballPositionEnum.WIDE_RECEIVER]),
            createFootballPlayer(playerId, [FootballPositionEnum.QUARTERBACK]),
            createFootballPlayer(3, [FootballPositionEnum.RUNNING_BACK]),
        ]);
        pickRepository.getDraftPicks.mockResolvedValue([
            { draftId: draftId, pickNumber: 1, teamNumber: teamNumber, player: null },
            { draftId: draftId, pickNumber: 2, teamNumber: teamNumber, player: null },
        ]);
        const draftSettings: FootballDraftSettings = {
            sport: SportEnum.FOOTBALL,
            draftOrderType: DraftOrderEnum.SNAKE,
            scoringType: ScoringEnum.PPR,
            pickTimeLimitSeconds: null,
            teamCount: 1,
            quarterbackSpotsCount: 1,
            runningBackSpotsCount: 1,
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
        draftRepository.getDraftByDraftId.mockResolvedValue(draft);
        draftUserRepository.getDraftUsers.mockResolvedValue([]);

        // Act
        await autoDraftPlayer.execute(draftId, pickNumber, teamNumber);

        // Assert
        expect(pickPlayer.execute).toHaveBeenCalledWith(draftId, playerId, teamNumber);
    });
});
