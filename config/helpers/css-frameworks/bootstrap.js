const fs = require('fs');
const path = require('path');

let ROOT = process.env.PWD;

const config = require('../../site.config');

if (!ROOT) {
  ROOT = process.cwd();
}

const bootstrap = {
  imports: fs.readFileSync('./node_modules/bootstrap/scss/bootstrap.scss', 'utf8'),
  variables: fs.readFileSync('./node_modules/bootstrap/scss/_variables.scss', 'utf8'),
};

bootstrap.imports = bootstrap.imports.replace(/@import "/g, '@import "~bootstrap/scss/');
bootstrap.imports = bootstrap.imports.replace(/@import "~bootstrap\/scss\/variables"/g, '@import "variables"');
bootstrap.imports = bootstrap.imports.replace(/"/g, "'"); // eslint-disable-line quotes

module.exports = {
  prepareFiles: (scriptsLanguage) => {
    fs.writeFile(path.join(ROOT, '/src/styles/_bootstrap.scss'), bootstrap.imports, () => {});
    fs.writeFile(path.join(ROOT, '/src/styles/_variables.scss'), bootstrap.variables, () => {});

    const bsScriptsFile = path.join(
      config.root,
      config.paths.config,
      'helpers/css-frameworks/scripts',
      `bootstrap.${scriptsLanguage}`
    );

    const scriptDist = path.join(config.root, config.paths.src, 'scripts', `bootstrap.${scriptsLanguage}`);

    const scriptContent = fs.readFileSync(bsScriptsFile);
    fs.writeFile(scriptDist, scriptContent, () => {});

    const mainScriptsFile = path.join(config.root, config.paths.src, 'scripts', `scripts.${scriptsLanguage}`);
    const scriptsImport = `import './bootstrap';\n`; // eslint-disable-line quotes
    const mainScriptsFileContent = fs.readFileSync(mainScriptsFile);

    fs.writeFile(mainScriptsFile, scriptsImport + mainScriptsFileContent, () => {});

    const scssImports = `@import 'bootstrap';\n`; // eslint-disable-line quotes
    fs.appendFile(path.join(ROOT, '/src/styles/styles.scss'), scssImports, () => {});
  },
};
