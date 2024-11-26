import { FootballPlayer, FootballPositionEnum } from "../../src/domain";

export const createFootballPlayer = (id: number, positions: FootballPositionEnum[]): FootballPlayer => {
    return new FootballPlayer(
        id,
        "",
        "Doe",
        null,
        null,
        0,
        "headshotUrl",
        null,
        1,
        1,
        1,
        positions.includes(FootballPositionEnum.QUARTERBACK) || positions.includes(FootballPositionEnum.BENCH),
        positions.includes(FootballPositionEnum.RUNNING_BACK) ||
            positions.includes(FootballPositionEnum.FLEX) ||
            positions.includes(FootballPositionEnum.BENCH),
        positions.includes(FootballPositionEnum.WIDE_RECEIVER) ||
            positions.includes(FootballPositionEnum.FLEX) ||
            positions.includes(FootballPositionEnum.BENCH),
        positions.includes(FootballPositionEnum.TIGHT_END) ||
            positions.includes(FootballPositionEnum.FLEX) ||
            positions.includes(FootballPositionEnum.BENCH),
        positions.includes(FootballPositionEnum.KICKER) || positions.includes(FootballPositionEnum.BENCH),
        positions.includes(FootballPositionEnum.DEFENSE) || positions.includes(FootballPositionEnum.BENCH),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    );
};
