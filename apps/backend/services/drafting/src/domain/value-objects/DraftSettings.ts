import { DraftOrderEnum } from "../enums/DraftOrderEnum";
import { ScoringEnum } from "../enums/ScoringEnum";
import { SportEnum } from "../enums/SportEnum";

export class DraftSettings {
    public readonly orderType: DraftOrderEnum;

    public readonly sport: SportEnum;

    public readonly scoringType: ScoringEnum;

    public readonly teamCount: number;

    public readonly pickTimeLimit: number | null;

    public isStarted: boolean;

    public readonly createdAt: string;

    public readonly isComplete: boolean;

    constructor(
        orderType: DraftOrderEnum,
        sport: SportEnum,
        scoringType: ScoringEnum,
        teamCount: number,
        pickTimeLimit: number | null,
        createdAt: string = new Date().toISOString(),
        isStarted: boolean = false,
        isComplete: boolean = false,
    ) {
        this.orderType = orderType;
        this.sport = sport;
        this.teamCount = teamCount;
        this.pickTimeLimit = pickTimeLimit;
        this.scoringType = scoringType;
        this.isStarted = isStarted;
        this.createdAt = createdAt;
        this.isComplete = isComplete;
    }

    public setIsStarted(isStarted: boolean): void {
        this.isStarted = isStarted;
    }

    public toJSON(): object {
        return {
            orderType: this.orderType,
            sport: this.sport,
            teamCount: this.teamCount,
            pickTimeLimit: this.pickTimeLimit,
            scoringType: this.scoringType,
            createdAt: this.createdAt,
            isStarted: this.isStarted,
            isComplete: this.isComplete,
        };
    }
}
