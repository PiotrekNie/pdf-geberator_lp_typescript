const path = require('path');
const fs = require('fs');

let ROOT = process.env.PWD;

if (!ROOT) {
  ROOT = process.cwd();
}

const config = {
  // If true, run project configurator
  configured: false,

  // Your website's name, used for favicon meta tags
  site_name: '',

  // Your website's description, used for favicon meta tags
  site_description: '',

  // Your website's URL, used for sitemap
  site_url: '',

  // CSS Library
  css_library: '',

  // CSS Library scripts
  css_library_scripts: false,

  // Reset Library
  css_reset: '',

  // Purge CSS
  purge_css: false,

  // Preload Variables
  preloadedCSSVariables: [],

  // JS Type
  js_type: '',

  // Add jQuery
  jQuery: false,

  // Helpers
  js_helpers: [],

  // Handlebars
  handlebars: true,

  // Google Tag Manager ID (leave blank to disable)
  googleTagManagerUA: '',

  // The viewport meta tag added to your HTML page's <head> tag
  viewport: 'width=device-width,initial-scale=1',

  // Source file for favicon generation. 512x512px recommended.
  favicon: path.join(ROOT, '/src/images/favicon.png'),

  // Local development URL
  dev_host: 'localhost',

  // Local development port
  port: process.env.PORT || 8000,

  // Advanced configuration, edit with caution!
  env: process.env.NODE_ENV,
  root: ROOT,
  paths: {
    config: 'config',
    components: 'components',
    src: 'src',
    dist: 'dist',
  },
  package: JSON.parse(fs.readFileSync(path.join(ROOT, '/package.json'), 'utf8').toString()),
};

module.exports = config;
