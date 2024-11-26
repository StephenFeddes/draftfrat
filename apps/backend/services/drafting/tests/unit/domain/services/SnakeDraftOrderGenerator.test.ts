import { DraftPickOrderGenerator } from "../../../../src/contracts";
import { DraftOrderEnum, DraftPick, DraftPickOrderGeneratorFactory } from "../../../../src/domain";

describe("SnakeDraftPickOrderGenerator", () => {
    let generator: DraftPickOrderGenerator;

    beforeEach(() => {
        generator = DraftPickOrderGeneratorFactory.create(DraftOrderEnum.SNAKE);
    });

    test("Generates correct snake draft order for 2 players per team and 3 teams", () => {
        const draftId = 1;
        const playerCountPerTeam = 2;
        const teamCount = 3;

        const result = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Expected order: [1, 2, 3, 3, 2, 1]
        const expectedOrder = [
            new DraftPick(draftId, 1, 1, null),
            new DraftPick(draftId, 2, 2, null),
            new DraftPick(draftId, 3, 3, null),
            new DraftPick(draftId, 4, 3, null),
            new DraftPick(draftId, 5, 2, null),
            new DraftPick(draftId, 6, 1, null),
        ];

        expect(result).toEqual(expectedOrder);
    });

    test("Generates correct snake draft order for 1 player per team and 4 teams", () => {
        const draftId = 2;
        const playerCountPerTeam = 1;
        const teamCount = 4;

        const result = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Expected order: [1, 2, 3, 4]
        const expectedOrder = [
            new DraftPick(draftId, 1, 1, null),
            new DraftPick(draftId, 2, 2, null),
            new DraftPick(draftId, 3, 3, null),
            new DraftPick(draftId, 4, 4, null),
        ];

        expect(result).toEqual(expectedOrder);
    });

    test("Generates correct snake draft order for 3 players per team and 2 teams", () => {
        const draftId = 3;
        const playerCountPerTeam = 3;
        const teamCount = 2;

        const result = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Expected order: [1, 2, 2, 1, 1, 2]
        const expectedOrder = [
            new DraftPick(draftId, 1, 1, null),
            new DraftPick(draftId, 2, 2, null),
            new DraftPick(draftId, 3, 2, null),
            new DraftPick(draftId, 4, 1, null),
            new DraftPick(draftId, 5, 1, null),
            new DraftPick(draftId, 6, 2, null),
        ];

        expect(result).toEqual(expectedOrder);
    });

    test("Handles edge case of 1 team", () => {
        const draftId = 4;
        const playerCountPerTeam = 5;
        const teamCount = 1;

        const result = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Expected order: [1, 1, 1, 1, 1]
        const expectedOrder = Array.from(
            { length: playerCountPerTeam },
            (_, i) => new DraftPick(draftId, i + 1, 1, null),
        );

        expect(result).toEqual(expectedOrder);
    });

    test("Handles edge case of 1 player per team", () => {
        const draftId = 5;
        const playerCountPerTeam = 1;
        const teamCount = 5;

        const result = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Expected order: [1, 2, 3, 4, 5]
        const expectedOrder = Array.from({ length: teamCount }, (_, i) => new DraftPick(draftId, i + 1, i + 1, null));

        expect(result).toEqual(expectedOrder);
    });

    test("Handles edge case of no players per team", () => {
        const draftId = 6;
        const playerCountPerTeam = 0;
        const teamCount = 4;

        const result = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Expected order: []
        expect(result).toEqual([]);
    });

    test("Handles edge case of no teams", () => {
        const draftId = 7;
        const playerCountPerTeam = 3;
        const teamCount = 0;

        const result = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Expected order: []
        expect(result).toEqual([]);
    });
});
