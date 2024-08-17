const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
    transpileDependencies: true,
});

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    configureWebpack: {
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css',
            }),
        ],
    },
    css: {
        extract: process.env.NODE_ENV === 'production',
    },
};
