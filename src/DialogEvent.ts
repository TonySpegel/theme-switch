/**
 * Copyright © 2022 Tony Spegel
 */

/**
 * DialogEvent is used to reference the targetElement
 * which has opened the ThemeSwitch component.
 * This needs to be done to re-select it after closing 
 * the dialog.
 * 
 * Dispatching on the host site:
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
