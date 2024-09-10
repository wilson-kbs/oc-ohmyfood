const { src, dest, series, watch, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const liveServer = require("live-server");

function buildAssets() {
    return src('src/assets/**/*')
        .pipe(dest('dist/assets/'))
}

function buildStyles() {
    return src('src/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('dist/styles/'));
}

function buildHTML() {
    return src('src/**/*.html')
        .pipe(dest('dist/'));
}

function watcher() {
    watch('src/assets/**/*', buildAssets);
    watch('src/styles/**/*.scss', buildStyles);
    watch('src/**/*.html', buildHTML);
    return Promise.resolve();
}

function liveServerStart() {
    const params = {
        port: 8181, // Set the server port. Defaults to 8080.
        host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
        root: "dist", // Set root directory that's being served. Defaults to cwd.
        open: true, // When false, it won't load your browser by default.
        file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
        wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
        logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    };

    liveServer.start(params);
    return Promise.resolve();
}

const build = parallel(buildStyles, buildHTML, buildAssets);
const dev = series(build, watcher, liveServerStart);

module.exports = {
    default: build,
    build,
    dev,
    watch: watcher,
}
