import { Timeouter } from "../../application/interfaces/time/Timeouter";

export class Timeout implements Timeouter {
    async execute(milliseconds: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }
}
