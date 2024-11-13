import { DraftSettingsDTO } from "../../dto/DraftSettingsDTO";
import { DraftOrderEnum } from "../../enums/DraftOrderEnum";
import { ScoringEnum } from "../../enums/ScoringEnum";
import { SportEnum } from "../../enums/SportEnum";

export class DraftSettings {
    public readonly orderType: DraftOrderEnum;

    public readonly sport: SportEnum;

    public readonly scoringType: ScoringEnum;

    public readonly teamCount: number;

    public readonly pickTimeLimit: number;

    public readonly isStarted: boolean;

    public readonly createdAt: string;

    constructor(
        orderType: DraftOrderEnum,
        sport: SportEnum,
        scoringType: ScoringEnum,
        teamCount: number,
        pickTimeLimit: number,
        isStarted: boolean,
        createdAt: string,
    ) {
        // Validation logic remains the same
        if (
            orderType === undefined ||
            orderType === null ||
            !Object.values(DraftOrderEnum).includes(orderType)
        ) {
            throw new Error(
                `Valid orderType is required. Valid order types are: ${Object.values(DraftOrderEnum)}`,
            );
        }

        if (sport === undefined || sport === null || !Object.values(SportEnum).includes(sport)) {
            throw new Error(
                `Valid sport is required. Valid sports are: ${Object.values(SportEnum)}`,
            );
        }

        if (
            scoringType === undefined ||
            scoringType === null ||
            !Object.values(ScoringEnum).includes(scoringType)
        ) {
            throw new Error(
                `Valid scoringType is required. Valid scoring types are: ${Object.values(ScoringEnum)}`,
            );
        }

        if (
            teamCount === undefined ||
            teamCount === null ||
            typeof teamCount !== "number" ||
            teamCount < 0 ||
            teamCount % 1 !== 0
        ) {
            throw new Error("teamCount is required and must be a non-negative whole number");
        }

        if (
            pickTimeLimit === undefined ||
            pickTimeLimit === null ||
            typeof pickTimeLimit !== "number" ||
            pickTimeLimit < 0 ||
            pickTimeLimit % 1 !== 0
        ) {
            throw new Error("pickTimeLimit is required and must be a non-negative whole number");
        }

        if (isStarted === undefined || isStarted === null || typeof isStarted !== "boolean") {
            throw new Error("isStarted is required and must be a boolean");
        }

        if (
            createdAt === undefined ||
            createdAt === null ||
            new Date(createdAt).toString() === "Invalid Date"
        ) {
            throw new Error("createdAt is required and must be a valid date string");
        }

        this.orderType = orderType;
        this.sport = sport;
        this.teamCount = teamCount;
        this.pickTimeLimit = pickTimeLimit;
        this.scoringType = scoringType;
        this.isStarted = isStarted;
        this.createdAt = createdAt;
    }

    public toJSON(): DraftSettingsDTO {
        return {
            orderType: this.orderType,
            sport: this.sport,
            teamCount: this.teamCount,
            pickTimeLimit: this.pickTimeLimit,
            scoringType: this.scoringType,
            isStarted: this.isStarted,
            createdAt: this.createdAt,
        };
    }
}
