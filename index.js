var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var Filter = require('broccoli-filter');
var helpers = require('broccoli-kitchen-sink-helpers');

Fingerprint.prototype = Object.create(Filter.prototype);
Fingerprint.prototype.constructor = Fingerprint;
function Fingerprint (inputTree, options) {
  if (!(this instanceof Fingerprint)) return new Fingerprint(inputTree, options);

  this.inputTree = inputTree;
  options = options || {};

  if (typeof options.keepOriginal === 'undefined') {
    this.keepOriginal = true;
  } else {
    this.keepOriginal = options.keepOriginal;
  }

  this.extensions = options.extensions || ['js', 'css'];
  this.encoding = options.encoding || 'utf8';
  this.separator = options.separator || '-';
}

Fingerprint.prototype.processFile = function(srcDir, destDir, relativePath) {
  if (this.keepOriginal) {
    helpers.copyPreserveSync(srcDir + '/' + relativePath, destDir + '/' + relativePath);
  }

  return Filter.prototype.processFile.apply(this, arguments);
};

Fingerprint.prototype.processString = function(s) {
  return s;
};

Fingerprint.prototype.getDestFilePath = function(filename) {
  var filepath = path.join(this.inputTree.tmpDestDir, filename);
  var separator = this.separator;

  function fingerprint(dest) {
    var file = fs.readFileSync(filepath, { encoding: 'utf8' });

    var md5 = crypto.createHash('md5');
    md5.update(file);
    var hex = md5.digest('hex');

    var extname =  path.extname(dest);
    var basename =  path.basename(dest, extname);
    return [basename, hex+extname].join(separator);
  }

  var destFilePath = Filter.prototype.getDestFilePath.apply(this, arguments);
  if (destFilePath) return fingerprint(destFilePath);
};

module.exports = Fingerprint;
