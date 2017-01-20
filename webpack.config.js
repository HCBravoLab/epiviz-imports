var path = require('path');

module.exports = [{
    entry: path.join(__dirname, './src/webpack.imports/entry-blocks-track.js'),
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: "import-epiviz-blocks-track.js"
    }
},{
    entry: path.join(__dirname, './src/webpack.imports/entry-common-lib.js'),
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: "import-epiviz-common-lib.js"
    }
},{
    entry: path.join(__dirname, './src/webpack.imports/entry-common-src.js'),
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: "import-epiviz-common-src.js"
    }
},{
    entry: path.join(__dirname, './src/webpack.imports/entry-data-source.js'),
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: "import-epiviz-data-source.js"
    }
},{
    entry: path.join(__dirname, './src/webpack.imports/entry-genes-track.js'),
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: "import-epiviz-genes-track.js"
    }
},{
    entry: path.join(__dirname, './src/webpack.imports/entry-heatmap-plot.js'),
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: "import-epiviz-heatmap-plot.js"
    }
},{
    entry: path.join(__dirname, './src/webpack.imports/entry-line-plot.js'),
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: "import-epiviz-line-plot.js"
    }
},{
    entry: path.join(__dirname, './src/webpack.imports/entry-line-track.js'),
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: "import-epiviz-line-track.js"
    }
},{
    entry: path.join(__dirname, './src/webpack.imports/entry-scatter-plot.js'),
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: "import-epiviz-scatter-plot.js"
    }
},{
    entry: path.join(__dirname, './src/webpack.imports/entry-stacked-line-track.js'),
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: "import-epiviz-stacked-line-track.js"
    }
},{
    entry: path.join(__dirname, './src/webpack.imports/entry-stacked-line-plot.js'),
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: "import-epiviz-stacked-line-plot.js"
    }
},{
    entry: path.join(__dirname, './src/webpack.imports/entry-custom-blocks-track.js'),
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: "import-epiviz-custom-blocks-track.js"
    }
},{
    entry: path.join(__dirname, './src/webpack.imports/entry-custom-line-plot.js'),
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: "import-epiviz-custom-line-plot.js"
    }
},{
    entry: path.join(__dirname, './src/webpack.imports/entry-custom-line-track.js'),
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: "import-epiviz-custom-line-track.js"
    }
},{
    entry: path.join(__dirname, './src/webpack.imports/entry-custom-scatter-plot.js'),
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: "import-epiviz-custom-scatter-plot.js"
    }
}];