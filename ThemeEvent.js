/**
 * Copyright © 2022 Tony Spegel
 */
/**
 * ThemeEvent transports the name of a theme so that
 * a host can react to it accordingly.
 *
 * Listening for the event:
 * window.addEventListener('theme-event', (themeEvent) => {
 *   const {themeName} = themeEvent;
 * });
 *
 * Dispatch the event:
 * window.dispatchEvent(new ThemeEvent('auto'));
 */
export class ThemeEvent extends Event {
    constructor(themeName) {
        super(ThemeEvent.eventName, { bubbles: true });
        this.themeName = '';
        this.themeName = themeName;
    }
}
ThemeEvent.eventName = 'theme-event';
//# sourceMappingURL=ThemeEvent.js.map