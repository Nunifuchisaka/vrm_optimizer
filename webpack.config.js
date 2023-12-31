const DIST_DIR = './docs',
      SRC_DIR = './src',
      path = require('path'),
      glob = require('glob'),
      DIST_PATH = path.resolve(__dirname, DIST_DIR),
      SRC_PATH = path.resolve(__dirname, SRC_DIR),
      BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
      RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts'),
      //MiniCssExtractPlugin = require('mini-css-extract-plugin'),
      { VueLoaderPlugin } = require('vue-loader'),
      { VuetifyPlugin } = require('webpack-plugin-vuetify'),
      entries = {};

glob.sync('*.ts', {
  cwd: SRC_DIR,
  ignore: ['_*.ts','*.d.ts'],
}).map(function(key){
  entries[key.replace('.ts', '')] = SRC_DIR + '/' + key;
});

glob.sync('*.scss', {
  cwd: SRC_DIR + '/scss',
  ignore: '_*.scss',
}).map(function(key){
  entries[key.replace('.scss', '.css')] = SRC_DIR + '/scss/' + key;
});

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: entries,
  output: {
    path: DIST_PATH,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader','css-loader']
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                //indentedSyntax: true // optional
              },
            },
          },
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.vue', '.ts', '.js']
  },
  plugins: [
    new VueLoaderPlugin(),
    new VuetifyPlugin({ autoImport: true }),
    new RemoveEmptyScriptsPlugin(),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 2000,
      server: { baseDir: DIST_DIR },
      files: [
        DIST_DIR + '/*.html',
        DIST_DIR + '/*.css',
        DIST_DIR + '/*.js'
      ]
    })
  ]
};