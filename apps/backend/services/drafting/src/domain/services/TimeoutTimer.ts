import { Timer } from "../../contracts";

export class TimeoutTimer implements Timer {
    async wait(milliseconds: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }
}
