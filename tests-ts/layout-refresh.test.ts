import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (file: string) => readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8');

test('routing separates all pages from the persistent layout', () => {
  const app = read('app/App.tsx');
  for (const name of ['HomePage', 'ManualPage', 'ProfilesPage', 'ContoursPage', 'HelpPage', 'AppLayout']) {
    assert.ok(app.includes(name));
  }
  for (const path of ['gauss-force', 'magnet-profiles', 'contour-plots', 'help']) {
    assert.ok(app.includes(`path="${path}"`));
  }
  assert.ok(app.length < 3000, 'App.tsx should only define routes');
});

test('shared measurement unit bar appears on tool pages, but not Help & FAQs', () => {
  const layout = read('components/layout/AppLayout.tsx');
  const bar = read('components/layout/AnalysisUnitsBar.tsx');
  const context = read('app/AppContext.ts');
  // JSX formatters may spread the same props over multiple lines or reorder them.
  // Check the actual shared component invocation independent of whitespace.
  const unitsBar = layout.match(/<AnalysisUnitsBar\b([^>]*?)\/>/)?.[1];
  assert.ok(unitsBar, 'AppLayout must render AnalysisUnitsBar');
  for (const [prop, variable] of [
    ['distance', 'distance'],
    ['onDistanceChange', 'setDistance'],
    ['force', 'force'],
    ['onForceChange', 'setForce'],
  ]) {
    assert.match(unitsBar, new RegExp(`\\b${prop}\\s*=\\s*\\{${variable}\\}`));
  }
  assert.ok(
    layout.indexOf('<AnalysisUnitsBar') < layout.indexOf('<Outlet'),
    'AnalysisUnitsBar should render in the shared layout before the page outlet',
  );
  assert.match(layout, /<Outlet \/>/);
  assert.match(layout, /makeUnits\(distance, force\)/);
  assert.match(context, /useAppContext/);
  assert.match(bar, /aria-label="Analysis units"/);
  assert.match(bar, /aria-label="Distance unit"/);
  assert.match(bar, /aria-label="Force index unit"/);
  // The shared layout retains unit state when navigating between pages.
  // Help & FAQs is the only route that does not display the controls.
  assert.match(layout, /const showAnalysisUnits\s*=\s*!\["home",\s*"help"\]\.includes\(selected\.id\)/);
  assert.match(layout, /\{showAnalysisUnits\s*&&\s*\(/);
  assert.match(layout, /const \[distance, setDistance\] = useState/);
  assert.match(layout, /const \[force, setForce\] = useState/);
});

test('navigation is responsive and legacy theme and system-status widgets are removed', () => {
  const layout = read('components/layout/AppLayout.tsx');
  assert.match(layout, /aria-label="Close navigation"/);
  assert.match(layout, /aria-label="Toggle navigation"/);
  assert.match(layout, /max-\[760px\]/);
  assert.doesNotMatch(layout, /SYSTEM STATUS|Theme Selection|Appearance theme|setTheme/);
  assert.match(layout, /Support &amp; Help Desk/);
  assert.match(layout, /https:\/\/helpdesk\.eriez\.net\/Ticket\/New\/11/);
});
