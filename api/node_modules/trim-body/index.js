/**
 * Module Export
 */
module.exports = trimBody;


/**
 * Trim body or object's string values.
 *
 * @param {object} body
 */
function trimBody(body){
  if (Object.prototype.toString.call(body) === '[object Object]') {
    Object.keys(body).forEach(function (key){
      var value = body[key];

      if (typeof value === 'string')
        return body[key] = value.trim();

      if (typeof value === 'object')
        trimBody(value);
    });
  }
}