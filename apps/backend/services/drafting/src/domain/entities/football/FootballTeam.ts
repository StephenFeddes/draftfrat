import { Team } from "../Team";

export class FootballTeam extends Team {
    public readonly id: number;

    public readonly abbreviation: string;

    public readonly byeWeek: number;

    constructor(id: number, abbreviation: string, byeWeek: number) {
        super(id, abbreviation);

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

    public toJSON(): object {
        return {
            id: this.id,
            abbreviation: this.abbreviation,
            byeWeek: this.byeWeek,
        };
    }
}
