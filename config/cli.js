const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const config = require('./site.config');

/**
 * Ensure path exists.
 * @param {string} extPath
 * @param {function | number} mask
 * @param {function} callback
 * @return void
 */
function ensureExists(extPath, mask, callback) {
  if (typeof mask === 'function') {
    // eslint-disable-next-line no-param-reassign
    callback = mask;
  }
  fs.mkdir(extPath, { recursive: false }, (err) => {
    if (err) {
      if (err.code.toUpperCase() === 'EEXIST') callback('EEXIST');
      // ignore the error if the folder already exists
      else callback(err); // something else went wrong
    } else callback('CREATED'); // successfully created folder
  });
}

/**
 * Create new component
 * @return void
 */
async function createComponent() {
  const argvPath = process.argv[2];

  if (path) {
    const componentName = argvPath.substring(argvPath.lastIndexOf('/') + 1);
    const componentPath = path.join(config.root, config.paths.src, config.paths.components, argvPath);

    ensureExists(componentPath, 0744, (err) => {
      if (err === 'CREATED') {
        fs.writeFile(
          path.join(componentPath, `${componentName}.${config.js_type}`),
          `import './${componentName}.scss';\n`,
          () => {}
        );
        fs.writeFile(path.join(componentPath, `${componentName}.scss`), '', () => {});
        fs.writeFile(path.join(componentPath, `${componentName}.html`), `${componentName} works!`, () => {});

        // import into components.ts
        const mainComponentsFile = path.join(
          config.root,
          config.paths.src,
          config.paths.components,
          `components.${config.js_type}`
        );

        const componentImport = `import './${argvPath.replace(/^\//, '')}/${componentName}';\n`; // eslint-disable-line quotes
        const mainComponentsFileContent = fs.readFileSync(mainComponentsFile);

        fs.writeFileSync(mainComponentsFile, componentImport + mainComponentsFileContent);

        console.log(chalk.green(`Component ${componentName} has been created!`));
        console.log(chalk.blue(`Component path: ${path.join(config.paths.src, config.paths.components, argvPath)}`));
      } else if (err === 'EEXIST') {
        console.log(chalk.redBright('Provided path already exists.'));
      } else {
        console.log(chalk.redBright('Error. Check if provided path is correct.'));
      }
    });
  } else {
    console.log(chalk.redBright('Provide path for new component'));
  }
}

createComponent();
