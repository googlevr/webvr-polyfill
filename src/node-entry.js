// if running in node and there is a window mock available,
// globalize its members where needed
if (global && global.window) {
  global.document = global.window.document;
  global.navigator = global.window.navigator;
}

require('./main');
