import { DraftRoster } from "../aggregates/DraftRoster";
import { DraftRosterPool } from "../aggregates/DraftRosterPool";
import { DraftPick } from "../entities/DraftPick";
import { DraftUser } from "../entities/DraftUser";
import { FootballPlayer } from "../entities/football/FootballPlayer";
import { FootballPositionEnum } from "../enums/FootballPositionEnum";
import { SportEnum } from "../enums/SportEnum";
import { DraftSettings } from "../value-objects/DraftSettings";
import { FootballDraftSettings } from "../value-objects/football/FootballDraftSettings";

export class DraftRosterPoolFactory {
    public static create(settings: DraftSettings, draftPicks: DraftPick[], users: DraftUser[]): DraftRosterPool {
        switch (settings.sport) {
            case SportEnum.FOOTBALL:
                return DraftRosterPoolFactory.createFootballRosterPool(
                    settings as FootballDraftSettings,
                    draftPicks,
                    users,
                );

            default:
                throw new Error(`Unsupported sport type: ${settings.sport}`);
        }
    }

    private static createFootballRosterPool(
        settings: FootballDraftSettings,
        draftPicks: DraftPick[],
        draftUsers: DraftUser[],
    ): DraftRosterPool {
        const footballRosters: DraftRoster[] = [];

        for (let i = 1; i <= settings.teamCount; i++) {
            const teamPicks = draftPicks
                .filter((pick) => pick.teamNumber === i && pick.player !== null)
                .map((pick) => pick.player as FootballPlayer);

            const owner: DraftUser | null = draftUsers.find((user) => user.teamNumber === i) || null;

            const roster = new DraftRoster(
                i,
                {
                    [FootballPositionEnum.QUARTERBACK]: settings.quarterbackSpotsCount,
                    [FootballPositionEnum.RUNNING_BACK]: settings.runningBackSpotsCount,
                    [FootballPositionEnum.WIDE_RECEIVER]: settings.wideReceiverSpotsCount,
                    [FootballPositionEnum.TIGHT_END]: settings.tightEndSpotsCount,
                    [FootballPositionEnum.FLEX]: settings.flexSpotsCount,
                    [FootballPositionEnum.BENCH]: settings.benchSpotsCount,
                    [FootballPositionEnum.KICKER]: settings.kickerSpotsCount,
                    [FootballPositionEnum.DEFENSE]: settings.defenseSpotsCount,
                },
                teamPicks,
                owner,
            );

            footballRosters.push(roster);
        }

        return new DraftRosterPool(footballRosters);
    }
}
