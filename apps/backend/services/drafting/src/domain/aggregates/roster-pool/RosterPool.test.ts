import {
    DraftOrderEnum,
    DraftPick,
    FootballDraftSettings,
    FootballPositionEnum,
    Roster,
    RosterPool,
    RosterPoolFactory,
    ScoringEnum,
    SportEnum,
} from "../..";
import { createFootballPlayer } from "../../../../tests/test-utils";

describe("RosterPool", () => {
    let draftPicks: DraftPick[];
    let draftSettings: FootballDraftSettings;

    beforeEach(() => {
        draftPicks = [
            {
                draftId: 1,
                pickNumber: 1,
                teamNumber: 1,
                player: createFootballPlayer(1, [FootballPositionEnum.QUARTERBACK]),
            },
            {
                draftId: 1,
                pickNumber: 2,
                teamNumber: 2,
                player: createFootballPlayer(2, [FootballPositionEnum.RUNNING_BACK]),
            },
            { draftId: 1, pickNumber: 3, teamNumber: 2, player: null },
            { draftId: 1, pickNumber: 4, teamNumber: 1, player: null },
        ];
        draftSettings = {
            sport: SportEnum.FOOTBALL,
            draftOrderType: DraftOrderEnum.SNAKE,
            scoringType: ScoringEnum.PPR,
            pickTimeLimitSeconds: null,
            teamCount: 2,
            quarterbackSpotsCount: 1,
            runningBackSpotsCount: 1,
            wideReceiverSpotsCount: 0,
            tightEndSpotsCount: 0,
            flexSpotsCount: 0,
            benchSpotsCount: 0,
            kickerSpotsCount: 0,
            defenseSpotsCount: 0,
        };
    });

    test("should get a roster", () => {
        // Arrange
        const rosterPool: RosterPool = RosterPoolFactory.create(draftSettings, draftPicks, []);

        // Act
        const roster: Roster = rosterPool.getRoster(1);

        // Assert
        expect(roster.teamNumber).toBe(1);
    });

    test("should add a player to a roster", () => {
        // Arrange
        const rosterPool: RosterPool = RosterPoolFactory.create(draftSettings, draftPicks, []);

        // Act
        rosterPool.addPlayerToRoster(1, createFootballPlayer(1, [FootballPositionEnum.RUNNING_BACK]));

        // Assert
        expect(rosterPool.getRoster(1).isRosterFull()).toBe(true);
    });

    test("should check if the rosters are full", () => {
        // Arrange
        const rosterPool: RosterPool = RosterPoolFactory.create(draftSettings, draftPicks, []);

        // Act
        rosterPool.addPlayerToRoster(1, createFootballPlayer(1, [FootballPositionEnum.RUNNING_BACK]));
        rosterPool.addPlayerToRoster(2, createFootballPlayer(2, [FootballPositionEnum.QUARTERBACK]));

        // Assert
        expect(rosterPool.isRostersFull()).toBe(true);
    });
});
