const DIST_DIR = './dist',
      SRC_DIR = './src',
      path = require('path'),
      glob = require('glob'),
      DIST_PATH = path.resolve(__dirname, DIST_DIR),
      SRC_PATH = path.resolve(__dirname, SRC_DIR),
      BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
      RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts'),
      MiniCssExtractPlugin = require('mini-css-extract-plugin'),
      entries = {};

glob.sync('*.ts', {
  cwd: SRC_DIR + '/ts',
  ignore: '_*.ts',
}).map(function(key){
  entries[key.replace('.ts', '')] = SRC_DIR + '/ts/' + key;
});

glob.sync('*.scss', {
  cwd: SRC_DIR + '/scss',
  ignore: '_*.scss',
}).map(function(key){
  entries[key.replace('.scss', '.css')] = SRC_DIR + '/scss/' + key;
});

module.exports = {
  mode: 'development',
  entry: entries,
  output: {
    path: DIST_PATH,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }, {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              //sourceMap: false,
              importLoaders: 2,
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                outputStyle: 'compressed',
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]',
    }),
    new RemoveEmptyScriptsPlugin(),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 2000,
      server: { baseDir: './dist' },
      files: [
        './dist/*.html',
        './dist/*.css'
      ]
    })
  ]
};