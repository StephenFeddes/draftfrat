import { DraftPickOrderGenerator } from "../../interfaces";
import { DraftOrderEnum } from "../enums/DraftOrderEnum";
import { LinearDraftPickOrderGenerator } from "../services/linear-draft-pick-order-generator/LinearDraftPickOrderGenerator";
import { SnakeDraftPickOrderGenerator } from "../services/snake-draft-pick-order-generator/SnakeDraftPickOrderGenerator";

export class DraftPickOrderGeneratorFactory {
    public static create(draftOrder: DraftOrderEnum): DraftPickOrderGenerator {
        switch (draftOrder) {
            case DraftOrderEnum.SNAKE:
                return new SnakeDraftPickOrderGenerator();
            case DraftOrderEnum.LINEAR:
                return new LinearDraftPickOrderGenerator();
            default:
                throw new Error(`Unsupported draft order type: ${draftOrder}`);
        }
    }
}
