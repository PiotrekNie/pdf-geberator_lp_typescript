const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require('./site.config');

// Define common loader constants
const sourceMap = config.env !== 'production';

// HTML loaders

// Handlebars

const handlebars = {
  loader: 'handlebars-loader',
  query: {
    debug: false,
    // partialDirs: getDirectories(componentsPath).map(file => {
    //   return path.join(config.root, config.paths.src, config.paths.components, file);
    // }),
    partialDirs: [path.join(config.root, config.paths.src, config.paths.components)],
    extensions: ['.html'],
  },
};

const extractLoader = {
  loader: 'extract-loader',
};

const html = {
  test: /\.(html)$/,
  exclude: /(node_modules)/,
  use: [
    config.handlebars ? handlebars : null,
    config.handlebars ? extractLoader : null,
    {
      loader: 'html-loader',
      options: {
        interpolate: true,
      },
    },
  ].filter(Boolean),
};

// Javascript loaders
const js = {
  test: /\.js(x)?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
    'eslint-loader',
  ],
};

// TypeScript loaders
const ts = {
  test: /\.ts?$/,
  exclude: /node_modules/,
  use: ['ts-loader', 'eslint-loader'],
};

// select scripts loader
const scripts = config.js_type === 'ts' ? ts : js;

// Style loaders
const styleLoader = {
  loader: 'style-loader',
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap,
  },
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [require('autoprefixer')()],
    },
    sourceMap,
  },
};

const css = {
  test: /\.css$/,
  use: [config.env === 'production' ? MiniCssExtractPlugin.loader : styleLoader, cssLoader, postcssLoader],
};

const sassResourcesLoader = {
  loader: 'sass-resources-loader',
  options: {
    resources: config.preloadedCSSVariables,
  },
};

const sass = {
  test: /\.s[c|a]ss$/,
  use: [
    config.env === 'production' ? MiniCssExtractPlugin.loader : styleLoader,
    cssLoader,
    postcssLoader,
    {
      loader: 'sass-loader',
      options: {
        sourceMap,
        sassOptions: {
          includePaths: [path.join(config.root, config.paths.src, 'styles')],
          outputStyle: 'compressed', // TODO: sourcemaps bug fix
        },
      },
    },
    config.preloadedCSSVariables.length ? sassResourcesLoader : null,
  ].filter(Boolean),
};

// Image loaders
const imageLoader = {
  loader: 'image-webpack-loader',
  options: {
    bypassOnDebug: true,
    gifsicle: {
      interlaced: false,
    },
    optipng: {
      optimizationLevel: 7,
    },
    pngquant: {
      quality: [0.65, 0.9],
      speed: 4,
    },
    mozjpeg: {
      progressive: true,
    },
  },
};

const images = {
  test: /\.(gif|png|jpe?g|svg)$/i,
  exclude: /fonts/,
  use: [
    {
      loader: 'file-loader?name=',
      options: {
        name: 'images/[name].[hash].[ext]',
        esModule: false,
      },
    },
    config.env === 'production' ? imageLoader : null,
  ].filter(Boolean),
};

// Font loaders
const fonts = {
  test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
  exclude: /images/,
  use: [
    {
      loader: 'file-loader',
      query: {
        name: '[name].[hash].[ext]',
        outputPath: 'fonts/',
      },
    },
  ],
};

// Video loaders
const videos = {
  test: /\.(mp4|webm)$/,
  use: [
    {
      loader: 'file-loader',
      query: {
        name: '[name].[hash].[ext]',
        outputPath: 'videos/',
      },
    },
  ],
};

// Files loaders
const files = {
  test: /\.(pdf|csv|xls([x]?)|xlr|doc([x]?)|ppt([x]?)|pps)$/,
  use: [
    {
      loader: 'file-loader',
      query: {
        name: '[name].[ext]',
        outputPath: 'files/',
      },
    },
  ],
};

module.exports = [html, scripts, css, sass, images, fonts, videos, files];
