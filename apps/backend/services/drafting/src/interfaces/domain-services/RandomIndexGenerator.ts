/**
 * Generates a random positive integer within a given range.
 */
export interface RandomIndexGenerator {
    /**
     * Generates a random positive integer within a given range.
     *
     * @param lower The lower bound of the range.
     * @param upper The upper bound of the range.
     * @returns The random number.
     */
    generate(lower: number, upper: number): number;
}
