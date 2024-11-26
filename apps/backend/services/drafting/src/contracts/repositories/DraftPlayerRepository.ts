import { DraftPick, Player } from "../../domain";

export interface DraftPlayerRepository {
    getDraftPicks(draftId: number): Promise<DraftPick[]>;

    pickPlayer(draftId: number, playerId: number, pickNumber: number, teamNumber: number): Promise<void>;

    getAvailablePlayers(draftId: number): Promise<Player[]>;

    getPlayerById(playerId: number): Promise<Player | null>;

    getCurrentDraftPick(draftId: number): Promise<DraftPick | null>;
}
