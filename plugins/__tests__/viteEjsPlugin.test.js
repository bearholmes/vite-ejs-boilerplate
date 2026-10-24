import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { ViteEjsPlugin } from '../viteEjsPlugin.js';

const setup = t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vite-ejs-include-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'templates'));
  fs.writeFileSync(
    path.join(root, 'templates/header.ejs'),
    '<header><%= title %></header>'
  );
  fs.writeFileSync(
    path.join(root, 'templates/layout.ejs'),
    '<main><%- include("@/templates/section") %></main>'
  );
  fs.writeFileSync(
    path.join(root, 'templates/section.ejs'),
    '<section><%- include("./header", { title: "nested" }) %></section>'
  );
  const render = (
    html,
    ejs = {},
    aliases = [{ find: '@/', replacement: root }]
  ) => {
    const plugin = ViteEjsPlugin({ ejs });
    plugin.configResolved({
      root,
      mode: 'development',
      resolve: { alias: aliases }
    });
    return plugin.transformIndexHtml.handler(html);
  };
  return { root, render };
};

test('resolves @/ includes with and without the .ejs extension', async t => {
  const { render } = setup(t);
  for (const name of ['header.ejs', 'header']) {
    assert.equal(
      await render(`<%- include('@/templates/${name}', { title: 'alias' }) %>`),
      '<header>alias</header>'
    );
  }
});

test('resolves aliases and relative includes inside included templates', async t => {
  const { render } = setup(t);
  assert.equal(
    await render("<%- include('@/templates/layout') %>"),
    '<main><section><header>nested</header></section></main>'
  );
});

test('supports dynamic alias paths in include expressions', async t => {
  const { render } = setup(t);
  assert.equal(
    await render(
      "<% const partial = '@/templates/header'; %><%- include(partial, { title: 'dynamic' }) %>"
    ),
    '<header>dynamic</header>'
  );
});

test('preserves includes resolved through views and page-relative paths', async t => {
  const { root, render } = setup(t);
  assert.equal(
    await render("<%- include('./templates/header', { title: 'views' }) %>"),
    '<header>views</header>'
  );
  assert.equal(
    await render(
      "<%- include('../../templates/header', { title: 'relative' }) %>",
      {
        filename: path.join(root, 'pages/nested/index.html')
      }
    ),
    '<header>relative</header>'
  );
});

test('uses the configured alias replacement rather than assuming the Vite root', async t => {
  const { root, render } = setup(t);
  for (const find of ['@/', '@']) {
    assert.equal(
      await render("<%- include('@/header', { title: 'configured' }) %>", {}, [
        { find, replacement: path.join(root, 'templates') }
      ]),
      '<header>configured</header>'
    );
  }
});

test('passes the resolved alias filename to a custom includer', async t => {
  const { root, render } = setup(t);
  const calls = [];
  assert.equal(
    await render("<%- include('@/templates/header', { title: 'custom' }) %>", {
      includer(originalPath, filename) {
        calls.push({ originalPath, filename });
        return undefined;
      }
    }),
    '<header>custom</header>'
  );
  assert.deepEqual(calls, [
    {
      originalPath: '@/templates/header',
      filename: path.join(root, 'templates/header.ejs')
    }
  ]);
});

test('preserves custom includer overrides and empty virtual templates', async t => {
  const { render } = setup(t);
  assert.equal(
    await render("<%- include('@/templates/header') %>", {
      includer: () => ({ template: '<header>override</header>' })
    }),
    '<header>override</header>'
  );
  assert.equal(
    await render("before<%- include('virtual') %>after", {
      includer: () => ({ template: '' })
    }),
    'beforeafter'
  );
});

test('rejects missing includes instead of silently rendering empty content', async t => {
  const { render } = setup(t);
  t.mock.method(console, 'error', () => {});
  for (const name of ['@/templates/missing', './templates/missing']) {
    await assert.rejects(render(`<%- include('${name}') %>`), /missing/);
  }
});

test('still converts asset aliases in the rendered HTML', async t => {
  const { render } = setup(t);
  assert.equal(
    await render('<img src="@/assets/logo.png">'),
    '<img src="/assets/logo.png">'
  );
});
