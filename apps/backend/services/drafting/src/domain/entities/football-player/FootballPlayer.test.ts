import { FootballPlayer } from "./FootballPlayer"; // Adjust path as necessary
import { FootballPlayerDTO } from "../../dto/FootballPlayerDTO";
import { InjuryStatusEnum } from "../../enums/InjuryStatusEnum";
import { FootballTeam } from "../football-team/FootballTeam";

describe("FootballPlayer", () => {
    const validTeam = new FootballTeam(1, "NYG", 5);

    const validParams = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        averageDraftPosition: 10.2,
        injuryStatus: InjuryStatusEnum.Questionable,
        yearsExperience: 3,
        headshotUrl: "http://example.com/headshot.jpg",
        team: validTeam,
        pprRank: 100,
        halfPprRank: 150,
        standardRank: 120,
        isQuarterback: false,
        isRunningBack: true,
        isWideReceiver: false,
        isTightEnd: false,
        isKicker: false,
        isDefense: false,
        projectedRushingAttempts: 50,
        projectedRushingYards: 500,
        projectedRushingTouchdowns: 5,
        projectedTargets: 40,
        projectedReceivingYards: 300,
        projectedReceivingTouchdowns: 2,
        projectedPassingAttempts: 20,
        projectedPassingYards: 200,
        projectedPassingTouchdowns: 1,
        projectedStandardFantasyPoints: 150,
        projectedHalfPprFantasyPoints: 155,
        projectedPprFantasyPoints: 160,
    };

    it("should create an instance with valid parameters", () => {
        const player = new FootballPlayer(
            validParams.id,
            validParams.firstName,
            validParams.lastName,
            validParams.averageDraftPosition,
            validParams.injuryStatus,
            validParams.yearsExperience,
            validParams.headshotUrl,
            validParams.team,
            validParams.pprRank,
            validParams.halfPprRank,
            validParams.standardRank,
            validParams.isQuarterback,
            validParams.isRunningBack,
            validParams.isWideReceiver,
            validParams.isTightEnd,
            validParams.isKicker,
            validParams.isDefense,
            validParams.projectedRushingAttempts,
            validParams.projectedRushingYards,
            validParams.projectedRushingTouchdowns,
            validParams.projectedTargets,
            validParams.projectedReceivingYards,
            validParams.projectedReceivingTouchdowns,
            validParams.projectedPassingAttempts,
            validParams.projectedPassingYards,
            validParams.projectedPassingTouchdowns,
            validParams.projectedStandardFantasyPoints,
            validParams.projectedHalfPprFantasyPoints,
            validParams.projectedPprFantasyPoints,
        );

        expect(player).toBeInstanceOf(FootballPlayer);
        expect(player.id).toBe(validParams.id);
        expect(player.firstName).toBe(validParams.firstName);
        expect(player.team).toBe(validParams.team);
    });

    it("should throw an error if 'id' is invalid", () => {
        expect(
            () =>
                new FootballPlayer(
                    undefined as unknown as number,
                    validParams.firstName,
                    validParams.lastName,
                    validParams.averageDraftPosition,
                    validParams.injuryStatus,
                    validParams.yearsExperience,
                    validParams.headshotUrl,
                    validParams.team,
                    validParams.pprRank,
                    validParams.halfPprRank,
                    validParams.standardRank,
                    validParams.isQuarterback,
                    validParams.isRunningBack,
                    validParams.isWideReceiver,
                    validParams.isTightEnd,
                    validParams.isKicker,
                    validParams.isDefense,
                    validParams.projectedRushingAttempts,
                    validParams.projectedRushingYards,
                    validParams.projectedRushingTouchdowns,
                    validParams.projectedTargets,
                    validParams.projectedReceivingYards,
                    validParams.projectedReceivingTouchdowns,
                    validParams.projectedPassingAttempts,
                    validParams.projectedPassingYards,
                    validParams.projectedPassingTouchdowns,
                    validParams.projectedStandardFantasyPoints,
                    validParams.projectedHalfPprFantasyPoints,
                    validParams.projectedPprFantasyPoints,
                ),
        ).toThrow("id is required and must be a positive whole number");
    });

    it("should throw an error if 'firstName' is missing or empty", () => {
        expect(
            () =>
                new FootballPlayer(
                    validParams.id,
                    "",
                    validParams.lastName,
                    validParams.averageDraftPosition,
                    validParams.injuryStatus,
                    validParams.yearsExperience,
                    validParams.headshotUrl,
                    validParams.team,
                    validParams.pprRank,
                    validParams.halfPprRank,
                    validParams.standardRank,
                    validParams.isQuarterback,
                    validParams.isRunningBack,
                    validParams.isWideReceiver,
                    validParams.isTightEnd,
                    validParams.isKicker,
                    validParams.isDefense,
                    validParams.projectedRushingAttempts,
                    validParams.projectedRushingYards,
                    validParams.projectedRushingTouchdowns,
                    validParams.projectedTargets,
                    validParams.projectedReceivingYards,
                    validParams.projectedReceivingTouchdowns,
                    validParams.projectedPassingAttempts,
                    validParams.projectedPassingYards,
                    validParams.projectedPassingTouchdowns,
                    validParams.projectedStandardFantasyPoints,
                    validParams.projectedHalfPprFantasyPoints,
                    validParams.projectedPprFantasyPoints,
                ),
        ).toThrow("firstName is required and must be a string");
    });

    it("should throw an error if 'averageDraftPosition' is negative", () => {
        expect(
            () =>
                new FootballPlayer(
                    validParams.id,
                    validParams.firstName,
                    validParams.lastName,
                    -1, // Invalid averageDraftPosition
                    validParams.injuryStatus,
                    validParams.yearsExperience,
                    validParams.headshotUrl,
                    validParams.team,
                    validParams.pprRank,
                    validParams.halfPprRank,
                    validParams.standardRank,
                    validParams.isQuarterback,
                    validParams.isRunningBack,
                    validParams.isWideReceiver,
                    validParams.isTightEnd,
                    validParams.isKicker,
                    validParams.isDefense,
                    validParams.projectedRushingAttempts,
                    validParams.projectedRushingYards,
                    validParams.projectedRushingTouchdowns,
                    validParams.projectedTargets,
                    validParams.projectedReceivingYards,
                    validParams.projectedReceivingTouchdowns,
                    validParams.projectedPassingAttempts,
                    validParams.projectedPassingYards,
                    validParams.projectedPassingTouchdowns,
                    validParams.projectedStandardFantasyPoints,
                    validParams.projectedHalfPprFantasyPoints,
                    validParams.projectedPprFantasyPoints,
                ),
        ).toThrow("averageDraftPosition must be a positive number");
    });

    it("should throw an error if 'injuryStatus' is not a valid enum value", () => {
        expect(
            () =>
                new FootballPlayer(
                    validParams.id,
                    validParams.firstName,
                    validParams.lastName,
                    validParams.averageDraftPosition,
                    "InvalidStatus" as unknown as InjuryStatusEnum,
                    validParams.yearsExperience,
                    validParams.headshotUrl,
                    validParams.team,
                    validParams.pprRank,
                    validParams.halfPprRank,
                    validParams.standardRank,
                    validParams.isQuarterback,
                    validParams.isRunningBack,
                    validParams.isWideReceiver,
                    validParams.isTightEnd,
                    validParams.isKicker,
                    validParams.isDefense,
                    validParams.projectedRushingAttempts,
                    validParams.projectedRushingYards,
                    validParams.projectedRushingTouchdowns,
                    validParams.projectedTargets,
                    validParams.projectedReceivingYards,
                    validParams.projectedReceivingTouchdowns,
                    validParams.projectedPassingAttempts,
                    validParams.projectedPassingYards,
                    validParams.projectedPassingTouchdowns,
                    validParams.projectedStandardFantasyPoints,
                    validParams.projectedHalfPprFantasyPoints,
                    validParams.projectedPprFantasyPoints,
                ),
        ).toThrow("injuryStatus must be a string or null");
    });

    it("should throw an error if 'yearsExperience' is negative", () => {
        expect(
            () =>
                new FootballPlayer(
                    validParams.id,
                    validParams.firstName,
                    validParams.lastName,
                    validParams.averageDraftPosition,
                    validParams.injuryStatus,
                    -1,
                    validParams.headshotUrl,
                    validParams.team,
                    validParams.pprRank,
                    validParams.halfPprRank,
                    validParams.standardRank,
                    validParams.isQuarterback,
                    validParams.isRunningBack,
                    validParams.isWideReceiver,
                    validParams.isTightEnd,
                    validParams.isKicker,
                    validParams.isDefense,
                    validParams.projectedRushingAttempts,
                    validParams.projectedRushingYards,
                    validParams.projectedRushingTouchdowns,
                    validParams.projectedTargets,
                    validParams.projectedReceivingYards,
                    validParams.projectedReceivingTouchdowns,
                    validParams.projectedPassingAttempts,
                    validParams.projectedPassingYards,
                    validParams.projectedPassingTouchdowns,
                    validParams.projectedStandardFantasyPoints,
                    validParams.projectedHalfPprFantasyPoints,
                    validParams.projectedPprFantasyPoints,
                ),
        ).toThrow("yearsExperience must be a positive whole number");
    });

    it("should throw an error if 'team' is not an instance of FootballTeam", () => {
        expect(
            () =>
                new FootballPlayer(
                    validParams.id,
                    validParams.firstName,
                    validParams.lastName,
                    validParams.averageDraftPosition,
                    validParams.injuryStatus,
                    validParams.yearsExperience,
                    validParams.headshotUrl,
                    undefined as unknown as FootballTeam,
                    validParams.pprRank,
                    validParams.halfPprRank,
                    validParams.standardRank,
                    validParams.isQuarterback,
                    validParams.isRunningBack,
                    validParams.isWideReceiver,
                    validParams.isTightEnd,
                    validParams.isKicker,
                    validParams.isDefense,
                    validParams.projectedRushingAttempts,
                    validParams.projectedRushingYards,
                    validParams.projectedRushingTouchdowns,
                    validParams.projectedTargets,
                    validParams.projectedReceivingYards,
                    validParams.projectedReceivingTouchdowns,
                    validParams.projectedPassingAttempts,
                    validParams.projectedPassingYards,
                    validParams.projectedPassingTouchdowns,
                    validParams.projectedStandardFantasyPoints,
                    validParams.projectedHalfPprFantasyPoints,
                    validParams.projectedPprFantasyPoints,
                ),
        ).toThrow("team must be null or FootballTeam");
    });

    it("should correctly convert to JSON format", () => {
        const player = new FootballPlayer(
            validParams.id,
            validParams.firstName,
            validParams.lastName,
            validParams.averageDraftPosition,
            validParams.injuryStatus,
            validParams.yearsExperience,
            validParams.headshotUrl,
            validParams.team,
            validParams.pprRank,
            validParams.halfPprRank,
            validParams.standardRank,
            validParams.isQuarterback,
            validParams.isRunningBack,
            validParams.isWideReceiver,
            validParams.isTightEnd,
            validParams.isKicker,
            validParams.isDefense,
            validParams.projectedRushingAttempts,
            validParams.projectedRushingYards,
            validParams.projectedRushingTouchdowns,
            validParams.projectedTargets,
            validParams.projectedReceivingYards,
            validParams.projectedReceivingTouchdowns,
            validParams.projectedPassingAttempts,
            validParams.projectedPassingYards,
            validParams.projectedPassingTouchdowns,
            validParams.projectedStandardFantasyPoints,
            validParams.projectedHalfPprFantasyPoints,
            validParams.projectedPprFantasyPoints,
        );

        const expectedJson: FootballPlayerDTO = {
            id: validParams.id,
            averageDraftPosition: validParams.averageDraftPosition,
            firstName: validParams.firstName,
            lastName: validParams.lastName,
            injuryStatus: validParams.injuryStatus,
            yearsExperience: validParams.yearsExperience,
            headshotUrl: validParams.headshotUrl,
            team: {
                id: validParams.team.id,
                abbreviation: validParams.team.abbreviation,
                byeWeek: validParams.team.byeWeek,
            },
            pprRank: validParams.pprRank,
            halfPprRank: validParams.halfPprRank,
            standardRank: validParams.standardRank,
            isQuarterback: validParams.isQuarterback,
            isRunningBack: validParams.isRunningBack,
            isWideReceiver: validParams.isWideReceiver,
            isTightEnd: validParams.isTightEnd,
            isKicker: validParams.isKicker,
            isDefense: validParams.isDefense,
            projectedRushingAttempts: validParams.projectedRushingAttempts,
            projectedRushingYards: validParams.projectedRushingYards,
            projectedRushingTouchdowns: validParams.projectedRushingTouchdowns,
            projectedTargets: validParams.projectedTargets,
            projectedReceivingYards: validParams.projectedReceivingYards,
            projectedReceivingTouchdowns: validParams.projectedReceivingTouchdowns,
            projectedPassingAttempts: validParams.projectedPassingAttempts,
            projectedPassingYards: validParams.projectedPassingYards,
            projectedPassingTouchdowns: validParams.projectedPassingTouchdowns,
            projectedStandardFantasyPoints: validParams.projectedStandardFantasyPoints,
            projectedHalfPprFantasyPoints: validParams.projectedHalfPprFantasyPoints,
            projectedPprFantasyPoints: validParams.projectedPprFantasyPoints,
        };

        expect(player.toJSON()).toEqual(expectedJson);
    });
});
