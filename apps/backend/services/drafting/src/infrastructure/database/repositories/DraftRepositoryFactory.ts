import { FootballDraftRepository } from "./FootballDraftRepository";

export class DraftingRepositoryFactory {
    static create(sport: string) {
        switch (sport) {
            case "football":
                return new FootballDraftRepository();
            default:
                throw new Error(`Unknown sport: ${sport}`);
        }
    }
}
