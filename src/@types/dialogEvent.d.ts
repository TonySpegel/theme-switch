import {DialogEvent} from '../DialogEvent';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface WindowEventMap
        extends Record<typeof DialogEvent['eventName'], DialogEvent> {}
}
