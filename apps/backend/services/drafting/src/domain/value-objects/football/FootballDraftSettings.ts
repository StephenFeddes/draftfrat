import { DraftOrderEnum } from "../../enums/DraftOrderEnum";
import { ScoringEnum } from "../../enums/ScoringEnum";
import { SportEnum } from "../../enums/SportEnum";
import { DraftSettings } from "../DraftSettings";

export class FootballDraftSettings extends DraftSettings {
    public readonly quarterbackSpotsCount: number;

    public readonly runningBackSpotsCount: number;

    public readonly wideReceiverSpotsCount: number;

    public readonly tightEndSpotsCount: number;

    public readonly flexSpotsCount: number;

    public readonly benchSpotsCount: number;

    public readonly kickerSpotsCount: number;

    public readonly defenseSpotsCount: number;

    constructor(
        orderType: DraftOrderEnum,
        scoringType: ScoringEnum,
        teamCount: number,
        pickTimeLimit: number | null,
        quarterbackSpotsCount: number,
        runningBackSpotsCount: number,
        wideReceiverSpotsCount: number,
        tightEndSpotsCount: number,
        flexSpotsCount: number,
        benchSpotsCount: number,
        kickerSpotsCount: number,
        defenseSpotsCount: number,
        createdAt: string = new Date().toISOString(),
        isStarted: boolean = false,
        isComplete: boolean = false,
    ) {
        super(orderType, SportEnum.FOOTBALL, scoringType, teamCount, pickTimeLimit, createdAt, isStarted, isComplete);

        this.quarterbackSpotsCount = quarterbackSpotsCount;
        this.runningBackSpotsCount = runningBackSpotsCount;
        this.wideReceiverSpotsCount = wideReceiverSpotsCount;
        this.tightEndSpotsCount = tightEndSpotsCount;
        this.flexSpotsCount = flexSpotsCount;
        this.benchSpotsCount = benchSpotsCount;
        this.kickerSpotsCount = kickerSpotsCount;
        this.defenseSpotsCount = defenseSpotsCount;
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
            quarterbackSpotsCount: this.quarterbackSpotsCount,
            runningBackSpotsCount: this.runningBackSpotsCount,
            wideReceiverSpotsCount: this.wideReceiverSpotsCount,
            tightEndSpotsCount: this.tightEndSpotsCount,
            flexSpotsCount: this.flexSpotsCount,
            benchSpotsCount: this.benchSpotsCount,
            kickerSpotsCount: this.kickerSpotsCount,
            defenseSpotsCount: this.defenseSpotsCount,
        };
    }
}
