import { FootballTeamDTO } from "../../dto/FootballTeamDTO";

export class FootballTeam {
    public readonly id: number;

    public readonly abbreviation: string;

    public readonly byeWeek: number;

    constructor(id: number, abbreviation: string, byeWeek: number) {
        if (id === undefined || id === null || typeof id !== "number" || id < 1 || id % 1 !== 0) {
            throw new Error("id is required and must be a positive whole number");
        }

        if (
            abbreviation === undefined ||
            abbreviation === null ||
            typeof abbreviation !== "string" ||
            abbreviation.length < 1 ||
            abbreviation.length > 3
        ) {
            throw new Error(
                "abbreviation must be a string with a length between 1 and 3 characters",
            );
        }

        if (
            byeWeek === undefined ||
            byeWeek === null ||
            typeof byeWeek !== "number" ||
            byeWeek < 1 ||
            byeWeek % 1 !== 0
        ) {
            throw new Error("byeWeek is required and must be a positive whole number");
        }

        this.id = id;
        this.abbreviation = abbreviation;
        this.byeWeek = byeWeek;

        Object.freeze(this);
    }

    public toJSON(): FootballTeamDTO {
        return {
            id: this.id,
            abbreviation: this.abbreviation,
            byeWeek: this.byeWeek,
        };
    }
}
