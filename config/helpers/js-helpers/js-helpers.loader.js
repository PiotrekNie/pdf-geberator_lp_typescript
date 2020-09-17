const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const config = require('../../site.config');

/**
 * JavaScript Helpers loader
 * @param {string} scriptsLanguage - Language of scripts
 * @param {string[]} helpers - Array of helpers
 */

function helperFilesLoader(scriptsLanguage, helpers) {
  if (helpers.length) {
    fs.mkdir(path.join(config.root, config.paths.src, 'scripts/helpers'), { recursive: true }, () => {
      helpers.forEach((helper) => {
        const fileURL = path.join(
          config.root,
          config.paths.config,
          'helpers/js-helpers',
          scriptsLanguage,
          `${helper}.${scriptsLanguage}`
        );

        if (fs.existsSync(fileURL)) {
          const file = fs.readFileSync(fileURL);

          fs.writeFile(
            path.join(config.root, config.paths.src, 'scripts/helpers', `${helper}.${scriptsLanguage}`),
            file,
            () => {}
          );
        } else {
          console.log(chalk.redBright(`${helper} helper is not available yet. Skipping.`));
        }
      });
    });
  }
}

module.exports = helperFilesLoader;
