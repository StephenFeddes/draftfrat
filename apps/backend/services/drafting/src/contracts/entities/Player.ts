import { InjuryStatusEnum } from "../../domain/enums/InjuryStatusEnum";
import { FootballTeam } from "../../domain/entities/football-team/FootballTeam";

export abstract class Player {
    public readonly id: number;

    public readonly firstName: string;

    public readonly lastName: string;

    public readonly averageDraftPosition: number;

    public readonly injuryStatus: InjuryStatusEnum | null;

    public readonly yearsExperience: number;

    public readonly headshotUrl: string;

    public readonly team: FootballTeam | null;

    constructor(
        id: number,
        firstName: string,
        lastName: string,
        averageDraftPosition: number,
        injuryStatus: InjuryStatusEnum | null,
        yearsExperience: number,
        headshotUrl: string,
        team: FootballTeam | null,
    ) {
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

        this.id = id;
        this.averageDraftPosition = averageDraftPosition;
        this.firstName = firstName;
        this.lastName = lastName;
        this.injuryStatus = injuryStatus;
        this.yearsExperience = yearsExperience;
        this.headshotUrl = headshotUrl;
        this.team = team;
    }

    /**
     * Determines player can play a given position
     *
     * @param position the position to check
     *
     * @returns true if this player can play the given position, false otherwise
     */
    public abstract canPlayPosition(position: string): boolean;

    /**
     * Gets an array of all positions this player can play
     *
     * @returns an array of all positions this player can play
     *
     * @example
     * const player = new FootballPlayer(...);
     * player.getPositions(); // [FootballPositionEnum.QUARTERBACK, FootballPositionEnum.RUNNING_BACK]
     */
    public abstract getPositions(): string[];

    public abstract toJSON(): object;
}
