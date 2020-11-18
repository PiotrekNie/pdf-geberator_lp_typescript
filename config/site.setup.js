const path = require('path');
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const { exec } = require('child_process');
const { prompt } = require('inquirer');

// eslint-disable-next-line import/no-extraneous-dependencies
const del = require('del');

const config = require('./site.config');

const bootstrap = require('./helpers/css-frameworks/bootstrap');
const foundation = require('./helpers/css-frameworks/foundation');

const helperFilesLoader = require('./helpers/js-helpers/js-helpers.loader');
const componentsLoader = require('./helpers/components/components.loader');

const skipSetup = process.env.skipSetup || false;
const isConfigured = config.configured;

const copyFilePromise = util.promisify(fs.copyFile);

/**
 * Remove Assets before writing new files
 * @param {function} callback
 * @return void
 */
async function removeAssets(callback) {
  const deletedPaths = await del([
    path.join(config.root, config.paths.src, 'styles/styles.scss'),
    path.join(config.root, config.paths.src, 'scripts/scripts.ts'),
    path.join(config.root, config.paths.src, 'scripts/scripts.js'),
  ]);

  if (typeof callback === 'function') {
    callback(deletedPaths.join('\n'));
  } else {
    console.log(chalk.redBright('Callback must be a function.'));
  }
}

/**
 * Copy files from one dir to another
 * @param {string} srcDir
 * @param {string} destDir
 * @param {string[]} files
 * @return Promise
 */
function copyFiles(srcDir, destDir, files) {
  return Promise.all(files.map(f => {
    return copyFilePromise(path.join(srcDir, f), path.join(destDir, f));
  }));
}

async function runSetup() {
  clear();

  console.log(chalk.blue(figlet.textSync('Project Config:', { font: 'Cybermedium' })));

  const questions = await prompt([
    {
      type: 'input',
      name: 'site_name',
      message: 'What is the name of your website?',
      default: 'Starter Project',
    },
    {
      type: 'input',
      name: 'site_description',
      message: 'What is a description of your website?',
      validate: input => {
        if (!input) {
          console.log(chalk.redBright(' - This field is required'));
        }
        return !!input;
      },
    },
    {
      type: 'input',
      name: 'site_url',
      message: 'What is the live URL for your website?',
      validate: input => {
        const expression = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
        const isURL = new RegExp(expression);

        if (!input.match(isURL)) {
          console.log(chalk.redBright(' - Enter a valid URL'));
        }
        return !!input.match(isURL);
      },
    },
    {
      type: 'input',
      name: 'google_tag_manager',
      message: 'What is your Google Tag Manager ID?',
    },
    {
      type: 'list',
      name: 'css_library',
      message: 'Which CSS Framework would you like installed?',
      choices: ['Foundation Zurb', 'Bootstrap', 'None'],
    },
    {
      when: answers => answers.css_library === 'None',
      type: 'list',
      name: 'css_reset',
      message: 'Which CSS Reset library would you like installed?',
      choices: ['normalize.css', 'reset.css', 'sanitize.css', 'None'],
    },
    // {
    //   when: answers => answers.css_library !== 'None',
    //   type: 'confirm',
    //   name: 'css_library_scripts',
    //   message: 'Do you want to use the scripts of the selected library? (TODO)', // TODO: add CSS Library Scripts
    // },
    {
      type: 'confirm',
      name: 'purge_css',
      message: 'Do you want to remove unused CSS styles from production build?',
    },
    {
      type: 'list',
      name: 'js_type',
      message: 'Choose Scripts Language:',
      choices: [
        { name: 'TypeScript', value: 'ts' },
        { name: 'EcmaScript 6', value: 'js' },
      ],
    },
    {
      when: answers => answers.js_type !== 'ts',
      type: 'confirm',
      name: 'jquery',
      message: 'Do you want to use jQuery?',
    },
    {
      type: 'confirm',
      name: 'handlebars',
      message: 'Do you want to use Handlebars?',
    },
    {
      type: 'confirm',
      name: 'pipelines',
      message: 'Add Bitbucket Pipelines config?',
    },
    {
      type: 'checkbox',
      name: 'js_helpers',
      message: 'Include selected helpers:',
      choices: [
        { name: 'HTTP Requests', value: 'http-request' },
        { name: 'Animations', value: 'animations' },
        { name: 'NuLead (not available)', value: 'nulead' },
        { name: 'Form Validation (not available)', value: 'form-validation' },
        { name: 'Translations (not available)', value: 'i18n' },
      ],
    },
  ]);

  // Update site configuration
  fs.readFile('./config/site.config.js', 'utf8', (err, data) => {
    let fileContent = data;

    if (typeof questions.site_name !== 'undefined') {
      fileContent = fileContent.replace(/site_name: '.*?'/g, `site_name: '${questions.site_name}'`);
    }
    if (typeof questions.site_description !== 'undefined') {
      fileContent = fileContent.replace(
        /site_description: '.*?'/g,
        `site_description: '${questions.site_description}'`,
      );
    }
    if (typeof questions.site_url !== 'undefined') {
      fileContent = fileContent.replace(/site_url: '.*?'/g, `site_url: '${questions.site_url}'`);
    }
    if (typeof questions.google_tag_manager !== 'undefined') {
      fileContent = fileContent.replace(
        /googleTagManagerUA: '.*?'/g,
        `googleTagManagerUA: '${questions.google_tag_manager}'`,
      );
    }
    if (typeof questions.css_library !== 'undefined') {
      fileContent = fileContent.replace(/css_library: '.*?'/g, `css_library: '${questions.css_library}'`);
    }
    if (typeof questions.css_library_scripts !== 'undefined') {
      fileContent = fileContent.replace(
        /css_library_scripts:.*/g,
        `css_library_scripts: ${questions.css_library_scripts},`,
      );
    }
    if (typeof questions.css_reset !== 'undefined') {
      fileContent = fileContent.replace(/css_reset: '.*?'/g, `css_reset: '${questions.css_reset}'`);
    }
    if (typeof questions.purge_css !== 'undefined') {
      fileContent = fileContent.replace(/purge_css:.*/g, `purge_css: ${questions.purge_css},`);
    }
    if (typeof questions.js_type !== 'undefined') {
      fileContent = fileContent.replace(/js_type: '.*?'/g, `js_type: '${questions.js_type}'`);
    }
    if (typeof questions.jquery !== 'undefined') {
      fileContent = fileContent.replace(/jQuery:.*/g, `jQuery: ${questions.jquery},`);
    }
    if (typeof questions.handlebars !== 'undefined') {
      fileContent = fileContent.replace(/handlebars:.*/g, `handlebars: ${questions.handlebars},`);
    }
    if (typeof questions.js_helpers !== 'undefined') {
      let helpersList = '';

      questions.js_helpers.forEach((helper, index) => {
        helpersList += index > 0 ? ', ' : '';
        helpersList += `'${helper}'`;
      });

      fileContent = fileContent.replace(/js_helpers:.*/g, `js_helpers: [${helpersList}],`);
    }

    // Change configurator status
    fileContent = fileContent.replace(/configured:.*/g, 'configured: true,');

    fs.writeFile(path.join(config.root, config.paths.config, 'site.config.js'), fileContent, 'utf8', () => {
    });
  });

  // Add CSS reset to stylesheet
  if (questions.css_reset !== 'None' && typeof questions.css_reset !== 'undefined') {
    const cssContent = `// Load CSS Reset from NPM\n @import "~${questions.css_reset}";\n`;

    fs.writeFile(path.join(config.root, config.paths.src, 'styles/styles.scss'), cssContent, () => {
    });
  }

  // Add CSS Library to stylesheet
  if (questions.css_library === 'Foundation Zurb' && typeof questions.css_library !== 'undefined') {
    foundation.prepareFiles();
  } else if (questions.css_library === 'Bootstrap' && typeof questions.css_library !== 'undefined') {
    bootstrap.prepareFiles();
  }

  // add styles.scss entry point
  if (questions.css_library === 'None' && questions.css_reset === 'None') {
    fs.writeFile(path.join(config.root, config.paths.src, 'styles/styles.scss'), '', () => {
    });
  }

  // Add Scripts entry file
  if (typeof questions.js_type !== 'undefined') {
    const componentsImport = '// import components\n import "../components/components";';

    if (!fs.existsSync(path.join(config.root, config.paths.src, `components/components.${questions.js_type}`))) {
      // Create components import file
      const components = 'import "./sample-component/sample-component"';
      fs.writeFile(
        path.join(config.root, config.paths.src, `components/components.${questions.js_type}`),
        components,
        () => {
        },
      );
    }

    fs.writeFile(
      path.join(config.root, config.paths.src, `scripts/scripts.${questions.js_type}`),
      componentsImport,
      () => {
      },
    );
  }

  // Add jQuery to scripts
  if (questions.jquery && typeof questions.jquery !== 'undefined') {
    const jsContent = '// Load jQuery from NPM\n import $ from "jquery";\n\n window.jQuery = $;\n window.$ = $;\n';

    fs.writeFile(path.join(config.root, config.paths.src, `scripts/scripts.${questions.js_type}`), jsContent, () => {
    });
  }

  // Add Helpers files
  if (typeof questions.js_helpers !== 'undefined') {
    helperFilesLoader(questions.js_type, questions.js_helpers);
  }

  // Add Pipelines
  if (typeof questions.pipelines !== 'undefined') {
    // usage
    copyFiles(
      path.join(config.root, config.paths.config, 'helpers', 'pipelines'),
      path.join(config.root),
      ['bitbucket-pipelines.yml', 'deployment-exclude-list.txt', 'setup-perms.sh'],
    ).then(() => {
      console.log('Pipelines done');
    }).catch(err => {
      console.log(err);
    });
  }

  // Copy components
  componentsLoader(questions.js_type);
}

/**
 * Code Review
 * @param {function} callback - Callback fired after Code Review is done
 */
function runCodeReview(callback = () => {
}) {
  console.log(`\n${chalk.gray('One more moment ...')}`);

  const child = exec('npm run fix:html && npm run fix:styles && npm run fix:scripts');

  child.on('exit', () => {
    console.log(chalk.greenBright.bold('All done!\n'));
    console.log(chalk.magentaBright.bold('Do not forget about the README file before you start!\n'));

    if (typeof callback === 'function') {
      callback();
    } else {
      console.log(chalk.redBright('Callback must be a function.'));
    }
  });
}

if (!skipSetup) {
  if (isConfigured) {
    clear();

    console.log(chalk.blue('It looks like your project is already configured.'));
    console.log(chalk.blue(`You can change the settings in the ${chalk.yellow.bold('site.config.js')} file`));

    runCodeReview();
  } else {
    removeAssets(() => {
      runSetup().then(() => {
        console.log(chalk.blue('\nConfiguration is being saved...'));
        console.log(chalk.blue(`You can change these settings in the ${chalk.yellow.bold('site.config.js')} file`));

        runCodeReview();
      });
    });
  }
}
