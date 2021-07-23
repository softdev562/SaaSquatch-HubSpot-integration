const path = require('path');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "../src/gherkin-add-on/src/preset.js"
  ],
  managerWebpack: async (config, { configType }) => {
    // Update config to use raw loader for feature files
    config.module.rules.push({
      test: /\.feature$/,
      loaders: 'raw-loader',
      include: path.resolve(__dirname,'../')
    });
    config.resolve.extensions.push('.feature');
    return config;
  },
};