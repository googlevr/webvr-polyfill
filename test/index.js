'use strict';

const path = require('path');
const expect = require('chai').expect;
const jsdom = require('jsdom');

describe('node acceptance tests', function() {
  beforeEach(function() {
    global.window = jsdom.jsdom().defaultView;
  });

  afterEach(function() {
    delete global.window;
  });

  it('can run in node', function() {
    require(path.join(process.cwd(), 'src', 'node-entry'));

    expect(window.VRDisplay).to.be.ok;
  });
});
