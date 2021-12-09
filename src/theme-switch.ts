/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

// const savePreference = (theme: string): void => {
//     localStorage.setItem('theme-preference', theme);
// };

/**
 * Custom element which helps switching themes.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('theme-switch')
export class ThemeSwitch extends LitElement {
    static override styles = css`
        :host {
            display: block;
            border: solid 1px gray;
            padding: calc(var(--base-gap));
            min-width: 340px;

            --base-gap: 8px;
            --base-radius: 8px;
        }

        #btn-theme-selection {
            border-radius: 50%;
            width: 25px;
            aspect-ratio: 1;

            color: var(--color, var(--color));
        }

        #dialog-theme-selection {
            border: 1px solid darkorchid;
            border-radius: var(--base-radius);
            padding: var(--base-gap);
        }

        #dialog-theme-selection[aria-hidden='true'] {
            display: none;
        }
    `;

    /**
     * The name to say "Hello" to.
     */
    @property({type: String})
    name = 'World';

    /**
     * The number of times the button has been clicked.
     */
    @property({type: Number})
    count = 0;

    @state()
    private dialogHidden = true;

    override render() {
        return html`
            <!-- <h1>${this.sayHello(this.name)}!</h1>
            <button @click=${this._onClick} part="button">
                Click Count: ${this.count}
            </button> -->

            <button
                @click=${() => (this.dialogHidden = !this.dialogHidden)}
                aria-label="Theme-Auswahl öffnen"
                id="btn-theme-selection"
                title="Theme-Auswahl öffnen"
            ></button>
            <div
                aria-hidden="${this.dialogHidden}"
                aria-label="Theme-Auswahl"
                aria-modal="true"
                id="dialog-theme-selection"
                role="dialog"
            >
                <input type="radio" name="themes" value="day" />
                <input type="radio" name="themes" value="night" />
                <span>Dialog Content</span>
            </div>
            <!-- <slot></slot> -->
        `;
    }

    private _onClick() {
        this.count++;
        this.dispatchEvent(new CustomEvent('count-changed'));
    }

    /**
     * Formats a greeting
     * @param name The name to say "Hello" to
     */
    sayHello(name: string): string {
        return `Hello, ${name}`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'theme-switch': ThemeSwitch;
    }
}
