var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var Writer = require('broccoli-writer');
var helpers = require('broccoli-kitchen-sink-helpers');

var DEFAULTS = require('./defaults');

var Manifest = module.exports = function (inputTree, options) {
  if (!(this instanceof Manifest))
    return new Manifest(inputTree, options);

  options = options || {};

  this.separator = options.separator || DEFAULTS.separator;
  this.name = options.name || DEFAULTS.manifestName;
  this.extensions = options.extensions || DEFAULTS.extensions;
  this.inputTree = inputTree;
};

Manifest.prototype = Object.create(Writer.prototype);
Manifest.prototype.constructor = Manifest;

Manifest.prototype.write = function (readTree, destDir) {
  var name = this.name;
  var regex = new RegExp(this.separator+'([a-f0-9]{32}).('+this.extensions.join('|')+')$');

  return readTree(this.inputTree).then(function (srcDir) {
    var map = {};

    var files = helpers.multiGlob(['**/*'], { cwd: srcDir })
      .filter(function (file) { return regex.test(file); });

    files.forEach(function (file) {
      var extname = path.extname(file);
      var match = file.match(regex);
      var bareFilename = file.replace(match[0], '')+extname;
      map[bareFilename] = file;
    });

    var json = JSON.stringify(map, null, 2);
    var destFilepath = path.join(destDir, name);
    mkdirp.sync(path.dirname(destFilepath));
    fs.writeFileSync(destFilepath, json);
  });
};
