import { Player } from "../../entities/Player";
import { Roster } from "../roster/Roster";

/**
 * Contains all the rosters for a draft.
 */
export class RosterPool {
    private rosters: Map<number, Roster> = new Map();

    /**
     * Creates a new DraftRosterPool.
     *
     * @param draftRosters - The rosters to add to the pool.
     */
    constructor(draftRosters: Roster[]) {
        draftRosters.forEach((team) => this.rosters.set(team.teamNumber, team));
    }

    /**
     * Adds a player to a team's roster.
     *
     * @param teamNumber - The number of the team to add the player to.
     * @param player - The player to add to the team.
     */
    public addPlayerToRoster(teamNumber: number, player: Player): void {
        const teamRoster = this.rosters.get(teamNumber);
        if (!teamRoster) {
            throw new Error(`Team number ${teamNumber} not found`);
        }
        try {
            teamRoster.addPlayer(player);
        } catch (error) {
            throw new Error(`Unable to add player to team: ${error}`);
        }
    }

    /**
     * Gets the roster for a team.
     *
     * @param teamNumber - The number of the team to get the roster for.
     * @returns The roster for the team.
     */
    public getRoster(teamNumber: number): Roster {
        const teamRoster = this.rosters.get(teamNumber);
        if (!teamRoster) {
            throw new Error(`Team with ID ${teamNumber} not found`);
        }
        return teamRoster;
    }

    /**
     * Checks if the draft is complete.
     *
     * @returns True if the draft is complete, false otherwise.
     */
    public isRostersFull(): boolean {
        for (const roster of this.rosters.values()) {
            if (!roster.isRosterFull()) {
                return false;
            }
        }
        return true;
    }

    public getRosters(): Record<string, object> {
        const rosters: Record<string, object> = {};
        this.rosters.forEach((roster, teamNumber) => {
            rosters[teamNumber] = {
                owner: roster.owner,
                assignments: roster.getAssignments(),
            };
        });
        return rosters;
    }
}
