import { DraftOrderEnum, DraftPick } from "../../../../src/domain";
import { DraftPickOrderGenerator } from "../../../../src/contracts";
import { DraftPickOrderGeneratorFactory } from "../../../../src/domain/factories/DraftPickOrderGeneratorFactory";

describe("LinearDraftPickOrderGenerator", () => {
    let generator: DraftPickOrderGenerator;

    beforeEach(() => {
        generator = DraftPickOrderGeneratorFactory.create(DraftOrderEnum.LINEAR);
    });

    test("should generate a single round draft order for 3 teams and 1 player per team", () => {
        const draftId = 1;
        const playerCountPerTeam = 1;
        const teamCount = 3;

        const result = generator.generate(draftId, playerCountPerTeam, teamCount);

        expect(result).toEqual([
            new DraftPick(draftId, 1, 1, null),
            new DraftPick(draftId, 2, 2, null),
            new DraftPick(draftId, 3, 3, null),
        ]);
    });

    test("should generate a multi-round draft order for 2 teams and 3 players per team", () => {
        const draftId = 2;
        const playerCountPerTeam = 3;
        const teamCount = 2;

        const result = generator.generate(draftId, playerCountPerTeam, teamCount);

        expect(result).toEqual([
            new DraftPick(draftId, 1, 1, null),
            new DraftPick(draftId, 2, 2, null),
            new DraftPick(draftId, 3, 1, null),
            new DraftPick(draftId, 4, 2, null),
            new DraftPick(draftId, 5, 1, null),
            new DraftPick(draftId, 6, 2, null),
        ]);
    });

    test("should generate an empty draft order if playerCountPerTeam is 0", () => {
        const draftId = 3;
        const playerCountPerTeam = 0;
        const teamCount = 5;

        const result = generator.generate(draftId, playerCountPerTeam, teamCount);

        expect(result).toEqual([]);
    });

    test("should generate an empty draft order if teamCount is 0", () => {
        const draftId = 4;
        const playerCountPerTeam = 4;
        const teamCount = 0;

        const result = generator.generate(draftId, playerCountPerTeam, teamCount);

        expect(result).toEqual([]);
    });

    test("should generate a draft order for a single team", () => {
        const draftId = 5;
        const playerCountPerTeam = 3;
        const teamCount = 1;

        const result = generator.generate(draftId, playerCountPerTeam, teamCount);

        expect(result).toEqual([
            new DraftPick(draftId, 1, 1, null),
            new DraftPick(draftId, 2, 1, null),
            new DraftPick(draftId, 3, 1, null),
        ]);
    });

    test("should generate a correct draft order for 4 teams and 2 players per team", () => {
        const draftId = 6;
        const playerCountPerTeam = 2;
        const teamCount = 4;

        const result = generator.generate(draftId, playerCountPerTeam, teamCount);

        expect(result).toEqual([
            new DraftPick(draftId, 1, 1, null),
            new DraftPick(draftId, 2, 2, null),
            new DraftPick(draftId, 3, 3, null),
            new DraftPick(draftId, 4, 4, null),
            new DraftPick(draftId, 5, 1, null),
            new DraftPick(draftId, 6, 2, null),
            new DraftPick(draftId, 7, 3, null),
            new DraftPick(draftId, 8, 4, null),
        ]);
    });
});
