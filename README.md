# svelte-todomvc

**[todomvc.svelte.dev](https://todomvc.svelte.dev/)**

[TodoMVC](http://todomvc.com/) implemented in [Svelte](https://github.com/sveltejs/svelte).

## Migration to Svelte 5

- Upgraded to `svelte@^5` with fine‑grained reactivity using runes (`$state`, `$derived`, `$effect`).
- Replaced reactive statements (`$:`) with runes; side‑effects now use `$effect`.
- Component instantiation switched from `new Component(...)` to `mount(Component, { target })`.
- Vite config updated to latest plugin versions and added test configuration.
- Added tests using Vitest and `@testing-library/svelte`.

### Breaking changes

- `index.html` now mounts the app via `svelte.mount`.
- Reactive declarations in components use runes, not `$:`.
- Testing requires Node and Vite versions compatible with `@sveltejs/vite-plugin-svelte@^6` and `vitest@^4`.

### Development

- Run dev server: `npm run dev`
- Build: `npm run build`
- Tests: `npm test` or `npm run test:watch`
