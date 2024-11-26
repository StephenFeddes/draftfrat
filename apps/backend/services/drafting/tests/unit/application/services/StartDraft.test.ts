import { RandomAutoDraftPlayer, StartDraft } from "../../../../src/application";
import {
    DraftPlayerRepository,
    DraftRepository,
    DraftUserRepository,
    EventBus,
    RandomIndexGenerator,
    StartTurnTimer,
    PickPlayer,
    Timer,
} from "../../../../src/contracts";
import { DraftOrderEnum, DraftPick, DraftUser, FootballDraftSettings, ScoringEnum } from "../../../../src/domain";

describe("StartDraft", () => {
    let draftPlayerRepository: jest.Mocked<DraftPlayerRepository>;
    let draftRepository: jest.Mocked<DraftRepository>;
    let draftUserRepository: jest.Mocked<DraftUserRepository>;
    let randomIndexGenerator: jest.Mocked<RandomIndexGenerator>;
    let autoDraftPlayer: RandomAutoDraftPlayer;
    let eventBus: EventBus;
    let startTurnTimer: StartTurnTimer;
    let timer: Timer;

    beforeEach(() => {
        draftPlayerRepository = {
            pickPlayer: jest.fn(),
            getPlayerById: jest.fn(),
            getAvailablePlayers: jest.fn(),
            getDraftPicks: jest.fn(),
            getCurrentDraftPick: jest.fn(),
        };
        draftRepository = {
            getDraftSettings: jest.fn(),
            createDraft: jest.fn(),
            startDraft: jest.fn(),
            updateDraftSettings: jest.fn(),
        };
        draftUserRepository = {
            getDraftUserByTeamNumber: jest.fn(),
            getDraftUsers: jest.fn(),
            claimTeam: jest.fn(),
            setAutoDraftStatus: jest.fn(),
        };

        eventBus = {
            publish: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
            publishAll: jest.fn(),
        };
        randomIndexGenerator = {
            generate: jest.fn().mockReturnValue(0),
        };
        startTurnTimer = {
            execute: jest.fn(),
        };
        timer = {
            wait: jest.fn(),
        };
    });

    it("should start turn timer if the current team's user does not have auto draft enabled", async () => {
        const draftId: number = 1;
        const teamNumber: number = 1;
        const userId: number = 1;
        const time: number = 30;

        draftPlayerRepository.getDraftPicks.mockResolvedValue([new DraftPick(draftId, 1, teamNumber, null)]);
        draftRepository.getDraftSettings.mockResolvedValue(
            new FootballDraftSettings(DraftOrderEnum.SNAKE, ScoringEnum.PPR, 1, time, 0, 0, 0, 0, 0, 0, 0, 0, "", true),
        );
        draftUserRepository.getDraftUserByTeamNumber.mockResolvedValue(
            new DraftUser(draftId, 1, "mockUser", teamNumber, false, false),
        );

        const startDraft = new StartDraft(
            draftRepository,
            draftPlayerRepository,
            draftUserRepository,
            autoDraftPlayer,
            startTurnTimer,
            timer,
        );

        await startDraft.execute(draftId);

        expect(startTurnTimer.execute).toHaveBeenCalledWith(draftId, userId, time);
        expect(draftRepository.startDraft).toHaveBeenCalledWith(draftId);
    });
});
