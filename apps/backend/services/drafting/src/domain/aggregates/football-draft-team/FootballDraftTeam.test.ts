import { FootballPlayer } from "../../entities/football-player/FootballPlayer";
import { DraftOrderEnum } from "../../enums/DraftOrderEnum";
import { ScoringEnum } from "../../enums/ScoringEnum";
import { SportEnum } from "../../enums/SportEnum";
import { FootballDraftSettings } from "../../value-objects/football-draft-settings/FootballDraftSettings";
import { FootballDraftTeamAggregate } from "./FootballDraftTeam";

const createPlayer = (positions: string[]): FootballPlayer => {
    return new FootballPlayer(
        1,
        "John",
        "Doe",
        1,
        null,
        1,
        "headshotUrl",
        null,
        1,
        1,
        1,
        positions.includes("QB"),
        positions.includes("RB"),
        positions.includes("WR"),
        positions.includes("TE"),
        positions.includes("K"),
        positions.includes("DEF"),
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
    );
};

const createDraftSettings = (
    quarterbackSpotsCount: number,
    runningBackSpotsCount: number,
    wideReceiverSpotsCount: number,
    tightEndSpotsCount: number,
    flexSpotsCount: number,
    benchSpotsCount: number,
    kickerSpotsCount: number,
    defenseSpotsCount: number,
): FootballDraftSettings => {
    return new FootballDraftSettings(
        DraftOrderEnum.SNAKE,
        SportEnum.Football,
        ScoringEnum.PPR,
        1,
        1,
        true,
        new Date().toISOString(),
        quarterbackSpotsCount,
        runningBackSpotsCount,
        wideReceiverSpotsCount,
        tightEndSpotsCount,
        flexSpotsCount,
        benchSpotsCount,
        kickerSpotsCount,
        defenseSpotsCount,
    );
};

describe("FootballDraftTeam", () => {
    test("should create a basic FootballDraftTeam", () => {
        const draftTeam: FootballDraftTeamAggregate = new FootballDraftTeamAggregate(
            createDraftSettings(1, 1, 1, 1, 0, 0, 0, 0),
        );
        const quarterBackTightEnd: FootballPlayer = createPlayer(["QB", "TE"]);
        const runningBackTightEnd: FootballPlayer = createPlayer(["RB", "TE"]);
        const runningBackWideReceiver: FootballPlayer = createPlayer(["RB", "WR"]);
        const quarterback: FootballPlayer = createPlayer(["QB"]);

        draftTeam.addPlayer(quarterBackTightEnd);
        draftTeam.addPlayer(runningBackTightEnd);
        draftTeam.addPlayer(runningBackWideReceiver);
        draftTeam.addPlayer(quarterback);
        expect(draftTeam.toJSON()).toEqual({
            quarterback: [quarterback.toJSON()],
            runningBack: [runningBackTightEnd.toJSON()],
            wideReceiver: [runningBackWideReceiver.toJSON()],
            tightEnd: [quarterBackTightEnd.toJSON()],
            flex: [],
            bench: [],
            kicker: [],
            defense: [],
        });
    });

    test("should create a FootballDraftTeam with unfilled spots", () => {
        const draftTeam: FootballDraftTeamAggregate = new FootballDraftTeamAggregate(
            createDraftSettings(1, 1, 1, 1, 1, 1, 1, 0),
        );
        const quarterback: FootballPlayer = createPlayer(["QB"]);
        const runningBack: FootballPlayer = createPlayer(["RB"]);
        const wideReceiver: FootballPlayer = createPlayer(["WR"]);
        const tightEnd: FootballPlayer = createPlayer(["TE"]);
        const benchPlayer: FootballPlayer = createPlayer(["QB", "RB", "WR", "TE", "K", "DEF"]);

        draftTeam.addPlayer(quarterback);
        draftTeam.addPlayer(runningBack);
        draftTeam.addPlayer(wideReceiver);
        draftTeam.addPlayer(tightEnd);
        draftTeam.addPlayer(benchPlayer);
        expect(draftTeam.toJSON()).toEqual({
            quarterback: [quarterback.toJSON()],
            runningBack: [runningBack.toJSON()],
            wideReceiver: [wideReceiver.toJSON()],
            tightEnd: [tightEnd.toJSON()],
            flex: [benchPlayer.toJSON()],
            bench: [null],
            kicker: [null],
            defense: [],
        });
    });

    test("should create a FootballDraftTeam with many players", () => {
        const draftTeam: FootballDraftTeamAggregate = new FootballDraftTeamAggregate(
            createDraftSettings(2, 2, 2, 2, 2, 2, 2, 2),
        );
        const quarterback: FootballPlayer = createPlayer(["QB"]);
        const quarterBackTightEnd: FootballPlayer = createPlayer(["QB", "TE"]);
        const runningBackTightEnd: FootballPlayer = createPlayer(["RB", "TE"]);
        const runningBackWideReceiver: FootballPlayer = createPlayer(["RB", "WR"]);
        const runningBackWideReceiverTightEnd: FootballPlayer = createPlayer(["RB", "WR", "TE"]);
        const quarterbackWideReceiverTightEnd: FootballPlayer = createPlayer(["QB", "WR", "TE"]);
        const tightEnd: FootballPlayer = createPlayer(["TE"]);
        const runningBack: FootballPlayer = createPlayer(["RB"]);
        const wideReceiver: FootballPlayer = createPlayer(["WR"]);
        const wideReceiverTightEnd: FootballPlayer = createPlayer(["WR", "TE"]);
        const flexPlayer: FootballPlayer = createPlayer(["RB", "WR", "TE"]);
        const benchPlayer: FootballPlayer = createPlayer(["QB", "RB", "WR", "TE", "K", "DEF"]);
        const kicker: FootballPlayer = createPlayer(["K"]);
        const kickerTightend: FootballPlayer = createPlayer(["K", "TE"]);
        const defense1: FootballPlayer = createPlayer(["DEF"]);
        const defense2: FootballPlayer = createPlayer(["DEF"]);

        draftTeam.addPlayer(quarterback);
        draftTeam.addPlayer(quarterBackTightEnd);
        draftTeam.addPlayer(runningBackTightEnd);
        draftTeam.addPlayer(runningBackWideReceiver);
        draftTeam.addPlayer(runningBackWideReceiverTightEnd);
        draftTeam.addPlayer(quarterbackWideReceiverTightEnd);
        draftTeam.addPlayer(tightEnd);
        draftTeam.addPlayer(runningBack);
        draftTeam.addPlayer(wideReceiver);
        draftTeam.addPlayer(wideReceiverTightEnd);
        draftTeam.addPlayer(flexPlayer);
        draftTeam.addPlayer(benchPlayer);
        draftTeam.addPlayer(kicker);
        draftTeam.addPlayer(kickerTightend);
        draftTeam.addPlayer(defense1);
        draftTeam.addPlayer(defense2);
        expect(draftTeam.toJSON()).toEqual({
            quarterback: [quarterback.toJSON(), quarterBackTightEnd.toJSON()],
            runningBack: [runningBackTightEnd.toJSON(), runningBackWideReceiver.toJSON()],
            wideReceiver: [
                runningBackWideReceiverTightEnd.toJSON(),
                quarterbackWideReceiverTightEnd.toJSON(),
            ],
            tightEnd: [tightEnd.toJSON(), wideReceiverTightEnd.toJSON()],
            flex: [runningBack.toJSON(), wideReceiver.toJSON()],
            bench: [flexPlayer.toJSON(), benchPlayer.toJSON()],
            kicker: [kicker.toJSON(), kickerTightend.toJSON()],
            defense: [defense2.toJSON(), defense1.toJSON()],
        });
    });

    test("should throw an error when adding to a full team", () => {
        const draftTeam: FootballDraftTeamAggregate = new FootballDraftTeamAggregate(
            createDraftSettings(1, 0, 0, 0, 0, 0, 0, 0),
        );
        const quarterback1: FootballPlayer = createPlayer(["QB"]);
        const quarterback2: FootballPlayer = createPlayer(["QB"]);

        draftTeam.addPlayer(quarterback1);
        expect(() => draftTeam.addPlayer(quarterback2)).toThrow("Team is full");
    });

    test("should throw an error when unable to assign a player", () => {
        const draftTeam: FootballDraftTeamAggregate = new FootballDraftTeamAggregate(
            createDraftSettings(1, 1, 0, 0, 0, 0, 0, 0),
        );
        const quarterback1: FootballPlayer = createPlayer(["QB"]);
        const quarterback2: FootballPlayer = createPlayer(["QB"]);

        draftTeam.addPlayer(quarterback1);
        expect(() => draftTeam.addPlayer(quarterback2)).toThrow("Unable to add player");
    });
});
