const webpack = require('webpack');
const cssnano = require('cssnano');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const RobotstxtPlugin = require('robotstxt-webpack-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;
const PurgecssPlugin = require('purgecss-webpack-plugin');

const config = require('./site.config');

// Hot module replacement
const hmr = new webpack.HotModuleReplacementPlugin();

// Optimize CSS assets
const optimizeCss = new OptimizeCssAssetsPlugin({
  assetNameRegExp: /\.css$/g,
  cssProcessor: cssnano,
  cssProcessorPluginOptions: {
    preset: [
      'default',
      {
        discardComments: {
          removeAll: true,
        },
      },
    ],
  },
  canPrint: true,
});

// Generate robots.txt
const robots = new RobotstxtPlugin({
  sitemap: `${config.site_url}/sitemap.xml`,
  host: config.site_url,
});

// Clean webpack
const clean = new CleanWebpackPlugin();

// Stylelint
const stylelint = new StyleLintPlugin();

// Extract CSS
const cssExtract = new MiniCssExtractPlugin({
  filename: 'style.[contenthash].css',
});

// HTML generation
const paths = [];
const generateHTMLPlugins = () => {
  return glob
    .sync('./src/**/*.html', {
      ignore: ['./src/components/**/*.html'], // ignore components
    })
    .map(dir => {
      const filename = path.basename(dir);

      if (filename !== '404.html') {
        paths.push(filename);
      }

      return new HTMLWebpackPlugin({
        filename,
        template: path.join(config.root, config.paths.src, filename),
        meta: {
          viewport: config.viewport,
        },
      });
    });
};

// Sitemap
const sitemap = new SitemapPlugin(config.site_url, paths, {
  priority: 1.0,
  lastmodrealtime: true,
});

// Favicons
const favicons = new FaviconsWebpackPlugin({
  logo: config.favicon,
  prefix: 'images/favicons/',
  publicPath: '.',
  favicons: {
    appName: config.site_name,
    developerName: null,
    developerURL: null,
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: false,
      coast: false,
      favicons: true,
      firefox: false,
      windows: false,
      yandex: false,
    },
  },
});

// Webpack bar
const webpackBar = new WebpackBar({
  color: '#70c11a',
});

// Google Tag Manager

// eslint-disable-next-line max-len, quotes
const CODE_HEAD = `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','{{ID}}');</script>`;
// eslint-disable-next-line max-len, quotes
const CODE_BODY = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ID}}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;

class GoogleTagManagerPlugin {
  constructor({ id }) {
    this.id = id;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('GoogleTagManagerPlugin', compilation => {
      HTMLWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('GoogleTagManagerPlugin', (data, cb) => {
        const pageData = data;
        pageData.html = data.html.replace('</head>', `${CODE_HEAD.replace('{{ID}}', this.id)}</head>`);
        pageData.html = data.html.replace('<body>', `${CODE_BODY.replace('{{ID}}', this.id)}</head>`);
        cb(null, pageData);
      });
    });
  }
}

const google = new GoogleTagManagerPlugin({
  id: config.googleTagManagerUA,
});

const purgeCSS = new PurgecssPlugin({
  paths: glob.sync(path.join(config.root, config.paths.src, '/**/*'), { nodir: true }),
});

module.exports = [
  clean,
  stylelint,
  cssExtract,
  ...generateHTMLPlugins(),
  fs.existsSync(config.favicon) && favicons,
  config.env === 'production' && optimizeCss,
  config.env === 'production' && config.purge_css && purgeCSS,
  config.env === 'production' && robots,
  config.env === 'production' && sitemap,
  config.googleTagManagerUA && google,
  webpackBar,
  config.env === 'development' && hmr,
].filter(Boolean);
