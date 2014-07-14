## broccoli-fingerprint

[Broccoli](https://github.com/broccolijs/broccoli) plugin to fingerprint filenames of a tree of files. It optionaly generates a json manifest file mapping the original filenames to the fingerprinted ones.

### Install
```
npm install --save broccoli-fingerprint
```

### Example
```js
var fingerprint = require('broccoli-fingerprint');

// Example with default options
var tree = fingerprint(tree, {
  encoding:'utf8'
, separator: '-'
, keepOriginal: true
, extensions: ['js', 'css']
});

// Example output:
// <filename>-47f1dd2de35b82f32922850d2eeec45a.js
// <filename>-34c50157779f988854aeb7f451beae74.css

// Example with default options
var manifestTree = fingerprint.manifest(tree, {
  extensions: ['js', 'css']
, name: 'fingerprint-manifest.json'
});

// Example manifest file: 'fingerprint-manifest.json'
{
  "app.css": "app-47f1dd2de35b82f32922850d2eeec45a.css"
  "app.js": "app-34c50157779f988854aeb7f451beae74.js"
}

```

