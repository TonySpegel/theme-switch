/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, queryAll, state} from 'lit/decorators.js';

interface themeState {
    title: string;
    active: boolean;
}

/**
 * Custom element which helps switching themes.
 */
@customElement('theme-switch')
export class ThemeSwitch extends LitElement {
    static override styles = css`
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

            --base-gap: 8px;
            --base-radius: 8px;
        }

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

        #dialog-theme-selection {
            border: 1px solid darkorchid;
            border-radius: var(--base-radius);
            padding: var(--base-gap);
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: lightsteelblue;
        }

        #dialog-theme-selection[aria-hidden='true'] {
            display: none;
        }

        h2 {
            margin-top: 0;
        }

        .dialog-actions {
            padding: var(--base-gap) 0;
        }

        button[aria-pressed='true'] {
            background-color: red;
        }
    `;

    @state()
    private dialogHidden = false;
    @queryAll('button[role="radio"]')
    _themeButtons!: HTMLButtonElement[];

    @state()
    private themes: themeState[] = [
        {
            title: 'light',
            active: false,
        },
        {
            title: 'light',
            active: false,
        },
    ];

    constructor() {
        super();
        this.clicker.bind(this);
    }

    private toggle() {
        this.dialogHidden = !this.dialogHidden;
        if (this.dialogHidden) {
            document.querySelector('body')?.classList.remove('dialog-open');
        } else {
            document.querySelector('body')?.classList.add('dialog-open');
        }
    }

    private clicker(event: Event): void {
        const {target} = event;

        if (target !== null) {
            const buttonElement = target as HTMLButtonElement;

            if (buttonElement.getAttribute('role') === 'radio') {
                buttonElement.setAttribute('tabindex', '0');
            }
        }
    }

    private resetRadioButtonStates(): void {
        const states = this.themes;
        states.map((state) => (state.active = false));
        this.themes = states;
    }

    private manageRadioButton(i: number, active: boolean): void {
        this.resetRadioButtonStates();
        const states = this.themes;
        states[i].active = active;

        this.themes = states;
    }

    override render() {
        return html`
            <button
                @click=${() => this.toggle()}
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
            >
                <div class="dialog-title">
                    <h2>Theme Selection</h2>
                </div>

                <div role="radiogroup">
                    ${this.themes.map(
                        (theme, index) => html`
                            <button
                                @click="${() =>
                                    this.manageRadioButton(index, true)}"
                                aria-pressed="${theme.active}"
                                role="radio"
                                tabindex=${theme.active ? '0' : '-1'}
                            >
                                ${theme.title}
                            </button>
                        `
                    )}
                </div>

                <div class="dialog-actions">
                    <button @click=${() => this.toggle()}>Close</button>
                </div>
            </div>
            <!-- <slot></slot> -->
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'theme-switch': ThemeSwitch;
    }
}
