import { Pool } from "pg";
import { PickRepository } from "../../../interfaces";
import { SportEnum } from "../../../domain";
import { PostgresFootballPickRepository } from "../repositories/football/PostgresFootballPickRepository";

export class PickRepositoryFactory {
    static create(sport: SportEnum, databaseConnectionPool: Pool): PickRepository {
        switch (sport) {
            case SportEnum.FOOTBALL:
                return new PostgresFootballPickRepository(databaseConnectionPool);
            default:
                throw new Error(`Unsupported sport type: ${sport}`);
        }
    }
}
