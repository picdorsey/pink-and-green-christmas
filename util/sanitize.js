var check = require('validator').check,
    sanitize = require('validator').sanitize;

module.exports = function (str) {
  
  var str = sanitize(str).escape();
  sanitized = sanitize(str).entityEncode();

  return sanitized;
};