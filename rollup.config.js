import babel from 'rollup-plugin-babel';

module.exports = {
  name: 'cat',
  input: './src/index.js',
  output: {
    file: './build/cat.js',
    format: 'umd'
  },
  globals: {
    d3: 'd3',
    webcharts: 'webCharts',
    jquery:'jquery'
  },
  external: ['jquery','d3'],
  plugins: [
    babel(
      {
        "presets": [
          [
            "es2015",
            {
              "modules": false
            }
          ]
        ],
        "plugins": [
          "external-helpers"
        ],
        "exclude": "node_modules/**"
      })
  ]
};
