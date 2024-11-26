export interface PickPlayer {
    execute(draftId: number, playerId: number, teamNumber: number): Promise<void>;
}
