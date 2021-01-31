const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
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
      const helpersDir = path.join(config.root, config.paths.config, 'helpers/js-helpers', scriptsLanguage);
      const helpersDist = path.join(config.root, config.paths.src, 'scripts/helpers');

      helpers.forEach((helper) => {
        const fileURL = path.join(helpersDir, `${helper}.${scriptsLanguage}`);
        const dirURL = path.join(helpersDir, helper);

        if (fs.existsSync(fileURL)) {
          const file = fs.readFileSync(fileURL);

          fs.writeFile(path.join(helpersDist, `${helper}.${scriptsLanguage}`), file, () => {});
        } else if (fs.existsSync(dirURL)) {
          fse.copySync(dirURL, path.join(helpersDist, helper), { errorOnExist: true });
        } else {
          console.log(chalk.redBright(`${helper} helper is not available yet. Skipping.`));
        }
      });
    });
  }
}

module.exports = helperFilesLoader;
