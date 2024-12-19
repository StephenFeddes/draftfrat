/**
 * Waits a specified amount of time.
 */
export interface Timeouter {
    /**
     * Wait for the specified amount of time.
     *
     * @param time The amount of time to wait in milliseconds.
     *
     * @return void
     */
    execute(time: number): Promise<void>;
}
