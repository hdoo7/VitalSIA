const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.fallback = {
                buffer: require.resolve('buffer/'),
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                assert: require.resolve('assert/'),
                http: require.resolve('stream-http'),
                https: require.resolve('https-browserify'),
                os: require.resolve('os-browserify/browser'),
                url: require.resolve('url/'),
                path: require.resolve('path-browserify'),
                fs: false,
                net: false,
                tls: false,
                dns: false,
            };
            webpackConfig.plugins.push(
                new webpack.ProvidePlugin({
                    process: 'process/browser',
                    Buffer: ['buffer', 'Buffer'],
                })
            );
            webpackConfig.resolve.alias = {
                ...webpackConfig.resolve.alias,
                process: 'process/browser'
            };
            return webpackConfig;
        },
    },
};

