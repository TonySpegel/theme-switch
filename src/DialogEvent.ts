/**
 * Copyright © 2021 Tony Spegel
 */

/**
 * DialogEvent is used to transport the targetElement
 * which has opened the ThemeSwitch component.
 * 
 * Dispatching:
 * 
 * document
 *     .querySelector('#btn-theme-selection')
 *     .addEventListener('click', (event) => {
 *          const {target} = event;
 *          window.dispatchEvent(new DialogEvent(target));
 *     });
 */
export class DialogEvent extends Event {
    static readonly eventName = 'dialog-event' as const;
    targetElement: HTMLElement;

    constructor(targetElement: HTMLElement) {
        super(DialogEvent.eventName, {bubbles: true});
        this.targetElement = targetElement;
    }
}
