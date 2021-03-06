const express = require('express'),
    path = require('path'),
    app = express();

if (process.env.NODE_ENV !== 'production') {
    const webpackMiddleware = require("webpack-dev-middleware"),
        webpack = require('webpack'),
        webpackConfig = require('./webpack.config');

    app.use(webpackMiddleware(webpack(webpackConfig)));
} else {
    app.use(express.static('build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build/index.html'));
    })
}

app.listen(process.env.PORT || 3050, () => console.log(`Listening`));