import ejs from 'ejs';
import path from 'node:path';
import pageList from './src/page-list.json';

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
          html = ejs.render(
            html,
            {
              isDev: config.mode === 'development',
              pageList: JSON.stringify(pageList),
            },
            {
              views: [path.resolve(config.root)],
              ...ejsOptions,
              async: false
            }
          );

          const alias = config.resolve.alias || [];
          alias.forEach(({ find, replacement }) => {
            const aliasRegex = new RegExp(find, 'g');
            html = html.replace(aliasRegex, (match) => {
              return path.posix.join('/', path.relative(config.root, replacement));
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
