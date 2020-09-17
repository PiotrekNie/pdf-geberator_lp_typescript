const fs = require('fs');
const path = require('path');

const copyDir = require('copy-dir');

const config = require('../../site.config');

const componentsDirectories = fs
  .readdirSync(path.join(config.root, config.paths.config, 'helpers', 'components'))
  .filter(file => {
    return fs.statSync(path.join(config.root, config.paths.config, 'helpers', 'components', file)).isDirectory();
  });

function componentsLoader(scriptsLang) {
  componentsDirectories.forEach(componentDir => {
    copyDir.sync(
      path.join(config.root, config.paths.config, 'helpers', 'components', componentDir),
      path.join(config.root, config.paths.src, 'components', componentDir),
      {
        filter: (stat, filepath) => {
          return !(stat === 'file' && path.extname(filepath) === (scriptsLang === 'js' ? '.ts' : '.js'));
        },
      }
    );
  });
}

module.exports = componentsLoader;
