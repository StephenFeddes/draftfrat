import { FootballTeam } from "./FootballTeam";

describe("FootballTeam", () => {
    test("should create a valid FootballTeam object", () => {
        const team = new FootballTeam(1, "DAL", 6);
        expect(team.id).toBe(1);
        expect(team.abbreviation).toBe("DAL");
        expect(team.byeWeek).toBe(6);
    });

    test("should throw an error if id is not a positive whole number", () => {
        expect(() => new FootballTeam(0, "DAL", 6)).toThrow(
            "id is required and must be a positive whole number",
        );
        expect(() => new FootballTeam(-1, "DAL", 6)).toThrow(
            "id is required and must be a positive whole number",
        );
        expect(() => new FootballTeam(1.5, "DAL", 6)).toThrow(
            "id is required and must be a positive whole number",
        );
    });

    test("should throw an error if abbreviation is not a string of length 1 to 3", () => {
        expect(() => new FootballTeam(1, "", 6)).toThrow(
            "abbreviation must be a string with a length between 1 and 3 characters",
        );
        expect(() => new FootballTeam(1, "DALLAS", 6)).toThrow(
            "abbreviation must be a string with a length between 1 and 3 characters",
        );
        expect(() => new FootballTeam(1, 123 as unknown as string, 6)).toThrow(
            "abbreviation must be a string with a length between 1 and 3 characters",
        );
    });

    test("should throw an error if byeWeek is not a positive whole number", () => {
        expect(() => new FootballTeam(1, "DAL", 0)).toThrow(
            "byeWeek is required and must be a positive whole number",
        );
        expect(() => new FootballTeam(1, "DAL", -5)).toThrow(
            "byeWeek is required and must be a positive whole number",
        );
        expect(() => new FootballTeam(1, "DAL", 3.5)).toThrow(
            "byeWeek is required and must be a positive whole number",
        );
    });

    test("should correctly serialize to JSON", () => {
        const team = new FootballTeam(1, "DAL", 6);
        const json = team.toJSON();
        expect(json).toEqual({
            id: 1,
            abbreviation: "DAL",
            byeWeek: 6,
        });
    });

    test("should freeze object properties", () => {
        const team = new FootballTeam(1, "DAL", 6);
        expect(Object.isFrozen(team)).toBe(true);
        expect(() => {
            (team as any).id = 2;
        }).toThrow();
    });
});
