'use strict';

var crypto = require('crypto');

function generateKeyHash(url, headers, varyHeader) {
  if (!varyHeader) return { url: url };

  var varySplit = varyHeader.toLowerCase().split(/,\s*/);
  if (!varySplit.length) return { url: url };

  varySplit.sort(); // Always keep the list in alphabetical order

  return varySplit.reduce(function(memo, vary) {
    memo['h.' + vary] = headers && headers[vary] || '';
    return memo;
  }, {
    url: url
  });
}

function hashKeyString(s) {
  var shasum = crypto.createHash('sha1');
  shasum.update(s);
  return shasum.digest('hex');
}

module.exports = function(url, headers, varyHeader) {
  var hash = generateKeyHash(url, headers, varyHeader);
  return hashKeyString(JSON.stringify(hash));
};
