import ejs from 'ejs';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Safely turn a Vite alias `find` value into a global RegExp.
 * Supports both strings and RegExp instances.
 * @param {string|RegExp} find
 * @returns {RegExp}
 */
const toAliasRegex = find => {
  if (find instanceof RegExp) {
    return find;
  }

  const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(escaped, 'g');
};

/**
 * Load the generated page list JSON for templating.
 * Falls back to an empty array when the file is missing or malformed.
 * @param {string} rootDir
 * @returns {Array|Object}
 */
const readPageList = rootDir => {
  try {
    const filePath = path.join(rootDir, 'page-list.json');
    const json = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(json);
  } catch {
    return [];
  }
};

/**
 * Render EJS variables in Vite-served HTML and normalize alias paths.
 * @param {object} options
 * @returns {import('vite').Plugin}
 */
function ViteEjsPlugin(options = {}) {
  let config;

  return {
    name: 'vite-plugin-ejs',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        let ejsOptions = options.ejs || {};
        if (typeof ejsOptions === 'function') {
          ejsOptions = ejsOptions(config);
        }

        try {
          const pageList = readPageList(config.root);

          html = ejs.render(
            html,
            {
              isDev: config.mode === 'development',
              pageList: JSON.stringify(pageList)
            },
            {
              views: [path.resolve(config.root)],
              ...ejsOptions,
              async: false
            }
          );

          const alias = config.resolve.alias || [];
          alias.forEach(({ find, replacement }) => {
            const aliasRegex = toAliasRegex(find);
            html = html.replace(aliasRegex, () => {
              return path.posix.join(
                '/',
                path.relative(config.root, replacement)
              );
            });
          });

          return html;
        } catch (error) {
          console.error('EJS 렌더링 에러:', error);
          throw error;
        }
      }
    }
  };
}

export { ViteEjsPlugin };
