# WebVR Polyfill

[![Build Status](http://img.shields.io/travis/googlevr/webvr-polyfill.svg?style=flat-square)](https://travis-ci.org/googlevr/webvr-polyfill)
[![Build Status](http://img.shields.io/npm/v/webvr-polyfill.svg?style=flat-square)](https://www.npmjs.org/package/webvr-polyfill)


A JavaScript implementation of the [WebVR spec][spec]. This project lets you use
WebVR today, without requiring a [special][moz] [browser][cr] build. It also
lets you view the same content without requiring a virtual reality viewer.

Take a look at [basic WebVR samples][samples] that use this polyfill.

[moz]: http://mozvr.com/
[cr]: https://drive.google.com/folderview?id=0BzudLt22BqGRbW9WTHMtOWMzNjQ
[samples]: https://toji.github.io/webvr-samples/
[spec]: https://mozvr.github.io/webvr-spec/

## Implementation

The polyfill decides which VRDisplays to provide, depending on the configuration
of your browser. Mobile devices provide the `CardboardVRDisplay`. Desktop devices
use the `MouseKeyboardVRDisplay`.

`CardboardVRDisplay` uses DeviceMotionEvents to implement a complementary
filter which does [sensor fusion and pose prediction][fusion] to provide
orientation tracking. It can also render in stereo mode, and includes mesh-based
lens distortion. This display also includes user interface elements in VR mode
to make the VR experience more intuitive, including:

- A gear icon to select your VR viewer.
- A back button to exit VR mode.
- An interstitial which only appears in portrait orientation, requesting you switch
  into landscape orientation (if [orientation lock][ol] is not available).

`MouseKeyboardVRDisplay` uses mouse events to allow you to do the equivalent of
mouselook. It also uses keyboard arrows keys to look around the scene
with the keyboard.

[fusion]: http://smus.com/sensor-fusion-prediction-webvr/
[ol]: https://www.w3.org/TR/screen-orientation/


## Configuration

The polyfill can be configured and debugged with various options. The following
are supported:

```javascript
WebVRConfig = {
  // Flag to disabled the UI in VR Mode.
  CARDBOARD_UI_DISABLED: false, // Default: false

  // Forces availability of VR mode, even for non-mobile devices.
  FORCE_ENABLE_VR: true, // Default: false.

  // Complementary filter coefficient. 0 for accelerometer, 1 for gyro.
  K_FILTER: 0.98, // Default: 0.98.

  // Flag to disable the instructions to rotate your device.
  ROTATE_INSTRUCTIONS_DISABLED: false, // Default: false.

  // How far into the future to predict during fast motion (in seconds).
  PREDICTION_TIME_S: 0.040, // Default: 0.040.

  // Flag to disable touch panner. In case you have your own touch controls.
  TOUCH_PANNER_DISABLED: false, // Default: true.

  // Enable yaw panning only, disabling roll and pitch. This can be useful
  // for panoramas with nothing interesting above or below.
  YAW_ONLY: true, // Default: false.

  // To disable keyboard and mouse controls, if you want to use your own
  // implementation.
  MOUSE_KEYBOARD_CONTROLS_DISABLED: true, // Default: false.

  // Prevent the polyfill from initializing immediately. Requires the app
  // to call InitializeWebVRPolyfill() before it can be used.
  DEFER_INITIALIZATION: true, // Default: false.

  // Enable the deprecated version of the API (navigator.getVRDevices).
  ENABLE_DEPRECATED_API: true, // Default: false.

  // Scales the recommended buffer size reported by WebVR, which can improve
  // performance.
  BUFFER_SCALE: 0.5, // Default: 0.5.

  // Allow VRDisplay.submitFrame to change gl bindings, which is more
  // efficient if the application code will re-bind its resources on the
  // next frame anyway. This has been seen to cause rendering glitches with
  // THREE.js.
  // Dirty bindings include: gl.FRAMEBUFFER_BINDING, gl.CURRENT_PROGRAM,
  // gl.ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING,
  // and gl.TEXTURE_BINDING_2D for texture unit 0.
  DIRTY_SUBMIT_FRAME_BINDINGS: true, // Default: false.

  // When set to true, this will cause a polyfilled VRDisplay to always be
  // appended to the list returned by navigator.getVRDisplays(), even if that
  // list includes a native VRDisplay.
  ALWAYS_APPEND_POLYFILL_DISPLAY: false,

  // There are versions of Chrome (M58-M60?) where the native WebVR API exists,
  // and instead of returning 0 VR displays when none are detected,
  // `navigator.getVRDisplays()`'s promise never resolves. This results
  // in the polyfill hanging and not being able to provide fallback
  // displays, so set a timeout in milliseconds to stop waiting for a response
  // and just use polyfilled displays.
  // https://bugs.chromium.org/p/chromium/issues/detail?id=727969
  GET_VR_DISPLAYS_TIMEOUT: 1000,
}
```

## Performance

Performance is critical for VR. If you find your application is too sluggish,
consider tweaking some of the above parameters. In particular, keeping
`BUFFER_SCALE` at 0.5 (the default) will likely help a lot.

## WebVR 1.1 Shim

The polyfill exposes a helper method `WebVRPolyfill.InstallWebVRSpecShim` which
installs a shim that updates a WebVR 1.0 spec implementation to WebVR 1.1.

## Development

If you'd like to contribute to the `webvr-poyfill` library, check out
the repository and install
[Node](https://nodejs.org/en/download/package-manager/) and the dependencies:

```bash
git clone https://github.com/googlevr/webvr-polyfill
cd webvr-polyfill
npm install
```

### Development Commands

* `npm install`: installs the dependencies.
* `npm start`: auto-builds the module whenever any source changes and serves the example
content on `http://0.0.0.0:8080/`.
* `npm run build`: builds the module.

## License

This program is free software for both commercial and non-commercial use,
distributed under the [Apache 2.0 License](LICENSE).


## Thanks

- [Brandon Jones][bj] and [Vladimir Vukicevic][vv] for their work on the [WebVR
  spec][spec].
- [Ricardo Cabello][doob] for THREE.js.
- [Diego Marcos][dm] for VREffect and VRControls.
- [Dmitriy Kovalev][dk] for help with lens distortion correction.

[dk]: https://github.com/dmitriykovalev/
[bj]: https://twitter.com/tojiro
[vv]: https://twitter.com/vvuk
[spec]: https://mozvr.github.io/webvr-spec/
[dm]: https://twitter.com/dmarcos
[doob]: https://twitter.com/mrdoob
