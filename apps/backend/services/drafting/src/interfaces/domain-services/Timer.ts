/**
 * Waits a specified amount of time.
 */
export interface Timer {
    /**
     * Wait for the specified amount of time.
     *
     * @param time The amount of time to wait in milliseconds.
     *
     * @return void
     */
    wait(time: number): Promise<void>;
}
