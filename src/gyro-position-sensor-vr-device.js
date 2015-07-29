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
var PositionSensorVRDevice = require('./base.js').PositionSensorVRDevice;
var THREE = require('./three-math.js');

// How much to interpolate between the current orientation estimate and the
// previous estimate position. This is helpful for devices with low
// deviceorientation firing frequency (eg. on iOS, it is 20 Hz).
// The larger this value (in [0, 1]), the smoother but more delayed the
// head tracking is.
var SMOOTHING_FACTOR = 0.4;

/**
 * The positional sensor, implemented using web DeviceOrientation APIs.
 */
function GyroPositionSensorVRDevice() {
  this.deviceId = 'webvr-polyfill:gyro';
  this.deviceName = 'VR Position Device (webvr-polyfill:gyro)';

  // Subscribe to deviceorientation events.
  window.addEventListener('deviceorientation', this.onDeviceOrientationChange.bind(this));
  window.addEventListener('orientationchange', this.onScreenOrientationChange.bind(this));
  this.deviceOrientation = null;
  this.screenOrientation = window.orientation;

  // The last orientation (for smooth interpolation).
  this.lastOrientation = new THREE.Quaternion();

  // Helper objects for calculating orientation.
  this.finalQuaternion = new THREE.Quaternion();
  this.tmpQuaternion = new THREE.Quaternion();
  this.deviceEuler = new THREE.Euler();
  this.screenTransform = new THREE.Quaternion();
  // -PI/2 around the x-axis.
  this.worldTransform = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
}
GyroPositionSensorVRDevice.prototype = new PositionSensorVRDevice();

/**
 * Returns {orientation: {x,y,z,w}, position: null}.
 * Position is not supported since we can't do 6DOF.
 */
GyroPositionSensorVRDevice.prototype.getState = function() {
  return {
    hasOrientation: true,
    orientation: this.getOrientation(),
    hasPosition: false,
    position: null
  }
};

GyroPositionSensorVRDevice.prototype.onDeviceOrientationChange =
    function(deviceOrientation) {
  this.deviceOrientation = deviceOrientation;
};

GyroPositionSensorVRDevice.prototype.onScreenOrientationChange =
    function(screenOrientation) {
  this.screenOrientation = window.orientation;
};


var degreeToRadiansFactor = Math.PI / 180.0;
function degToRad(degrees) {
  return degrees * degreeToRadiansFactor;
}

GyroPositionSensorVRDevice.prototype.getOrientation = function() {
  if (this.deviceOrientation == null) {
    return null;
  }

  // Rotation around the z-axis.
  var alpha = degToRad(this.deviceOrientation.alpha);
  // Front-to-back (in portrait) rotation (x-axis).
  var beta = degToRad(this.deviceOrientation.beta);
  // Left to right (in portrait) rotation (y-axis).
  var gamma = degToRad(this.deviceOrientation.gamma);
  var orient = degToRad(this.screenOrientation);

  // Use three.js to convert to quaternion. Lifted from
  // https://github.com/richtr/threeVR/blob/master/js/DeviceOrientationController.js
  this.deviceEuler.set(beta, alpha, -gamma, 'YXZ');
  this.finalQuaternion.setFromEuler(this.deviceEuler);
  this.minusHalfAngle = -orient / 2;
  this.screenTransform.set(0, Math.sin(this.minusHalfAngle), 0, Math.cos(this.minusHalfAngle));
  this.finalQuaternion.multiply(this.screenTransform);
  this.finalQuaternion.multiply(this.worldTransform);

  // Get the last orientation ready for use.
  this.tmpQuaternion.copy(this.lastOrientation);

  // Save this result as the last orientation.
  this.lastOrientation.copy(this.finalQuaternion);

  // Interpolate between the new estimate and the last quaternion.
  this.finalQuaternion.slerp(this.tmpQuaternion, SMOOTHING_FACTOR);

  return this.finalQuaternion;
};


module.exports = GyroPositionSensorVRDevice;
