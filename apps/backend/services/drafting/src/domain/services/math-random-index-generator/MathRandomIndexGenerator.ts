import { RandomIndexGenerator } from "../../../interfaces";

export class MathRandomIndexGenerator implements RandomIndexGenerator {
    public generate(lower: number, upper: number): number {
        if (lower > upper) {
            throw new Error("Lower bound must be less than or equal to the upper bound.");
        }
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    }
}
