const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ensure extensions are resolved, including .mjs files
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        extensions: ['.js', '.jsx', '.json', '.mjs'], // Add .mjs for ES6 module compatibility
        fallback: {
          ...webpackConfig.resolve.fallback,
          "net": false,
          "tls": false,
          "dns": false,
          "pg": false,
          "memjs": false,
          "redis": false,
          "fs": false,
          "crypto": require.resolve("crypto-browserify"),
          "stream": require.resolve("stream-browserify"),
          "buffer": require.resolve("buffer"),
          "assert": require.resolve("assert"),
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "os": require.resolve("os-browserify/browser"),
          "url": require.resolve("url"),
          "path": require.resolve("path-browserify"),
          "zlib": require.resolve("browserify-zlib"),
          "process": require.resolve("process/browser.js"), // Specify extension explicitly
          "querystring": require.resolve("querystring-es3"), // Polyfill for 'querystring'
          "child_process": false // Use an empty module for 'child_process'
        },
      };

      // Add a rule for handling .mjs files (important for ES modules)
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto', // Treat .mjs as auto type for module resolution
      });

      // Add ProvidePlugin for 'process' and 'Buffer' polyfills
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser.js', // Specify extension explicitly here as well
          Buffer: ['buffer', 'Buffer'], // Provide 'Buffer' polyfill for browser
        }),
        // Add ESLint plugin for linting
        new ESLintPlugin({
          extensions: ['js', 'jsx', 'ts', 'tsx'], // Add other file types if needed
          eslintPath: require.resolve('eslint'), // Specify path to ESLint
          emitWarning: true, // Emit warnings instead of errors (optional)
        }),
      ];

      // Fix source map parsing errors (disable source maps for specific packages)
      webpackConfig.module.rules.push({
        test: /\.js$/,
        exclude: /node_modules\/(proto3-json-serializer|google-gax)/, // Exclude specific packages
        use: ['source-map-loader'], // Optionally apply the source-map-loader to other packages
      });

      // Optional: If you want to disable source map warnings completely
      webpackConfig.stats = {
        warningsFilter: [/Failed to parse source map/],
      };

      return webpackConfig;
    },
  },
};
