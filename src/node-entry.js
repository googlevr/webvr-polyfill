const jsdom = require('jsdom');

global.window = jsdom.jsdom().defaultView;
global.document = window.document;
global.navigator = window.navigator;

require('./main');
