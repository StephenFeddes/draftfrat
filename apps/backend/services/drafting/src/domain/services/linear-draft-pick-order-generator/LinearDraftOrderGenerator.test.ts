import { DraftOrderEnum, DraftPick } from "../..";
import { DraftPickOrderGenerator } from "../../interfaces/DraftPickOrderGenerator";
import { DraftPickOrderGeneratorFactory } from "../../factories/DraftPickOrderGeneratorFactory";

describe("LinearDraftPickOrderGenerator", () => {
    let generator: DraftPickOrderGenerator;

    beforeEach(() => {
        generator = DraftPickOrderGeneratorFactory.create(DraftOrderEnum.LINEAR);
    });

    test("should generate a single round draft order for 3 teams and 1 player per team", () => {
        // Arrange
        const draftId: number = 1;
        const playerCountPerTeam: number = 1;
        const teamCount: number = 3;

        // Act
        const draftPicks: DraftPick[] = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Assert
        expect(draftPicks).toEqual([
            { draftId: draftId, pickNumber: 1, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 2, teamNumber: 2, player: null },
            { draftId: draftId, pickNumber: 3, teamNumber: 3, player: null },
        ]);
    });

    test("should generate a multi-round draft order for 2 teams and 3 players per team", () => {
        // Arrange
        const draftId: number = 2;
        const playerCountPerTeam: number = 3;
        const teamCount: number = 2;

        // Act
        const draftPicks: DraftPick[] = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Assert
        expect(draftPicks).toEqual([
            { draftId: draftId, pickNumber: 1, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 2, teamNumber: 2, player: null },
            { draftId: draftId, pickNumber: 3, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 4, teamNumber: 2, player: null },
            { draftId: draftId, pickNumber: 5, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 6, teamNumber: 2, player: null },
        ]);
    });

    test("should generate an empty draft order if playerCountPerTeam is 0", () => {
        // Arrange
        const draftId: number = 3;
        const playerCountPerTeam: number = 0;
        const teamCount: number = 5;

        // Act
        const draftPicks: DraftPick[] = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Assert
        expect(draftPicks).toEqual([]);
    });

    test("should generate an empty draft order if teamCount is 0", () => {
        // Arrange
        const draftId: number = 4;
        const playerCountPerTeam: number = 4;
        const teamCount: number = 0;

        // Act
        const draftPicks: DraftPick[] = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Assert
        expect(draftPicks).toEqual([]);
    });

    test("should generate a draft order for a single team", () => {
        // Arrange
        const draftId: number = 5;
        const playerCountPerTeam: number = 3;
        const teamCount: number = 1;

        // Act
        const draftPicks: DraftPick[] = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Assert
        expect(draftPicks).toEqual([
            { draftId: draftId, pickNumber: 1, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 2, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 3, teamNumber: 1, player: null },
        ]);
    });

    test("should generate a correct draft order for 4 teams and 2 players per team", () => {
        // Arrange
        const draftId: number = 6;
        const playerCountPerTeam: number = 2;
        const teamCount: number = 4;

        // Act
        const draftPicks: DraftPick[] = generator.generate(draftId, playerCountPerTeam, teamCount);

        // Assert
        expect(draftPicks).toEqual([
            { draftId: draftId, pickNumber: 1, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 2, teamNumber: 2, player: null },
            { draftId: draftId, pickNumber: 3, teamNumber: 3, player: null },
            { draftId: draftId, pickNumber: 4, teamNumber: 4, player: null },
            { draftId: draftId, pickNumber: 5, teamNumber: 1, player: null },
            { draftId: draftId, pickNumber: 6, teamNumber: 2, player: null },
            { draftId: draftId, pickNumber: 7, teamNumber: 3, player: null },
            { draftId: draftId, pickNumber: 8, teamNumber: 4, player: null },
        ]);
    });
});
