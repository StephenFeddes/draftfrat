import { DraftPlayerRepository } from "../../src/contracts";
import { DraftPick, Player } from "../../src/domain";

export class MockDraftPlayerRepository implements DraftPlayerRepository {
    private players: Player[] = [];

    private draftPicks: DraftPick[] = [];

    private availablePlayers: Player[] = [];

    constructor(players: Player[]) {
        this.players = players;
        this.availablePlayers = players;
    }

    public async getPlayerById(playerId: number): Promise<Player | null> {
        return this.players.find((player) => player.id === playerId) || null;
    }

    public async addDraftPicks(draftPicks: DraftPick[]): Promise<void> {
        this.draftPicks.push(...draftPicks);
    }

    public async getDraftPicks(draftId: number): Promise<DraftPick[]> {
        return this.draftPicks.filter((draftPick) => draftPick.draftId === draftId);
    }

    public async pickPlayer(draftId: number, playerId: number, pickNumber: number, teamNumber: number): Promise<void> {
        const player = this.availablePlayers.find((availablePlayer) => availablePlayer.id === playerId);
        const draftPickIndex: number = this.draftPicks.findIndex(
            (draftPick: DraftPick) =>
                draftPick.draftId === draftId &&
                draftPick.pickNumber === pickNumber &&
                draftPick.teamNumber === teamNumber,
        );
        this.draftPicks[draftPickIndex] = new DraftPick(draftId, pickNumber, teamNumber, player);
    }

    public async getAvailablePlayers(draftId: number): Promise<Player[]> {
        // Return all players that have not been picked in the draft.
        return this.availablePlayers.filter(
            (player) =>
                !this.draftPicks.some(
                    (draftPick) => draftPick.player?.id === player.id && draftPick.draftId === draftId,
                ),
        );
    }

    public async enqueuePlayer(draftId: number, playerId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async dequeuePlayer(draftId: number, playerId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
