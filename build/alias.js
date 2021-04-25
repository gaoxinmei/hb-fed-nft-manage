'use strict';
const path = require('path')
const url = require('url');
const fs = require('fs');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const envPublicUrl = process.env.PUBLIC_URL;
const src = resolveApp('src')
const alias = {
    'vue$': 'vue/dist/vue.esm.js',
    '@': resolve('src'),
    '__components': src + '/components',
    '__assets': src + '/assets',
    '__style': src + '/assets/style',
    '__images': src + '/assets/images',
    '__util': src + '/util',
    '__libs': src + '/libs',
    '__views': src + '/views',
    '__store': src + '/store',
    '__router': src + '/router',
    '__userSearch' : src + `/views/user/userSearch/${process.env.TYPE}`,
    '__userAuth' : src + `/views/user/userAuth/${process.env.TYPE}`,
    '__tradeCount' : src + `/views/systemStatistics/tradeCount-${process.env.TYPE}`
}

module.exports = alias;
