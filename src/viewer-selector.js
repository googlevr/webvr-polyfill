/*
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Emitter = require('./emitter.js');

var IFRAME_ORIGIN = 'https://embed.whatcardboard.com';
var IFRAME_URL = IFRAME_ORIGIN + '/v0/1/iframe/';
var CLASS_NAME = 'webvr-polyfill-viewer-selector';

/**
 * Creates a viewer selector with the options specified. Supports being shown
 * and hidden. Generates events when viewer parameters change. Also supports
 * saving the currently selected index in localStorage.
 */
function ViewerSelector(root) {
  this.root = root;

  this.iframe = document.createElement('iframe');
  this.iframe.src = IFRAME_URL;

  this.dialog = this.createDialog_();

  // Buffer messages until iframe is loaded
  this.messageQueue_ = [];
  this.iframe.addEventListener('load', this.unqueueMessages_.bind(this));

  window.addEventListener('message', this.receiveMessage_.bind(this));
}
ViewerSelector.prototype = new Emitter();
ViewerSelector.prototype.receiveMessage_ = function(evt) {
  if (evt.origin == IFRAME_ORIGIN) {
    return this.handleMessage_(evt.data);
  }
};
ViewerSelector.prototype.handleMessage_ = function(message) {
  switch (message.type) {
    case 'ready': return this.handleReadyMessage_(message);
    case 'deviceprofile': return this.handleDeviceProfileMessage_(message);
  }
};
ViewerSelector.prototype.handleReadyMessage_ = function(message) {
  if (message.presentable && this.showing_) {
    this.unhide_();
  }
};
ViewerSelector.prototype.handleDeviceProfileMessage_ = function(message) {
  this.emit('profile', message.profile);
};
ViewerSelector.prototype.postIframeMessage_ = function(message) {
  return this.iframe.contentWindow.postMessage(message, IFRAME_ORIGIN);
};
ViewerSelector.prototype.sendMessage_ = function(message) {
  if (this.messageQueue_) {
    this.messageQueue_.push(message);
  } else {
    return this.postIframeMessage_(message);
  }
};
ViewerSelector.prototype.unqueueMessages_ = function() {
  if (this.messageQueue_) {
    for (var i = 0; i < this.messageQueue_.length; i++) {
      this.postIframeMessage_(this.messageQueue_[i]);
    }
    this.messageQueue_ = null;
    this.iframe.removeEventListener('load', this.initialIframeLoadListener_);
  }
};

ViewerSelector.prototype.unhide_ = function() {
  // Show the UI.
  this.dialog.style.display = 'block';
};
ViewerSelector.prototype.show = function(root) {
  this.root = root;

  // re-establish the message queue,
  // as moving the iframe in the DOM will cause it to reload
  this.dialog.parentElement.removeChild(this.dialog);
  this.messageQueue_ = [];
  root.appendChild(this.dialog);

  //console.log('ViewerSelector.show');
  this.showing_ = true;
  return this.sendMessage_({type: 'present'});
};

ViewerSelector.prototype.hide = function() {
  this.showing_ = false;
  //console.log('ViewerSelector.hide');
  this.dialog.style.display = 'none';
};

ViewerSelector.prototype.queryCurrentViewerProfile = function() {
  this.sendMessage_({type: 'query'});
};

/**
 * Creates the dialog.
 */
ViewerSelector.prototype.createDialog_ = function(options) {
  var container = document.createElement('div');
  container.classList.add(CLASS_NAME);
  container.style.display = 'none';
  // Create an overlay that dims the background, and which goes away when you
  // tap it.
  var overlay = document.createElement('div');
  var s = overlay.style;
  s.position = 'fixed';
  s.left = 0;
  s.top = 0;
  s.width = '100%';
  s.height = '100%';
  s.background = 'rgba(0, 0, 0, 0.3)';
  overlay.addEventListener('click', this.hide.bind(this));

  s = this.iframe.style;
  s.boxSizing = 'border-box';
  s.position = 'fixed';
  s.top = '24px';
  s.left = '25%';
  s.width = '50%';
  s.height = '80%';
  s.right = '24px';
  s.padding = '24px';
  s.background = '#fafafa';
  s.border = 'none';
  s.boxShadow = '0px 5px 20px #666';

  container.appendChild(overlay);
  container.appendChild(this.iframe);
  document.body.appendChild(container);

  return container;
};

module.exports = ViewerSelector;
