## broccoli-fingerprint

[Broccoli](https://github.com/broccolijs/broccoli) plugin to fingerprint filenames of a tree of files.

### Install
```
npm install --save broccoli-fingerprint
```

### Example
```
var fingerprint = require('broccoli-fingerprint');
var tree = fingerprint(tree, {
  encoding:'utf8' //defualt
, separator: '-' // default
});

// Outputs:
// <filename>-47f1dd2de35b82f32922850d2eeec45a.js
```

