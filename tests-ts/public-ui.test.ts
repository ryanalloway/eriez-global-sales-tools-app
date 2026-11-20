import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (file: string) => readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8');

test('only completed tool pages appear in public routes and navigation', () => {
  const routes = read('app/App.tsx');
  const navigation = read('lib/navigation.ts');
  const toolPaths = [...navigation.matchAll(/\{ path: "([^"]+)", title:/g)].map((match) => match[1]);
  assert.deepEqual(toolPaths, ['/', '/gauss-force', '/magnet-profiles', '/contour-plots', '/help']);
  for (const hidden of ['materials', 'burden', 'another', 'admin']) {
    assert.doesNotMatch(routes + navigation, new RegExp(`path="${hidden}"|id: "${hidden}"`));
  }
});

test('customer-facing pages do not display developer setup instructions', () => {
  const pages = ['pages/HomePage.tsx', 'pages/ManualPage.tsx', 'pages/ProfilesPage.tsx', 'pages/ContoursPage.tsx', 'pages/HelpPage.tsx'];
  for (const page of pages) {
    assert.doesNotMatch(read(page), /Connect SQL|local CSV|Estimator under development|original application lists/);
  }
});
