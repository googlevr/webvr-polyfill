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
var HMDVRDevice = require('./base.js').HMDVRDevice;

var INTERPUPILLARY_DISTANCE = 0.064;
var DEFAULT_MAX_FOV_TOP = 53.09438705444336;
var DEFAULT_MAX_FOV_BOTTOM = 53.09438705444336;
var DEFAULT_MAX_FOV_OUTER = 46.63209533691406;
var DEFAULT_MAX_FOV_INNER = 47.52769470214844;

/**
 * The HMD itself, providing rendering parameters.
 */
function CardboardHMDVRDevice() {
  // From com/google/vrtoolkit/cardboard/FieldOfView.java.
  this.fovLeft = {
    upDegrees: DEFAULT_MAX_FOV_TOP,
    downDegrees: DEFAULT_MAX_FOV_BOTTOM,
    leftDegrees: DEFAULT_MAX_FOV_OUTER,
    rightDegrees: DEFAULT_MAX_FOV_INNER
  };
  this.fovRight = {
    upDegrees: DEFAULT_MAX_FOV_TOP,
    downDegrees: DEFAULT_MAX_FOV_BOTTOM,
    leftDegrees: DEFAULT_MAX_FOV_INNER,
    rightDegrees: DEFAULT_MAX_FOV_OUTER
  };
  // Set display constants.
  this.eyeTranslationLeft = {
    x: INTERPUPILLARY_DISTANCE * -0.5,
    y: 0,
    z: 0
  };
  this.eyeTranslationRight = {
    x: INTERPUPILLARY_DISTANCE * 0.5,
    y: 0,
    z: 0
  };
}
CardboardHMDVRDevice.prototype = new HMDVRDevice();

CardboardHMDVRDevice.prototype.getEyeParameters = function(whichEye) {
  var eyeTranslation, fov;
  if (whichEye == 'left') {
    eyeTranslation = this.eyeTranslationLeft;
    fov = this.fovLeft;
  } else if (whichEye == 'right') {
    eyeTranslation = this.eyeTranslationRight;
    fov = this.fovRight;
  } else {
    console.error('Invalid eye provided: %s', whichEye);
    return null;
  }
  return {
    recommendedFieldOfView: fov,
    eyeTranslation: eyeTranslation
  };
};

module.exports = CardboardHMDVRDevice;
