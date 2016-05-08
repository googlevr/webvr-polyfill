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
var Util = require('./util.js');
var WebVRPolyfill = require('./webvr-polyfill.js');

var RENAMED_BOOL_CONFIG_OPTIONS = {
  FORCE_ENABLE_VR: {
    new_key: 'ENABLE_VR',
    inverse: false
  },
  TOUCH_PANNER_DISABLED: {
    new_key: 'TOUCH_PANNER',
    inverse: true
  },
  MOUSE_KEYBOARD_CONTROLS_DISABLED: {
    new_key: 'MOUSE_KEYBOARD_CONTROLS',
    inverse: true
  },
  ENABLE_DEPRECATED_API: {
    new_key: 'USE_DEPRECATED_API',
    inverse: false
  }
};

// To be nice, we tell the developers of the renamed config options —
// and until deprecation is announced and known — we gracefully change the
// values for them if they are using the deprecated keys.
if (window.WebVRConfig) {
  var option;
  Object.keys(RENAMED_BOOL_CONFIG_OPTIONS).forEach(function (oldKey) {
    option = RENAMED_BOOL_CONFIG_OPTIONS[oldKey];
    if (oldKey in window.WebVRConfig) {
      // If necessary, inverse value of config option boolean.
      window.WebVRConfig[option.new_key] = option.inverse ? !window.WebVRConfig[oldKey] : window.WebVRConfig[oldKey];
      delete window.WebVRConfig[oldKey];
      console.warn(
        '`window.WebVRConfig.%s` is deprecated and will be removed soon. ' +
        'Please change to `window.WebVRConfig.%s = %s`.',
        oldKey,
        option.new_key,
        window.WebVRConfig[option.new_key]
      );
    }
  });
}

// Initialize a WebVRConfig just in case.
window.WebVRConfig = Util.extend({
  // Force availability of VR mode, even for non-mobile devices.
  ENABLE_VR: false,

  // Complementary filter coefficient. 0 for accelerometer, 1 for gyro.
  K_FILTER: 0.98,

  // How far into the future to predict during fast motion (in seconds).
  PREDICTION_TIME_S: 0.040,

  // Flag to enable touch panner. You may want to disable if you have your
  // own touch controls.
  TOUCH_PANNER: true,

  // Enable yaw panning only, disabling roll and pitch. This can be useful
  // for panoramas with nothing interesting above or below.
  YAW_ONLY: false,

  // To toggle keyboard and mouse controls, if you want to use your own
  // implementation.
  MOUSE_KEYBOARD_CONTROLS: true,

  // Prevent the polyfill from initializing immediately. Requires the app
  // to call InitializeWebVRPolyfill() before it can be used.
  DEFER_INITIALIZATION: false,

  // Enable the deprecated version of the API (navigator.getVRDevices).
  USE_DEPRECATED_API: false,

  // Scales the recommended buffer size reported by WebVR, which can improve
  // performance.
  // UPDATE(2016-05-03): Setting this to 0.5 by default since 1.0 does not
  // perform well on many mobile devices.
  BUFFER_SCALE: 0.5,

  // Allow VRDisplay.submitFrame to change gl bindings, which is more
  // efficient if the application code will re-bind its resources on the
  // next frame anyway. This has been seen to cause rendering glitches with
  // THREE.js.
  // Dirty bindings include: gl.FRAMEBUFFER_BINDING, gl.CURRENT_PROGRAM,
  // gl.ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING,
  // and gl.TEXTURE_BINDING_2D for texture unit 0.
  DIRTY_SUBMIT_FRAME_BINDINGS: false
}, window.WebVRConfig);

if (!window.WebVRConfig.DEFER_INITIALIZATION) {
  new WebVRPolyfill();
} else {
  window.InitializeWebVRPolyfill = function() {
    new WebVRPolyfill();
  }
}
