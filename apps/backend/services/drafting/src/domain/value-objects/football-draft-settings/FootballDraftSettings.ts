import { FootballDraftSettingsDTO } from "../../dto/FootballDraftSettingsDTO";
import { DraftOrderEnum } from "../../enums/DraftOrderEnum";
import { ScoringEnum } from "../../enums/ScoringEnum";
import { SportEnum } from "../../enums/SportEnum";
import { DraftSettings } from "../draft-settings/DraftSettings";

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
        sport: SportEnum,
        scoringType: ScoringEnum,
        teamCount: number,
        pickTimeLimit: number,
        isStarted: boolean,
        createdAt: string,
        quarterbackSpotsCount: number,
        runningBackSpotsCount: number,
        wideReceiverSpotsCount: number,
        tightEndSpotsCount: number,
        flexSpotsCount: number,
        benchSpotsCount: number,
        kickerSpotsCount: number,
        defenseSpotsCount: number,
    ) {
        super(orderType, sport, scoringType, teamCount, pickTimeLimit, isStarted, createdAt);

        if (
            quarterbackSpotsCount === undefined ||
            quarterbackSpotsCount === null ||
            typeof quarterbackSpotsCount !== "number" ||
            quarterbackSpotsCount < 0 ||
            quarterbackSpotsCount % 1 !== 0
        ) {
            throw new Error(
                "quarterbackSpotsCount is required and must be a non-negative whole number",
            );
        }

        if (
            runningBackSpotsCount === undefined ||
            runningBackSpotsCount === null ||
            typeof runningBackSpotsCount !== "number" ||
            runningBackSpotsCount < 0 ||
            runningBackSpotsCount % 1 !== 0
        ) {
            throw new Error(
                "runningBackSpotsCount is required and must be a non-negative whole number",
            );
        }

        if (
            wideReceiverSpotsCount === undefined ||
            wideReceiverSpotsCount === null ||
            typeof wideReceiverSpotsCount !== "number" ||
            wideReceiverSpotsCount < 0 ||
            wideReceiverSpotsCount % 1 !== 0
        ) {
            throw new Error(
                "wideReceiverSpotsCount is required and must be a non-negative whole number",
            );
        }

        if (
            tightEndSpotsCount === undefined ||
            tightEndSpotsCount === null ||
            typeof tightEndSpotsCount !== "number" ||
            tightEndSpotsCount < 0 ||
            tightEndSpotsCount % 1 !== 0
        ) {
            throw new Error(
                "tightEndSpotsCount is required and must be a non-negative whole number",
            );
        }

        if (
            flexSpotsCount === undefined ||
            flexSpotsCount === null ||
            typeof flexSpotsCount !== "number" ||
            flexSpotsCount < 0 ||
            flexSpotsCount % 1 !== 0
        ) {
            throw new Error("flexSpotsCount is required and must be a non-negative whole number");
        }

        if (
            benchSpotsCount === undefined ||
            benchSpotsCount === null ||
            typeof benchSpotsCount !== "number" ||
            benchSpotsCount < 0 ||
            benchSpotsCount % 1 !== 0
        ) {
            throw new Error("benchSpotsCount is required and must be a non-negative whole number");
        }

        if (
            kickerSpotsCount === undefined ||
            kickerSpotsCount === null ||
            typeof kickerSpotsCount !== "number" ||
            kickerSpotsCount < 0 ||
            kickerSpotsCount % 1 !== 0
        ) {
            throw new Error("kickerSpotsCount is required and must be a non-negative whole number");
        }

        if (
            defenseSpotsCount === undefined ||
            defenseSpotsCount === null ||
            typeof defenseSpotsCount !== "number" ||
            defenseSpotsCount < 0 ||
            defenseSpotsCount % 1 !== 0
        ) {
            throw new Error(
                "defenseSpotsCount is required and must be a non-negative whole number",
            );
        }

        this.quarterbackSpotsCount = quarterbackSpotsCount;
        this.runningBackSpotsCount = runningBackSpotsCount;
        this.wideReceiverSpotsCount = wideReceiverSpotsCount;
        this.tightEndSpotsCount = tightEndSpotsCount;
        this.flexSpotsCount = flexSpotsCount;
        this.benchSpotsCount = benchSpotsCount;
        this.kickerSpotsCount = kickerSpotsCount;
        this.defenseSpotsCount = defenseSpotsCount;
    }

    public toJSON(): FootballDraftSettingsDTO {
        return {
            orderType: this.orderType,
            sport: this.sport,
            teamCount: this.teamCount,
            pickTimeLimit: this.pickTimeLimit,
            scoringType: this.scoringType,
            isStarted: this.isStarted,
            createdAt: this.createdAt,
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
