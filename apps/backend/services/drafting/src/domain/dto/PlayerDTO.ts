import { InjuryStatusEnum } from "../enums/InjuryStatusEnum";

export type PlayerDTO = {
    id: number;
    averageDraftPosition: number;
    firstName: string;
    lastName: string;
    injuryStatus: InjuryStatusEnum | null;
    yearsExperience: number;
    headshotUrl: string;
};
