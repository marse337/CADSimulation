# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CADSimulation is an interactive UI mockup for "Common Agent Desktop" (v3.6.0) - an enterprise customer service and job management application. It demonstrates navigation flows and interactive states for 3 departments (CR/CS/CRSE), 3 environments (Stage/Training/Production), and 4 customer types (AlarmDotCom/NonAlarm/Cancelled/AuthorizedDealer).

## Commands

```bash
# Build (required after editing any slide or src/ file)
node build.js

# Test
npm install                                    # First time only
npm test                                       # Build + run all tests
npx playwright test tests/slides.spec.js       # Run specific test file
npx playwright test -g "Contract Info"         # Run tests matching name pattern
npx playwright test --headed                   # Run with visible browser
npx playwright show-report                     # View HTML test report

# Run
# Open index.html directly in a web browser. No server required.
```

**Do not edit `index.html` directly** — it is auto-generated. Edit source files in `src/` and `slides/`, then run `node build.js`.

## Configuration

Version and app-wide settings live in `js/config.js` (`window.AppConfig`). To update the version, edit **only** this file — the sidebar component reads it automatically.

## Architecture

### Build System

`build.js` (zero dependencies) assembles `index.html` from `src/header.html` + `slides/*.html` (sorted numerically) + `src/footer.html`. It auto-updates the slide indicator total count and validates the slide count matches `<section>` tag count.

### Slide Files

Slides live under `slides/`, named `{NN}-{DataTitle}.html` (e.g., `01-LoggedIn.html`, `34-JobManagementCRSE.html`). Each contains a `<section class="slide" data-title="...">` element. Currently 35 slides.

### Adding a New Slide

1. Create `slides/{NN}-{DataTitle}.html` with a `<section class="slide" data-title="{DataTitle}">` element. The numeric prefix determines sort order.
2. If the slide needs custom styles, create `css/slides/{nn}-{name}.css` and add a `<link>` tag in `src/header.html` (in the slide-specific styles section).
3. If the slide needs new JS behavior, create a file in `js/`, export via `window.*`, and add a `<script>` tag in `src/footer.html` (deferred, before `main.js`). Wire initialization in `js/main.js` if needed.
4. Run `node build.js` — the slide indicator total updates automatically.
5. Update navigation: set `data-goto` attributes on buttons in adjacent slides to link to/from the new slide (1-indexed).
6. Update test expectations in `tests/slides.spec.js` if slide count or structure changed.

### Adding New CSS or JS Files

New CSS files must be manually linked in `src/header.html`. New JS files must be manually added to `src/footer.html` — the build system only concatenates slides, it does not auto-discover CSS/JS.

**JS load order matters in `src/footer.html`:**
- **Immediate (no defer):** `js/config.js` first, then component files (`component-renderer.js`, `sidebar.js`, `topbar.js`, `tabs.js`) — must exist before `DOMContentLoaded`
- **Deferred:** All application modules, then `main.js` last

### Module System

All JS uses the IIFE pattern with `window.*` global exports (no ES modules or bundler). Script load order in `src/footer.html` matters (see above).

**Initialization order** (in `js/main.js`):
1. `ComponentRenderer.renderAll()` — replaces `data-component` placeholders with rendered HTML
2. `SlideNavigation.init()` — binds slide navigation after components exist in DOM
3. `EnvironmentSwitcher.init()` — theme switching (stage/training/production)
4. `DepartmentSwitcher.init()` — department switching (cr/cs/crse)

### Component System

Reusable components (sidebar, topbar, tabs) are declared as placeholder `<div>` elements with `data-component` and configured via `data-*` attributes:

```html
<div data-component="sidebar"
     data-active-nav="lookup"
     data-disabled-nav='["alarm","voziq"]'
     data-nav-goto='{"myaccount":"31","support":"30"}'></div>
```

`ComponentRenderer` (`js/components/component-renderer.js`) finds all `[data-component]` elements, parses their `data-*` attributes (kebab-case → camelCase, with JSON auto-parsing), calls the registered render function, and replaces the placeholder with the returned HTML.

### Slide Navigation

- Navigation buttons: `data-prev`, `data-next`, `data-goto="slideNumber"` (1-indexed)
- Click-zone navigation: `data-goto-on-click="slideNumber"` with optional `data-goto-trigger="selector"`
- Conditional navigation: `data-goto-market-map='{"Truck Roll Only":"19","Remote Tech Only":"21"}'` reads the current `.topbar-select` dropdown value to pick destination
- Market type selections sync across all slides via `js/market-type-sync.js` (persisted in sessionStorage)

### State Management

DOM attributes on `#canvas` drive theming via CSS attribute selectors:
- `data-env`: `stage`/`training`/`production` (environment color theme)
- `data-dept`: `cr`/`cs`/`crse` (department-specific sidebar/topbar colors)

**Customer types** (`window.AppConfig.customerType`): `AlarmDotCom` (default), `NonAlarm`, `Cancelled`, `AuthorizedDealer`. Slides use `data-customer-view="AuthorizedDealer"` to show content only for that type and `data-customer-view-hide="Cancelled,AuthorizedDealer"` to hide it (comma-separated values supported). `AuthorizedDealer` inherits `AlarmDotCom` content on slides that don't have a dedicated `.content[data-customer-view="AuthorizedDealer"]` block.

### Department-Based Redirects

When department is **CRSE** and customer type is **Cancelled**, navigation automatically redirects:
- Slide 11 (JobManagement) → Slide 34 (JobManagementCRSE)
- Slide 12 (SystemManagement) → Slide 35 (SystemManagementCRSE)

This logic lives in `js/navigation.js`.

### CSS Organization

- `css/base.css` — core deck styles, canvas, slide controls
- `css/layout.css` — app grid layout (sidebar, topbar, main)
- `css/themes.css` — environment/department colors
- `css/components/` — sidebar, forms, tables
- `css/slides/` — slide-specific styles, named by slide (e.g., `11-job-management.css`)

Some CSS files target multiple slides: `11-job-management.css` covers both `JobManagement` and `JobManagementCRSE`; same for `12-system-management.css`.

### External Dependencies

- [Sortable.js](https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js) loaded from CDN (drag-and-drop in contact management)

## Testing

Tests use Playwright with `file:///` protocol (no server). Slides are navigated in tests by manipulating the `.active` class via `page.evaluate()`:

```javascript
await page.evaluate(() => {
  document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
  document.querySelector('[data-title="SlideName"]').classList.add('active');
});
```

Two test files:
- `tests/slides.spec.js` — 106 tests (components, themes, departments, customer types, modals, CRSE redirects)
- `tests/crse-visual-flow.spec.js` — headed visual test for CRSE end-to-end flow (must run with `--headed`)

## Element Map

`element_map/elements.py` contains 276 AutomationIds for the real .NET MAUI/WinUI3 CAD application, organized into 16 page sections (e.g., `CUSTOMER_LOOKUP`, `JOB_MANAGEMENT`, `SIDEBAR_MENU`). The sidebar and topbar components include `data-automation-id` attributes that match these IDs. Use `find_element(auto_id)` to reverse-lookup which page section an element belongs to.

## Design System

| Purpose | Color |
|---------|-------|
| Primary Button | `#15803d` (hover: `#16a34a`) |
| Accent/Links | `#0d9488` (hover: `#0f766e`) |
| Border | `#d1d5db` |
| Text Primary | `#111827` |
| Text Secondary | `#374151` |
| Text Muted | `#6b7280` |
| Modal Background | `#0f212b` |

- **Buttons**: Pill shape (`border-radius: 20px`), green primary / white secondary
- **Input focus**: `border-color: #0d9488` with teal box-shadow
- **Environment Colors**: Stage (gray), Training (green `#2d6a4f`), Production (teal `#1e3a4c`)
- **Department Colors**: CR (violet `#7c3aed`), CS (cyan `#0891b2`), CRSE (purple `#9333ea`)
- **Font**: Segoe UI system stack
