import {
    DraftEventEnum,
    DraftOrderEnum,
    DraftPick,
    DraftRosterPoolFactory,
    DraftUser,
    FootballDraftSettings,
    FootballPositionEnum,
    ScoringEnum,
} from "../../../../src/domain";
import { createFootballPlayer } from "../../../test-utils";
import {
    PickPlayer,
    DraftPlayerQueueRepository,
    DraftPlayerRepository,
    DraftRepository,
    DraftUserRepository,
    EventBus,
} from "../../../../src/contracts";
import { BasicPickPlayer } from "../../../../src/application";

describe("BasicPickPlayer", () => {
    let mockedEventBus: jest.Mocked<EventBus>;
    let mockedDraftPlayerQueueRepository: jest.Mocked<DraftPlayerQueueRepository>;
    let mockedDraftPlayerRepository: jest.Mocked<DraftPlayerRepository>;
    let mockedDraftUserRepository: jest.Mocked<DraftUserRepository>;
    let mockedDraftRepository: jest.Mocked<DraftRepository>;

    beforeEach(() => {
        // Mock dependencies
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
    });

    it("should successfully publish to the event bus when the player is picked", async () => {
        const draftId = 1;
        const playerId = 101;
        const pickNumber = 1;
        const teamNumber = 1;

        // Mock data
        const draftSettings = new FootballDraftSettings(
            DraftOrderEnum.SNAKE,
            ScoringEnum.PPR,
            1,
            null,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            "",
            true,
        );
        const draftPicks = [new DraftPick(draftId, pickNumber, teamNumber, null)];
        const draftUsers = [new DraftUser(1, 1, "mockUser", 1, false, false)];
        const pickedPlayer = createFootballPlayer(playerId, [FootballPositionEnum.QUARTERBACK]);

        mockedDraftRepository.getDraftSettings.mockResolvedValue(draftSettings);
        mockedDraftPlayerRepository.getDraftPicks.mockResolvedValue(draftPicks);
        mockedDraftUserRepository.getDraftUsers.mockResolvedValue(draftUsers);
        mockedDraftPlayerRepository.getPlayerById.mockResolvedValue(pickedPlayer);
        mockedDraftPlayerRepository.getAvailablePlayers.mockResolvedValue([]);
        mockedDraftPlayerQueueRepository.getQueuedDraftPlayers.mockResolvedValue([]);

        const pickPlayer = new BasicPickPlayer(
            mockedEventBus,
            mockedDraftPlayerQueueRepository,
            mockedDraftPlayerRepository,
            mockedDraftRepository,
            mockedDraftUserRepository,
        );

        await pickPlayer.execute(draftId, playerId, teamNumber);

        // Verify interactions
        expect(mockedDraftPlayerRepository.pickPlayer).toHaveBeenCalledWith(draftId, playerId, pickNumber, teamNumber);
        expect(mockedEventBus.publish).toHaveBeenCalledWith({
            draftId,
            eventName: DraftEventEnum.PLAYER_PICKED,
            eventData: {
                picks: [new DraftPick(draftId, pickNumber, teamNumber, pickedPlayer).toJSON()],
                rosters: DraftRosterPoolFactory.create(
                    draftSettings,
                    [new DraftPick(draftId, pickNumber, teamNumber, pickedPlayer)],
                    draftUsers,
                ).toJSON(),
                playersAvailable: [],
                queues: {},
            },
        });
    });

    it("should not pick the player if the roster cannot add the player", async () => {
        const draftId = 1;
        const playerId = 101;
        const pickNumber = 1;
        const teamNumber = 1;

        // Mock data
        const draftSettings = new FootballDraftSettings(
            DraftOrderEnum.SNAKE,
            ScoringEnum.PPR,
            1,
            null,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            "",
            true,
        );
        const draftPicks = [new DraftPick(draftId, pickNumber, teamNumber, null)];
        const draftUsers = [new DraftUser(1, 1, "mockUser", 1, false, false)];
        const pickedPlayer = createFootballPlayer(playerId, [FootballPositionEnum.QUARTERBACK]);

        mockedDraftRepository.getDraftSettings.mockResolvedValue(draftSettings);
        mockedDraftPlayerRepository.getDraftPicks.mockResolvedValue(draftPicks);
        mockedDraftUserRepository.getDraftUsers.mockResolvedValue(draftUsers);
        mockedDraftPlayerRepository.getPlayerById.mockResolvedValue(pickedPlayer);
        mockedDraftPlayerRepository.getAvailablePlayers.mockResolvedValue([]);
        mockedDraftPlayerQueueRepository.getQueuedDraftPlayers.mockResolvedValue([]);

        const pickPlayer = new BasicPickPlayer(
            mockedEventBus,
            mockedDraftPlayerQueueRepository,
            mockedDraftPlayerRepository,
            mockedDraftRepository,
            mockedDraftUserRepository,
        );

        await pickPlayer.execute(draftId, playerId, teamNumber);

        // Verify interactions
        expect(mockedDraftPlayerRepository.pickPlayer).not.toHaveBeenCalled();
        expect(mockedEventBus.publish).not.toHaveBeenCalled();
    });

    it("should not pick the player if the team does not own the pick", async () => {
        const draftId = 1;
        const playerId = 101;
        const pickNumber = 1;
        const teamNumber = 1;

        // Mock data
        const draftSettings = new FootballDraftSettings(
            DraftOrderEnum.SNAKE,
            ScoringEnum.PPR,
            1,
            null,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            "",
            true,
        );
        const draftPicks = [new DraftPick(draftId, 2, teamNumber, null)];
        const draftUsers = [new DraftUser(1, 1, "mockUser", 1, false, false)];
        const pickedPlayer = createFootballPlayer(playerId, [FootballPositionEnum.QUARTERBACK]);

        mockedDraftRepository.getDraftSettings.mockResolvedValue(draftSettings);
        mockedDraftPlayerRepository.getDraftPicks.mockResolvedValue(draftPicks);
        mockedDraftUserRepository.getDraftUsers.mockResolvedValue(draftUsers);
        mockedDraftPlayerRepository.getPlayerById.mockResolvedValue(pickedPlayer);
        mockedDraftPlayerRepository.getAvailablePlayers.mockResolvedValue([]);

        const pickPlayer = new BasicPickPlayer(
            mockedEventBus,
            mockedDraftPlayerQueueRepository,
            mockedDraftPlayerRepository,
            mockedDraftRepository,
            mockedDraftUserRepository,
        );

        await pickPlayer.execute(draftId, playerId, teamNumber);

        expect(mockedDraftPlayerRepository.pickPlayer).not.toHaveBeenCalled();
        expect(mockedEventBus.publish).not.toHaveBeenCalled();
    });

    it("should not pick the player if the draft has not started", async () => {
        const draftId = 1;
        const playerId = 101;
        const pickNumber = 1;
        const teamNumber = 1;

        // Mock data
        const draftSettings = new FootballDraftSettings(
            DraftOrderEnum.SNAKE,
            ScoringEnum.PPR,
            1,
            null,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            "",
            false,
        );
        const draftPicks = [new DraftPick(draftId, teamNumber, teamNumber, null)];
        const draftUsers = [new DraftUser(1, 1, "mockUser", 1, false, false)];
        const pickedPlayer = createFootballPlayer(playerId, [FootballPositionEnum.QUARTERBACK]);

        mockedDraftRepository.getDraftSettings.mockResolvedValue(draftSettings);
        mockedDraftPlayerRepository.getDraftPicks.mockResolvedValue(draftPicks);
        mockedDraftUserRepository.getDraftUsers.mockResolvedValue(draftUsers);
        mockedDraftPlayerRepository.getPlayerById.mockResolvedValue(pickedPlayer);
        mockedDraftPlayerRepository.getAvailablePlayers.mockResolvedValue([]);
        mockedDraftPlayerQueueRepository.getQueuedDraftPlayers.mockResolvedValue([]);

        const pickPlayer = new BasicPickPlayer(
            mockedEventBus,
            mockedDraftPlayerQueueRepository,
            mockedDraftPlayerRepository,
            mockedDraftRepository,
            mockedDraftUserRepository,
        );

        await pickPlayer.execute(draftId, playerId, teamNumber);

        expect(mockedDraftPlayerRepository.pickPlayer).not.toHaveBeenCalled();
        expect(mockedEventBus.publish).not.toHaveBeenCalled();
    });
});
