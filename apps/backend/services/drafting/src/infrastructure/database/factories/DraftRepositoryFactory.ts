import { DraftRepository } from "../../../contracts";
import { SportEnum } from "../../../domain";
import { PostgresFootballDraftRepository } from "../repositories/football/PostgresFootballDraftRepository";

export class DraftRepositoryFactory {
    static create(sport: SportEnum): DraftRepository {
        switch (sport) {
            case SportEnum.FOOTBALL:
                return new PostgresFootballDraftRepository();
            default:
                throw new Error(`Unsupported sport type: ${sport}`);
        }
    }
}
