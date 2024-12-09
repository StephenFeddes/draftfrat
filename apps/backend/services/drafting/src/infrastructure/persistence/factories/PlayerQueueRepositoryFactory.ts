import { Pool } from "pg";
import { PlayerQueueRepository } from "../../../interfaces";
import { SportEnum } from "../../../domain";
import { PostgresFootballPlayerQueueRepository } from "../repositories/football/PostgresFootballPlayerQueueRepository";

export class PlayerQueueRepositoryFactory {
    static create(sport: SportEnum, databaseConnectionPool: Pool): PlayerQueueRepository {
        switch (sport) {
            case SportEnum.FOOTBALL:
                return new PostgresFootballPlayerQueueRepository(databaseConnectionPool);
            default:
                throw new Error(`Unsupported sport type: ${sport}`);
        }
    }
}
