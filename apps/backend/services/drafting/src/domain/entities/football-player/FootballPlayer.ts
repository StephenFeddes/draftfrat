import { Player } from "../../../contracts/entities/Player";
import { FootballPlayerDTO } from "../../dto/FootballPlayerDTO";
import { FootballPositionEnum } from "../../enums/FootballPositionEnum";
import { InjuryStatusEnum } from "../../enums/InjuryStatusEnum";
import { FootballTeam } from "../football-team/FootballTeam";

export class FootballPlayer extends Player {
    public readonly pprRank: number;

    public readonly halfPprRank: number;

    public readonly standardRank: number;

    public readonly isQuarterback: boolean;

    public readonly isRunningBack: boolean;

    public readonly isWideReceiver: boolean;

    public readonly isTightEnd: boolean;

    public readonly isKicker: boolean;

    public readonly isDefense: boolean;

    public readonly projectedRushingAttempts: number | null;

    public readonly projectedRushingYards: number | null;

    public readonly projectedRushingTouchdowns: number | null;

    public readonly projectedTargets: number | null;

    public readonly projectedReceivingYards: number | null;

    public readonly projectedReceivingTouchdowns: number | null;

    public readonly projectedPassingAttempts: number | null;

    public readonly projectedPassingYards: number | null;

    public readonly projectedPassingTouchdowns: number | null;

    public readonly projectedStandardFantasyPoints: number | null;

    public readonly projectedHalfPprFantasyPoints: number | null;

    public readonly projectedPprFantasyPoints: number | null;

    constructor(
        id: number,
        firstName: string,
        lastName: string,
        averageDraftPosition: number,
        injuryStatus: InjuryStatusEnum | null,
        yearsExperience: number,
        headshotUrl: string,
        team: FootballTeam | null,
        pprRank: number,
        halfPprRank: number,
        standardRank: number,
        isQuarterback: boolean,
        isRunningBack: boolean,
        isWideReceiver: boolean,
        isTightEnd: boolean,
        isKicker: boolean,
        isDefense: boolean,
        projectedRushingAttempts: number | null,
        projectedRushingYards: number | null,
        projectedRushingTouchdowns: number | null,
        projectedTargets: number | null,
        projectedReceivingYards: number | null,
        projectedReceivingTouchdowns: number | null,
        projectedPassingAttempts: number | null,
        projectedPassingYards: number | null,
        projectedPassingTouchdowns: number | null,
        projectedStandardFantasyPoints: number | null,
        projectedHalfPprFantasyPoints: number | null,
        projectedPprFantasyPoints: number | null,
    ) {
        super(
            id,
            firstName,
            lastName,
            averageDraftPosition,
            injuryStatus,
            yearsExperience,
            headshotUrl,
            team,
        );

        if (id === undefined || id === null || typeof id !== "number" || id < 1 || id % 1 !== 0) {
            throw new Error("id is required and must be a positive whole number");
        }

        if (
            firstName === undefined ||
            firstName === null ||
            typeof firstName !== "string" ||
            firstName.length < 1
        ) {
            throw new Error("firstName is required and must be a string");
        }

        if (
            lastName === undefined ||
            lastName === null ||
            typeof lastName !== "string" ||
            lastName.length < 1
        ) {
            throw new Error("lastName is required and must be a string");
        }

        if (
            averageDraftPosition === null ||
            typeof averageDraftPosition !== "number" ||
            averageDraftPosition < 0
        ) {
            throw new Error("averageDraftPosition must be a positive number");
        }

        if (
            injuryStatus !== null &&
            (injuryStatus === undefined ||
                !Object.values(InjuryStatusEnum).includes(injuryStatus as InjuryStatusEnum))
        ) {
            throw new Error("injuryStatus must be a string or null");
        }

        if (
            yearsExperience === undefined ||
            yearsExperience === null ||
            typeof yearsExperience !== "number" ||
            yearsExperience < 0
        ) {
            throw new Error("yearsExperience must be a positive whole number");
        }

        if (
            headshotUrl === undefined ||
            typeof headshotUrl !== "string" ||
            headshotUrl.length < 1
        ) {
            throw new Error("headshotUrl must be null or a string");
        }

        if (team !== null && (team === undefined || !(team instanceof FootballTeam))) {
            throw new Error("team must be null or FootballTeam");
        }

        this.pprRank = pprRank;
        this.halfPprRank = halfPprRank;
        this.standardRank = standardRank;
        this.isQuarterback = isQuarterback;
        this.isRunningBack = isRunningBack;
        this.isWideReceiver = isWideReceiver;
        this.isTightEnd = isTightEnd;
        this.isKicker = isKicker;
        this.isDefense = isDefense;
        this.projectedRushingAttempts = projectedRushingAttempts;
        this.projectedRushingYards = projectedRushingYards;
        this.projectedRushingTouchdowns = projectedRushingTouchdowns;
        this.projectedTargets = projectedTargets;
        this.projectedReceivingYards = projectedReceivingYards;
        this.projectedReceivingTouchdowns = projectedReceivingTouchdowns;
        this.projectedPassingAttempts = projectedPassingAttempts;
        this.projectedPassingYards = projectedPassingYards;
        this.projectedPassingTouchdowns = projectedPassingTouchdowns;
        this.projectedStandardFantasyPoints = projectedStandardFantasyPoints;
        this.projectedHalfPprFantasyPoints = projectedHalfPprFantasyPoints;
        this.projectedPprFantasyPoints = projectedPprFantasyPoints;
    }

    /**
     * Determines player can play a given position
     *
     * @param position the position to check
     *
     * @returns true if this player can play the given position, false otherwise
     */
    public canPlayPosition(position: FootballPositionEnum): boolean {
        switch (position) {
            case FootballPositionEnum.QUARTERBACK:
                return this.isQuarterback;
            case FootballPositionEnum.RUNNING_BACK:
                return this.isRunningBack;
            case FootballPositionEnum.WIDE_RECEIVER:
                return this.isWideReceiver;
            case FootballPositionEnum.TIGHT_END:
                return this.isTightEnd;
            case FootballPositionEnum.KICKER:
                return this.isKicker;
            case FootballPositionEnum.DEFENSE:
                return this.isDefense;
            case FootballPositionEnum.FLEX:
                return this.isRunningBack || this.isWideReceiver || this.isTightEnd;
            case FootballPositionEnum.BENCH:
                return true;
            default:
                return false;
        }
    }

    /**
     * Gets an array of all positions this player can play
     *
     * @returns an array of all positions this player can play
     *
     * @example
     * const player = new FootballPlayer(...);
     * player.getPositions(); // [FootballPositionEnum.QUARTERBACK, FootballPositionEnum.RUNNING_BACK]
     */
    public getPositions(): FootballPositionEnum[] {
        const positions: FootballPositionEnum[] = [];
        if (this.isQuarterback) {
            positions.push(FootballPositionEnum.QUARTERBACK);
        }
        if (this.isRunningBack) {
            positions.push(FootballPositionEnum.RUNNING_BACK);
        }
        if (this.isWideReceiver) {
            positions.push(FootballPositionEnum.WIDE_RECEIVER);
        }
        if (this.isTightEnd) {
            positions.push(FootballPositionEnum.TIGHT_END);
        }
        if (this.isKicker) {
            positions.push(FootballPositionEnum.KICKER);
        }
        if (this.isDefense) {
            positions.push(FootballPositionEnum.DEFENSE);
        }
        return positions;
    }

    public toJSON(): FootballPlayerDTO {
        return {
            id: this.id,
            averageDraftPosition: this.averageDraftPosition,
            firstName: this.firstName,
            lastName: this.lastName,
            injuryStatus: this.injuryStatus,
            yearsExperience: this.yearsExperience,
            headshotUrl: this.headshotUrl,
            team: this.team ? this.team.toJSON() : null,
            pprRank: this.pprRank,
            halfPprRank: this.halfPprRank,
            standardRank: this.standardRank,
            isQuarterback: this.isQuarterback,
            isRunningBack: this.isRunningBack,
            isWideReceiver: this.isWideReceiver,
            isTightEnd: this.isTightEnd,
            isKicker: this.isKicker,
            isDefense: this.isDefense,
            projectedRushingAttempts: this.projectedRushingAttempts,
            projectedRushingYards: this.projectedRushingYards,
            projectedRushingTouchdowns: this.projectedRushingTouchdowns,
            projectedTargets: this.projectedTargets,
            projectedReceivingYards: this.projectedReceivingYards,
            projectedReceivingTouchdowns: this.projectedReceivingTouchdowns,
            projectedPassingAttempts: this.projectedPassingAttempts,
            projectedPassingYards: this.projectedPassingYards,
            projectedPassingTouchdowns: this.projectedPassingTouchdowns,
            projectedStandardFantasyPoints: this.projectedStandardFantasyPoints,
            projectedHalfPprFantasyPoints: this.projectedHalfPprFantasyPoints,
            projectedPprFantasyPoints: this.projectedPprFantasyPoints,
        };
    }
}
