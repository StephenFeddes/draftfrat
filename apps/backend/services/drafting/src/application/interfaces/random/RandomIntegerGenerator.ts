/**
 * Generates a random integer within a given range.
 */
export interface RandomIntegerGenerator {
    /**
     * Generates a random integer within a given range.
     *
     * @param lower The lower bound of the range.
     * @param upper The upper bound of the range.
     * @returns The random number.
     */
    execute(lower: number, upper: number): number;
}
