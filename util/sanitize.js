var check = require('validator').check,
    sanitize = require('validator').sanitize;

module.exports = function (str) {
  
  var str = sanitize(str).escape();
  
  return str;
};