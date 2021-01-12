const cssnano = require('cssnano');

//ENV
const mode = process.env.NODE_ENV;
const serverRuns = process.env.SERVER_RUNS == 'true' //true if webpack dev server runs
const isProduction = mode == 'production';
const isDevelopment = !isProduction;


module.exports = {
    syntax: 'postcss-scss',
    plugins: [
        "autoprefixer",

        isProduction ? cssnano({
            preset: ['default', {
                discardComments: {
                    removeAll: true,
                },
            }]
        }) : undefined,


    ],
};