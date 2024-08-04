import ejs from "ejs";
import path from "node:path";

function ViteEjsPlugin(data = {}, options) {
  let config;

  return {
    name: "vite-plugin-ejs",

    // Get Resolved config
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    transformIndexHtml: {
      order: "pre",
      handler(html) {
        if (typeof data === "function") data = data(config);
        let ejsOptions = options && options.ejs ? options.ejs : {};
        if (typeof ejsOptions === "function") ejsOptions = ejsOptions(config);

        // EJS 렌더링
        html = ejs.render(
          html,
          {
            NODE_ENV: config.mode,
            isDev: config.mode === "development",
            ...data
          },
          {
            // setting views enables includes support
            views: [config.root],
            ...ejsOptions,
            async: false // Force sync
          }
        );

        // Alias
        const alias = config.resolve.alias;
        alias.forEach(({ find, replacement }) => {
          const aliasRegex = new RegExp(find, 'g');
          html = html.replace(aliasRegex, (match) => {
            const resolvedPath = path.posix.join('/', path.relative(config.root, replacement));
            return resolvedPath;
          });
        });

        return html;
      }
    }
  };
}

export { ViteEjsPlugin, ejs }
