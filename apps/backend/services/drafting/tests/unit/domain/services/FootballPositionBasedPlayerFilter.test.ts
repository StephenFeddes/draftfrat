import { FootballPlayer, FootballPositionEnum } from "../../../../src/domain";
import { createFootballPlayer } from "../../../test-utils";

describe("FootballPositionBasedPlayerFilter", () => {
    test("filters out players with no positions distinct from the filtering player's positions", () => {
        const targetPlayer = createFootballPlayer(1, [FootballPositionEnum.QUARTERBACK, FootballPositionEnum.RUNNING_BACK]);
        const players: FootballPlayer[] = [
            createFootballPlayer(2, [FootballPositionEnum.QUARTERBACK, FootballPositionEnum.RUNNING_BACK]),
            createFootballPlayer(3, [FootballPositionEnum.RUNNING_BACK]),
            createFootballPlayer(4, [FootballPositionEnum.QUARTERBACK]),
            createFootballPlayer(4, [
                FootballPositionEnum.QUARTERBACK,
                FootballPositionEnum.RUNNING_BACK,
                FootballPositionEnum.WIDE_RECEIVER,
            ]),
            createFootballPlayer(5, [FootballPositionEnum.TIGHT_END]),
        ];
        const filteredPlayers = PositionBasedPlayerFilterFactory.create(targetPlayer.sport).execute(players, targetPlayer);
        expect(filteredPlayers).toEqual(players.slice(3, 4));
    });
});
