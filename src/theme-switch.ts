/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, css, html} from 'lit';
import {customElement, queryAll, state} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';

interface themeStateInterface {
    title: string;
    checked: boolean;
}

/**
 * Custom element which helps switching themes.
 */
@customElement('theme-switch')
export class ThemeSwitch extends LitElement {
    static override styles = css`
        /**
         * Animations
         */
        @keyframes gradient {
            0% {
                background-position: 3% 50%;
            }
            50% {
                background-position: 97% 50%;
            }
            100% {
                background-position: 3% 50%;
            }
        }

        :host {
            display: block;
            font-family: Sans-Serif;

            --base-gap: 8px;
            --base-radius: 8px;
        }
        /**
         * Button which opens the dialog
         */
        #btn-theme-selection {
            border-radius: 50%;
            border: 2px solid hsla(281, 53%, 97%, 0.63);
            width: 25px;
            aspect-ratio: 1;

            cursor: pointer;

            background: linear-gradient(
                -45deg,
                hsla(281, 55%, 74%, 1),
                hsl(191, 98%, 56%),
                hsl(281, 60%, 25%),
                hsl(338, 78%, 48%)
            );

            background-size: 400% 400%;
            animation: gradient 10s ease infinite;
        }
        /**
         * Dialog
         */
        #dialog-theme-selection {
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

        #dialog-theme-selection[aria-hidden='true'] {
            display: none;
        }

        h2 {
            margin-top: 0;
            color: hsla(281, 100%, 21%, 1);
        }

        .dialog-actions {
            padding: var(--base-gap) 0;
        }

        .themes {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
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
     * Decorators
     * ==============================
     */
    @queryAll('button[role="radio"]')
    private themeButtons!: HTMLButtonElement[];
    /**
     * States ✨
     * ===============
     */
    @state()
    private dialogHidden = false;

    @state()
    private themes: themeStateInterface[] = [
        {title: 'auto', checked: true},
        {title: 'day', checked: false},
        {title: 'night', checked: false},
        {title: 'ocean', checked: false},
    ];

    private lastIndex: number = this.themes.length - 1;

    /**
     * Methods ✨
     * ===============
     */

    private toggleDialog() {
        this.dialogHidden = !this.dialogHidden;
        if (this.dialogHidden) {
            document.querySelector('body')?.classList.remove('dialog-open');
        } else {
            document.querySelector('body')?.classList.add('dialog-open');
        }
    }

    private updateViaIndex(index: number): void {
        const themesCopy = [...this.themes];
        themesCopy.forEach((theme) => (theme.checked = false));
        themesCopy[index].checked = true;

        this.themes = themesCopy;
    }

    // WIP for onKeyDown
    private handleKeyboard(event: KeyboardEvent, currentIndex: number) {
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
                this.updateViaIndex(currentIndex);
                break;
            default:
                break;
        }

        return '';
    }

    override render() {
        return html`
            <button
                @click=${this.toggleDialog}
                aria-label="open theme-selection"
                id="btn-theme-selection"
                title="open theme-Selection"
            ></button>
            <div
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
                                        @click="${() =>
                                            this.updateViaIndex(index)}"
                                        @keydown="${(event: KeyboardEvent) =>
                                            this.handleKeyboard(event, index)}"
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

                <div class="dialog-actions">
                    <button @click=${() => this.toggleDialog()}>Close</button>
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
