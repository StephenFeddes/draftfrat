import { RandomAutoDraftPlayer } from "../../../../src/application";
import {
    DraftPlayerQueueRepository,
    DraftPlayerRepository,
    DraftRepository,
    DraftUserRepository,
    EventBus,
    RandomIndexGenerator,
    PickPlayer
} from "../../../../src/contracts";
import {
    DraftOrderEnum,
    DraftPick,
    FootballDraftSettings,
    FootballPositionEnum,
    ScoringEnum,
} from "../../../../src/domain";
import { createFootballPlayer } from "../../../test-utils";

describe("RandomAutoDraftPlayer", () => {
    let mockedPickPlayer: jest.Mocked<PickPlayer>;
    let mockedDraftPlayerQueueRepository: jest.Mocked<DraftPlayerQueueRepository>;
    let mockedDraftPlayerRepository: jest.Mocked<DraftPlayerRepository>;
    let mockedDraftRepository: jest.Mocked<DraftRepository>;
    let mockedDraftUserRepository: jest.Mocked<DraftUserRepository>;
    let mockedRandomIndexGenerator: jest.Mocked<RandomIndexGenerator>;
    let mockedEventBus: jest.Mocked<EventBus>;

    beforeEach(() => {
        mockedEventBus = {
            publish: jest.fn(),
            publishAll: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        };
        mockedDraftPlayerRepository = {
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
            getDraftSettings: jest.fn(),
            createDraft: jest.fn(),
            startDraft: jest.fn(),
            updateDraftSettings: jest.fn(),
        };
        mockedDraftPlayerQueueRepository = {
            enqueuePlayer: jest.fn(),
            dequeuePlayer: jest.fn(),
            swapQueuedPlayerPriorities: jest.fn(),
            removePlayerFromQueue: jest.fn(),
            getQueuedDraftPlayers: jest.fn(),
            getQueuedDraftPlayersByUserId: jest.fn(),
            removePlayersFromQueue: jest.fn(),
        };

        mockedEventBus = {
            publish: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
            publishAll: jest.fn(),
        };
        mockedRandomIndexGenerator = {
            generate: jest.fn().mockReturnValue(0),
        };
        mockedPickPlayer = {
            execute: jest.fn(),
        }
    });

    it("should select a player randomly from the top 3 available players", async () => {
        const draftId = 1;
        const pickNumber = 1;
        const teamNumber = 1;

        mockedDraftPlayerRepository.getAvailablePlayers.mockResolvedValue([
            createFootballPlayer(1, [FootballPositionEnum.QUARTERBACK]),
            createFootballPlayer(2, [FootballPositionEnum.RUNNING_BACK]),
            createFootballPlayer(3, [FootballPositionEnum.WIDE_RECEIVER]),
        ]);
        mockedDraftPlayerRepository.getDraftPicks.mockResolvedValue([
            new DraftPick(draftId, 1, teamNumber, null),
            new DraftPick(draftId, 2, teamNumber, null),
        ]);
        mockedDraftRepository.getDraftSettings.mockResolvedValue(
            new FootballDraftSettings(DraftOrderEnum.SNAKE, ScoringEnum.PPR, 1, null, 1, 1, 0, 0, 0, 0, 0, 0, "", true),
        );
        mockedDraftUserRepository.getDraftUsers.mockResolvedValue([]);

        const autoDraftPlayer = new RandomAutoDraftPlayer(
            mockedPickPlayer,
            mockedDraftPlayerRepository,
            mockedDraftRepository,
            mockedDraftUserRepository,
            mockedRandomIndexGenerator,
        );

        await autoDraftPlayer.execute(draftId, pickNumber, teamNumber);

        // Verify that mockedPickPlayer.execute was called with the correct arguments
        expect(mockedPickPlayer.execute).toHaveBeenCalledWith(draftId, 1, pickNumber, teamNumber);
    });
});