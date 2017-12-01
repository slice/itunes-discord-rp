const { promisify } = require('util');
const applescript = require('applescript');

module.exports = promisify(applescript.execString);
