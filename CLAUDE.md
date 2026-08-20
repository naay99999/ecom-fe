# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server with HMR
npm run build     # production build (outputs to dist/)
npm run preview   # preview the production build locally
npm run lint      # ESLint over the whole repo
```

There is no test suite or test runner configured in this project.

Both `package-lock.json` and `bun.lock` are present; check which one has been updated most recently before installing/adding dependencies, and keep both in sync with whichever tool you use (`npm install` / `bun install`).

## Architecture

This is a JavaScript (not TypeScript) React 19 + Vite scaffold for an e-commerce storefront, styled with Tailwind CSS v4 and shadcn/ui.

- **Entry chain**: `src/main.jsx` → `src/providers.jsx` (wraps the app in `RouterProvider`) → `src/router.js`.
- **Routing**: `src/router.js` defines one `createBrowserRouter` tree rooted at `RootLayout`, with nested pathless layouts for `checkout/*` (`CheckoutLayout`) and `account/*` (`AccountLayout`), each rendering an `<Outlet />`. Add new routes by registering a page under the appropriate layout's `children` array, importing it at the top in the same grouped-comment style (`// pages — auth`, `// pages — orders`, etc.).
- **Pages vs layouts**: `src/pages/*` are route-level screens; `src/layouts/*` are structural wrappers that render `<Outlet />` (and, on `RootLayout`, `<ScrollRestoration />`). Most pages are currently stub placeholders (e.g. a single `<h1>`) — check a page's actual content before assuming it's fully implemented.
- **`src/features/`**: intended location for feature-scoped logic (e.g. `features/auth`), but currently empty/unimplemented — don't assume auth logic exists yet.
- **Path alias**: `@/*` maps to `src/*` (configured in both `vite.config.js` and `jsconfig.json`). Use `@/...` imports rather than deep relative paths, matching existing code.

### UI components (shadcn/ui on Base UI, not Radix)

- `components.json` sets `style: "base-nova"` — this project's shadcn components are built on **`@base-ui/react`, not Radix UI**. This changes several APIs from what most shadcn docs/examples (which target Radix) show:
  - Composition uses `render={<Component />}` instead of `asChild`.
  - When `render` swaps a trigger to a non-button element, pass `nativeButton={false}`.
  - `Select`, `ToggleGroup`, `Slider`, and `Accordion` have different prop shapes (e.g. `Select` needs an `items` prop; `ToggleGroup`/`Accordion` use a `multiple` boolean and always-array `defaultValue` instead of `type="single"|"multiple"`).
  - Full details are in `.agents/skills/shadcn/rules/base-vs-radix.md` (also symlinked at `.claude/skills/shadcn/`) — consult it before writing any Base UI component usage that differs from Radix idioms.
- New shadcn components go in `src/components/ui/`, following the existing pattern of `cva`-based `variants` + `cn()` (from `@/lib/utils`, wrapping `clsx` + `tailwind-merge`) for class merging.
- Icons come from `lucide-react` (per `components.json`'s `iconLibrary`).

### Styling

- Tailwind v4 is configured entirely via CSS in `src/styles/globals.css` (no `tailwind.config.js`) — it imports `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`, and the `Geist` variable font, then defines design tokens (colors, radii, sidebar/chart colors) in an `@theme inline` block backed by CSS custom properties. Dark mode is a `.dark` class variant (`@custom-variant dark (&:is(.dark *))`).
- Prefer editing/extending tokens in `globals.css` over introducing a separate Tailwind config.
