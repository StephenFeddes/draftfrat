import { DraftPickOrderGenerator } from "../../contracts";
import { DraftOrderEnum } from "../enums/DraftOrderEnum";
import { LinearDraftPickOrderGenerator } from "../services/LinearDraftPickOrderGenerator";
import { SnakeDraftPickOrderGenerator } from "../services/SnakeDraftPickOrderGenerator";

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
