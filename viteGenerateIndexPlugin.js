import path from 'node:path';
import fs from 'fs';
import { sync } from 'glob';

const normalizePath = (filePath) => {
  return filePath.replace(/\\/g, '/'); // Convert backslashes to forward slashes for consistency
};

// Generate index JSON file
async function generateIndexJson(rootDir, outDir) {
  let ejsList = sync(`${rootDir}/pages/**/*.{html,ejs}`, { nosort: true });

  const pages = [];
  const nonMetaPages = [];
  const errorMetaPages = [];

  ejsList.forEach((ejsPath) => {
    const valid = validMeta(ejsPath);
    const meta = extractMeta(ejsPath);
    if (!meta) {
      nonMetaPages.push(ejsPath);
    } else {
      if (!valid) {
        errorMetaPages.push(ejsPath);
      } else {
        const metaJson = JSON.parse(meta);
        metaJson.path = ejsPath.replace(new RegExp(`^${rootDir}`), '').replace(/\.(html|ejs)$/, '.html');
        pages.push(metaJson);
      }
    }
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

  for (let key in groups) {
    groups[key].sort((a, b) => {
      return comp(a.depth1, b.depth1) || comp(a.depth2, b.depth2)
        || comp(a.depth3, b.depth3) || comp(a.depth4, b.depth4);
    });
  }

  const result = Object.keys(groups).sort().reduce((acc, key) => {
    acc[key] = groups[key];
    return acc;
  }, {});

  // Write the JSON file to the outDir for production build or rootDir for development
  const filePath = outDir ? path.join(outDir, 'page-list.json') : path.join(rootDir, 'page-list.json');
  fs.writeFileSync(filePath, JSON.stringify(reverseSortJsonKeys(result)));
}

// Utility functions
function extractMeta(ejsPath) {
  const data = fs.readFileSync(ejsPath, "utf8");
  const meta = data.substring(0, data.indexOf("#%>"))
    .replace(/<%#|\n/g, "");
  return meta;
}

function validMeta(ejsPath) {
  const data = fs.readFileSync(ejsPath, "utf8");
  const meta = data.substring(0, data.indexOf("#%>"))
    .replace(/<%#|\n/g, "");
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

function ViteGenerateIndexPlugin() {
  let rootDir = '';
  let outDir = '';

  return {
    name: "vite-generate-index-plugin",

    configResolved(config) {
      // Store rootDir and outDir values
      rootDir = config.root;
      outDir = config.build.outDir;
    },

    async buildStart() {
      // Generate JSON file in the rootDir for development
      await generateIndexJson(rootDir);
    },

    async writeBundle(options) {
      // Generate JSON file in the outDir for production build
      await generateIndexJson(rootDir, options.dir);
    },

    async handleHotUpdate({ file }) {
      if (file.endsWith('.html') || file.endsWith('.ejs')) {
        // Regenerate JSON file on file changes
        await generateIndexJson(rootDir);
      }
    },
  };
}

export { ViteGenerateIndexPlugin };
