import { InjuryStatusEnum } from "../enums/InjuryStatusEnum";
import { SportEnum } from "../enums/SportEnum";
import { Team } from "./Team";

export abstract class Player {
    public readonly id: number;

    public readonly firstName: string;

    public readonly lastName: string;

    public readonly averageDraftPosition: number | null;

    public readonly injuryStatus: InjuryStatusEnum | null;

    public readonly yearsExperience: number;

    public readonly headshotUrl: string | null;

    public readonly team: Team | null;

    public readonly sport: SportEnum;

    constructor(
        id: number,
        firstName: string,
        lastName: string,
        averageDraftPosition: number | null,
        injuryStatus: InjuryStatusEnum | null,
        yearsExperience: number,
        headshotUrl: string | null,
        team: Team | null,
        sport: SportEnum,
    ) {
        this.id = id;
        this.averageDraftPosition = averageDraftPosition;
        this.firstName = firstName;
        this.lastName = lastName;
        this.injuryStatus = injuryStatus;
        this.yearsExperience = yearsExperience;
        this.headshotUrl = headshotUrl;
        this.team = team;
        this.sport = sport;
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
