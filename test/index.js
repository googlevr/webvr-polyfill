'use strict';

const path = require('path');
const expect = require('chai').expect;

describe('node acceptance tests', function() {
  it('can run in node', function() {
    require(path.join(process.cwd(), 'src', 'node-entry'));

    expect(window.VRDisplay).to.be.ok;
  });
});
