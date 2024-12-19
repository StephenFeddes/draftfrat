import { RandomIntegerGenerator } from "../../application/interfaces/random/RandomIntegerGenerator";

export class GenerateRandomInteger implements RandomIntegerGenerator {
    public execute(lower: number, upper: number): number {
        if (lower > upper) {
            throw new Error("Lower bound must be less than or equal to the upper bound.");
        }
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    }
}
