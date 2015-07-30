var fs = require('fs'),
  path = require('path'),
  filepath = path.resolve(__dirname, '../../webpack-stats.json');

module.exports = function writeStats(stats, env) {

  var publicPath = this.options.output.publicPath;

  var json = stats.toJson();

  // get chunks by name and extensions
  function getChunks(name, ext) {
    ext = ext || 'js';
    var chunk = json.assetsByChunkName[name];

    // a chunk could be a string or an array, so make sure it is an array
    if (!(Array.isArray(chunk))) {
      chunk = [chunk];
    }

    return chunk
      // filter by extension
      .filter(function(chunkName) {
        return path.extname(chunkName) === '.' + ext;
      })
      .map(function(chunkName) {
        return publicPath + chunkName;
      });
  }

  var script = getChunks('main', 'js');
  var cssFiles = getChunks('main', 'css');

  var cssModules = {};

  // Is there a way to get this dynamically so it doesn't depend on loader?
  var namePrefix = './~/css-loader?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]!./~/autoprefixer-loader?browsers=last 2 version!./~/sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true!';

  json.modules.filter(function(m) {
    if (env === 'prod') {
      return /\.scss$/.test(m.name);
    }

    return m.name.slice(0, namePrefix.length) === namePrefix;
  }).forEach(function(m) {
    var name = path.resolve(__dirname, '../../', env === 'prod' ?
      m.name.slice('./src'.length) :
      m.name.slice(namePrefix.length + './src'.length));
    //Resolve the e.g.:"C:\"  issue on windows
    if (name) {
      const i = name.indexOf(":");
      name = name.substring(i > -1 ? i + 1 : 0, name.length + 1);
    }
    //end
    var regex = env === 'prod' ? /module\.exports = ((.|\n)+);/ : /exports\.locals = ((.|\n)+);/;
    var match = m.source.match(regex);
    cssModules[name] = match ? JSON.parse(match[1]) : {};
  });

  // Find compiled images in modules
  // it will be used to map original filename to the compiled one
  // for server side rendering
  const imagesRegex = /\.(jpe?g|png|gif|svg)$/;
  const images = json.modules
    .filter(function(module) {
      return imagesRegex.test(module.name);
    })
    .map(function(image) {
      return {
        original: image.name,
        compiled: publicPath + image.assets[0]
      };
    });

  var content = {
    script: script,
    css: {
      files: cssFiles,
      modules: cssModules
    },
    images: images
  };

  fs.writeFileSync(filepath, JSON.stringify(content));

};
