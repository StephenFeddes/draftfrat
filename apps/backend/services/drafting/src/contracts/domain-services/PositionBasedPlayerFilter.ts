import { Player } from "../../domain";

export interface PositionBasedPlayerFilter {
    filter(players: Player[], targetPlayer: Player): Player[];
}
