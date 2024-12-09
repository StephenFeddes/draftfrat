import { DraftPickOrderGenerator } from "../../../interfaces";
import { DraftOrderEnum, DraftPick, DraftPickOrderGeneratorFactory } from "../..";

describe("SnakeDraftPickOrderGenerator", () => {
    let generator: DraftPickOrderGenerator;

    beforeEach(() => {
        generator = DraftPickOrderGeneratorFactory.create(DraftOrderEnum.SNAKE);
    });

    test("Generates correct snake draft order for 2 players per team and 3 teams", () => {
        // Arrange
        const draftId: number = 1;
        const playerCountPerTeam: number = 2;
        const teamCount: number = 3;

        // Act
        const draftPicks: DraftPick[] = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Assert
        expect(draftPicks).toEqual([
            { draftId: draftId, pickNumber: 1, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 2, teamNumber: 2, player: null },
            { draftId: draftId, pickNumber: 3, teamNumber: 3, player: null },
            { draftId: draftId, pickNumber: 4, teamNumber: 3, player: null },
            { draftId: draftId, pickNumber: 5, teamNumber: 2, player: null },
            { draftId: draftId, pickNumber: 6, teamNumber: 1, player: null },
        ]);
    });

    test("Generates correct snake draft order for 1 player per team and 4 teams", () => {
        // Arrange
        const draftId: number = 2;
        const playerCountPerTeam: number = 1;
        const teamCount: number = 4;

        // Act
        const draftPicks: DraftPick[] = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Assert
        expect(draftPicks).toEqual([
            { draftId: draftId, pickNumber: 1, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 2, teamNumber: 2, player: null },
            { draftId: draftId, pickNumber: 3, teamNumber: 3, player: null },
            { draftId: draftId, pickNumber: 4, teamNumber: 4, player: null },
        ]);
    });

    test("Generates correct snake draft order for 3 players per team and 2 teams", () => {
        // Arrange
        const draftId: number = 3;
        const playerCountPerTeam: number = 3;
        const teamCount: number = 2;

        // Act
        const draftPicks: DraftPick[] = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Assert
        expect(draftPicks).toEqual([
            { draftId: draftId, pickNumber: 1, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 2, teamNumber: 2, player: null },
            { draftId: draftId, pickNumber: 3, teamNumber: 2, player: null },
            { draftId: draftId, pickNumber: 4, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 5, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 6, teamNumber: 2, player: null },
        ]);
    });

    test("Handles edge case of 1 team", () => {
        // Arrange
        const draftId: number = 4;
        const playerCountPerTeam: number = 5;
        const teamCount: number = 1;

        // Act
        const draftPicks: DraftPick[] = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Assert
        expect(draftPicks).toEqual([
            { draftId: draftId, pickNumber: 1, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 2, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 3, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 4, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 5, teamNumber: 1, player: null },
        ]);
    });

    test("Handles edge case of 1 player per team", () => {
        // Arrange
        const draftId: number = 5;
        const playerCountPerTeam: number = 1;
        const teamCount: number = 5;

        // Act
        const draftPicks: DraftPick[] = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Assert
        expect(draftPicks).toEqual([
            { draftId: draftId, pickNumber: 1, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 2, teamNumber: 2, player: null },
            { draftId: draftId, pickNumber: 3, teamNumber: 3, player: null },
            { draftId: draftId, pickNumber: 4, teamNumber: 4, player: null },
            { draftId: draftId, pickNumber: 5, teamNumber: 5, player: null },
        ]);
    });

    test("Handles edge case of no players per team", () => {
        // Arrange
        const draftId: number = 6;
        const playerCountPerTeam: number = 0;
        const teamCount: number = 4;

        // Act
        const draftPicks: DraftPick[] = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Assert
        expect(draftPicks).toEqual([]);
    });

    test("Handles edge case of no teams", () => {
        // Arrange
        const draftId: number = 7;
        const playerCountPerTeam: number = 3;
        const teamCount: number = 0;

        // Act
        const draftPicks: DraftPick[] = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Assert
        expect(draftPicks).toEqual([]);
    });
});
