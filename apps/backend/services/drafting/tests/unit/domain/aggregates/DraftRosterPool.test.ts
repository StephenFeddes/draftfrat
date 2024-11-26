import {
    DraftOrderEnum,
    DraftPick,
    DraftRoster,
    DraftRosterPool,
    DraftRosterPoolFactory,
    FootballDraftSettings,
    FootballPositionEnum,
    ScoringEnum,
} from "../../../../src/domain";
import { createFootballPlayer } from "../../../test-utils";

describe("DraftRosterPoo", () => {
    let draftPicks: DraftPick[];

    const draftSettings = new FootballDraftSettings(
        DraftOrderEnum.SNAKE,
        ScoringEnum.STANDARD,
        2,
        null,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
    );

    beforeEach(() => {
        draftPicks = [
            new DraftPick(1, 1, 1, createFootballPlayer(1, [FootballPositionEnum.QUARTERBACK])),
            new DraftPick(1, 2, 2, createFootballPlayer(2, [FootballPositionEnum.RUNNING_BACK])),
            new DraftPick(1, 3, 2, null),
            new DraftPick(1, 4, 1, null),
        ];
    });

    test("should get a roster", () => {
        const rosterPool: DraftRosterPool = DraftRosterPoolFactory.create(draftSettings, draftPicks, []);
        const roster: DraftRoster = rosterPool.getRoster(1);
        expect(roster.teamNumber).toBe(1);
    });

    test("should add a player to a roster", () => {
        const rosterPool: DraftRosterPool = DraftRosterPoolFactory.create(draftSettings, draftPicks, []);
        rosterPool.addPlayerToRoster(1, createFootballPlayer(1, [FootballPositionEnum.RUNNING_BACK]));
        expect(rosterPool.getRoster(1).isRosterFull()).toBe(true);
    });

    test("should check if the rosters are full", () => {
        const rosterPool: DraftRosterPool = DraftRosterPoolFactory.create(draftSettings, draftPicks, []);
        rosterPool.addPlayerToRoster(1, createFootballPlayer(1, [FootballPositionEnum.RUNNING_BACK]));
        rosterPool.addPlayerToRoster(2, createFootballPlayer(2, [FootballPositionEnum.QUARTERBACK]));
        expect(rosterPool.isRostersFull()).toBe(true);
    });
});
