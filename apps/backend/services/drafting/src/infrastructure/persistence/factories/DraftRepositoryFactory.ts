import { Pool } from "pg";
import { DraftRepository } from "../../../interfaces";
import { SportEnum } from "../../../domain";
import { PostgresFootballDraftRepository } from "../repositories/football/PostgresFootballDraftRepository";

export class DraftRepositoryFactory {
    static create(sport: SportEnum, databaseConnectionPool: Pool): DraftRepository {
        switch (sport) {
            case SportEnum.FOOTBALL:
                return new PostgresFootballDraftRepository(databaseConnectionPool);
            default:
                throw new Error(`Unsupported sport type: ${sport}`);
        }
    }
}
