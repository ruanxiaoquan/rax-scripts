const { getDepPath } = require('../pathHelper');

const EntryLoader = require.resolve('../../../loaders/MiniAppEntryLoader');

module.exports = (config, context, routes) => {
  const { rootDir } = context;

  config.entryPoints.clear();

  routes.forEach(({ entryName, source }) => {
    const entryConfig = config.entry(entryName);

    const pageEntry = getDepPath(rootDir, source);
    entryConfig.add(`${EntryLoader}?${JSON.stringify({ routes })}!${pageEntry}`);
  });

  // Add app entry
  config.entry('app').add(getDepPath(rootDir, 'app'));
};

