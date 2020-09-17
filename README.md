# Starter Template

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Requirements

* **Node** >= 10.16.3. Recommended **v12**
* **Prettier** plugin
* **PostCSS** plugin (Visual Studio)

## Features

* **Modern Technologies:** Full support for HTML5, JavaScript (Vanilla and ES6), TypeScript and CSS (Sass and PostCSS)
* **Built-in Server:** Local development server with hot reloading
* **Performance Tuning:** CSS and JavaScript transpilation, bundling, autoprefixing, and minification
* **Image Optimization:** Optimizes images for loading speed
* **Favicon Generation:** Automatically generates all favicons for Web, Apple and Android devices from one image file
* **Code Linting:** Full support for JavaScript (ESLint) and CSS (StyleLint) linting
* **Code Format:** Code formatting with Prettier and styles ordering with PostCSS & Stylelint
* **PurgeCSS:** Automatically removes unused CSS code from production build
* **Sitemap & Robots.txt Generation:** Automatically generates a sitemap.xml and robots.txt files
* **Setup Wizard:** Optionally install helpful libraries and snippets including:
    * CSS Resets: `normalize.css`, `reset.css` or `sanitize.css`
    * CSS Framework: `Foundation Zurm` or `Bootstrap`
    * `TypeScript` or `EcmaScript 6`
    * `jQuery` (available with `EcmaScript 6`)
    * Google Tag Manager\*
* **JS Helpers:** Additional JavaScript helpers:
    * NuLead support
    * Form Validation
    * HTTP Requests
    * Translations (i18n)
* **Webpack:** Uses Webpack for processing and bundling code
* **Deployment:** Built-in support for deployment via FTP or Netlify

## Browser Support

* Chrome _\(latest 2\)_
* Edge _\(latest 2\)_
* Firefox _\(latest 2\)_
* Internet Explorer 10+
* Opera _\(latest 2\)_
* Safari _\(latest 2\)_

_This is fully dependent on your code and doesn't mean that Starter Template won't work in older browsers, just that we'll ensure compatibility with the ones mentioned above._

## Structure

* **files** - `pdf`, `csv`, `xls(x)`, `xlr`, `doc(x)`, `ppt(x)`, `pps`
* **fonts** - `woff`, `woff2`, `eot`, `ttf`, `otf`, `svg`
* **images** - `gif`, `png`, `jp(e)g`, `svg`
* **videos** - `mp4`, `webm`
* **components** - directories with `js|ts`, `scss` and `html` files
* **styles** - `scss`
* **scripts** - `js` or `ts`

## Components

Every component should be placed in catalog inside `components` directory.
  
Component need to contain at least one `ts|js` file, which name is **the same** as the name of component directory.

Every component have to be imported in main scripts file.
  
You can add styles directly in your component. Just add `scss` file inside component directory and import it inside component scripts file.

**Component markup** - see `Handlebars` section.

## Handlebars

During installation you can add Handlebars support to your project.
  
To use Handlebars components you need to add `html` file inside your component. Name of this file should be **the same** as component directory.  
Import and pass parameters to your component inside any html file with:
```handlebars
{{> component-name yourVariable="example" }}
```

Learn more about Handlebars at <https://handlebarsjs.com>.

## Configuration

All configuration is being saved into `site.config.js` file during installation.

## IDE

#### Visual Studio Code:

Install following plugins:

- Prettier (https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- PostCSS Sorting (https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-postcss-sorting)

All the plugins configuration is already included to the repo and can be found in `.vscode/settings.json`

You can additionally add keyboard shortcut to your `keybindings.json` file:

```json
{
  "key": "ctrl+shift+c",
  "command": "postcssSorting.execute"
}
```

---

#### IntelliJ

Install `Prettier` plugin.

Add `'order/properties-order'` array from `.stylelintrc.yml` to:

```text
Settings / Editor / Code Style / Style sheets / SCSS / Arrangement / Custom order
```

You can additionally add File Watchers (https://www.jetbrains.com/help/idea/using-file-watchers.html) to format files on save.

## Author

**Marek Miotelka**

- Website: <https://miotelka.me/>

## License

The code is available under the [MIT license](LICENSE).
