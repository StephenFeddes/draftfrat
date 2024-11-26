import { DraftUser } from "../entities/DraftUser";
import { Player } from "../entities/Player";

export class DraftRoster {
    public readonly teamNumber: number;

    public readonly owner: DraftUser | null;

    private assignments: Record<string, (Player | null)[]> = {};

    private totalSpots: number = 0;

    private readonly spotsPerPosition: Record<string, number>;

    private isValidAssignmentFound: boolean = false;

    private assignmentAttempts: number = 0;

    private readonly MAX_ASSIGNMENT_ATTEMPTS: number = 10000;

    constructor(
        teamNumber: number,
        spotsPerPosition: Record<string, number>,
        players: Player[] = [],
        owner: DraftUser | null = null,
    ) {
        this.teamNumber = teamNumber;
        this.spotsPerPosition = spotsPerPosition;
        this.owner = owner;
        for (let i = 0; i < Object.keys(this.spotsPerPosition).length; i++) {
            this.assignments[Object.keys(this.spotsPerPosition)[i]] = [];
        }

        for (let i = 0; i < Object.values(this.spotsPerPosition).length; i++) {
            this.totalSpots += Object.values(this.spotsPerPosition)[i];
        }

        if (players.length > this.totalSpots) {
            throw new Error("Team is full");
        }

        this.assignPlayers(players);
        this.assignmentAttempts = 0;

        if (!this.isValidAssignmentFound) {
            throw new Error("Unable to find valid assignment for players");
        } else {
            this.isValidAssignmentFound = false;
        }
    }

    /**
     * Adds a player to the team and assigns them to a position.
     *
     * @param player - The FootballPlayer object to add to the team.
     * @throws Error - If the team is full or no valid assignments are found.
     * @returns void
     */
    public addPlayer(player: Player): void {
        // Get all players that have been assigned to the team.
        const players: Player[] = this.getAssignedPlayers();

        players.push(player); // Add the new player to the list of assigned players.

        if (players.length > this.totalSpots) {
            throw new Error("Team is full");
        }

        this.resetAssignments(); // Reset the assignments for each position on the team.
        this.assignPlayers(players); // Assign players to positions on the team.
        this.assignmentAttempts = 0; // Reset the number of assignment attempts.

        if (!this.isValidAssignmentFound) {
            throw new Error("Unable to add player");
        } else {
            this.isValidAssignmentFound = false; // Reset the flag for valid assignments.
        }
    }

    public canAddPlayer(player: Player): boolean {
        try {
            const players: Player[] = this.getAssignedPlayers();
            this.addPlayer(player);
            this.resetAssignments();
            this.assignPlayers(players);
            this.assignmentAttempts = 0;
            this.isValidAssignmentFound = false;

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Determines if the roster is full.
     *
     * @returns {boolean} - True if the team is full, false otherwise.
     */
    public isRosterFull(): boolean {
        return this.getAssignedPlayers().length === this.totalSpots;
    }

    /**
     * Assigns players to positions on the team.
     *
     * @param players An array of FootballPlayer objects to assign to positions.
     * @param positionIndex The index of the current position to assign players to.
     * @returns void
     */
    private assignPlayers(players: Player[], positionIndex: number = 0): void {
        if (this.isValidAssignmentFound || this.assignmentAttempts > this.MAX_ASSIGNMENT_ATTEMPTS) {
            return;
        }

        // Get the positions in the order they should be assigned.
        const positions: string[] = Object.keys(this.spotsPerPosition);

        // Get the position to assign players to.
        const position: string = positions[positionIndex];

        // Get the number of spots needed for the position.
        const spotsNeeded: number = this.spotsPerPosition[position];

        // Get all players that are currently assigned to the team.
        const assignedPlayers: Player[] = this.getAssignedPlayers();

        const playersEligibleForPosition: (Player | null)[] = players.filter(
            (player: Player) => player.canPlayPosition(position) && !this.getAssignedPlayers().includes(player),
        );

        if (positionIndex === positions.length && assignedPlayers.length === players.length) {
            this.isValidAssignmentFound = true; // All players have been assigned to roster spots.
            return;
        }

        if (positionIndex === positions.length) {
            return; // All positions have been iterated through, but not all players have been assigned.
        }

        // Add null placeholders so that the number of eligible players matches the number of spots needed.
        if (playersEligibleForPosition.length < spotsNeeded) {
            for (let i = playersEligibleForPosition.length; i < spotsNeeded; i++) {
                playersEligibleForPosition.push(null);
            }
        }

        // Generate unique combinations of eligible players for the position
        const playerCombinations: (Player | null)[][] = this.generatePlayerCombinations(
            playersEligibleForPosition,
            spotsNeeded,
        );

        // Assign players to the position and recursively assign players to the next position.
        for (let i = 0; i < playerCombinations.length; i++) {
            this.assignments[position] = playerCombinations[i];
            this.assignmentAttempts += 1;

            // If too many attempts have been made, stop trying to assign players to prevent infinite loop.
            if (this.assignmentAttempts > this.MAX_ASSIGNMENT_ATTEMPTS) {
                return;
            }

            // Recursively assign players to the next position.
            this.assignPlayers(players, positionIndex + 1);

            // If a valid assignment has been found, stop trying to assign players.
            if (this.isValidAssignmentFound) {
                return;
            }

            // Backtrack to the next combination if the current combination led to an invalid assignment.
            this.assignments[position] = [];
        }
    }

    /**
     * Generates combinations of players for a given combination size
     * that are unique based on player positions.
     *
     * @param players - An array of FootballPlayer objects or null placeholders.
     * @param playersPerCombination - The number of players needed in each combination.
     * @returns {(FootballPlayer | null)[][]} - An array of unique player combinations.
     * Each combination is an array containing FootballPlayer objects or null values.
     *
     * @example
     * const result = generatePlayerCombinations([player1, player2, player3], 2);
     * result: [[player1, player2], [player1, player3], [player2, player3]]
     */
    private generatePlayerCombinations(players: (Player | null)[], playersPerCombination: number): (Player | null)[][] {
        // Base case: return an empty array if no players are needed in the combination.
        if (playersPerCombination === 0) {
            return [[]];
        }

        // Base case: return an empty array if there are not enough players to choose from.
        if (players.length < playersPerCombination) {
            return [];
        }

        const playerCombinations: (Player | null)[][] = [];
        const uniquePositionCombinations = new Set<string>();

        // Recursively generate player combinations.
        for (let i = 0; i < players.length; i++) {
            const remainingCombinations = this.generatePlayerCombinations(
                players.slice(i + 1),
                playersPerCombination - 1,
            );

            for (const combination of remainingCombinations) {
                const newPlayerCombination = [players[i], ...combination];
                const newPositionCombination: string = JSON.stringify(
                    newPlayerCombination.map((player: Player | null) =>
                        player ? player.getPositions().sort() : ["None"],
                    ),
                );

                // Only add unique combinations that have unique player positions.
                if (!uniquePositionCombinations.has(newPositionCombination)) {
                    uniquePositionCombinations.add(newPositionCombination);
                    playerCombinations.push(newPlayerCombination);
                }
            }
        }

        return playerCombinations;
    }

    /**
     * Gets all players that have been assigned to the team.
     *
     * @returns {FootballPlayer[]} - An array of FootballPlayer objects that have been assigned to the team.
     */
    private getAssignedPlayers() {
        return Object.values(this.assignments)
            .flat()
            .filter((player) => player !== null);
    }

    /**
     * Resets the assignments for each position on the team.
     */
    private resetAssignments() {
        for (let i = 0; i < Object.keys(this.assignments).length; i++) {
            this.assignments[Object.keys(this.assignments)[i]] = [];
        }
    }

    /**
     * Converts the FootballDraftTeam object to a JSON object.
     *
     * @returns {object} - A JSON object representing the FootballDraftTeam object.
     */
    public toJSON(): object {
        const jsonAssignments: Record<string, (object | null)[]> = {};
        for (let i = 0; i < Object.keys(this.assignments).length; i++) {
            jsonAssignments[Object.keys(this.assignments)[i]] = this.assignments[Object.keys(this.assignments)[i]].map(
                (player) => (player ? player.toJSON() : null),
            );
        }
        return jsonAssignments;
    }
}
