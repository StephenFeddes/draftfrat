import { DraftOrderGeneratorFactory } from "../../src/utils/draft-order/DraftOrderGeneratorFactory";

describe("Draft Orders", () => {
    // Tests for the snake draft order
    test("A snake draft with 2 players and 2 teams.", () => {
        expect(
            DraftOrderGeneratorFactory.create("snake").generate(2, 2),
        ).toEqual([1, 2, 2, 1]);
    });
    test("A snake draft with 2 players and 12 teams.", () => {
        console.log(DraftOrderGeneratorFactory.create("snake").generate(2, 12));
        expect(
            DraftOrderGeneratorFactory.create("snake").generate(2, 12),
        ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    });
    test("A snake draft with 3 players and 2 teams.", () => {
        expect(
            DraftOrderGeneratorFactory.create("snake").generate(3, 2),
        ).toEqual([1, 2, 2, 1, 1, 2]);
    });
    test("A snake draft with 3 players and 12 teams.", () => {
        expect(
            DraftOrderGeneratorFactory.create("snake").generate(3, 12),
        ).toEqual([
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3,
            4, 5, 6, 7, 8, 9, 10, 11, 12,
        ]);
    });

    // Tests for the linear draft order
    test("A linear draft with 2 players and 2 teams.", () => {
        expect(
            DraftOrderGeneratorFactory.create("linear").generate(2, 2),
        ).toEqual([1, 2, 1, 2]);
    });
    test("A linear draft with 2 players and 12 teams.", () => {
        expect(
            DraftOrderGeneratorFactory.create("linear").generate(2, 12),
        ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });
    test("A linear draft with 3 players and 2 teams.", () => {
        expect(
            DraftOrderGeneratorFactory.create("linear").generate(3, 2),
        ).toEqual([1, 2, 1, 2, 1, 2]);
    });
    test("A linear draft with 3 players and 12 teams.", () => {
        expect(
            DraftOrderGeneratorFactory.create("linear").generate(3, 12),
        ).toEqual([
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3,
            4, 5, 6, 7, 8, 9, 10, 11, 12,
        ]);
    });
});
