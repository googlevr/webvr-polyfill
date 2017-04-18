const path = require('path');
const expect = require('chai').expect;
const jsdom = require('jsdom');

describe('node acceptance tests', function() {
  let _window;

  beforeEach(function() {
    _window = global.window = jsdom.jsdom().defaultView;
    global.navigator = _window.navigator;
    global.document = _window.document;
    Object.defineProperty(_window, 'WebVRConfig', {
      get() {
        return global.WebVRConfig;
      },
      set(WebVRConfig) {
        global.WebVRConfig = WebVRConfig;
      }
    });
  });

  afterEach(function() {
    delete global.window;
    delete global.document;
    delete global.WebVRConfig;
  });

  it('can run in node', function() {
    require(path.join(process.cwd(), 'src', 'main'));

    expect(_window.VRDisplay).to.be.ok;
  });
});
