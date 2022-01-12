# &lt;theme-switch> a web component build with Lit 🔥
Switch your theme with style

## About
&lt;theme-switch> is a modal dialog which enables users to switch between themes. 
It is build as a web compoment with [Lit](https://lit.dev/) by using this [this starter project](https://github.com/lit/lit-element-starter-ts).

### Features
- Configurable themes
- Close the dialog by pressing <kbd>Esc</kbd>
- Re-focus the element which has opened the dialog after closing it again
- Trap focus inside the dialog
- Select the next theme by using <kbd>Tab</kbd>, <kbd>&#8594;</kbd>, <kbd>&#8595;</kbd>
- Select the previous theme by using <kbd>Shift + Tab</kbd>, <kbd>&#8592;</kbd>, <kbd>&#8593;</kbd>
- Manage settings via `localStorage`
  - `save-selection`: `true` or `false`
  - `theme-preference`: a string value of the theme which is saved (e. g. `frog-green-theme`) 

## Prerequisites
Install Node with NPM.

## Installation
If you would like to use this component in your project, you can install it from [npm](https://www.npmjs.com/package/theme-switch-component)
```bash
npm i theme-switch-component
```

## Configuration
You can configure `<theme-switch>` by using the `availableThemes` property, three slots and some CSS variables. Its events are this components way of communicating with the host.

### Property `availableThemes` 

| Name             | Required | Values                                           | Default                                                                                                                                                                                                                          | Description                                                                           |
|------------------|----------|--------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| `availableThemes` | No       | Any string or emoji.<br>"light", "midnight", "🐸" | `"auto"`, `"light"`, `"dark"`<br><br>`auto`: use the current OS theme which is either a light or dark theme<br>`light`: usually light and friendly colors<br>`dark`: darker and more comfy shades to reduce eye strain (or to be cool) | These values<br>will be communicated<br>to anyone who listens <br>to the [ThemeEvent](#themeevent) |

### Slots

Slots are identified by their name attribute, and allow you to define placeholders in your template that can be filled with any markup fragment you want when the element is used in the markup.
These placeholder are meant to be used to display two headings and 
a _"read more"_ link but you could place anything you would like to.

| Name          | Meaning                                                                                                           | Example value                                                                                                |
|---------------|-------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| `heading`     | The "title" of the dialog                                                                                         | `<h2 slot="heading">Theme Selection</h2>`                                                              |
| `sub-heading` | Short explanation what this dialog does                                                                           | `<span slot="sub-heading">Choose a theme for your site</span>`                                  |
| `read-more`   | Can be used to point to your privacy statement<br>section to explain what values are saved by <br>this component. | `<a slot="read-more" href="/privacy-statement" target="_blank" title="What data will be saved?">?</a>` |                                 |

### Examples
Using the default values
```html
<theme-switch>
  <h2 slot="heading">Theme Selection</h2>
  <span slot="sub-heading">Choose a theme for your site</span>
  <a
    slot="read-more"
    href="/privacy-statement"
    id="read-more"
    target="_blank"
    title="What data will be saved?"
  >
    ? 
  </a>
</theme-switch>
```
Using your own set of themes
```html
<theme-switch availableThemes='["🐢", "🦕", "🐸"]'>
  <!-- Slots as above -->
</theme-switch>
```
### Events
#### `DialogEvent`
Used to open the dialog and reference the targetElement which has opened the dialog. This needs to be done to re-select the element after closing the dialog.
```javascript
class DialogEvent extends Event {
  static eventName = 'dialog-event';
  targetElement = '';

  constructor(targetElement) {
    super(DialogEvent.eventName, { bubbles: true });
    this.targetElement = targetElement;
  }
}
```
Define an EventListener to dispatch the event
```javascript
document
  .querySelector('#btn-theme-selection')
  .addEventListener('click', (event) => {
    const { target } = event;
    window.dispatchEvent(new DialogEvent(target));
  });
```
#### `ThemeEvent`
Transports the name of a theme so that a host can react to it accordingly. For example one could use it to set attributes or CSS classes.

```javascript
window.addEventListener('theme-event', (themeEvent) => {
  const { themeName } = themeEvent;

  document.documentElement.setAttribute('theme-preference', themeName);
});
```

### CSS variables

| Variable           | Purpose                                 | Default value          |
|--------------------|-----------------------------------------|------------------------|
| `--base-gap`       | Spacing for paddings, margins & gaps    | `8px`                  |
| `--base-radius`    | Border radius for different elements    | `8px`                  |
| `--blur-amount`    | Amount for blurring the dialog backdrop | `5px`                  |
| `--backdrop-color` | Color of the dialog backdrop            | `hsla(0, 0, 78%, 0.1)` |

## WIP: Defining a theme

## Setup

Install dependencies:

```bash
npm i
```

## Build

This project uses the TypeScript compiler to produce JavaScript that runs in modern browsers.

To build the JavaScript version of this component youd would need to run:

```bash
npm run build
```

To watch files and rebuild when the files are modified, run the following command in a separate shell:

```bash
npm run build:watch
```

Both the TypeScript compiler and lit-analyzer are configured to be very strict. You may want to change `tsconfig.json` to make them less strict.

## Dev Server

&lt;theme-switch> uses modern-web.dev's [@web/dev-server](https://www.npmjs.com/package/@web/dev-server) for previewing the project without additional build steps. Web Dev Server handles resolving Node-style "bare" import specifiers, which aren't supported in browsers. It also automatically transpiles JavaScript and adds polyfills to support older browsers. See [modern-web.dev's Web Dev Server documentation](https://modern-web.dev/docs/dev-server/overview/) for more information.

To run the dev server and open the project in a new browser tab:

```bash
npm run serve
```

There is a development HTML file located at `/dev/index.html` that you can view at http://localhost:8000/dev/index.html. Note that this command will serve your code using Lit's development mode (with more verbose errors). To serve your code against Lit's production mode, use `npm run serve:prod`.

## Editing

If you use VS Code, it is highly recommend to have the [lit-plugin extension](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin) installed, which enables some extremely useful features for lit-html templates:

- Syntax highlighting
- Type-checking
- Code completion
- Hover-over docs
- Jump to definition
- Linting
- Quick Fixes

The project is setup to recommend lit-plugin to VS Code users if they don't already have it installed.

## Linting

Linting of TypeScript files is provided by [ESLint](eslint.org) and [TypeScript ESLint](https://github.com/typescript-eslint/typescript-eslint). In addition, [lit-analyzer](https://www.npmjs.com/package/lit-analyzer) is used to type-check and lint lit-html templates with the same engine and rules as lit-plugin.

The rules are mostly the recommended rules from each project, but some have been turned off to make LitElement usage easier. The recommended rules are pretty strict, so you may want to relax them by editing `.eslintrc.json` and `tsconfig.json`.

To lint the project run:

```bash
npm run lint
```

## Formatting

[Prettier](https://prettier.io/) is used for code formatting. It has been pre-configured according to the Lit's style. You can change this in `.prettierrc.json`.

Prettier has not been configured to run when committing files, but this can be added with Husky and and `pretty-quick`. See the [prettier.io](https://prettier.io/) site for instructions.

To format the project run:
```bash
npm run format
```

## Static Site

This project includes a simple website generated with the [eleventy](11ty.dev) static site generator and the templates and pages in `/docs-src`. The site is generated to `/docs` and intended to be checked in so that GitHub pages can serve the site [from `/docs` on the main branch](https://help.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

To enable the site go to the GitHub settings and change the GitHub Pages &quot;Source&quot; setting to &quot;main branch /docs folder&quot;.</p>

To build the site, run:

```bash
npm run docs
```

To serve the site locally, run:

```bash
npm run docs:serve
```

To watch the site files, and re-build automatically, run:

```bash
npm run docs:watch
```

The site will usually be served at http://localhost:8000.

## Bundling and minification

This component doesn't include any build-time optimizations like bundling or minification. It is recommended to publish components
as unoptimized JavaScript modules, and performing build-time optimizations at the application level. This gives build tools the best chance to deduplicate code, remove dead code, and so on.

For information on building application projects that include LitElement components, see [Build for production](https://lit.dev/docs/tools/production/) on the Lit site or at the [open web components site](https://open-wc.org/docs/building/rollup/).

## Useful resources

- [Get started](https://lit.dev/docs/getting-started/) on the lit.dev site for more information.
- [Open Web Component scaffold generators](https://open-wc.org/docs/development/generator/) (an alternative for this starter project)
- [A11y Radio Button Design Pattern](https://www.w3.org/TR/2017/WD-wai-aria-practices-1.1-20170628/examples/radio/radio-1/radio-1.html)
- [A11y Pattern for modals & dialogs](https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/dialog.html)