/**
 * Timer interface for waiting a specified amount of time.
 */
export interface Timer {
    /**
     * Wait for the specified amount of time.
     *
     * @param time The amount of time to wait in milliseconds.
     *
     * @return A promise that resolves to void when the time has elapsed.
     */
    wait(time: number): Promise<void>;
}
