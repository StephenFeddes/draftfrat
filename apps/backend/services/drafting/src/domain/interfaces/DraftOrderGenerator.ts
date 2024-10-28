export interface DraftOrderGenerator {
    generate(playerCountPerTeam: number, teamCount: number): number[];
}
