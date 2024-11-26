import { FootballPlayer, DraftRoster, FootballPositionEnum } from "../../../../src/domain";
import { createFootballPlayer } from "../../../test-utils";

describe("DraftRoster", () => {
    test("should instantiate a FootballDraftTeam", () => {
        const quarterback: FootballPlayer = createFootballPlayer(1, [FootballPositionEnum.QUARTERBACK]);
        const runningBack: FootballPlayer = createFootballPlayer(2, [FootballPositionEnum.RUNNING_BACK]);
        const wideReceiver: FootballPlayer = createFootballPlayer(3, [FootballPositionEnum.WIDE_RECEIVER]);
        const tightEnd: FootballPlayer = createFootballPlayer(4, [FootballPositionEnum.TIGHT_END]);
        const flexPlayer: FootballPlayer = createFootballPlayer(5, [FootballPositionEnum.FLEX]);
        const benchPlayer: FootballPlayer = createFootballPlayer(6, [FootballPositionEnum.BENCH]);
        const kicker: FootballPlayer = createFootballPlayer(7, [FootballPositionEnum.KICKER]);
        const defense: FootballPlayer = createFootballPlayer(8, [FootballPositionEnum.DEFENSE]);

        const draftTeam: DraftRoster = new DraftRoster(
            1,
            {
                [FootballPositionEnum.QUARTERBACK]: 1,
                [FootballPositionEnum.RUNNING_BACK]: 1,
                [FootballPositionEnum.WIDE_RECEIVER]: 1,
                [FootballPositionEnum.TIGHT_END]: 1,
                [FootballPositionEnum.FLEX]: 1,
                [FootballPositionEnum.BENCH]: 1,
                [FootballPositionEnum.KICKER]: 1,
                [FootballPositionEnum.DEFENSE]: 1,
            },
            [quarterback, runningBack, wideReceiver, tightEnd, flexPlayer, benchPlayer, kicker, defense],
        );

        expect(draftTeam.toJSON()).toEqual({
            [FootballPositionEnum.QUARTERBACK]: [quarterback.toJSON()],
            [FootballPositionEnum.RUNNING_BACK]: [runningBack.toJSON()],
            [FootballPositionEnum.WIDE_RECEIVER]: [wideReceiver.toJSON()],
            [FootballPositionEnum.TIGHT_END]: [tightEnd.toJSON()],
            [FootballPositionEnum.FLEX]: [flexPlayer.toJSON()],
            [FootballPositionEnum.BENCH]: [benchPlayer.toJSON()],
            [FootballPositionEnum.KICKER]: [kicker.toJSON()],
            [FootballPositionEnum.DEFENSE]: [defense.toJSON()],
        });
    });

    test("should be able to know if player can be added to team", () => {
        const quarterBackTightEnd: FootballPlayer = createFootballPlayer(1, [
            FootballPositionEnum.QUARTERBACK,
            FootballPositionEnum.TIGHT_END,
        ]);
        const runningBackTightEnd: FootballPlayer = createFootballPlayer(2, [
            FootballPositionEnum.RUNNING_BACK,
            FootballPositionEnum.TIGHT_END,
        ]);
        const runningBackWideReceiver: FootballPlayer = createFootballPlayer(3, [
            FootballPositionEnum.RUNNING_BACK,
            FootballPositionEnum.WIDE_RECEIVER,
        ]);
        const quarterback: FootballPlayer = createFootballPlayer(4, [FootballPositionEnum.QUARTERBACK]);

        const draftTeam: DraftRoster = new DraftRoster(
            1,
            {
                [FootballPositionEnum.QUARTERBACK]: 1,
                [FootballPositionEnum.RUNNING_BACK]: 1,
                [FootballPositionEnum.WIDE_RECEIVER]: 1,
                [FootballPositionEnum.TIGHT_END]: 1,
                [FootballPositionEnum.FLEX]: 0,
                [FootballPositionEnum.BENCH]: 0,
                [FootballPositionEnum.KICKER]: 0,
                [FootballPositionEnum.DEFENSE]: 0,
            },
            [quarterBackTightEnd, runningBackTightEnd, runningBackWideReceiver],
        );

        expect(draftTeam.canAddPlayer(quarterback)).toBe(true);
    });

    test("should add a player to FootballDraftTeam", () => {
        const quarterBackTightEnd: FootballPlayer = createFootballPlayer(1, [
            FootballPositionEnum.QUARTERBACK,
            FootballPositionEnum.TIGHT_END,
        ]);
        const runningBackTightEnd: FootballPlayer = createFootballPlayer(2, [
            FootballPositionEnum.RUNNING_BACK,
            FootballPositionEnum.TIGHT_END,
        ]);
        const runningBackWideReceiver: FootballPlayer = createFootballPlayer(3, [
            FootballPositionEnum.RUNNING_BACK,
            FootballPositionEnum.WIDE_RECEIVER,
        ]);
        const quarterback: FootballPlayer = createFootballPlayer(4, [FootballPositionEnum.QUARTERBACK]);

        const draftTeam: DraftRoster = new DraftRoster(
            1,
            {
                [FootballPositionEnum.QUARTERBACK]: 1,
                [FootballPositionEnum.RUNNING_BACK]: 1,
                [FootballPositionEnum.WIDE_RECEIVER]: 1,
                [FootballPositionEnum.TIGHT_END]: 1,
                [FootballPositionEnum.FLEX]: 0,
                [FootballPositionEnum.BENCH]: 0,
                [FootballPositionEnum.KICKER]: 0,
                [FootballPositionEnum.DEFENSE]: 0,
            },
            [quarterBackTightEnd, runningBackTightEnd, runningBackWideReceiver],
        );
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
        const quarterback: FootballPlayer = createFootballPlayer(1, [FootballPositionEnum.QUARTERBACK]);
        const runningBack: FootballPlayer = createFootballPlayer(2, [FootballPositionEnum.RUNNING_BACK]);
        const wideReceiver: FootballPlayer = createFootballPlayer(3, [FootballPositionEnum.WIDE_RECEIVER]);
        const tightEnd: FootballPlayer = createFootballPlayer(4, [FootballPositionEnum.TIGHT_END]);
        const benchPlayer: FootballPlayer = createFootballPlayer(5, [FootballPositionEnum.BENCH]);
        const draftTeam: DraftRoster = new DraftRoster(
            1,
            {
                [FootballPositionEnum.QUARTERBACK]: 1,
                [FootballPositionEnum.RUNNING_BACK]: 1,
                [FootballPositionEnum.WIDE_RECEIVER]: 1,
                [FootballPositionEnum.TIGHT_END]: 1,
                [FootballPositionEnum.FLEX]: 1,
                [FootballPositionEnum.BENCH]: 1,
                [FootballPositionEnum.KICKER]: 1,
                [FootballPositionEnum.DEFENSE]: 0,
            },
            [quarterback, runningBack, wideReceiver, tightEnd, benchPlayer],
        );
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
        const quarterback: FootballPlayer = createFootballPlayer(1, [FootballPositionEnum.QUARTERBACK]);
        const quarterBackTightEnd: FootballPlayer = createFootballPlayer(2, [
            FootballPositionEnum.QUARTERBACK,
            FootballPositionEnum.TIGHT_END,
        ]);
        const runningBackTightEnd: FootballPlayer = createFootballPlayer(3, [
            FootballPositionEnum.RUNNING_BACK,
            FootballPositionEnum.TIGHT_END,
        ]);
        const runningBackWideReceiver: FootballPlayer = createFootballPlayer(4, [
            FootballPositionEnum.RUNNING_BACK,
            FootballPositionEnum.WIDE_RECEIVER,
        ]);
        const runningBackWideReceiverTightEnd: FootballPlayer = createFootballPlayer(5, [
            FootballPositionEnum.RUNNING_BACK,
            FootballPositionEnum.WIDE_RECEIVER,
            FootballPositionEnum.TIGHT_END,
        ]);
        const quarterbackWideReceiverTightEnd: FootballPlayer = createFootballPlayer(6, [
            FootballPositionEnum.QUARTERBACK,
            FootballPositionEnum.WIDE_RECEIVER,
            FootballPositionEnum.TIGHT_END,
        ]);
        const tightEnd: FootballPlayer = createFootballPlayer(7, [FootballPositionEnum.TIGHT_END]);
        const runningBack: FootballPlayer = createFootballPlayer(8, [FootballPositionEnum.RUNNING_BACK]);
        const wideReceiver: FootballPlayer = createFootballPlayer(9, [FootballPositionEnum.WIDE_RECEIVER]);
        const wideReceiverTightEnd: FootballPlayer = createFootballPlayer(10, [
            FootballPositionEnum.WIDE_RECEIVER,
            FootballPositionEnum.TIGHT_END,
        ]);
        const flexPlayer: FootballPlayer = createFootballPlayer(11, [FootballPositionEnum.FLEX]);
        const benchPlayer: FootballPlayer = createFootballPlayer(12, [FootballPositionEnum.BENCH]);
        const kicker: FootballPlayer = createFootballPlayer(13, [FootballPositionEnum.KICKER]);
        const kickerTightend: FootballPlayer = createFootballPlayer(14, [
            FootballPositionEnum.KICKER,
            FootballPositionEnum.TIGHT_END,
        ]);
        const defense1: FootballPlayer = createFootballPlayer(15, [FootballPositionEnum.DEFENSE]);
        const defense2: FootballPlayer = createFootballPlayer(16, [FootballPositionEnum.DEFENSE]);
        const draftTeam: DraftRoster = new DraftRoster(
            1,
            {
                [FootballPositionEnum.QUARTERBACK]: 2,
                [FootballPositionEnum.RUNNING_BACK]: 2,
                [FootballPositionEnum.WIDE_RECEIVER]: 2,
                [FootballPositionEnum.TIGHT_END]: 2,
                [FootballPositionEnum.FLEX]: 2,
                [FootballPositionEnum.BENCH]: 2,
                [FootballPositionEnum.KICKER]: 2,
                [FootballPositionEnum.DEFENSE]: 2,
            },
            [
                quarterback,
                quarterBackTightEnd,
                runningBackTightEnd,
                runningBackWideReceiver,
                runningBackWideReceiverTightEnd,
                quarterbackWideReceiverTightEnd,
                tightEnd,
                runningBack,
                wideReceiver,
                wideReceiverTightEnd,
                flexPlayer,
                benchPlayer,
                kicker,
                kickerTightend,
                defense1,
                defense2,
            ],
        );
        expect(draftTeam.toJSON()).toEqual({
            quarterback: [quarterback.toJSON(), quarterBackTightEnd.toJSON()],
            runningBack: [runningBackTightEnd.toJSON(), runningBackWideReceiver.toJSON()],
            wideReceiver: [runningBackWideReceiverTightEnd.toJSON(), quarterbackWideReceiverTightEnd.toJSON()],
            tightEnd: [tightEnd.toJSON(), wideReceiverTightEnd.toJSON()],
            flex: [runningBack.toJSON(), wideReceiver.toJSON()],
            bench: [flexPlayer.toJSON(), benchPlayer.toJSON()],
            kicker: [kicker.toJSON(), kickerTightend.toJSON()],
            defense: [defense1.toJSON(), defense2.toJSON()],
        });
    });

    test("should throw an error when adding to a full team", () => {
        const quarterback1: FootballPlayer = createFootballPlayer(1, [FootballPositionEnum.QUARTERBACK]);
        const quarterback2: FootballPlayer = createFootballPlayer(2, [FootballPositionEnum.QUARTERBACK]);
        const draftTeam: DraftRoster = new DraftRoster(
            1,
            {
                [FootballPositionEnum.QUARTERBACK]: 1,
                [FootballPositionEnum.RUNNING_BACK]: 0,
                [FootballPositionEnum.WIDE_RECEIVER]: 0,
                [FootballPositionEnum.TIGHT_END]: 0,
                [FootballPositionEnum.FLEX]: 0,
                [FootballPositionEnum.BENCH]: 0,
                [FootballPositionEnum.KICKER]: 0,
                [FootballPositionEnum.DEFENSE]: 0,
            },
            [quarterback1],
        );

        expect(() => draftTeam.addPlayer(quarterback2)).toThrow("Team is full");
    });

    test("should throw an error when unable to assign a player", () => {
        const quarterback1: FootballPlayer = createFootballPlayer(1, [FootballPositionEnum.QUARTERBACK]);
        const quarterback2: FootballPlayer = createFootballPlayer(2, [FootballPositionEnum.QUARTERBACK]);
        const draftTeam: DraftRoster = new DraftRoster(
            1,
            {
                [FootballPositionEnum.QUARTERBACK]: 1,
                [FootballPositionEnum.RUNNING_BACK]: 1,
                [FootballPositionEnum.WIDE_RECEIVER]: 0,
                [FootballPositionEnum.TIGHT_END]: 0,
                [FootballPositionEnum.FLEX]: 0,
                [FootballPositionEnum.BENCH]: 0,
                [FootballPositionEnum.KICKER]: 0,
                [FootballPositionEnum.DEFENSE]: 0,
            },
            [quarterback1],
        );

        expect(() => draftTeam.addPlayer(quarterback2)).toThrow("Unable to add player");
    });

    test("should instantiate a roster with no spots", () => {
        const draftTeam: DraftRoster = new DraftRoster(
            1,
            {
                [FootballPositionEnum.QUARTERBACK]: 0,
                [FootballPositionEnum.RUNNING_BACK]: 0,
                [FootballPositionEnum.WIDE_RECEIVER]: 0,
                [FootballPositionEnum.TIGHT_END]: 0,
                [FootballPositionEnum.FLEX]: 0,
                [FootballPositionEnum.BENCH]: 0,
                [FootballPositionEnum.KICKER]: 0,
                [FootballPositionEnum.DEFENSE]: 0,
            },
            [],
        );
        expect(draftTeam.toJSON()).toEqual({
            [FootballPositionEnum.QUARTERBACK]: [],
            [FootballPositionEnum.RUNNING_BACK]: [],
            [FootballPositionEnum.WIDE_RECEIVER]: [],
            [FootballPositionEnum.TIGHT_END]: [],
            [FootballPositionEnum.FLEX]: [],
            [FootballPositionEnum.BENCH]: [],
            [FootballPositionEnum.KICKER]: [],
            [FootballPositionEnum.DEFENSE]: [],
        });
    });

    test("should instantiate an unfilled roster", () => {
        const draftTeam: DraftRoster = new DraftRoster(
            1,
            {
                [FootballPositionEnum.QUARTERBACK]: 1,
                [FootballPositionEnum.RUNNING_BACK]: 1,
                [FootballPositionEnum.WIDE_RECEIVER]: 1,
                [FootballPositionEnum.TIGHT_END]: 1,
                [FootballPositionEnum.FLEX]: 1,
                [FootballPositionEnum.BENCH]: 1,
                [FootballPositionEnum.KICKER]: 1,
                [FootballPositionEnum.DEFENSE]: 1,
            },
            [],
        );
        expect(draftTeam.toJSON()).toEqual({
            [FootballPositionEnum.QUARTERBACK]: [null],
            [FootballPositionEnum.RUNNING_BACK]: [null],
            [FootballPositionEnum.WIDE_RECEIVER]: [null],
            [FootballPositionEnum.TIGHT_END]: [null],
            [FootballPositionEnum.FLEX]: [null],
            [FootballPositionEnum.BENCH]: [null],
            [FootballPositionEnum.KICKER]: [null],
            [FootballPositionEnum.DEFENSE]: [null],
        });
    });
});
