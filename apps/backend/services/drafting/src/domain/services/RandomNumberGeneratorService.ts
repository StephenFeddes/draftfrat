import { RandomIndexGenerator } from "../../contracts";

export class MathRandomIndexGenerator implements RandomIndexGenerator {
    public generate(n: number): number {
        return Math.floor(Math.random() * (n + 1));
    }
}
