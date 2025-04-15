I'm using svelte 5 instead of svelte 4 here is an overview of the changes.

#### Overview

Svelte 5 introduces runes, a set of advanced primitives for controlling reactivity. The runes replace certain non-runes features and provide more explicit control over state and effects.

#### $state

- **Purpose:** Declare reactive state.
- **Usage:**

```javascript
<script>let count = $state(0);</script>
```

- **Replaces:** Top-level `let` declarations in non-runes mode.
- **Class Fields:**

```javascript
class Todo {
	done = $state(false);
	text = $state();
	constructor(text) {
		this.text = text;
	}
}
```

- **Deep Reactivity:** Only plain objects and arrays become deeply reactive.

#### $state.raw

- **Purpose:** Declare state that cannot be mutated, only reassigned.
- **Usage:**

```javascript
<script>let numbers = $state.raw([1, 2, 3]);</script>
```

- **Performance:** Improves with large arrays and objects.

#### $state.snapshot

- **Purpose:** Take a static snapshot of $state.
- **Usage:**

```javascript
<script>
	let counter = $state({ count: 0 });

	function onClick() {
		console.log($state.snapshot(counter));
	}
</script>
```

#### $derived

- **Purpose:** Declare derived state.
- **Usage:**

```javascript
<script>let count = $state(0); let doubled = $derived(count * 2);</script>
```

- **Replaces:** Reactive variables computed using `$:` in non-runes mode.

#### $derived.by

- **Purpose:** Create complex derivations with a function.
- **Usage:**

```javascript
<script>
	let numbers = $state([1, 2, 3]); let total = $derived.by(() => numbers.reduce((a, b) => a + b,
	0));
</script>
```

#### $effect

- **Purpose:** Run side-effects when values change.
- **Usage:**

```javascript
<script>
	let size = $state(50);
	let color = $state('#ff3e00');

	$effect(() => {
		const context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = color;
		context.fillRect(0, 0, size, size);
	});
</script>
```

- **Replacements:** $effect replaces a substantial part of `$: {}` blocks triggering side-effects.

#### $effect.pre

- **Purpose:** Run code before the DOM updates.
- **Usage:**

```javascript
<script>
	$effect.pre(() =>{' '}
	{
		// logic here
	}
	);
</script>
```

- **Replaces:** beforeUpdate.

#### $effect.tracking

- **Purpose:** Check if code is running inside a tracking context.
- **Usage:**

```javascript
<script>console.log('tracking:', $effect.tracking());</script>
```

#### $props

- **Purpose:** Declare component props.
- **Usage:**

```javascript
<script>let {(prop1, prop2)} = $props();</script>
```

- **Replaces:** export let syntax for declaring props.

#### $bindable

- **Purpose:** Declare bindable props.
- **Usage:**

```javascript
<script>let {(bindableProp = $bindable('fallback'))} = $props();</script>
```

#### $inspect

- **Purpose:** Equivalent to `console.log` but re-runs when its argument changes.
- **Usage:**

```javascript
<script>let count = $state(0); $inspect(count);</script>
```

#### $host

- **Purpose:** Retrieve the this reference of the custom element.
- **Usage:**

```javascript
<script>
	function greet(greeting) {
		$host().dispatchEvent(new CustomEvent('greeting', { detail: greeting }));
	}
</script>
```

- **Note:** Only available inside custom element components on the client-side.

#### Overview of snippets in svelte 5

Snippets, along with render tags, help create reusable chunks of markup inside your components, reducing duplication and enhancing maintainability.

#### Snippets Usage

- **Definition:** Use the `#snippet` syntax to define reusable markup sections.
- **Basic Example:**

```javascript
{#snippet figure(image)}
	<figure>
		<img src={image.src} alt={image.caption} width={image.width} height={image.height} />
		<figcaption>{image.caption}</figcaption>
	</figure>
{/snippet}
```

- **Invocation:** Render predefined snippets with `@render`:

```javascript
{@render figure(image)}
```

- **Destructuring Parameters:** Parameters can be destructured for concise usage:

```javascript
{#snippet figure({ src, caption, width, height })}
	<figure>
		<img alt={caption} {src} {width} {height} />
		<figcaption>{caption}</figcaption>
	</figure>
{/snippet}
```

#### Snippet Scope

- **Scope Rules:** Snippets have lexical scoping rules; they are visible to everything in the same lexical scope:

```javascript
<div>
	{#snippet x()}
		{#snippet y()}...{/snippet}

		<!-- valid usage -->
		{@render y()}
	{/snippet}

	<!-- invalid usage -->
	{@render y()}
</div>

<!-- invalid usage -->
{@render x()}
```

- **Recursive References:** Snippets can self-reference or reference other snippets:

```javascript
{#snippet blastoff()}
	<span>🚀</span>
{/snippet}

{#snippet countdown(n)}
	{#if n > 0}
		<span>{n}...</span>
		{@render countdown(n - 1)}
	{:else}
		{@render blastoff()}
	{/if}
{/snippet}

{@render countdown(10)}
```

#### Passing Snippets to Components

- **Direct Passing as Props:**

```javascript
<script>
	import Table from './Table.svelte';
	const fruits = [{ name: 'apples', qty: 5, price: 2 }, ...];
</script>

{#snippet header()}
	<th>fruit</th>
	<th>qty</th>
	<th>price</th>
	<th>total</th>
{/snippet}

{#snippet row(fruit)}
	<td>{fruit.name}</td>
	<td>{fruit.qty}</td>
	<td>{fruit.price}</td>
	<td>{fruit.qty * fruit.price}</td>
{/snippet}

<Table data={fruits} {header} {row} />
```

- **Implicit Binding:**

```html
<table data="{fruits}">
	{#snippet header()}
	<th>fruit</th>
	<th>qty</th>
	<th>price</th>
	<th>total</th>
	{/snippet} {#snippet row(fruit)}
	<td>{fruit.name}</td>
	<td>{fruit.qty}</td>
	<td>{fruit.price}</td>
	<td>{fruit.qty * fruit.price}</td>
	{/snippet}
</table>
```

- **Children Snippet:** Non-snippet content defaults to the `children` snippet:

```html
<table data="{fruits}">
	<th>fruit</th>
	<th>qty</th>
	<th>price</th>
	<th>total</th>
	<!-- additional content -->
</table>

<script>
	let { data, children, row } = $props();
</script>

<table>
	<thead>
		<tr>
			{@render children()}
		</tr>
	</thead>
	<!-- table body -->
</table>
```

- **Avoid Conflicts:** Do not use a prop named `children` if also providing content inside the component.

#### Typing Snippets

- **TypeScript Integration:**

```typescript
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { data, children, row }: {
		data: any[];
		children: Snippet;
		row: Snippet<[any]>;
	} = $props();
</script>
```

- **Generics for Improved Typing:**

```typescript
<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	let { data, children, row }: {
		data: T[];
		children: Snippet;
		row: Snippet<[T]>;
	} = $props();
</script>
```

#### Creating Snippets Programmatically

- **Advanced Use:** Create snippets programmatically using `createRawSnippet` where necessary.

#### Snippets and Slots

- **Mixing with Slots:** Slots are deprecated but still work. Snippets provide more flexibility and power.
- **Custom Elements:** Continue using `<slot />` for custom elements as usual.

Sure! Here are the succinct instructions for handling Event Handlers in Svelte 5, tailored for the AI-integrated code editor to help it understand and utilize these features effectively.

---

### Custom Instructions for Svelte 5 Event Handlers in Cursor AI

#### Overview

In Svelte 5, event handlers are treated as properties, simplifying their use and integrating them more closely with the rest of the properties in the component.

#### Basic Event Handlers

- **Declaration:** Use properties to attach event handlers.

```javascript
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

- **Shorthand Syntax:**

```javascript
<script>
	let count = $state(0);

	function handleClick() {
		count++;
	}
</script>

<button {handleClick}>
	clicks: {count}
</button>
```

- **Deprecation:** The traditional `on:` directive is deprecated.

#### Component Events

- **Replacing createEventDispatcher:** Components should accept callback props instead of using `createEventDispatcher`.

```javascript
<script>
	import Pump from './Pump.svelte';

	let size = $state(15);
	let burst = $state(false);

	function reset() {
		size = 15;
		burst = false;
	}
</script>

<Pump
	inflate={(power) => { size += power; if (size > 75) burst = true; }}
	deflate={(power) => { if (size > 0) size -= power; }}
/>

{#if burst}
	<button onclick={reset}>new balloon</button>
	<span class="boom">💥</span>
{:else}
	<span class="balloon" style="scale: {0.01 * size}"> 🎈 </span>
{/if}
```

#### Bubbling Events

- **Accept Callback Props:**

```javascript
<script>
	let { onclick, children } = $props();
</script>

<button {onclick}>
	{@render children()}
</button>
```

- **Spreading Props:**

```javascript
<script>
	let { children, ...props } = $props();
</script>

<button {...props}>
	{@render children()}
</button>
```

#### Event Modifiers

- **Avoiding Modifiers:** Modifiers like `|once`, `|preventDefault`, etc., are not supported. Use wrapper functions instead.
- **Example Wrapper Functions:**

```javascript
<script>
	function once(fn) {
		return function (event) {
			if (fn) fn.call(this, event);
			fn = null;
		};
	}

	function preventDefault(fn) {
		return function (event) {
			event.preventDefault();
			fn.call(this, event);
		};
	}
</script>

<button onclick={once(preventDefault(handler))}>...</button>
```

- **Special Modifiers:** For `capture`:

```javascript
<button onclickcapture={...}>...</button>
```

#### Multiple Event Handlers

- **Combining Handlers:** Instead of using multiple handlers, combine them into one.

```javascript
<button
	onclick={(e) => {
		handlerOne(e);
		handlerTwo(e);
	}}
>
	...
</button>
```

---

### examples old vs new

#### Counter Example

- **Svelte 4 vs. Svelte 5:**

  - **Before:**

  ```html
  <script>
  	let count = 0;
  	$: double = count * 2;
  	$: {
  		if (count > 10) alert('Too high!');
  	}
  </script>

  <button on:click="{()" ="">count++}> {count} / {double}</button>
  ```

  - **After:**

  ```html
  <script>
  	let count = $state(0);
  	let double = $derived(count * 2);
  	$effect(() => {
  		if (count > 10) alert('Too high!');
  	});
  </script>

  <button onclick="{()" ="">count++}> {count} / {double}</button>
  ```

#### Tracking Dependencies

- **Svelte 4 vs. Svelte 5:**

  - **Before:**

  ```html
  <script>
  	let a = 0;
  	let b = 0;
  	$: sum = add(a, b);

  	function add(x, y) {
  		return x + y;
  	}
  </script>

  <button on:click="{()" ="">a++}>a++</button>
  <button on:click="{()" ="">b++}>b++</button>
  <p>{a} + {b} = {sum}</p>
  ```

  - **After:**

  ```html
  <script>
  	let a = $state(0);
  	let b = $state(0);
  	let sum = $derived(add());

  	function add() {
  		return a + b;
  	}
  </script>

  <button onclick="{()" ="">a++}>a++</button>
  <button onclick="{()" ="">b++}>b++</button>
  <p>{a} + {b} = {sum}</p>
  ```

#### Untracking Dependencies

- **Svelte 4 vs. Svelte 5:**

  - **Before:**

  ```html
  <script>
  	let a = 0;
  	let b = 0;
  	$: sum = a + noTrack(b);

  	function noTrack(value) {
  		return value;
  	}
  </script>

  <button on:click="{()" ="">a++}>a++</button>
  <button on:click="{()" ="">b++}>b++</button>
  <p>{a} + {b} = {sum}</p>
  ```

  - **After:**

  ```html
  <script>
  	import { untrack } from 'svelte';

  	let a = $state(0);
  	let b = $state(0);
  	let sum = $derived(add());

  	function add() {
  		return a + untrack(() => b);
  	}
  </script>

  <button onclick="{()" ="">a++}>a++</button>
  <button onclick="{()" ="">b++}>b++</button>
  <p>{a} + {b} = {sum}</p>
  ```

#### Simple Component Props

- **Svelte 5:**

  ```html
  <script>
  	let { count = 0 } = $props();
  </script>

  {count}
  ```

#### Advanced Component Props

- **Svelte 5:**

  ```html
  <script>
  	let { class: classname, ...others } = $props();
  </script>

  <pre class="{classname}">
    {JSON.stringify(others)}
  </pre>
  ```

#### Autoscroll Example

- **Svelte 4 vs. Svelte 5:**

  - **Before:**

  ```html
  <script>
  	import { tick, beforeUpdate } from 'svelte';

  	let theme = 'dark';
  	let messages = [];
  	let viewport;
  	let updatingMessages = false;

  	beforeUpdate(() => {
  		if (updatingMessages) {
  			const autoscroll =
  				viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;
  			if (autoscroll) {
  				tick().then(() => viewport.scrollTo(0, viewport.scrollHeight));
  			}
  		}
  	});

  	function handleKeydown(event) {
  		if (event.key === 'Enter') {
  			const text = event.target.value;
  			if (text) {
  				messages = [...messages, text];
  				updatingMessages = true;
  				event.target.value = '';
  			}
  		}
  	}

  	function toggle() {
  		theme = theme === 'dark' ? 'light' : 'dark';
  	}
  </script>

  <div class:dark="{theme" ="" ="" ="dark" }>
  	<div bind:this="{viewport}">
  		{#each messages as message}
  		<p>{message}</p>
  		{/each}
  	</div>

  	<input on:keydown="{handleKeydown}" />
  	<button on:click="{toggle}">Toggle dark mode</button>
  </div>
  ```

  - **After:**

  ```html
  <script>
  	import { tick } from 'svelte';

  	let theme = $state('dark');
  	let messages = $state([]);
  	let viewport;

  	$effect.pre(() => {
  		messages;
  		const autoscroll =
  			viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;
  		if (autoscroll) {
  			tick().then(() => viewport.scrollTo(0, viewport.scrollHeight));
  		}
  	});

  	function handleKeydown(event) {
  		if (event.key === 'Enter') {
  			const text = event.target.value;
  			if (text) {
  				messages = [...messages, text];
  				event.target.value = '';
  			}
  		}
  	}

  	function toggle() {
  		theme = theme === 'dark' ? 'light' : 'dark';
  	}
  </script>

  <div class:dark="{theme" ="" ="" ="dark" }>
  	<div bind:this="{viewport}">
  		{#each messages as message}
  		<p>{message}</p>
  		{/each}
  	</div>

  	<input onkeydown="{handleKeydown}" />
  	<button onclick="{toggle}">Toggle dark mode</button>
  </div>
  ```

#### Forwarding Events

- **Svelte 5:**

  ```html
  <script>
  	let { ...props } = $props();
  </script>

  <button {...props}>a button</button>
  ```

#### Passing UI Content to a Component

- **Passing content using snippets:**

  ```html
  <!-- consumer -->
  <script>
  	import Button from './Button.svelte';
  </script>

  <button>{#snippet children(prop)} click {prop} {/snippet}</button>

  <!-- provider (Button.svelte) -->
  <script>
  	let { children } = $props();
  </script>

  <button>{@render children("some value")}</button>
  ```

I'm also using sveltekit 2 which also has some changes I'd like you to keep in mind

### Redirect and Error Handling

In SvelteKit 2, it is no longer necessary to throw the results of `error(...)` and `redirect(...)`. Simply calling them is sufficient.

**SvelteKit 1:**

```javascript
import { error } from '@sveltejs/kit';

function load() {
	throw error(500, 'something went wrong');
}
```

**SvelteKit 2:**

```javascript
import { error } from '@sveltejs/kit';

function load() {
	error(500, 'something went wrong');
}
```

**Distinguish Errors:**
Use `isHttpError` and `isRedirect` to differentiate known errors from unexpected ones.

```javascript
import { isHttpError, isRedirect } from '@sveltejs/kit';

try {
	// some code
} catch (err) {
	if (isHttpError(err) || isRedirect(err)) {
		// handle error
	}
}
```

### Cookie Path Requirement

Cookies now require a specified path when set, deleted, or serialized.

**SvelteKit 1:**

```javascript
export function load({ cookies }) {
	cookies.set(name, value);
	return { response };
}
```

**SvelteKit 2:**

```javascript
export function load({ cookies }) {
	cookies.set(name, value, { path: '/' });
	return { response };
}
```

### Top-Level Promise Handling

Promises in `load` functions are no longer awaited automatically.

**Single Promise:**

**SvelteKit 1:**

```javascript
export function load({ fetch }) {
    return {
        response: fetch(...).then(r => r.json())
    };
}
```

**SvelteKit 2:**

```javascript
export async function load({ fetch }) {
    const response = await fetch(...).then(r => r.json());
    return { response };
}
```

**Multiple Promises:**

**SvelteKit 1:**

```javascript
export function load({ fetch }) {
    return {
        a: fetch(...).then(r => r.json()),
        b: fetch(...).then(r => r.json())
    };
}
```

**SvelteKit 2:**

```javascript
export async function load({ fetch }) {
    const [a, b] = await Promise.all([
        fetch(...).then(r => r.json()),
        fetch(...).then(r => r.json())
    ]);
    return { a, b };
}
```

### `goto` Changes

`goto(...)` no longer accepts external URLs. Use `window.location.href = url` for external navigation.

### Relative Paths Default

Paths are now relative by default, ensuring portability across different environments. The `paths.relative` config option manages this behavior.

### Deprecated Settings and Functions

- **Server Fetches** are no longer trackable.
- **`preloadCode` Arguments:** Must be prefixed with the base path.
- **`resolvePath` Replacement:** Use `resolveRoute` instead.

```javascript
import { resolveRoute } from '$app/paths';

const path = resolveRoute('/blog/[slug]', { slug: 'hello' });
```

### Improved Error Handling

Errors trigger the `handleError` hook with `status` and `message` properties for better discernment.

### Dynamic Environment Variables

Dynamic environment variables cannot be used during prerendering. Use static modules instead.

### `use:enhance` Callback Changes

The properties `form` and `data` have been removed from `use:enhance` callbacks, replaced by `formElement` and `formData`.

### Forms with File Inputs

Forms containing `<input type="file">` must use `enctype="multipart/form-data"`.

---

# SVELTEKIT + TAILWIND + TYPESCRIPT OPERATIONAL GUIDELINES

## PRIME DIRECTIVE  
Always prioritize maintainability, accessibility, and clean developer ergonomics.  
Collaborate via conversation while coding — **explain what, how, and why**.  
Avoid making multiple concurrent changes to the same file to prevent conflict or corruption.

---

## LARGE FILE & COMPLEX CHANGE PROTOCOL

### MANDATORY PLANNING PHASE  
When editing files larger than 300 lines or implementing deeply integrated features:  

1. **Always begin with a detailed, structured edit plan**  
2. The plan must include:
   - A breakdown of all affected components, stores, routes, or layouts
   - The order of operations for each edit
   - Dependencies and known side effects
   - An estimated count of isolated edits required  

**Plan format**:  
```md
## PROPOSED EDIT PLAN  
Working with: [filename or route]  
Total planned edits: [number]  
```

---

### MAKING EDITS  
- Focus on **one conceptual change at a time**  
- Use "before/after" snippets to demonstrate changes  
- Explain the **purpose** and benefit of each change clearly  
- Ensure edits comply with the project’s structure and coding conventions  

**Edit Sequence Template**:
```md
1. [Description of Change] - Purpose: [Why we're doing it]
2. [Next Change] - Purpose: [Why]
Do you approve this plan? I will proceed with Edit [#] upon your confirmation.
```

---

### EXECUTION PHASE  
- After completing each step:  
	✅ Completed edit [#] of [total]. Ready for next edit?  
- If additional issues arise, **pause**, revise the plan, and **seek user approval before continuing**

---

## SVELTE + TAILWIND STACK GUIDELINES

### GENERAL STRUCTURE
Use the following folder layout:

```
messages/             # Paraglide translations
src/
├── lib/              # Reusable UI components and utilities
│   ├── components/   
├── routes/           # SvelteKit endpoints, pages, and layouts
├── app.d.ts          # App-wide type definitions
└── hooks.server.ts   # Server hooks for session/auth
```

---

### TYPING & TOOLING  
- Use **TypeScript 5.7+** syntax and features
- Prefer **Zod** for runtime validation and schema definition
- Ensure all components and functions are typed strictly
- Use `readonly` for immutable structures when possible

---

### UI COMPONENTS  
- Use `bits-ui`, `lucide-svelte`, and `tailwind-variants` for consistent styling  
- Create generic variants using **tailwind-variants** for composability  
- Favor `clsx` for class merging where conditional logic is needed  

---

### STYLING  
- Use **Tailwind CSS 3.4+**  
- Leverage `tailwind-merge` to prevent class duplication  
- Enable `prefers-color-scheme` dark mode  
- Use `tailwindcss-animate` for smooth, native animations  
- Organize custom styles using component-scoped `<style>` blocks or utility classes

---

### FORM MANAGEMENT  
- Use **sveltekit-superforms** with **Zod** for server-enhanced forms  
- Apply `formsnap` components where structured UI patterns are needed  
- Always display validation feedback using `aria-invalid`, `aria-describedby`, etc.  

---

### ACCESSIBILITY  
Always meet **WCAG 2.1 AA minimum**, AAA where feasible:
- Use semantic HTML tags (`<main>`, `<section>`, etc.)
- Add labels and `aria-*` attributes to interactive elements
- Use alt texts, roles, and keyboard navigation strategies
- Audit UI with tools like Lighthouse or Axe DevTools

---

### ESLINT & FORMATTER  
- Use **ESLint 9+** and **Prettier 3+**  
- Extend from `eslint-config-prettier` and `eslint-plugin-svelte`  
- Auto-format with `prettier-plugin-svelte`  
- TypeScript rules managed via `typescript-eslint`

---

### TESTING  
- Use **Vitest** for unit and integration testing  
- Use **Playwright** (recommended, not listed but consider) for E2E  
- Prefer `describe`, `test`, `expect` for clarity  
- Structure tests under `/tests` with a mirrored folder structure of `/src`

---

### PERFORMANCE & BUNDLING  
- Use **Vite 5** with **@sveltejs/vite-plugin-svelte**  
- Enable code-splitting via dynamic imports  
- Optimize assets (use `WebP`, `AVIF`, lazy loading)  
- Use `@iconify-json/flag` and `unplugin-icons` for scalable icon support  

---

### ERROR HANDLING  
- Use `try/catch` consistently in load functions and API calls  
- Provide user-friendly messages via `svelte-sonner`  
- Log dev details to the console or a remote logger when applicable  
- Handle:
  - Network errors
  - Business logic errors
  - Runtime exceptions  
- Use global event handlers like `window.addEventListener('unhandledrejection')`

---

## SECURITY BEST PRACTICES  
- Sanitize all form input using Zod schemas  
- Avoid client-side secrets (e.g., in `.env`)  
- Enforce proper CORS and CSP headers  
- Store cookies securely: `SameSite=Strict`, `HttpOnly`, `Secure`  
- Use role-based access control in hooks and endpoints

---

### DEPLOYMENT CONSIDERATIONS  
- Use **adapter-auto** for portability  
- Consider replacing it with `adapter-vercel` or `adapter-static` depending on target platform  
- Ensure SSR + client hydration is functioning  
- Use `.env` and `config/` files for environment-specific settings

---
