---
layout: page.11ty.cjs
title: <theme-switch> ⌲ Home
---

# &lt;theme-switch>

`<theme-switch>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<theme-switch>` is just an HTML element. You can it anywhere you can use HTML!

```html
<theme-switch></theme-switch>
```

  </div>
  <div>

<theme-switch></theme-switch>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<theme-switch>` can be configured with attributed in plain HTML.

```html
<theme-switch name="HTML"></theme-switch>
```

  </div>
  <div>

<theme-switch name="HTML"></theme-switch>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<theme-switch>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name = 'lit-html';

render(
  html`
    <h2>This is a &lt;theme-switch&gt;</h2>
    <theme-switch .name=${name}></theme-switch>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;theme-switch&gt;</h2>
<theme-switch name="lit-html"></theme-switch>

  </div>
</section>
