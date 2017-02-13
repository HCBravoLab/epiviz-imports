var path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: 'app.js',
    libraryTarget: 'var',
    library: 'epiviz'
  },
  externals: {
    jquery: './src/js/lib/jquery/jquery-1.8.2.js',
    d3: './src/js/lib/d3/d3.v3.js',
    sprintf: './src/js/lib/sprintf-0.6.js'
  }
//   plugins: [
//     new webpack.ProvidePlugin({
//       epiviz: 'epiviz'
//     })
//   ]
};