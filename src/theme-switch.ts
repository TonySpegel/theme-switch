/**
 * <theme-switch> is a web component which enables
 * users to switch between themes they have defined.
 *
 * Features:
 * - [x] Config trough attributes `<theme-switch arr='["auto", "light"]'></theme-switch>`
 * - [x] Keyboard navigation for custom radio buttons
 * - [x] Keyboard handling for the dialog
 *     - [x] close dialog using the 'escape' key
 *     - [x] re-focus the element which has opened the dialog after closing it again
 *     - [x] trapping focus inside the dialog
 * - [x] Saving the selected theme to localStorage
 * - [x] Reading the selected from localStorage
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
import {ThemeEvent} from './ThemeEvent';
import {customElement, property, queryAll, state} from 'lit/decorators.js';

interface themeStateInterface {
    name: string;
    checked: boolean;
}

const readSetting = (setting: string): string | null => {
    return localStorage.getItem(setting);
};

const saveSetting = (setting: string, value: string): void => {
    localStorage.setItem(setting, value);
};

const deleteSetting = (setting: string): void => {
    localStorage.removeItem(setting);
};

/**
 * These are default themes most users will use
 */
const defaulThemes: themeStateInterface[] = [
    {name: 'auto', checked: true},
    {name: 'light', checked: false},
    {name: 'dark', checked: false},
];
/**
 * The component can be configured by the 'availableThemes' property.
 * As these are just strings, they need to be upgraded by
 * adding a name and checked property
 */
const upgradeToTheme = (names: string[]): themeStateInterface[] => {
    return names.map((name, index) => {
        return {name, checked: index === 0 ? true : false};
    });
};
/**
 * Custom element which helps switching themes.
 */
@customElement('theme-switch')
export class ThemeSwitch extends LitElement {
    static override styles = css`
        :host {
            --purple-50: #faf5ff;
            --purple-100: #f3e8ff;
            --purple-200: #e9d5ff;
            --purple-300: #d8b4fe;
            --purple-400: #c084fc;
            --purple-500: #a855f7;
            --purple-600: #9333ea;
            --purple-700: #7e22ce;
            --purple-800: #6b21a8;
            --purple-900: #581c87;
            --purple-950: #2f0050;

            --base-gap: 8px;
            --base-radius: 8px;
            --blur-amount: 5px;
            --backdrop-color: hsla(0, 0, 78%, 0.1);

            --text-color-1: var(--purple-950);
            --text-color-2: var(--purple-900);
            --outline-color: #000;

            /* Dialog */
            --dialog-bg-color: var(--purple-50);
            --dialog-border-color: var(--purple-500);
            /* Themes Wrapper */
            --themes-border-color: var(--purple-400);
            /* Radio Buttons */
            --circle-bg-color: var(--purple-100);
            --circle-bg-color-checked: var(--purple-300);
            --circle-border-color: var(--purple-500);
            /* Control elements */
            --control-color: var(--purple-300);
            --control-interaction-color: var(--purple-400);
            /* Checkbox */
            --checkbox-bg-color: var(--purple-50);
            --checkbox-bg-color-checked: var(--purple-200);
            --checkmark-color: var(--purple-900);
            --checkbox-border-color: var(--purple-500);

            font-family: var(--font-fam, sans-serif);
        }

        ::slotted(h2) {
            margin: 0;
            color: var(--text-color-1);
        }

        ::slotted(span) {
            color: var(--text-color-2);
        }

        ::slotted(#read-more) {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            padding: 4px;
            width: 30px;
            height: 30px;
            text-decoration: none;

            color: var(--text-color-1);
            transition: transform 50ms ease-in-out,
                background-color 100ms ease-in-out;
            background-color: var(--control-color);
            box-sizing: border-box;
        }

        ::slotted(a#read-more:hover),
        ::slotted(a#read-more:focus) {
            background-color: var(--control-interaction-color);
        }

        #dialog-backdrop {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 999;
            background-color: var(
                --backdrop-color,
                hsla(260deg, 55%, 35%, 19%)
            );
            backdrop-filter: blur(var(--blur-amount, 5px));
        }

        #dialog-backdrop[aria-hidden='true'] {
            display: none;
        }
        /**
         * Dialog
         */
        #dialog-theme-selection {
            display: flex;
            flex-direction: column;
            gap: calc(var(--base-gap) * 1.5);

            position: absolute;
            left: 50%;
            top: 50%;

            z-index: 1000;

            outline: none;
            border: 3px solid var(--dialog-border-color);
            border-radius: calc(var(--base-radius) * 2);
            padding: calc(var(--base-gap) * 1.5);
            width: 250px;

            transform: translate(-50%, -50%);

            background-color: var(--dialog-bg-color);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19),
                0 6px 6px rgba(0, 0, 0, 0.23);

            text-align: center;
        }

        #dialog-theme-selection[aria-hidden='true'] {
            display: none;
        }

        label {
            color: var(--text-color-1);
            cursor: pointer;
        }

        .themes {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
            gap: calc(var(--base-gap) / 2);
            border: 1px solid var(--themes-border-color);
            border-radius: var(--base-radius);
            padding: calc(var(--base-gap) / 2);
        }

        .theme {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: calc(var(--base-gap) / 4);

            border-radius: var(--base-radius);
            padding: calc(var(--base-gap) / 2);

            text-transform: capitalize;
        }

        .circle-wrapper {
            display: grid;
            place-items: center;
            grid-template-areas: 'circle';
            width: 100%;
            max-width: 45px;
            aspect-ratio: 1;
        }

        .inner-circle {
            grid-area: circle;
            z-index: 1;

            background-color: var(--circle-bg-color);
            border-color: var(--circle-border-color);
        }

        .outer-circle {
            grid-area: circle;
            z-index: 0;

            border-radius: 50%;
            width: 50%;
            aspect-ratio: 1;

            background-color: var(--circle-wave);
            opacity: 0.1;
            transition: transform 0.4s cubic-bezier(0.54, 1.5, 0.38, 1.2);
        }

        .radio {
            cursor: pointer;
            border-radius: 50%;
            width: 60%;
            aspect-ratio: 1;

            border: 2px solid var(--circle-border-color);

            transition: transform 0.4s cubic-bezier(0.54, 1.5, 0.38, 1.2);
            outline: none;
        }

        .radio:hover + .outer-circle,
        .radio:focus + .outer-circle {
            transform: scale(2);
        }

        .radio[aria-checked='true'].inner-circle {
            /* background-color: var(--surface-3); */
            /* background-color: var(--circle-checked); */
            background-color: var(--circle-bg-color-checked);
        }

        .save-settings {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--base-gap);
        }

        .dialog-control {
            color: var(--text-color-1);
            transition: transform 50ms ease-in-out,
                background-color 100ms ease-in-out;
            background-color: var(--control-color);
        }

        .dialog-control:hover,
        .dialog-control:focus {
            background-color: var(--control-interaction-color);
        }

        #btn-close-dialog {
            cursor: pointer;

            border: none;
            border-radius: var(--base-radius);
            margin: 0 auto;
            padding: calc(var(--base-gap) / 2);
            width: 80%;

            text-transform: capitalize;
        }

        input[type='checkbox'] {
            position: absolute !important;
            height: 1px;
            width: 1px;
            overflow: hidden;
            clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
            clip: rect(1px, 1px, 1px, 1px);
        }

        input[type='checkbox'] + label {
            display: grid;
            align-items: center;
            gap: var(--base-gap);
            grid-template-areas: 'checkbox-cell label';
            grid-template-columns: auto 1fr;
        }

        input[type='checkbox'] + label:before {
            content: '';
            grid-area: checkbox-cell;
            border-radius: 2px;
            border: 1px solid var(--checkbox-border-color);
            width: 20px;
            height: 20px;
            background: var(--checkbox-bg-color);
        }

        input[type='checkbox']:checked + label:before {
            background: var(--checkbox-bg-color-checked);
        }

        input[type='checkbox']:checked + label::after {
            content: '';
            border-left: 2px solid var(--checkmark-color);
            border-bottom: 2px solid var(--checkmark-color);
            height: 5px;
            width: 12px;
            transform: rotate(-45deg);
            position: relative;
            left: 4px;
            grid-area: checkbox-cell;
            top: -2px;
        }

        input[type='checkbox']:focus + label::before {
            outline: var(--outline-color) solid 1px;
        }

        @media (prefers-reduced-motion: no-preference) {
            #read-more:active,
            #btn-close-dialog:active {
                transform: scale(0.95);
            }
        }
    `;
    /**
     * States ✨ + Decorators
     * ======================
     */
    // Used to toggle the dialog's visibility
    @state()
    private dialogHidden = false;
    // Represents radio buttons to select a theme
    @state()
    private themes: themeStateInterface[] = [];
    // If it's allowed to write to localStorage
    @state()
    private saveSelection = false;
    /**
     * Use availableThemes='["🐢", "🦕", "🐸"]' or don't
     * and rely on default themes
     */
    @property({type: Array}) availableThemes: string[] = [];
    // Buttons to select a theme
    @queryAll('button[role="radio"]')
    private themeButtons!: NodeListOf<HTMLButtonElement>;
    /**
     * Properties
     * ==========
     */

    // Reference to the element that opened the dialog
    private openerElementId!: string;
    // The index of the last radio button / theme
    private lastIndex: number = this.themes.length - 1;

    /**
     * Custom element lifecycle events
     * ===============================
     */

    /**
     * Invoked when a component is added to the document's DOM.
     */
    override connectedCallback(): void {
        super.connectedCallback();
        /**
         * Listen for special event to change the visibility of the component
         * and safe a reference to the element which has dispatched it
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
            // When this is done we are ready so focus the first element
            this.getTabElements()[0].focus();
        });
        // Read user settings from localStorage
        const preference = readSetting('theme-preference');
        const saveSelection = readSetting('save-selection');
        /**
         * Try reading a boolean value from localStorage
         */
        try {
            this.saveSelection = JSON.parse(saveSelection || '') as boolean;
        } catch (e) {
            this.saveSelection = false;
        }
        /**
         * If themes have been configured through
         * <theme-switch availableThemes='["🐢", "🦕", "🐸"]'></theme-switch>
         * upgrade those otherwise use the default ones
         */
        if (
            Array.isArray(this.availableThemes) &&
            this.availableThemes.length
        ) {
            // Themes are upgraded by adding keys
            this.themes = upgradeToTheme(this.availableThemes);
        } else {
            // Use the default themes if none are set
            this.themes = defaulThemes;
        }
        // Find the index in order to select a prefered theme
        const index = this.themes.findIndex(
            (themes) => themes.name === preference,
        );
        /**
         * Upgrade the related theme by using the index,
         * default to 0 if none was found
         */
        this.updateThemeState(index === -1 ? 0 : index);
        this.lastIndex = this.themes.length - 1;
    }
    /**
     * Invoked when a component is removed from the document's DOM.
     */
    override disconnectedCallback(): void {
        super.disconnectedCallback();
        removeEventListener(DialogEvent.eventName, () => {
            console.info(
                `${DialogEvent.eventName} has been removed as an EventListener`,
            );
        });
    }

    /**
     * Methods ✨
     * ===============
     */

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
     * Arrow keys need to be handled because non standard radion buttons are used
     */
    private handleArrowKeys(event: KeyboardEvent, currentIndex: number): void {
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                if (currentIndex !== 0) {
                    this.focusElement(this.themeButtons, currentIndex - 1);
                } else {
                    this.focusElement(this.themeButtons, this.lastIndex);
                }
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                if (currentIndex !== this.lastIndex) {
                    this.focusElement(this.themeButtons, currentIndex + 1);
                } else {
                    this.focusElement(this.themeButtons, 0);
                }
                break;
            default:
                break;
        }
    }
    /**
     * Get elements which should be accessible by using the tab key.
     * This needs to be done because non standard radio buttons are
     * used and the radio button which can be reached changes based
     * selection.
     */
    private getTabElements(): NodeListOf<HTMLElement> {
        return this.renderRoot.querySelectorAll(
            'a[href], input, button:not([tabindex="-1"])',
        );
    }
    /**
     * Used to focus on non standard radio buttons and other elements
     */
    private focusElement(nodes: NodeListOf<HTMLElement>, index: number) {
        nodes[index].focus();
    }

    override render() {
        return html`
            <div
                aria-hidden="true"
                tabindex="0"
                @focus="${() => {
                    const el = this.getTabElements();
                    const index = el.length - 1;
                    this.focusElement(el, index);
                }}"
            ></div>
            <div aria-hidden="${this.dialogHidden}" id="dialog-backdrop">
                <div
                    @keydown="${(event: KeyboardEvent) => {
                        if (event.key === 'Escape') {
                            this.closeDialog();
                        }
                    }}"
                    aria-hidden="${this.dialogHidden}"
                    aria-label="Theme-Selection"
                    aria-modal="true"
                    id="dialog-theme-selection"
                    role="dialog"
                    tabindex="-1"
                >
                    <div class="dialog-title">
                        <slot name="heading"></slot>
                        <slot name="sub-heading"></slot>
                    </div>

                    <div role="radiogroup" class="themes">
                        ${this.themes.map((theme, index) => {
                            return html`
                                <div class="theme">
                                    <div class="circle-wrapper">
                                        <button
                                            @click="${() => {
                                                // Update state
                                                this.updateThemeState(index);
                                                // Save selection if user has agreed to do so
                                                if (this.saveSelection) {
                                                    saveSetting(
                                                        'theme-preference',
                                                        theme.name,
                                                    );
                                                }
                                                // Send event which theme has been selected
                                                window.dispatchEvent(
                                                    new ThemeEvent(theme.name),
                                                );
                                            }}"
                                            @keydown="${(
                                                event: KeyboardEvent,
                                            ) => {
                                                this.handleArrowKeys(
                                                    event,
                                                    index,
                                                );

                                                if (event.key === 'Enter') {
                                                    this.updateThemeState(
                                                        index,
                                                    );
                                                }
                                            }}"
                                            aria-checked="${theme.checked}"
                                            class="radio inner-circle"
                                            id="${theme.name}"
                                            role="radio"
                                            tabindex=${theme.checked ? 0 : -1}
                                            title="${theme.name}-Theme aktivieren"
                                        ></button>
                                        <div class="outer-circle"></div>
                                    </div>

                                    <label for="${theme.name}">
                                        ${theme.name}
                                    </label>
                                </div>
                            `;
                        })}
                    </div>

                    <div class="save-settings">
                        <div>
                            <input
                                ?checked=${this.saveSelection}
                                @click=${() => {
                                    if (this.saveSelection === false) {
                                        const {name} = this.themes.filter(
                                            (theme) => theme.checked === true,
                                        )[0];
                                        saveSetting('save-selection', 'true');
                                        saveSetting('theme-preference', name);
                                    } else {
                                        deleteSetting('save-selection');
                                        deleteSetting('theme-preference');
                                    }

                                    this.saveSelection = !this.saveSelection;
                                }}
                                id="save-selection"
                                name="save-selection"
                                type="checkbox"
                            />
                            <label for="save-selection">
                                Auswahl speichern
                            </label>
                        </div>
                        <slot name="read-more"></slot>
                    </div>

                    <button
                        @click=${this.closeDialog}
                        class="dialog-control"
                        id="btn-close-dialog"
                        title="Dialog schließen"
                    >
                        Schließen
                    </button>
                </div>
                <div
                    @focus="${() => {
                        const el = this.getTabElements();
                        this.focusElement(el, 0);
                    }}"
                    aria-hidden="true"
                    tabindex="0"
                ></div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'theme-switch': ThemeSwitch;
    }
}
