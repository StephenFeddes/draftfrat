import { DraftPlayerRepository } from "../../../contracts";
import { SportEnum } from "../../../domain";
import { PostgresFootballDraftPlayerRepository } from "../repositories/football/PostgresFootballDraftPlayerRepository";

export class DraftPlayerRepositoryFactory {
    static create(sport: SportEnum): DraftPlayerRepository {
        switch (sport) {
            case SportEnum.FOOTBALL:
                return new PostgresFootballDraftPlayerRepository();
            default:
                throw new Error(`Unsupported sport type: ${sport}`);
        }
    }
}
