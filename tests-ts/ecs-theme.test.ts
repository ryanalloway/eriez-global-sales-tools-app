import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (file: string) => readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8');

test('Tailwind config includes Eriez light palette', () => {
  const css = read('styles.css');
  assert.match(css, /@import "tailwindcss";/);
  // CSS hex colors are case-insensitive. Verify the named Eriez tokens,
  // not the capitalization applied by an editor or formatter.
  const palette: Record<string, string> = {
    eriez: '#F37021',
    'eriez-hover': '#D85E13',
    canvas: '#F8FAFC',
    ink: '#1E293B',
    muted: '#64748B',
    line: '#E2E8F0',
  };
  for (const [token, value] of Object.entries(palette)) {
    assert.match(
      css,
      new RegExp(`--color-${token}\\s*:\\s*${value}\\s*;`, 'i'),
      `Missing or incorrect Eriez color token --color-${token}: ${value}`,
    );
  }
  assert.doesNotMatch(css, /data-theme|@media|\.app\s*\{/);
});

test('chart styling is consistent, without an appearance preference or theme observer', () => {
  const chart = read('components/charts/ContourPlot.tsx');
  const app = read('components/layout/AppLayout.tsx');
  assert.doesNotMatch(chart + app, /localStorage|matchMedia|MutationObserver|Theme Selection|Appearance theme/);
  assert.match(chart, /paper_bgcolor: "#ffffff"/);
});

test('home page shows three finished analysis tools', () => {
  const home = read('pages/HomePage.tsx');
  assert.match(home, /Magnetic Performance Analysis/);
  assert.match(home, /Gauss & Force Plotter/);
  assert.match(home, /Magnet Profiles/);
  assert.match(home, /Contour Plots/);
  assert.match(home, /3 available tools/);
});
