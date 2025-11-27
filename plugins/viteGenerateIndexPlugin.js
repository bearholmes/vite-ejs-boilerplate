import path from 'node:path';
import fs from 'fs';
import { sync } from 'glob';

const normalizePath = (filePath) => filePath.replace(/\\/g, '/');

/**
 * Generate a grouped page list from HTML/EJS meta blocks.
 * @param {string} rootDir absolute or relative root directory (e.g., src)
 * @param {string} [outDir] optional build output directory
 * @returns {Promise<void>}
 */
async function generateIndexJson(rootDir, outDir) {
  const ejsList = sync(`${rootDir}/pages/**/*.{html,ejs}`, { nosort: true });

  const pages = [];
  const nonMetaPages = [];
  const errorMetaPages = [];

  ejsList.forEach((ejsPath) => {
    const meta = extractMeta(ejsPath);
    if (!meta) {
      nonMetaPages.push(ejsPath);
      return;
    }

    if (!isValidMeta(meta)) {
      errorMetaPages.push(ejsPath);
      return;
    }

    const metaJson = JSON.parse(meta);
    const relativePath = normalizePath(path.relative(rootDir, ejsPath));
    metaJson.path = `/${relativePath.replace(/\.(html|ejs)$/, '.html')}`;
    pages.push(metaJson);
  });

  if (nonMetaPages.length > 0) {
    console.log('\x1b[33;1m', '페이지 정보 데이터 없는 템플릿 파일 목록');
    console.table(nonMetaPages);
  }

  if (errorMetaPages.length > 0) {
    console.log('\x1b[31;1m', '페이지 정보 데이터 표기 오류 템플릿 파일 목록', '\n');
    console.table(errorMetaPages);
  }

  const groups = pages.reduce(reducer, {});

  for (const key in groups) {
    groups[key].sort((a, b) => {
      return comp(a.depth1, b.depth1) || comp(a.depth2, b.depth2)
        || comp(a.depth3, b.depth3) || comp(a.depth4, b.depth4);
    });
  }

  const result = Object.keys(groups).sort().reduce((acc, key) => {
    acc[key] = groups[key];
    return acc;
  }, {});

  const filePath = outDir ? path.join(outDir, 'page-list.json') : path.join(rootDir, 'page-list.json');
  fs.writeFileSync(filePath, JSON.stringify(reverseSortJsonKeys(result)));
}

/**
 * Extract the JSON meta block at the top of a template file.
 * @param {string} ejsPath
 * @returns {string|null}
 */
function extractMeta(ejsPath) {
  const data = fs.readFileSync(ejsPath, 'utf8');
  const endIndex = data.indexOf('#%>');
  if (endIndex === -1) {
    return null;
  }

  const meta = data.substring(0, endIndex)
    .replace(/<%#|\n/g, '')
    .trim();

  return meta || null;
}

/**
 * Validate that a meta string is a JSON object.
 * @param {string} meta
 * @returns {boolean}
 */
function isValidMeta(meta) {
  try {
    const json = JSON.parse(meta);
    return (typeof json === 'object');
  } catch (e) {
    return false;
  }
}

function comp(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
}

/**
 * Group pages by `group` key.
 * @param {Record<string, Array>} accumulator
 * @param {object} page
 * @returns {Record<string, Array>}
 */
function reducer(accumulator, page) {
  const groupName = page.group;
  if (accumulator.hasOwnProperty(groupName)) {
    accumulator[groupName].push(page);
  } else {
    accumulator[groupName] = [page];
  }
  return accumulator;
}

function reverseSortJsonKeys(jsonObj) {
  const keys = Object.keys(jsonObj).sort().reverse();
  const sortedJsonObj = {};
  keys.forEach(key => {
    sortedJsonObj[key] = jsonObj[key];
  });
  return sortedJsonObj;
}

/**
 * Vite plugin that builds page-list.json for navigation and metadata.
 * @returns {import('vite').Plugin}
 */
function ViteGenerateIndexPlugin() {
  let rootDir = '';
  let buildOutDir = '';

  return {
    name: 'vite-generate-index-plugin',

    configResolved(config) {
      rootDir = config.root;
      buildOutDir = config.build.outDir;
    },

    async buildStart() {
      await generateIndexJson(rootDir);
    },

    async writeBundle(options) {
      const targetDir = options?.dir || buildOutDir;
      await generateIndexJson(rootDir, targetDir);
    },

    async handleHotUpdate({ file }) {
      if (file.endsWith('.html') || file.endsWith('.ejs')) {
        await generateIndexJson(rootDir);
      }
    },
  };
}

export { ViteGenerateIndexPlugin };
