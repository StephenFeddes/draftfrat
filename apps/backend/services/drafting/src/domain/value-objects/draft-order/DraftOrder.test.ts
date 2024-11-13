import { DraftOrderEnum } from "../../enums/DraftOrderEnum";
import { DraftOrder } from "./DraftOrder";

describe("DraftOrder", () => {
    // Input Validation Tests
    describe("Input Validation", () => {
        test("Throws error for undefined orderType", () => {
            expect(() => new DraftOrder(undefined as unknown as DraftOrderEnum, 2, 2)).toThrow(
                "order_type is required",
            );
        });

        test("Throws error for invalid draft order type", () => {
            expect(() => new DraftOrder("InvalidOrder" as DraftOrderEnum, 2, 2)).toThrow(
                `Invalid orderType: InvalidOrder. Valid order types are: ${Object.values(DraftOrderEnum)}`,
            );
        });

        test("Throws error for decimal player count per team", () => {
            expect(() => new DraftOrder(DraftOrderEnum.SNAKE, 0.5, 2)).toThrow(
                "playerCountPerTeam must be a positive whole number",
            );
        });

        test("Throws error for negative player count per team", () => {
            expect(() => new DraftOrder(DraftOrderEnum.SNAKE, -1, 2)).toThrow(
                "playerCountPerTeam must be a positive whole number",
            );
        });

        test("Throws error for decimal team count", () => {
            expect(() => new DraftOrder(DraftOrderEnum.SNAKE, 2, 0.5)).toThrow(
                "teamCount must be a positive whole number",
            );
        });

        test("Throws error for negative team count", () => {
            expect(() => new DraftOrder(DraftOrderEnum.SNAKE, 2, -2)).toThrow(
                "teamCount must be a positive whole number",
            );
        });
    });

    // Snake Draft Order Tests
    describe("Snake Draft Order", () => {
        test("Generates correct snake draft order with 2 players and 2 teams", () => {
            expect(new DraftOrder(DraftOrderEnum.SNAKE, 2, 2).generateDraftOrder()).toEqual([
                1, 2, 2, 1,
            ]);
        });

        test("Generates correct snake draft order with 2 players and 12 teams", () => {
            expect(new DraftOrder(DraftOrderEnum.SNAKE, 2, 12).generateDraftOrder()).toEqual([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
            ]);
        });

        test("Generates correct snake draft order with 3 players and 2 teams", () => {
            expect(new DraftOrder(DraftOrderEnum.SNAKE, 3, 2).generateDraftOrder()).toEqual([
                1, 2, 2, 1, 1, 2,
            ]);
        });

        test("Generates correct snake draft order with 3 players and 12 teams", () => {
            expect(new DraftOrder(DraftOrderEnum.SNAKE, 3, 12).generateDraftOrder()).toEqual([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 2,
                3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
            ]);
        });
    });

    // Linear Draft Order Tests
    describe("Linear Draft Order", () => {
        test("Generates correct linear draft order with 2 players and 2 teams", () => {
            expect(new DraftOrder(DraftOrderEnum.LINEAR, 2, 2).generateDraftOrder()).toEqual([
                1, 2, 1, 2,
            ]);
        });

        test("Generates correct linear draft order with 2 players and 12 teams", () => {
            expect(new DraftOrder(DraftOrderEnum.LINEAR, 2, 12).generateDraftOrder()).toEqual([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
            ]);
        });

        test("Generates correct linear draft order with 3 players and 2 teams", () => {
            expect(new DraftOrder(DraftOrderEnum.LINEAR, 3, 2).generateDraftOrder()).toEqual([
                1, 2, 1, 2, 1, 2,
            ]);
        });

        test("Generates correct linear draft order with 3 players and 12 teams", () => {
            expect(new DraftOrder(DraftOrderEnum.LINEAR, 3, 12).generateDraftOrder()).toEqual([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2,
                3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
            ]);
        });
    });
});
