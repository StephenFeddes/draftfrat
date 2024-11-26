import { PositionBasedPlayerFilter } from "../../contracts/domain-services/PositionBasedPlayerFilter";
import { Player } from "../entities/Player";

export class FootballPositionBasedPlayerFilter implements PositionBasedPlayerFilter {
    filter(players: Player[], targetPlayer: Player): Player[] {
        return players.filter(player => player.position === targetPlayer.position);
    }
}
