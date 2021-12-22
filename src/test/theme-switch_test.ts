/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {ThemeSwitch} from '../theme-switch.js';

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('theme-switch', () => {
    test('is defined', () => {
        const el = document.createElement('theme-switch');
        assert.instanceOf(el, ThemeSwitch);
    });

    test('renders with default values', async () => {
        const el = await fixture(html`<theme-switch></theme-switch>`);
        assert.shadowDom.equal(
            el,
            `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
        );
    });

    test('renders with a set name', async () => {
        const el = await fixture(html`<theme-switch></theme-switch>`);
        assert.shadowDom.equal(
            el,
            `
      <h1>Hello, Test!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
        );
    });

    test('handles a click', async () => {
        const el = (await fixture(
            html`<theme-switch></theme-switch>`
        )) as ThemeSwitch;
        const button = el.shadowRoot!.querySelector('button')!;
        button.click();
        await el.updateComplete;
        assert.shadowDom.equal(
            el,
            `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 1</button>
      <slot></slot>
    `
        );
    });

    test('styling applied', async () => {
        const el = (await fixture(
            html`<theme-switch></theme-switch>`
        )) as ThemeSwitch;
        await el.updateComplete;
        assert.equal(getComputedStyle(el).paddingTop, '16px');
    });
});
