var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var Writer = require('broccoli-writer');
var Promise = require('rsvp').Promise;

Fingerprint.prototype = Object.create(Writer.prototype);
Fingerprint.prototype.constructor = Fingerprint;
function Fingerprint (inputTree, options) {
  if (!(this instanceof Fingerprint)) return new Fingerprint(inputTree, options);

  this.inputTree = inputTree;
  this.options = options || { };
  this.options.encoding = this.options.encoding || 'utf8';
  this.options.separator = this.options.separator || '-';
}

Fingerprint.prototype.write = function (readTree, destDir) {
  var options = this.options;
  var inputTree = this.inputTree;

  function fingerprint(inputTreepath, filename) {
    var filepath = path.join(inputTreepath, filename);
    var file = fs.readFileSync(filepath);

    var md5 = crypto.createHash('md5');
    md5.update(file);
    var hex = md5.digest('hex');

    var extname =  path.extname(filename);
    var basename =  path.basename(filename, extname);
    return {
      name: [basename, hex+extname].join(options.separator)
    , contents: file
    };
  }

  return new Promise(function (resolve, reject) {
    readTree(inputTree).then(function (inputTreepath) {
      fs.readdir(inputTreepath, function (err, files) {
        if (err) return reject(err);
        files.forEach(function (file) {
          var fp = fingerprint(inputTreepath, file);
          fs.writeFileSync(path.join(destDir, fp.name), fp.contents, {encoding: options.encoding});
        });
        resolve();
      });

    }, reject);
  });

};

module.exports = Fingerprint;
