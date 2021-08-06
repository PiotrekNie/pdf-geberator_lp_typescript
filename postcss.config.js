module.exports = () => ({
  browsers: ['> 0.25%', 'ie >= 11'],
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-sorting': {
      order: ['custom-properties', 'dollar-variables', 'declarations', 'at-rules', 'rules'],
      'properties-order': [
        'position',
        'top',
        'right',
        'bottom',
        'left',
        'z-index',
        'box-sizing',
        'display',
        'flex',
        'flex-grow',
        'flex-shrink',
        'flex-basis',
        'flex-align',
        'flex-direction',
        'flex-wrap',
        'flex-flow',
        'flex-order',
        'flex-pack',
        'align-content',
        'align-items',
        'align-self',
        'justify-content',
        'order',
        'float',
        'width',
        'min-width',
        'max-width',
        'height',
        'min-height',
        'max-height',
        'padding',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',
        'margin',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',
        'overflow',
        'overflow-x',
        'overflow-y',
        '-webkit-overflow-scrolling',
        '-ms-overflow-x',
        '-ms-overflow-y',
        '-ms-overflow-style',
        'columns',
        'column-width',
        'column-span',
        'column-count',
        'column-fill',
        'column-gap',
        'column-rule',
        'column-rule-width',
        'column-rule-style',
        'column-rule-color',
        'orphans',
        'widows',
        'clip',
        'clear',
        'font',
        'font-style',
        'font-variant',
        'font-weight',
        'font-size',
        'font-family',
        'font-size-adjust',
        'font-stretch',
        'font-effect',
        'font-emphasize',
        'font-emphasize-position',
        'font-emphasize-style',
        'font-smooth',
        'src',
        'hyphens',
        'line-height',
        'color',
        'text-align',
        'text-align-last',
        'text-emphasis',
        'text-emphasis-color',
        'text-emphasis-style',
        'text-emphasis-position',
        'text-decoration',
        'text-indent',
        'text-justify',
        'text-outline',
        '-ms-text-overflow',
        'text-overflow',
        'text-overflow-ellipsis',
        'text-overflow-mode',
        'text-shadow',
        'text-transform',
        'text-wrap',
        '-webkit-text-size-adjust',
        '-ms-text-size-adjust',
        'letter-spacing',
        '-ms-word-break',
        'word-break',
        'word-spacing',
        '-ms-word-wrap',
        'word-wrap',
        'overflow-wrap',
        'tab-size',
        'white-space',
        'vertical-align',
        'direction',
        'unicode-bidi',
        'list-style',
        'list-style-type',
        'list-style-position',
        'list-style-image',
        'pointer-events',
        '-ms-touch-action',
        'touch-action',
        'cursor',
        'visibility',
        'zoom',
        'table-layout',
        'empty-cells',
        'caption-side',
        'border-spacing',
        'border-collapse',
        'content',
        'quotes',
        'counter-reset',
        'counter-increment',
        'resize',
        'user-select',
        'nav-index',
        'nav-up',
        'nav-right',
        'nav-down',
        'nav-left',
        'background',
        'background-color',
        'background-image',
        'background-position',
        'background-position-x',
        'background-position-y',
        'background-size',
        'background-repeat',
        'background-origin',
        'background-clip',
        'background-attachment',
        'filter',
        'border',
        'border-width',
        'border-style',
        'border-color',
        'border-top',
        'border-top-width',
        'border-top-style',
        'border-top-color',
        'border-right',
        'border-right-width',
        'border-right-style',
        'border-right-color',
        'border-bottom',
        'border-bottom-width',
        'border-bottom-style',
        'border-bottom-color',
        'border-left',
        'border-left-width',
        'border-left-style',
        'border-left-color',
        'border-radius',
        'border-top-left-radius',
        'border-top-right-radius',
        'border-bottom-right-radius',
        'border-bottom-left-radius',
        'border-image',
        'border-image-source',
        'border-image-slice',
        'border-image-width',
        'border-image-outset',
        'border-image-repeat',
        'outline',
        'outline-width',
        'outline-style',
        'outline-color',
        'outline-offset',
        'box-shadow',
        'opacity',
        '-ms-interpolation-mode',
        'page-break-after',
        'page-break-before',
        'page-break-inside',
        'transition',
        'transition-property',
        'transition-duration',
        'transition-timing-function',
        'transition-delay',
        'transform',
        'transform-origin',
        'perspective',
        'appearance',
        'animation',
        'animation-name',
        'animation-duration',
        'animation-timing-function',
        'animation-delay',
        'animation-iteration-count',
        'animation-direction',
        'animation-fill-mode',
        'animation-play-state',
        'fill',
        'stroke',
      ],
    },
  },
});
