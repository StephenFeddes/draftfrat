export abstract class Team {
    public readonly id: number;

    public readonly abbreviation: string;

    constructor(id: number, abbreviation: string) {
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

        this.id = id;
        this.abbreviation = abbreviation;
    }

    public abstract toJSON(): object;
}
