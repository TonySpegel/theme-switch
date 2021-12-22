/**
 * <theme-switch> is a web component which enables
 * users to switch between themes they have defined.
 *
 * Features:
 * - [ ] Config trough attributes `<theme-switch arr='["auto", "light"]'></theme-switch>`
 * - [x] Keyboard navigation for custom radio buttons
 * - [ ] Keyboard handling for the dialog
 *     - [x] close dialog using the 'escape' key
 *     - [x] re-focus the element which has opened the dialog after closing it again
 *     - [ ] trapping focus inside the dialog
 * - [ ] Saving the selected theme to localStorage
 *
 * Copyright © 2021 Tony Spegel
 */

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, css, html} from 'lit';
import {DialogEvent} from './DialogEvent';
import {customElement, query, queryAll, state} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';

interface themeStateInterface {
    title: string;
    checked: boolean;
}

const savePreference = (theme: string): void => {
    localStorage.setItem('theme-preference', theme);
};

/**
 * Custom element which helps switching themes.
 */
@customElement('theme-switch')
export class ThemeSwitch extends LitElement {
    static override styles = css`
        :host {
            display: block;
            font-family: Sans-Serif;

            --base-gap: 8px;
            --base-radius: 8px;
        }
        /**
         * Dialog
         */
        #dialog-theme-selection {
            display: flex;
            flex-direction: column;
            gap: var(--base-gap);

            position: absolute;
            left: 50%;
            top: 50%;

            width: 200px;

            border: 3px solid var(--surface-1);
            border-radius: var(--base-radius);
            padding: calc(var(--base-gap) * 2);
            transform: translate(-50%, -50%);

            background-color: white;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19),
                0 6px 6px rgba(0, 0, 0, 0.23);

            text-align: center;
        }

        #dialog-theme-selection:focus {
            border: 5px solid red;
        }

        #dialog-theme-selection[aria-hidden='true'] {
            display: none;
        }

        h2 {
            margin: 0;
            color: hsla(281, 100%, 21%, 1);
        }

        .dialog-actions {
            display: flex;
            gap: var(--base-gap);
        }

        .themes {
            display: grid;
            /* grid-temp    late-columns: repeat(auto-fit, minmax(50px, 1fr)); */
            gap: var(--base-gap);
        }

        .theme-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: calc(var(--base-gap) / 4);
            padding: calc(var(--base-gap) / 2);
            border-radius: var(--base-radius);

            background-color: '#f9f9f9';
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
                0 3px 6px rgba(0, 0, 0, 0.23);
        }

        .theme-wrapper > label {
            text-transform: capitalize;
        }

        .theme {
            border-radius: 50%;
            border: 2px solid hsla(281, 53%, 97%, 0.63);
            width: 25px;
            aspect-ratio: 1;

            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 0.15s;
            cursor: pointer;
        }

        .theme[aria-checked='true'] {
            background-color: currentColor;
        }

        .circle-wrapper {
            display: grid;
            place-items: center;
            grid-template-areas: 'circle';
            width: 100%;
            max-width: 40px;
            aspect-ratio: 1;
        }

        .inner-circle {
            grid-area: circle;
            z-index: 1;
        }

        .outer-circle {
            grid-area: circle;
            z-index: 0;

            border-radius: 50%;
            width: 50%;
            aspect-ratio: 1;

            /* background-color: hsl(var(--color), calc(var(--l) + 35%), 100%); */
            transition: transform 0.4s cubic-bezier(0.54, 1.5, 0.38, 1.2);
        }

        .radio {
            cursor: pointer;
            border-radius: 50%;
            width: 60%;
            aspect-ratio: 1;

            border: 2px solid var(--that-color);

            transition: transform 0.4s cubic-bezier(0.54, 1.5, 0.38, 1.2);
            outline: none;
        }

        .radio:hover + .outer-circle,
        .radio:focus + .outer-circle {
            transform: scale(2);
        }
    `;
    /**
     * Custom element lifecycle events
     * ===============================
     */

    /**
     * Invoked when a component is 
     * added to the document's DOM.
     */
    override connectedCallback(): void {
        super.connectedCallback();
        /**
         * Register an EventListener which handles WIP:
         */
        addEventListener(DialogEvent.eventName, async (event: DialogEvent) => {
            /**
             * targetElement can be any HTMLElement
             * which has opened the dialog.
             */
            const {targetElement} = event;
            /**
             * targetElement's id is used to focus() it
             * after closing the dialog which until then
             * had its focus trapped
             */
            const {id} = targetElement;
            this.openerElementId = id;
            /**
             * If that event has been received,
             * it's time to set the dialogHidden state to false.
             * This triggers the 'reactive update cycle'
             */
            this.dialogHidden = false;
            /**
             * Because ^ this happens to be asynchronous,
             * we have to wait for updateComplete to resolve
             * before doing any further work on any DOM element
             */
            await this.updateComplete;
            this.dialogElement.focus();
        });
    }
    /**
     * Invoked when a component is 
     * removed from the document's DOM.
     */
    override disconnectedCallback(): void {
        super.disconnectedCallback();
        removeEventListener(DialogEvent.eventName, () => {
            console.info(
                `${DialogEvent.eventName} has been removed as an EventListener`
            );
        });
    }
    /**
     * Decorators
     * ===============================
     */

    // Buttons to select a theme
    @queryAll('button[role="radio"]')
    private themeButtons!: HTMLButtonElement[];
    // All tabbable elements
    @queryAll('a[href], input, button:not([tabindex="-1"])')
    private allElements!: HTMLElement[];
    // The dialog itself
    @query('#dialog-theme-selection')
    private dialogElement!: HTMLDivElement;
    /**
     * States ✨
     * ===============
     */

    // Used to toggle the dialog's visibility
    @state()
    private dialogHidden = false;
    // Represents radio buttons to select a theme
    @state()
    private themes: themeStateInterface[] = [
        {title: 'auto', checked: true},
        {title: 'day', checked: false},
        {title: 'night', checked: false},
        {title: 'ocean', checked: false},
    ];

    // Id to identify which element has opened a dialog
    private openerElementId!: string;
    // The index of the last radio button / theme
    private lastIndex: number = this.themes.length - 1;

    /**
     * Methods ✨
     * ===============
     */

    /**
     * Closes the dialog by setting a the dialogHidden state to false
     */
    private closeDialog() {
        this.dialogHidden = true;
        // Refactor to its own method
        document
            .querySelector<HTMLButtonElement>(`#${this.openerElementId}`)
            ?.focus();
    }
    /**
     * Changes the state array of our themes
     */
    private updateThemeState(index: number): void {
        // Create a copy of 'themes'
        const themesCopy = [...this.themes];
        // Reset every theme to unchecked
        themesCopy.forEach((theme) => (theme.checked = false));
        // Update only that theme which has been selected
        themesCopy[index].checked = true;
        // Overwrite themes with our copy to trigger the reactive update cycle
        this.themes = themesCopy;
    }

    /**
     * WIP
     * @param event
     * @param currentIndex
     * @returns
     */
    private handleThemeKeyboard(event: KeyboardEvent, currentIndex: number) {
        const key = event.key;

        switch (key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                if (currentIndex !== 0) {
                    this.themeButtons[currentIndex - 1].focus();
                } else {
                    this.themeButtons[this.lastIndex].focus();
                }
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                if (currentIndex !== this.lastIndex) {
                    this.themeButtons[currentIndex + 1].focus();
                } else {
                    this.themeButtons[0].focus();
                }
                break;
            case 'Enter':
                this.updateThemeState(currentIndex);
                break;
            default:
                break;
        }

        return '';
    }

    private handleDialogKeyboard(event: KeyboardEvent) {
        const key = event.key;
        const isShift = event.shiftKey;
        // const firstElement = this.allButtons[0];
        // console.log(firstElement);

        console.log(this.allElements);

        if (key === 'Escape') {
            this.closeDialog();
        }

        if (isShift === false && key === 'Tab') {
            console.log('tab ->');
        }

        if (isShift && key === 'Tab') {
            console.log('<- tab');
        }
    }

    override render() {
        return html`
            <div
                @keyup="${this.handleDialogKeyboard}"
                aria-hidden="${this.dialogHidden}"
                aria-label="Theme-Selection"
                aria-modal="true"
                id="dialog-theme-selection"
                role="dialog"
                tabindex="-1"
            >
                <div class="dialog-title">
                    <h2>Farbschema</h2>
                </div>

                <!-- <button>First</button> -->

                <div role="radiogroup" class="themes">
                    ${this.themes.map((theme, index) => {
                        const innerCircleStyles = {
                            backgroundColor: theme.checked
                                ? `var(--surface-1-${theme.title}, #ccc)`
                                : '',
                            borderColor: `var(--surface-1-${theme.title}, #ccc)`,
                        };

                        const outerCircleStyle = {
                            backgroundColor: `hsla(
                                var(--hue-${theme.title}, 0deg), 
                                var(--sat-${theme.title}, 0%), 
                                calc(var(--lum-${theme.title}, 62%) + 25%),
                                0.5
                            )`,
                        };

                        return html`
                            <div class="theme-wrapper">
                                <div class="circle-wrapper">
                                    <button
                                        @click="${() => {
                                            // Update state
                                            this.updateThemeState(index);
                                            // Save selection
                                            savePreference(theme.title);
                                        }}"
                                        @keydown="${(event: KeyboardEvent) =>
                                            this.handleThemeKeyboard(event, index)}"
                                        aria-checked="${theme.checked}"
                                        class="radio inner-circle"
                                        id="${theme.title}"
                                        role="radio"
                                        style=${styleMap(innerCircleStyles)}
                                        tabindex=${theme.checked ? 0 : -1}
                                        title="${theme.title}"
                                    ></button>
                                    <div
                                        class="outer-circle"
                                        style=${styleMap(outerCircleStyle)}
                                    ></div>
                                </div>

                                <label>${theme.title}</label>
                            </div>
                        `;
                    })}
                </div>

                <div class="sace">
                    <input
                        checked
                        id="save-selection"
                        name="save-selection"
                        type="checkbox"
                    />
                    <label for="save-selection">Auswahl speichern</label>
                    <a id="read-more" href="/about">?</a>
                </div>

                <div class="dialog-actions">
                    <button
                        @click=${() => this.closeDialog()}
                        id="btn-close-dialog"
                    >
                        close
                    </button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'theme-switch': ThemeSwitch;
    }
}
