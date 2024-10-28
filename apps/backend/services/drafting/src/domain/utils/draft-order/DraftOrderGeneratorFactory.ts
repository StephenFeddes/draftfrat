import { LinearDraftOrderGenerator } from "./LinearDraftOrderGenerator";
import { SnakeDraftOrderGenerator } from "./SnakeDraftOrderGenerator";

export class DraftOrderGeneratorFactory {
    static create(generatorType: string) {
        switch (generatorType) {
            case 'snake':
                return new SnakeDraftOrderGenerator();
            case 'linear':
                return new LinearDraftOrderGenerator();
            default:
                throw new Error(`Unknown generator type: ${generatorType}`);
        }
    }
}