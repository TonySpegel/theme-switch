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
export declare class ThemeEvent extends Event {
    static readonly eventName: "theme-event";
    themeName: string;
    constructor(themeName: string);
}
//# sourceMappingURL=ThemeEvent.d.ts.map