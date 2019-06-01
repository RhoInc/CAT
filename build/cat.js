(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.cat = factory());
}(this, (function () { 'use strict';

  /**
   * @this {Promise}
   */
  function finallyConstructor(callback) {
    var constructor = this.constructor;
    return this.then(
      function(value) {
        return constructor.resolve(callback()).then(function() {
          return value;
        });
      },
      function(reason) {
        return constructor.resolve(callback()).then(function() {
          return constructor.reject(reason);
        });
      }
    );
  }

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}

  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function() {
      fn.apply(thisArg, arguments);
    };
  }

  /**
   * @constructor
   * @param {Function} fn
   */
  function Promise$1(fn) {
    if (!(this instanceof Promise$1))
      throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    /** @type {!number} */
    this._state = 0;
    /** @type {!boolean} */
    this._handled = false;
    /** @type {Promise|undefined} */
    this._value = undefined;
    /** @type {!Array<!Function>} */
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise$1._immediateFn(function() {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self)
        throw new TypeError('A promise cannot be resolved with itself.');
      if (
        newValue &&
        (typeof newValue === 'object' || typeof newValue === 'function')
      ) {
        var then = newValue.then;
        if (newValue instanceof Promise$1) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise$1._immediateFn(function() {
        if (!self._handled) {
          Promise$1._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  /**
   * @constructor
   */
  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(
        function(value) {
          if (done) return;
          done = true;
          resolve(self, value);
        },
        function(reason) {
          if (done) return;
          done = true;
          reject(self, reason);
        }
      );
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise$1.prototype['catch'] = function(onRejected) {
    return this.then(null, onRejected);
  };

  Promise$1.prototype.then = function(onFulfilled, onRejected) {
    // @ts-ignore
    var prom = new this.constructor(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise$1.prototype['finally'] = finallyConstructor;

  Promise$1.all = function(arr) {
    return new Promise$1(function(resolve, reject) {
      if (!arr || typeof arr.length === 'undefined')
        throw new TypeError('Promise.all accepts an array');
      var args = Array.prototype.slice.call(arr);
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(
                val,
                function(val) {
                  res(i, val);
                },
                reject
              );
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise$1.resolve = function(value) {
    if (value && typeof value === 'object' && value.constructor === Promise$1) {
      return value;
    }

    return new Promise$1(function(resolve) {
      resolve(value);
    });
  };

  Promise$1.reject = function(value) {
    return new Promise$1(function(resolve, reject) {
      reject(value);
    });
  };

  Promise$1.race = function(values) {
    return new Promise$1(function(resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise$1._immediateFn =
    (typeof setImmediate === 'function' &&
      function(fn) {
        setImmediate(fn);
      }) ||
    function(fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise$1._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /** @suppress {undefinedVars} */
  var globalNS = (function() {
    // the only reliable means to get the global object is
    // `Function('return this')()`
    // However, this causes CSP violations in Chrome apps.
    if (typeof self !== 'undefined') {
      return self;
    }
    if (typeof window !== 'undefined') {
      return window;
    }
    if (typeof global !== 'undefined') {
      return global;
    }
    throw new Error('unable to locate global object');
  })();

  if (!('Promise' in globalNS)) {
    globalNS['Promise'] = Promise$1;
  } else if (!globalNS.Promise.prototype['finally']) {
    globalNS.Promise.prototype['finally'] = finallyConstructor;
  }

  if (typeof Object.assign != 'function') {
      Object.defineProperty(Object, 'assign', {
          value: function assign(target, varArgs) {

              if (target == null) {
                  // TypeError if undefined or null
                  throw new TypeError('Cannot convert undefined or null to object');
              }

              var to = Object(target);

              for (var index = 1; index < arguments.length; index++) {
                  var nextSource = arguments[index];

                  if (nextSource != null) {
                      // Skip over if undefined or null
                      for (var nextKey in nextSource) {
                          // Avoid bugs when hasOwnProperty is shadowed
                          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                              to[nextKey] = nextSource[nextKey];
                          }
                      }
                  }
              }

              return to;
          },
          writable: true,
          configurable: true
      });
  }

  if (!Array.prototype.find) {
      Object.defineProperty(Array.prototype, 'find', {
          value: function value(predicate) {
              // 1. Let O be ? ToObject(this value).
              if (this == null) {
                  throw new TypeError('"this" is null or not defined');
              }

              var o = Object(this);

              // 2. Let len be ? ToLength(? Get(O, 'length')).
              var len = o.length >>> 0;

              // 3. If IsCallable(predicate) is false, throw a TypeError exception.
              if (typeof predicate !== 'function') {
                  throw new TypeError('predicate must be a function');
              }

              // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
              var thisArg = arguments[1];

              // 5. Let k be 0.
              var k = 0;

              // 6. Repeat, while k < len
              while (k < len) {
                  // a. Let Pk be ! ToString(k).
                  // b. Let kValue be ? Get(O, Pk).
                  // c. Let testResult be ToBoolean(? Call(predicate, T, � kValue, k, O �)).
                  // d. If testResult is true, return kValue.
                  var kValue = o[k];
                  if (predicate.call(thisArg, kValue, k, o)) {
                      return kValue;
                  }
                  // e. Increase k by 1.
                  k++;
              }

              // 7. Return undefined.
              return undefined;
          }
      });
  }

  if (!Array.prototype.findIndex) {
      Object.defineProperty(Array.prototype, 'findIndex', {
          value: function value(predicate) {
              // 1. Let O be ? ToObject(this value).
              if (this == null) {
                  throw new TypeError('"this" is null or not defined');
              }

              var o = Object(this);

              // 2. Let len be ? ToLength(? Get(O, "length")).
              var len = o.length >>> 0;

              // 3. If IsCallable(predicate) is false, throw a TypeError exception.
              if (typeof predicate !== 'function') {
                  throw new TypeError('predicate must be a function');
              }

              // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
              var thisArg = arguments[1];

              // 5. Let k be 0.
              var k = 0;

              // 6. Repeat, while k < len
              while (k < len) {
                  // a. Let Pk be ! ToString(k).
                  // b. Let kValue be ? Get(O, Pk).
                  // c. Let testResult be ToBoolean(? Call(predicate, T, � kValue, k, O �)).
                  // d. If testResult is true, return k.
                  var kValue = o[k];
                  if (predicate.call(thisArg, kValue, k, o)) {
                      return k;
                  }
                  // e. Increase k by 1.
                  k++;
              }

              // 7. Return -1.
              return -1;
          }
      });
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function getVersions(repo) {
      var apiURL = this.config.apiURL + '/' + repo;
      var branches = fetch(apiURL + '/branches').then(function (response) {
          return response.json();
      });
      var releases = fetch(apiURL + '/releases').then(function (response) {
          return response.json();
      });

      return Promise.all([branches, releases]).then(function (values) {
          var _values = slicedToArray(values, 2),
              branches = _values[0],
              releases = _values[1];

          branches.sort(function (a, b) {
              return a.name === 'master' ? -1 : b.name === 'master' ? 1 : a.name < b.name ? -1 : 1;
          });
          return d3.merge(values);
      }).catch(function (err) {
          console.log(err);
      });
  }

  function updateSelect(select, data) {
      select.selectAll('option').data(data).enter().append('option').text(function (d) {
          return d.label;
      });
  }

  function loadPackageJSON(repo, version) {
      var cdnURL = this.config.cdnURL + '/' + repo;
      var pkgURL = version === 'master' ? cdnURL + '/package.json' : cdnURL + '@' + version + '/package.json';

      return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', pkgURL);
          xhr.onload = function () {
              if (this.status === 200) {
                  resolve(xhr.response);
              } else {
                  reject({
                      status: this.status,
                      statusTxt: xhr.statusText
                  });
              }
          };
          xhr.onerror = function () {
              reject({
                  status: this.status,
                  statusText: xhr.statusText
              });
          };
          xhr.send();
      });
  }

  // Nice script loader from here: https://stackoverflow.com/questions/538745/how-to-tell-if-a-script-tag-failed-to-load

  function scriptLoader() {}

  scriptLoader.prototype = {
      timer: function timer(times, // number of times to try
      delay, // delay per try
      delayMore, // extra delay per try (additional to delay)
      test, // called each try, timer stops if this returns true
      failure, // called on failure
      result // used internally, shouldn't be passed
      ) {
          var me = this;
          if (times == -1 || times > 0) {
              setTimeout(function () {
                  result = test() ? 1 : 0;
                  me.timer(result ? 0 : times > 0 ? --times : times, delay + (delayMore ? delayMore : 0), delayMore, test, failure, result);
              }, result || delay < 0 ? 0.1 : delay);
          } else if (typeof failure == 'function') {
              setTimeout(failure, 1);
          }
      },

      addEvent: function addEvent(el, eventName, eventFunc) {
          if ((typeof el === 'undefined' ? 'undefined' : _typeof(el)) != 'object') {
              return false;
          }

          if (el.addEventListener) {
              el.addEventListener(eventName, eventFunc, false);
              return true;
          }

          if (el.attachEvent) {
              el.attachEvent('on' + eventName, eventFunc);
              return true;
          }

          return false;
      },

      // add script to dom
      require: function require(url, args) {
          var me = this;
          args = args || {};

          var scriptTag = document.createElement('script');
          var headTag = document.getElementsByTagName('head')[0];
          if (!headTag) {
              return false;
          }

          setTimeout(function () {
              var f = typeof args.success == 'function' ? args.success : function () {};
              args.failure = typeof args.failure == 'function' ? args.failure : function () {};
              var fail = function fail() {
                  if (!scriptTag.__es) {
                      scriptTag.__es = true;
                      scriptTag.id = 'failed';
                      args.failure(scriptTag);
                  }
              };
              scriptTag.onload = function () {
                  scriptTag.id = 'loaded';
                  f(scriptTag);
              };
              scriptTag.type = 'text/javascript';
              scriptTag.async = typeof args.async == 'boolean' ? args.async : false;
              scriptTag.charset = 'utf-8';
              me.__es = false;
              me.addEvent(scriptTag, 'error', fail); // when supported
              // when error event is not supported fall back to timer
              me.timer(15, 1000, 0, function () {
                  return scriptTag.id == 'loaded';
              }, function () {
                  if (scriptTag.id != 'loaded') {
                      fail();
                  }
              });
              scriptTag.src = url;
              setTimeout(function () {
                  try {
                      headTag.appendChild(scriptTag);
                  } catch (e) {
                      fail();
                  }
              }, 1);
          }, typeof args.delay == 'number' ? args.delay : 1);
          return scriptTag;
      }
  };

  function loadFiles(repo, pkg, branch, css) {
      var version = branch || pkg.version;
      var cdnURL = this.config.cdnURL + '/' + repo;

      //Load .css file
      if (css) {
          var cssURL = version === 'master' ? cdnURL + '/' + css : cdnURL + '@' + version + '/' + css;
          var link = document.createElement('link');
          link.href = cssURL;
          link.type = 'text/css';
          link.rel = 'stylesheet';
          document.getElementsByTagName('head')[0].appendChild(link);
      }

      //Load .js file
      var jsURL = version === 'master' ? cdnURL + '/' + pkg.main.replace(/^\.?\/?/, '') : cdnURL + '@' + version + '/' + pkg.main.replace(/^\.?\/?/, '');

      var loader = new scriptLoader();
      var script = loader.require(jsURL, {
          async: true,
          success: function success() {
              console.log('Loaded ' + jsURL + '.');
          },
          failure: function failure() {
              console.warn('Failed to load ' + jsURL + '.');
          }
      });
  }

  function updateFields(version) {
      var _this = this;

      this.controls.mainFunction.node().value = this.chartingApplication.main;
      this.controls.subFunction.node().value = this.chartingApplication.sub;
      this.controls.schema.node().value = this.chartingApplication.schema;
      this.controls.dataFileSelect.selectAll('option').property('selected', function (d) {
          return _this.chartingApplication.defaultData === d.label;
      });
  }

  var utilities = {
      getVersions: getVersions,
      updateSelect: updateSelect,
      loadPackageJSON: loadPackageJSON,
      loadFiles: loadFiles,
      scriptLoader: scriptLoader,
      updateFields: updateFields
  };

  var defaultSettings = {
      useServer: false,
      rootURL: 'https://github.com/RhoInc',
      dataURL: 'https://raw.githubusercontent.com/RhoInc/data-library/master/data/',
      chartingLibrary: {
          name: 'Webcharts',
          css: 'css/webcharts.css',
          versions: []
      },
      renderers: [],
      dataFiles: []
  };

  function setDefaults() {
      var _this = this;

      this.config.useServer = this.config.useServer || defaultSettings.useServer;
      this.config.rootURL = this.config.rootURL || defaultSettings.rootURL;
      this.config.apiURL = this.config.rootURL.replace('github.com', 'api.github.com/repos');
      this.config.cdnURL = this.config.rootURL.replace('github.com', 'cdn.jsdelivr.net/gh');
      this.config.dataURL = this.config.dataURL || defaultSettings.dataURL;
      this.config.chartingLibrary = this.config.chartingLibrary || defaultSettings.chartingLibrary;
      this.config.renderers = this.config.renderers || defaultSettings.renderers;
      this.config.dataFiles = this.config.dataFiles || defaultSettings.dataFiles;

      this.config.renderers.forEach(function (renderer) {
          renderer.label = renderer.label || renderer.name;
      });

      this.config.dataFiles = this.config.dataFiles.map(function (df) {
          return typeof df === 'string' ? { label: df, path: _this.config.dataURL, user_loaded: false } : df;
      });
  }

  function toggleDisplayOfControls() {
      var _this = this;

      var styleSheet = Array.from(document.styleSheets).find(function (styleSheet) {
          return styleSheet.href.indexOf('cat.css') > -1;
      });
      var controlsWidth = Array.from(styleSheet.cssRules).find(function (cssRule) {
          return cssRule.selectorText === '.cat-wrap .cat-controls';
      }).style.width;

      //Hide controls.
      this.hideControls.on('click', function () {
          _this.controls.wrap.classed('hidden', true);
          _this.chartWrap.style('margin-left', 0);
          _this.chartWrap.selectAll('.wc-chart').each(function (d) {
              try {
                  d.draw();
              } catch (error) {}
          });
          _this.dataWrap.style('margin-left', 0);
          _this.hideControls.classed('hidden', true);
          _this.showControls.classed('hidden', false);
      });

      //Show controls.
      this.showControls.on('click', function () {
          _this.controls.wrap.classed('hidden', false);
          _this.chartWrap.style('margin-left', controlsWidth);
          _this.chartWrap.selectAll('.wc-chart').each(function (d) {
              try {
                  d.draw();
              } catch (error) {}
          });
          _this.dataWrap.style('margin-left', controlsWidth);
          _this.hideControls.classed('hidden', false);
          _this.showControls.classed('hidden', true);
      });
  }

  function renderChart() {
      this.controls.submitWrap = this.controls.wrap.append('div').classed('control-section submit-section', true);
      this.controls.submitButton = this.controls.submitWrap.append('button').attr('class', 'submit').text('Render Chart');
  }

  function library() {
      this.controls.rendererWrap.append('span').text('Library: ');
      this.controls.rendererSelect = this.controls.rendererWrap.append('select');
      this.controls.rendererWrap.append('br');
  }

  function version() {
      this.controls.rendererWrap.append('span').text('Version: ');
      this.controls.versionSelect = this.controls.rendererWrap.append('select');
      this.controls.rendererWrap.append('br');
  }

  function init() {
      this.controls.rendererWrap.append('span').text(' Init: ');
      //.classed('hidden', true);
      this.controls.mainFunction = this.controls.rendererWrap.append('input'); //.classed('hidden', true);
      this.controls.rendererWrap.append('span').text('.');
      //.classed('hidden', true);
      this.controls.subFunction = this.controls.rendererWrap.append('input'); //.classed('hidden', true);
      this.controls.rendererWrap.append('br'); //.classed('hidden', true);
  }

  function webchartsVersion() {
      this.controls.rendererWrap.append('span').text('Webcharts Version: ');
      //.classed('hidden', true);
      this.controls.libraryVersion = this.controls.rendererWrap.append('select');
      //.classed('hidden', true);
      this.controls.rendererWrap.append('br'); //.classed('hidden', true);
  }

  function schema() {
      this.controls.rendererWrap.append('span').text('Schema: ');
      //.classed('hidden', true);
      this.controls.schema = this.controls.rendererWrap.append('input'); //.classed('hidden', true);
      this.controls.rendererWrap.append('br'); //.classed('hidden', true);
  }

  function chooseAChartingLibrary() {
      this.controls.rendererWrap = this.controls.wrap.append('div').classed('control-section renderer-section', true);
      this.controls.rendererWrap.append('h3').text('1. Choose a Charting Library');
      library.call(this);
      version.call(this);
      //moreOptions.call(this);
      init.call(this);
      schema.call(this);
      webchartsVersion.call(this);
  }

  function dataFile() {
      this.controls.dataFileSelect = this.controls.dataWrap.append('select');
  }

  function loadADataFile() {
      var loadLabel = this.controls.dataWrap.append('p').style('margin', 0);
      loadLabel.append('small').text('Use local .csv file:').append('sup').html('&#9432;').property('title', 'Render a chart using a local file. File is added to the data set list, and is only available for a single session and is not saved.').style('cursor', 'help');
      this.controls.loadStatus = loadLabel.append('small').attr('class', 'loadStatus').style('float', 'right').text('Select a csv to load');
      this.controls.dataFileLoad = this.controls.dataWrap.append('input').attr('type', 'file').attr('class', 'file-load-input');
      this.controls.dataFileLoadButton = this.controls.dataWrap.append('button').text('Load').attr('class', 'file-load-button').attr('disabled', true);
  }

  function chooseADataset() {
      this.controls.dataWrap = this.controls.wrap.append('div').classed('control-section data-section', true);
      this.controls.dataWrap.append('h3').text('2. Choose a Dataset');
      dataFile.call(this);
      this.controls.viewData = this.controls.dataWrap.append('span').html('&#128269;').style('cursor', 'pointer');
      loadADataFile.call(this);
  }

  function customizeTheChart() {
      this.controls.settingsWrap = this.controls.wrap.append('div').classed('control-section settings-section', true);
      this.controls.settingsWrap.append('h3').html('3. Customize the Chart ');
      this.controls.settingsWrap.append('span').text('Settings: ');
      this.controls.settingsTypeText = this.controls.settingsWrap.append('input').attr('class', 'radio').property('type', 'radio').property('name', 'settingsType').property('value', 'text');
      this.controls.settingsWrap.append('span').text('text');
      this.controls.settingsTypeForm = this.controls.settingsWrap.append('input').attr('class', 'radio').property('type', 'radio').property('name', 'settingsType').property('value', 'form');
      this.controls.settingsWrap.append('span').text('form');
      this.controls.settingsType = this.controls.settingsWrap.selectAll('input[type="radio"]');
      this.controls.settingsWrap.append('br');
      this.controls.settingsInput = this.controls.settingsWrap.append('textarea').attr('rows', 10).style('width', '90%').text('{}');
      this.controls.settingsForm = this.controls.settingsWrap.append('div').attr('class', 'settingsForm').append('form');
  }

  function environment() {
      this.controls.environmentWrap = this.controls.wrap.append('div').classed('control-section environment-section', true);
      this.controls.environmentWrap.append('h3').html('4. Environment ');
      this.controls.cssList = this.controls.environmentWrap.append('ul').attr('class', 'cssList');
      this.controls.cssList.append('h5').text('Loaded Stylesheets');
      this.controls.jsList = this.controls.environmentWrap.append('ul').attr('class', 'jsList');
      this.controls.jsList.append('h5').text('Loaded javascript');
  }

  function controls() {
      this.controls.wrap.append('h2').classed('cat-controls-header', true).text('Charting Application Tester 😼');
      renderChart.call(this);
      chooseAChartingLibrary.call(this);
      chooseADataset.call(this);
      customizeTheChart.call(this);
      environment.call(this);
  }

  function layout() {
      this.wrap = d3.select(this.element).append('div').attr('class', 'cat-wrap');

      //Controls display toggle
      this.hideControls = this.wrap.append('div').classed('cat-button cat-button--hide-controls', true).attr('title', 'Hide controls').text('<<');
      this.showControls = this.wrap.append('div').classed('cat-button cat-button--show-controls hidden', true).attr('title', 'Show controls').text('>>');
      toggleDisplayOfControls.call(this);

      //Controls
      this.controls.wrap = this.wrap.append('div').classed('cat-controls section', true);
      controls.call(this);

      //Chart
      this.chartWrap = this.wrap.append('div').classed('cat-chart section', true);

      //Table
      this.dataWrap = this.wrap.append('div').classed('cat-data section', true).classed('hidden', true);
  }

  function loadData() {
      this.utilities.updateSelect.call(this, this.controls.rendererSelect, this.config.renderers);
      this.utilities.updateSelect.call(this, this.controls.dataFileSelect, this.config.dataFiles);
  }

  function loadChartingLibrary() {
      var _this = this;

      this.utilities.getVersions.call(this, this.config.chartingLibrary.name).then(function (versions) {
          _this.config.chartingLibrary.versions = versions.map(function (version) {
              version.label = versions.tag_name ? version.tag_name : version.name;
              return version;
          });
          _this.utilities.updateSelect.call(_this, _this.controls.libraryVersion, _this.config.chartingLibrary.versions);
      });
      this.utilities.loadPackageJSON.call(this, this.config.chartingLibrary.name, 'master').then(function (pkg) {
          _this.config.chartingLibrary.pkg = JSON.parse(pkg);
          _this.utilities.loadFiles.call(_this, _this.config.chartingLibrary.name, _this.config.chartingLibrary.pkg, 'master', _this.config.chartingLibrary.css);
      });
  }

  function loadChartingApplication() {
      var _this = this;

      this.chartingApplication = this.config.renderers[0];
      this.utilities.getVersions.call(this, this.chartingApplication.name).then(function (versions) {
          _this.chartingApplication.versions = versions.map(function (version) {
              version.label = versions.tag_name ? version.tag_name : version.name;
              return version;
          });
          _this.utilities.updateSelect.call(_this, _this.controls.versionSelect, _this.chartingApplication.versions);
      });
      this.utilities.loadPackageJSON.call(this, this.chartingApplication.name, 'master').then(function (pkg) {
          _this.chartingApplication.pkg = JSON.parse(pkg);
          _this.utilities.loadFiles.call(_this, _this.chartingApplication.name, _this.chartingApplication.pkg, 'master', _this.chartingApplication.css);
          _this.utilities.updateFields.call(_this, _this.chartingApplication.main, _this.chartingApplication.sub, _this.chartingApplication.schema);
      });
  }

  function destroyChart() {
      if (this.chartingApplicationInstance) {
          if (this.chartingApplicationInstance && this.chartingApplicationInstance.destroy) {
              if (this.chartingApplicationInstance && this.chartingApplicationInstance.destroy) this.chartingApplicationInstance.destroy();
          } else {
              this.chartWrap.selectAll('.wc-chart').each(function (chart) {
                  if (chart.destroy) chart.destroy();else {
                      //remove resize event listener
                      select(window).on('resize.' + chart.element + chart.id, null);

                      //destroy controls
                      if (chart.controls) {
                          chart.controls.destroy();
                      }

                      //unmount chart wrapper
                      chart.wrap.remove();
                  }
              });
          }
      }

      this.chartWrap.selectAll('*').remove();
  }

  function loadData$1() {
      var dataFile = this.controls.dataFileSelect.node().value;
      this.dataObject = this.config.dataFiles.find(function (f) {
          return f.label == dataFile;
      });
      this.dataObject.dataFilePath = this.dataObject.path + dataFile;
      return fetch(this.dataObject.dataFilePath).then(function (response) {
          return response.text();
      }).then(function (text) {
          return d3.csv.parse(text);
      });
  }

  function initializeChart(data) {
      this.chartWrap.append('div').attr('class', 'chart');

      //Pass element and settings to charting application.
      if (this.chartingApplication.sub) {
          this.chartingApplicationInstance = window[this.chartingApplication.main][this.chartingApplication.sub]('.cat-chart .chart', this.chartingApplication.config || {});
      } else {
          this.chartingApplicationInstance = window[this.chartingApplication.main]('.cat-chart .chart', this.chartingApplication.config || {});
      }

      //Pass data to charting application.
      try {
          this.chartingApplicationInstance.init(data);
      } catch (err) {
          console.warn(err);
      }
  }

  /*
      1. Destroys the currently displayed chart if one has been rendered.
      2. Loads the selected data file.
      3. Initializes the selected charting application library.
  */

  function renderChart$1() {
      var _this = this;

      this.controls.submitButton.on('click', function () {
          _this.dataWrap.classed('hidden', true);
          _this.chartWrap.classed('hidden', false);
          destroyChart.call(_this);
          loadData$1.call(_this).then(function (json) {
              initializeChart.call(_this, json);
          });
      });
  }

  function changeLibrary() {
      var cat = this;

      this.controls.rendererSelect.on('change', function (d) {
          cat.chartingApplication = d3.select(this).selectAll('option:checked').datum();
          cat.chartingApplication.version = 'master';
          cat.controls.versionSelect.selectAll('option').property('selected', function (d) {
              return d.label === cat.chartingApplication.version;
          });
          cat.utilities.getVersions.call(cat, cat.chartingApplication.name).then(function (versions) {
              cat.chartingApplication.versions = versions.map(function (version) {
                  version.label = versions.tag_name ? version.tag_name : version.name;
                  return version;
              });
              cat.utilities.updateSelect.call(cat, cat.controls.versionSelect, cat.chartingApplication.versions);
          });
          cat.utilities.loadPackageJSON.call(cat, cat.chartingApplication.name, 'master').then(function (pkg) {
              cat.chartingApplication.pkg = JSON.parse(pkg);
              cat.utilities.loadFiles.call(cat, cat.chartingApplication.name, cat.chartingApplication.pkg, 'master', cat.chartingApplication.css);
              cat.utilities.updateFields.call(cat, cat.chartingApplication.main, cat.chartingApplication.sub, cat.chartingApplication.schema);
          });
      });
  }

  function changeLibraryVersion() {
      var cat = this;

      this.controls.versionSelect.on('change', function (d) {
          cat.chartingApplication.version = d3.select(this).selectAll('option:checked').datum().label;
          cat.utilities.loadPackageJSON.call(cat, cat.chartingApplication.name, cat.chartingApplication.version).then(function (pkg) {
              cat.chartingApplication.pkg = JSON.parse(pkg);
              cat.utilities.loadFiles.call(cat, cat.chartingApplication.name, cat.chartingApplication.pkg, cat.chartingApplication.version, cat.chartingApplication.css);
              cat.utilities.updateFields.call(cat, cat.chartingApplication.main, cat.chartingApplication.sub, cat.chartingApplication.schema);
          });
      });
  }

  function initializeControls() {
      renderChart$1.call(this);
      changeLibrary.call(this);
      changeLibraryVersion.call(this);
  }

  function init$1() {
      //settings
      setDefaults.call(this);

      //layout
      layout.call(this);

      //renderers and data files
      loadData.call(this);

      //load charting library
      loadChartingLibrary.call(this);

      //load charting application
      loadChartingApplication.call(this);

      //initialize controls
      initializeControls.call(this);
  }

  //import controls from './cat/controls';
  //import settings from './cat/settings';
  //import status from './cat/status';

  function createCat() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
      var config = arguments[1];

      var cat = {
          element: element,
          config: config,
          utilities: utilities,
          init: init$1,
          controls: {}
          //settings,
          //status
      };

      return cat;
  }

  var index = {
      createCat: createCat
  };

  return index;

})));
