const fs = require('fs');
const path = require('path');

let ROOT = process.env.PWD;

if (!ROOT) {
  ROOT = process.cwd();
}

const foundationModulePath = './node_modules/foundation-sites';

const foundation = {
  imports: fs.readFileSync('./config/helpers/css-frameworks/foundation-imports.scss', 'utf8'),
  variables: fs.readFileSync(`${foundationModulePath}/scss/settings/_settings.scss`, 'utf8'),
};

foundation.variables = foundation.variables.replace(
  /@import 'util\/util'/g,
  `@import '${foundationModulePath}/scss/util/util'`
);

module.exports = {
  prepareFiles: () => {
    fs.writeFile(path.join(ROOT, '/src/styles/_foundation.scss'), foundation.imports, () => {});
    fs.writeFile(path.join(ROOT, '/src/styles/_variables.scss'), foundation.variables, () => {});

    const scssImports = `@import 'foundation';\n@import 'variables';\n`; // eslint-disable-line quotes
    fs.appendFile(path.join(ROOT, '/src/styles/styles.scss'), scssImports, () => {});
  },
};
