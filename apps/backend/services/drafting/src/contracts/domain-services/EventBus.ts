import { DraftEventEnum, DraftEvent } from "../../domain";

/**
 * The event bus is used to publish and subscribe to events that occur during the draft.
 * This allows for the decoupling of the domain and use case logic from the infrastructure layer.
 */
export interface EventBus {
    /**
     * Subscribes to an event.
     *
     * @param eventName The name of the event to subscribe to.
     * @param handler The handler that will be called when the event is published.
     *
     * @return void
     */
    subscribe(eventName: DraftEventEnum, handler: (event: DraftEvent) => void): void;

    /**
     * Unsubscribes from an event.
     *
     * @param eventName The name of the event to unsubscribe from.
     * @param handler The handler that was previously subscribed to the event.
     *
     * @return void
     */
    unsubscribe(eventName: DraftEventEnum, handler: (event: DraftEvent) => void): void;

    /**
     * Publishes an event.
     *
     * @param event The event to publish.
     *
     * @return void
     */
    publish(event: DraftEvent): void;

    /**
     * Publishes multiple events.
     *
     * @param events The events to publish.
     *
     * @return void
     */
    publishAll(events: DraftEvent[]): void;
}
