import { DraftPick } from "../../domain";

export interface DraftPickOrderGenerator {
    generate(draftId: number, playersPerTeam: number, teamCount: number): DraftPick[];
}
