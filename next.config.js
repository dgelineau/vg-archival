const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");

module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config) => {
    // Replaces moment.js with day.js
    config.plugins.push(new AntdDayjsWebpackPlugin());

    return config;
  },
};
