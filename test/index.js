const path = require('path');
const expect = require('chai').expect;
const jsdom = require('jsdom');

describe('node acceptance tests', function() {
  beforeEach(function() {
    global.window = jsdom.jsdom().defaultView;
    global.navigator = window.navigator;
    global.document = window.document;
  });

  afterEach(function() {
    delete global.window;
    delete global.document;
  });

  it('can run in node', function() {
    require(path.join(process.cwd(), 'src', 'main'));

    expect(window.VRDisplay).to.be.ok;
  });
});
