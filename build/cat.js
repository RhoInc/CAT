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

  function init() {
      //layout the cat
      this.wrap = d3.select(this.element).append('div').attr('class', 'cat-wrap');
      this.layout(this);

      //initialize the settings
      this.setDefaults(this);

      //add others here!

      //create the controls
      this.controls.init(this);

      console.log(this);
  }

  function layout(cat) {
      /* Layout primary sections */
      cat.controls.wrap = cat.wrap.append('div').classed('cat-controls section', true);
      cat.chartWrap = cat.wrap.append('div').classed('cat-chart section', true);
      cat.dataWrap = cat.wrap.append('div').classed('cat-data section', true).classed('hidden', true);

      /* Layout CAT Controls Divs */
      cat.controls.wrap.append('h2').classed('cat-controls-header', true).text('Charting Application Tester 😼');

      cat.controls.submitWrap = cat.controls.wrap.append('div').classed('control-section submit-section', true);

      cat.controls.rendererWrap = cat.controls.wrap.append('div').classed('control-section renderer-section', true);

      cat.controls.dataWrap = cat.controls.wrap.append('div').classed('control-section data-section', true);

      cat.controls.settingsWrap = cat.controls.wrap.append('div').classed('control-section settings-section', true);

      cat.controls.environmentWrap = cat.controls.wrap.append('div').classed('control-section environment-section', true);
  }

  function addControlsToggle() {
      var _this = this;

      var styleSheet = Array.from(document.styleSheets).find(function (styleSheet) {
          return styleSheet.href.indexOf('cat.css') > -1;
      });
      var controlsWidth = Array.from(styleSheet.cssRules).find(function (cssRule) {
          return cssRule.selectorText === '.cat-wrap .cat-controls';
      }).style.width;

      //Minimize controls.
      this.controls.minimize = this.wrap.append('div').classed('cat-button cat-button--minimize hidden', true).attr('title', 'Hide controls').text('<<');
      this.controls.minimize.on('click', function () {
          _this.controls.wrap.classed('hidden', true);
          _this.chartWrap.style('margin-left', 0);
          _this.chartWrap.selectAll('.wc-chart').each(function (d) {
              try {
                  d.draw();
              } catch (error) {}
          });
          _this.dataWrap.style('margin-left', 0);
          _this.controls.minimize.classed('hidden', true);
          _this.controls.maximize.classed('hidden', false);
      });

      //Maximize controls.
      this.controls.maximize = this.wrap.append('div').classed('cat-button cat-button--maximize hidden', true).attr('title', 'Show controls').text('>>');
      this.controls.maximize.on('click', function () {
          _this.controls.wrap.classed('hidden', false);
          _this.chartWrap.style('margin-left', controlsWidth);
          _this.chartWrap.selectAll('.wc-chart').each(function (d) {
              try {
                  d.draw();
              } catch (error) {}
          });
          _this.dataWrap.style('margin-left', controlsWidth);
          _this.controls.minimize.classed('hidden', false);
          _this.controls.maximize.classed('hidden', true);
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

  function loadPackageJson(cat) {
      return new Promise(function (resolve, reject) {
          cat.current.url = cat.current.version === 'master' ? (cat.current.rootURL || cat.config.rootURL) + '/' + cat.current.name : (cat.current.rootURL || cat.config.rootURL) + '/' + cat.current.name + '@' + cat.current.version;
          var xhr = new XMLHttpRequest();
          xhr.open('GET', cat.current.url + '/package.json');
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

  function getCSS() {
      var current_css = [];
      d3.selectAll('link').each(function () {
          var obj = {};
          obj.sel = this;
          obj.link = d3.select(this).property('href');
          obj.disabled = d3.select(this).property('disabled');
          obj.filename = obj.link.substring(obj.link.lastIndexOf('/') + 1);
          obj.wrap = d3.select(this);
          current_css.push(obj);
      });
      return current_css;
  }

  function getJS() {
      var current_js = [];
      d3.selectAll('script').each(function () {
          var obj = {};
          obj.link = d3.select(this).property('src');
          obj.filename = obj.link.substring(obj.link.lastIndexOf('/') + 1);
          if (obj.link) {
              current_js.push(obj);
          }
      });
      return current_js;
  }

  function createChartExport(cat) {
      /* Get settings from current controls */
      var webcharts_version = cat.controls.libraryVersion.node().value;
      var renderer_version = cat.controls.versionSelect.node().value;
      var data_file = cat.controls.dataFileSelect.node().value;
      var data_file_path = cat.config.dataURL + data_file;
      var init_string = cat.current.sub ? cat.current.main + '.' + cat.current.sub : cat.current.main;

      var chart_config = JSON.stringify(cat.current.config, null, ' ');
      var renderer_css = '';
      if (cat.current.css) {
          var css_path = cat.config.rootURL + '/' + cat.current.name + '/' + renderer_version + '/' + cat.current.css;
          renderer_css = "<link type = 'text/css' rel = 'stylesheet' href = '" + css_path + "'>";
      }

      /* Return a html for a working chart */
      var exampleTemplate = '\n<!DOCTYPE html>\n\n    <html>\n\n    <head>\n        <title>' + cat.current.name + '</title>\n\n        <meta http-equiv = \'Content-Type\' content = \'text/html; charset = utf-8\'>\n\n        <script type = \'text/javascript\' src = \'https://d3js.org/d3.v3.min.js\'></script>\n        <script type = \'text/javascript\' src = \'https://rawgit.com/RhoInc/Webcharts/' + webcharts_version + '/build/webcharts.js\'></script>\n        <script type = \'text/javascript\' src = \'https://rawgit.com/RhoInc/' + cat.current.name + '/' + renderer_version + '/build/' + cat.current.main + '.js\'></script>\n\n        <link type = \'text/css\' rel = \'stylesheet\' href = \'https://rawgit.com/RhoInc/Webcharts/' + webcharts_version + '/css/webcharts.min.css\'>\n        ' + renderer_css + '\n    </head>\n\n    <body>\n        <h1 id = \'title\'>' + cat.current.name + ' created for ' + cat.current.defaultData + '</h1>\n        <div id = \'container\'>\n        </div>\n    </body>\n\n    <script type = \'text/javascript\'>\n        let settings = ' + chart_config + '\n        let chart = ' + init_string + '(\'#container\', settings);\n        d3.csv(\'' + data_file_path + '\', function(data) {\n            chart.init(data);\n        });\n\n    </script>\n</html>\n';
      return exampleTemplate;
  }

  function showEnv(cat) {
      /*build list of loaded CSS */
      var current_css = getCSS();
      var cssItems = cat.controls.cssList.selectAll('li').data(current_css);
      var newItems = cssItems.enter().append('li');
      var itemContents = newItems.append('span').property('title', function (d) {
          return d.link;
      });

      itemContents.append('a').text(function (d) {
          return d.filename;
      }).attr('href', function (d) {
          return d.link;
      }).property('target', '_blank');

      var switchWrap = itemContents.append('label').attr('class', 'switch').classed('hidden', function (d) {
          return d.filename == 'cat.css';
      });

      var switchCheck = switchWrap.append('input').property('type', 'checkbox').property('checked', function (d) {
          return !d.disabled;
      });
      switchWrap.append('span').attr('class', 'slider round');

      switchCheck.on('click', function (d) {
          //load or unload css
          d.disabled = !d.disabled;
          d.wrap.property('disabled', d.disabled);

          //update toggle mark
          this.checked = !d.disabled;
      });

      cssItems.exit().remove();

      /*build list of loaded JS */
      var current_js = getJS();
      var jsItems = cat.controls.jsList.selectAll('li').data(current_js);

      jsItems.enter().append('li').append('a').text(function (d) {
          return d.filename;
      }).property('title', function (d) {
          return d.link;
      }).attr('href', function (d) {
          return d.link;
      }).property('target', '_blank');

      jsItems.exit().remove();
  }

  function renderChart(cat) {
      var rendererObj = cat.controls.rendererSelect.selectAll('option:checked').data()[0];
      cat.settings.sync(cat);
      //render the new chart with the current settings
      var dataFile = cat.controls.dataFileSelect.node().value;
      var dataObject = cat.config.dataFiles.find(function (f) {
          return f.label == dataFile;
      });
      var version = cat.controls.versionSelect.node().value;
      cat.current.main = cat.controls.mainFunction.node().value;
      cat.current.sub = cat.controls.subFunction.node().value;

      function render(error, data) {
          if (error) {
              cat.status.loadStatus(cat.statusDiv, false, dataFilePath);
          } else {
              cat.status.loadStatus(cat.statusDiv, true, dataFilePath);
              if (cat.current.sub) {
                  cat.current.instance = window[cat.current.main][cat.current.sub]('.cat-chart', cat.current.config);
                  cat.status.chartCreateStatus(cat.statusDiv, cat.current.main, cat.current.sub);
              } else {
                  cat.current.instance = window[cat.current.main]('.cat-chart .chart', cat.current.config);
                  cat.status.chartCreateStatus(cat.statusDiv, cat.current.main);
              }

              cat.current.htmlExport = createChartExport(cat); // save the source code before init

              try {
                  cat.current.instance.init(data);
              } catch (err) {
                  cat.status.chartInitStatus(cat.statusDiv, false, err);
              } finally {
                  cat.status.chartInitStatus(cat.statusDiv, true, null, cat.current.htmlExport);

                  // save to server button
                  if (cat.config.useServer) {
                      cat.status.saveToServer(cat);
                  }
                  showEnv(cat);

                  //don't print any new statuses until a new chart is rendered
                  cat.printStatus = false;
              }
          }
          cat.current.rendered = true;
      }

      if (dataObject.user_loaded) {
          dataObject.json = d3.csv.parse(dataObject.csv_raw);
          render(false, dataObject.json);
      } else {
          var dataFilePath = dataObject.path + dataFile;
          d3.csv(dataFilePath, function (error, data) {
              render(error, data);
          });
      }
  }

  function loadRenderer(cat) {
      var promisedPackage = loadPackageJson(cat);
      promisedPackage.then(function (response) {
          cat.current.package = JSON.parse(response);
          cat.current.js_url = cat.current.url + '/' + cat.current.package.main.replace(/^\.?\/?/, '');
          cat.current.css_url = cat.current.css ? cat.current.url + '/' + cat.current.css : null;

          if (cat.current.css) {
              //var current_css = getCSS().filter(f => f.link == cat.current.css_url);
              //var css_loaded = current_css.length > 0;
              //if (!css_loaded) {
              cat.current.link = document.createElement('link');
              cat.current.link.href = cat.current.css_url;

              cat.current.link.type = 'text/css';
              cat.current.link.rel = 'stylesheet';
              document.getElementsByTagName('head')[0].appendChild(cat.current.link);
              //} else if (current_css[0].disabled) {
              //    //enable the css if it's disabled
              //    d3.select(current_css[0].sel).property('disabled', false);
              //    cat.controls.cssList
              //        .selectAll('li')
              //        .filter(d => d.link == cat.current.css_url)
              //        .select('input')
              //        .property('checked', true);
              //}
          }

          //var current_js = getJS().filter(f => f.link == cat.current.js_url);
          //var js_loaded = current_js.length > 0;

          //if (!js_loaded) {
          var loader = new scriptLoader();
          cat.current.script = loader.require(cat.current.js_url, {
              async: true,
              success: function success() {
                  cat.status.loadStatus(cat.statusDiv, true, cat.current.js_url, cat.current.name, cat.current.version);
                  renderChart(cat);
              },
              failure: function failure() {
                  cat.status.loadStatus(cat.statusDiv, false, cat.current.js_url, cat.current.name, cat.current.version);
              }
          });
          //} else {
          //    cat.status.loadStatus(
          //        cat.statusDiv,
          //        true,
          //        cat.current.js_url,
          //        cat.current.name,
          //        cat.current.version
          //    );
          //    renderChart(cat);
          //}
      });
  }

  function loadLibrary(cat) {
      var version = cat.controls.libraryVersion.node().value;
      var library = 'webcharts'; //hardcode to webcharts for now - could generalize later

      // --- load css --- //
      var cssPath = version !== 'master' ? cat.config.rootURL + '/Webcharts@' + version + '/css/webcharts.css' : cat.config.rootURL + '/Webcharts/css/webcharts.css';

      var current_css = getCSS().filter(function (f) {
          return f.link == cssPath;
      });
      var css_loaded = current_css.length > 0;
      if (!css_loaded) {
          //load the css if it isn't already loaded
          var link = document.createElement('link');
          link.href = cssPath;
          link.type = 'text/css';
          link.rel = 'stylesheet';
          document.getElementsByTagName('head')[0].appendChild(link);
      } else if (current_css[0].disabled) {
          //enable the css if it's disabled
          d3.select(current_css[0].sel).property('disabled', false);
          cat.controls.cssList.selectAll('li').filter(function (d) {
              return d.link == cssPath;
          }).select('input').property('checked', true);
      }

      // --- load js --- //
      var rendererPath = version !== 'master' ? cat.config.rootURL + '/' + library + '@' + version + '/build/webcharts.js' : cat.config.rootURL + '/Webcharts/build/webcharts.js';

      var current_js = getJS().filter(function (f) {
          return f.link == rendererPath;
      });
      var js_loaded = current_js.length > 0;

      if (!js_loaded) {
          var loader = new scriptLoader();
          loader.require(rendererPath, {
              async: true,
              success: function success() {
                  cat.status.loadStatus(cat.statusDiv, true, rendererPath, library, version);
                  loadRenderer(cat);
              },
              failure: function failure() {
                  cat.status.loadStatus(cat.statusDiv, false, rendererPath, library, version);
              }
          });
      } else {
          cat.status.loadStatus(cat.statusDiv, true, rendererPath, library, version);
          loadRenderer(cat);
      }
  }

  function addSubmitButton() {
      var _this = this;

      this.controls.submitButton = this.controls.submitWrap.append('button').attr('class', 'submit').text('Render Chart').on('click', function () {
          _this.controls.minimize.classed('hidden', false);
          _this.dataWrap.classed('hidden', true);
          _this.chartWrap.classed('hidden', false);

          //Disable and/or remove previously loaded stylesheets.
          d3.selectAll('link').filter(function () {
              return !this.href.indexOf('css/cat.css');
          }).property('disabled', true).remove();

          d3.selectAll('style').property('disabled', true).remove();

          if (_this.previous) {
              if (_this.previous.instance && _this.previous.instance.destroy) {
                  console.log('destroy');
                  console.log(_this.previous);
                  if (_this.previous.instance && _this.previous.instance.destroy) _this.previous.instance.destroy();
              } else {
                  console.log('no destroy');
                  console.log(_this.previous);
                  _this.chartWrap.selectAll('.wc-chart').each(function (chart) {
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

          _this.chartWrap.selectAll('*').remove();
          _this.printStatus = true;
          _this.statusDiv = _this.chartWrap.append('div').attr('class', 'status');
          _this.statusDiv.append('div').text('Starting to render the chart ... ').classed('info', true);

          _this.chartWrap.append('div').attr('class', 'chart');
          loadLibrary(_this);
          console.log(_this.current);
      });
  }

  function initSubmit(cat) {
      addControlsToggle.call(cat);
      addSubmitButton.call(cat);
  }

  function updateRenderer(select) {
      var _this = this;

      this.previous = _.clone(this.current);
      this.current = d3.select(select).select('option:checked').data()[0];
      this.current.version = 'master';

      //update the chart type configuration to the defaults for the selected renderer
      this.controls.mainFunction.node().value = this.current.main;
      this.controls.versionSelect.node().value = 'master';
      this.controls.subFunction.node().value = this.current.sub;
      this.controls.schema.node().value = this.current.schema;

      //update the selected data set to the default for the new rendererSection
      this.controls.dataFileSelect.selectAll('option').property('selected', function (d) {
          return _this.current.defaultData === d.label;
      });

      //Re-initialize the chart config section
      this.settings.set(this);
  }

  function getVersions(select) {
      var repo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'https://api.github.com/repos/RhoInc/Webcharts';

      var branches = fetch(repo + '/branches').then(function (response) {
          return response.json();
      });
      var releases = fetch(repo + '/releases').then(function (response) {
          return response.json();
      });

      Promise.all([branches, releases]).then(function (values) {
          var _values = slicedToArray(values, 2),
              branches = _values[0],
              releases = _values[1];

          branches.sort(function (a, b) {
              return a.name === 'master' ? -1 : b.name === 'master' ? 1 : a.name < b.name ? -1 : 1;
          });
          select.selectAll('option').remove();
          select.selectAll('option').data(d3.merge(values)).enter().append('option').text(function (d) {
              return d.tag_name || d.name;
          }).property('selected', function (d) {
              return d.name === 'master';
          });
      }).catch(function (err) {
          console.log(err);
      });
  }

  function initRendererSelect(cat) {
      cat.controls.rendererWrap.append('h3').text('1. Choose a Charting Library');
      cat.controls.rendererWrap.append('span').text('Library: ');

      //renderers
      cat.controls.rendererSelect = cat.controls.rendererWrap.append('select');
      cat.controls.rendererSelect.selectAll('option').data(cat.config.renderers).enter().append('option').text(function (d) {
          return d.name;
      });
      cat.controls.rendererSelect.on('change', function () {
          updateRenderer.call(cat, this);
          getVersions(cat.controls.versionSelect, cat.current.api_url);
      });
      cat.controls.rendererWrap.append('br');

      //renderer version
      cat.controls.rendererWrap.append('span').text('Version: ');
      cat.controls.versionSelect = cat.controls.rendererWrap.append('select');
      getVersions(cat.controls.versionSelect, cat.current.api_url);
      //cat.controls.versionSelect.node().value = 'master';
      cat.controls.versionSelect.on('input', function () {
          console.log(this.value);
          cat.current.version = this.value;
      });
      cat.controls.versionSelect.on('change', function () {
          cat.settings.set(cat);
      });
      cat.controls.rendererWrap.append('br');
      cat.controls.rendererWrap.append('a').text('More Options').style('text-decoration', 'underline').style('color', 'blue').style('cursor', 'pointer').on('click', function () {
          d3.select(this).remove();
          cat.controls.rendererWrap.selectAll('*').classed('hidden', false);
      });

      //name of method that creates the chart
      cat.controls.rendererWrap.append('span').text(' Init: ').classed('hidden', true);
      cat.controls.mainFunction = cat.controls.rendererWrap.append('input').classed('hidden', true);
      cat.controls.mainFunction.node().value = cat.current.main;
      cat.controls.rendererWrap.append('span').text('.').classed('hidden', true);

      //name of method that initializes chart
      cat.controls.subFunction = cat.controls.rendererWrap.append('input').classed('hidden', true);
      cat.controls.subFunction.node().value = cat.current.sub;
      cat.controls.rendererWrap.append('br').classed('hidden', true);

      //Webcharts version
      cat.controls.rendererWrap.append('span').text('Webcharts Version: ').classed('hidden', true);
      cat.controls.libraryVersion = cat.controls.rendererWrap.append('select').classed('hidden', true);
      getVersions(cat.controls.libraryVersion);
      //cat.controls.libraryVersion.node().value = 'master';
      cat.controls.rendererWrap.append('br').classed('hidden', true);

      //schema
      cat.controls.rendererWrap.append('span').text('Schema: ').classed('hidden', true);
      cat.controls.schema = cat.controls.rendererWrap.append('input').classed('hidden', true);
      cat.controls.schema.node().value = cat.current.schema;
      cat.controls.rendererWrap.append('br').classed('hidden', true);

      //add enter listener
      cat.controls.addEnterEventListener(cat.controls.rendererWrap, cat);
  }

  function showDataPreview(cat) {
      cat.dataWrap.classed('hidden', false);
      cat.chartWrap.classed('hidden', true);
      cat.dataWrap.selectAll('*').remove();

      if (cat.dataPreview) {
          cat.dataPreview.destroy();
      }

      var dataFile = cat.controls.dataFileSelect.node().value;
      var dataObject = cat.config.dataFiles.find(function (f) {
          return f.label == dataFile;
      });
      var path = dataObject.path + dataObject.label;

      cat.dataWrap.append('button').text('<< Close Data Preview').on('click', function () {
          cat.dataWrap.classed('hidden', true);
          cat.chartWrap.classed('hidden', false);
      });

      cat.dataWrap.append('h3').text('Data Preview for ' + dataFile);

      cat.dataWrap.append('div').attr('class', 'dataPreview').style('overflow-x', 'overlay');
      cat.dataPreview = webCharts.createTable('.dataPreview');
      if (dataObject.user_loaded) {
          cat.dataPreview.init(d3.csv.parse(dataObject.csv_raw));
      } else {
          d3.csv(path, function (raw) {
              cat.dataPreview.init(raw);
          });
      }
  }

  function initDataSelect(cat) {
      cat.controls.dataWrap.append('h3').text('2. Choose a data Set');
      cat.controls.dataFileSelect = cat.controls.dataWrap.append('select');

      cat.controls.dataWrap.append('span').html('&#128269;').style('cursor', 'pointer').on('click', function () {
          showDataPreview(cat);
      });

      cat.controls.dataFileSelect.selectAll('option').data(cat.config.dataFiles).enter().append('option').text(function (d) {
          return d.label;
      }).property('selected', function (d) {
          return cat.current.defaultData == d.label ? true : null;
      });
  }

  function initFileLoad() {
      var cat = this;
      //draw the control
      var loadLabel = cat.controls.dataWrap.append('p').style('margin', 0);

      loadLabel.append('small').text('Use local .csv file:').append('sup').html('&#9432;').property('title', 'Render a chart using a local file. File is added to the data set list, and is only available for a single session and is not saved.').style('cursor', 'help');

      var loadStatus = loadLabel.append('small').attr('class', 'loadStatus').style('float', 'right').text('Select a csv to load');

      cat.controls.dataFileLoad = cat.controls.dataWrap.append('input').attr('type', 'file').attr('class', 'file-load-input').on('change', function () {
          if (this.value.slice(-4).toLowerCase() == '.csv') {
              loadStatus.text(this.files[0].name + ' ready to load').style('color', 'green');
              cat.controls.dataFileLoadButton.attr('disabled', null);
          } else {
              loadStatus.text(this.files[0].name + ' is not a csv').style('color', 'red');
              cat.controls.dataFileLoadButton.attr('disabled', true);
          }
      });

      cat.controls.dataFileLoadButton = cat.controls.dataWrap.append('button').text('Load').attr('class', 'file-load-button').attr('disabled', true).on('click', function (d) {
          //credit to https://jsfiddle.net/Ln37kqc0/
          var files = cat.controls.dataFileLoad.node().files;

          if (files.length <= 0) {
              //shouldn't happen since button is disabled when no file is present, but ...
              console.log('No file selected ...');
              return false;
          }

          var fr = new FileReader();
          fr.onload = function (e) {
              // get the current date/time
              var d = new Date();
              var n = d3.time.format('%X')(d);

              //make an object for the file
              var dataObject = {
                  label: files[0].name + ' (added at ' + n + ')',
                  user_loaded: true,
                  csv_raw: e.target.result
              };
              cat.config.dataFiles.push(dataObject);

              //add it to the select dropdown
              cat.controls.dataFileSelect.append('option').datum(dataObject).text(function (d) {
                  return d.label;
              }).attr('selected', true);

              //clear the file input & disable the load button
              loadStatus.text(files[0].name + ' loaded').style('color', 'green');

              cat.controls.dataFileLoadButton.attr('disabled', true);
              cat.controls.dataFileLoad.property('value', '');
          };

          fr.readAsText(files.item(0));
      });
  }

  function initChartConfig(cat) {
      var settingsHeading = cat.controls.settingsWrap.append('h3').html('3. Customize the Chart ');

      cat.controls.settingsWrap.append('span').text('Settings: ');

      /*
      //////////////////////////////////////
      //initialize the config status icon
      //////////////////////////////////////
      cat.controls.settingsStatus = settingsSection
      .append("div")
      .style("font-size", "1.5em")
      .style("float", "right")
      .style("cursor", "pointer");
      settingsSection.append("br");
      */

      //////////////////////////////////////////////////////////////////////
      //radio buttons to toggle between "text" and "form" based settings
      /////////////////////////////////////////////////////////////////////
      cat.controls.settingsTypeText = cat.controls.settingsWrap.append('input').attr('class', 'radio').property('type', 'radio').property('name', 'settingsType').property('value', 'text');
      cat.controls.settingsWrap.append('span').text('text');
      cat.controls.settingsTypeForm = cat.controls.settingsWrap.append('input').attr('class', 'radio').property('type', 'radio').property('name', 'settingsType').property('value', 'form');
      cat.controls.settingsWrap.append('span').text('form');
      cat.controls.settingsType = cat.controls.settingsWrap.selectAll('input[type="radio"]');

      cat.controls.settingsType.on('change', function (d) {
          cat.settings.sync(cat); //first sync the current settings to both views

          //then update to the new view, and update controls.
          cat.current.settingsView = this.value; //
          if (cat.current.settingsView == 'text') {
              cat.controls.settingsInput.classed('hidden', false);
              cat.controls.settingsForm.classed('hidden', true);
          } else if (cat.current.settingsView == 'form') {
              cat.controls.settingsInput.classed('hidden', true);
              cat.controls.settingsForm.classed('hidden', false);
          }
      });
      cat.controls.settingsWrap.append('br');

      //////////////////////////////////////////////////////////////////////
      //text input section
      /////////////////////////////////////////////////////////////////////
      cat.controls.settingsInput = cat.controls.settingsWrap.append('textarea').attr('rows', 10).style('width', '90%').text('{}');

      //////////////////////////////////////////////////////////////////////
      //wrapper for the form
      /////////////////////////////////////////////////////////////////////
      cat.controls.settingsForm = cat.controls.settingsWrap.append('div').attr('class', 'settingsForm').append('form');

      //set the text/form settings for the first renderer
      cat.settings.set(cat);
  }

  function initEnvConfig(cat) {
      var settingsHeading = cat.controls.environmentWrap.append('h3').html('4. Environment ');

      cat.controls.cssList = cat.controls.environmentWrap.append('ul').attr('class', 'cssList');
      cat.controls.cssList.append('h5').text('Loaded Stylesheets');

      cat.controls.jsList = cat.controls.environmentWrap.append('ul').attr('class', 'jsList');
      cat.controls.jsList.append('h5').text('Loaded javascript');

      showEnv(cat);
  }

  function init$1(cat) {
      cat.current = cat.config.renderers[0];
      cat.current.version = 'master';
      initSubmit(cat);
      initRendererSelect(cat);
      initDataSelect(cat);
      initFileLoad.call(cat);
      initChartConfig(cat);
      initEnvConfig(cat);
  }

  function addEnterEventListener(selection, cat) {
      //Add Enter event listener to all controls.
      selection.selectAll('select,input').each(function () {
          this.addEventListener('keypress', function (e) {
              var key = e.which || e.keyCode;

              //13 is Enter
              if (key === 13) cat.controls.submitButton.node().click();
          });
      });
  }

  /*------------------------------------------------------------------------------------------------\
    Define controls object.
  \------------------------------------------------------------------------------------------------*/

  var controls = {
      init: init$1,
      addEnterEventListener: addEnterEventListener
  };

  var defaultSettings = {
      useServer: false,
      rootURL: null,
      dataURL: null,
      dataFiles: [],
      renderers: []
  };

  function setDefaults(cat) {
      cat.config.useServer = cat.config.useServer || defaultSettings.useServer;
      cat.config.rootURL = cat.config.rootURL || defaultSettings.rootURL;
      cat.config.dataURL = cat.config.dataURL || defaultSettings.dataURL;
      cat.config.dataFiles = cat.config.dataFiles || defaultSettings.dataFiles;
      cat.config.renderers = cat.config.renderers || defaultSettings.renderers;

      cat.config.dataFiles = cat.config.dataFiles.map(function (df) {
          return typeof df == 'string' ? { label: df, path: cat.config.dataURL, user_loaded: false } : df;
      });
  }

  function makeForm(cat, obj) {
      d3.select('.settingsForm form').selectAll('*').remove();

      //define form from settings schema
      cat.current.form = brutusin['json-forms'].create(cat.current.schemaObj);

      if (!obj) {
          //Render form with default schema settings.
          cat.current.form.render(d3.select('.settingsForm form').node());

          //Define renderer settings.
          cat.current.config = cat.current.form.getData();

          //Update text settings with default schema settings.
          //cat.controls.settingsInput.node().value = JSON.stringify(cat.current.config, null, 4);
          var json = JSON.stringify(cat.current.config, null, 4);
          cat.controls.settingsInput.attr('rows', json.split('\n').length);
          cat.controls.settingsInput.html(json);
      } else
          //Render form with updated text settings.
          cat.current.form.render(d3.select('.settingsForm form').node(), cat.current.config);

      d3.select('.settingsForm form').selectAll('.glyphicon-remove').text('X');

      //handle submission with the "render chart" button
      d3.select('.settingsForm form .form-actions input').remove();
      //format the form a little bit so that we can dodge bootstrap
      d3.selectAll('i.icon-plus-sign').text('+');
      d3.selectAll('i.icon-minus-sign').text('-');

      //add enter listener
      cat.controls.addEnterEventListener(cat.controls.wrap.select('.settingsForm'), cat);
  }

  function setStatus(cat, statusVal) {
      var statusOptions = [{
          key: 'valid',
          symbol: '&#x2714;',
          color: 'green',
          details: "Settings match the current schema. Click 'Render Chart' to draw the chart."
      }, {
          key: 'invalid',
          symbol: '&#x2718;',
          color: 'red',
          details: "Settings do not match the current schema. You can still click 'Render Chart' to try to draw the chart, but it might not work as expected."
      }, {
          key: 'unknown',
          symbol: '?',
          color: 'blue',
          details: "You've loaded a schema, but the setting have changed. Click 'Validate Settings' to see if they're valid or you can click 'Render Chart' and see what happens."
      }, {
          key: 'no schema',
          symbol: 'NA',
          color: '#999',
          details: "No Schema loaded. Cannot validate the current settings. You can click 'Render Chart' and see what happens."
      }];

      var myStatus = statusOptions.filter(function (d) {
          return d.key == statusVal;
      })[0];

      cat.controls.settingsStatus.html(myStatus.symbol).style('color', myStatus.color).attr('title', myStatus.details);
  }

  function validateSchema(cat) {
      // consider: http://epoberezkin.github.io/ajv/#getting-started
      //  var Ajv = require('ajv');
      //  var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
      //  var validate = ajv.compile(cat.);
      return true;
  }

  function set$1(cat) {
      // load the schema (if any) and see if it is validate
      cat.current.schemaPath = [cat.current.rootURL || cat.config.rootURL, cat.current.version !== 'master' ? cat.current.name + '@' + cat.current.version : cat.current.name, cat.current.schema].join('/');

      cat.current.settingsView = 'text';
      cat.controls.settingsInput.value = '{}';
      cat.current.config = {};

      d3.json(cat.current.schemaPath, function (error, schemaObj) {
          if (error) {
              console.log('No schema loaded.');
              cat.current.hasValidSchema = false;
              cat.current.schemaObj = null;
          } else {
              // attempt to validate the schema
              console.log('Schema found ...');
              cat.current.hasValidSchema = validateSchema(schemaObj);
              cat.current.settingsView = cat.current.hasValidSchema ? 'form' : 'text';
              cat.current.schemaObj = cat.current.hasValidSchema ? schemaObj : null;
          }
          //set the radio buttons
          cat.controls.settingsTypeText.property('checked', cat.current.settingsView == 'text');

          cat.controls.settingsTypeForm.property('checked', cat.current.settingsView == 'form').property('disabled', !cat.current.hasValidSchema);

          // Show/Hide sections
          cat.controls.settingsInput.classed('hidden', cat.current.settingsView != 'text');
          cat.controls.settingsForm.classed('hidden', cat.current.settingsView != 'form');

          //update the text or make the schema
          cat.controls.settingsInput.node().value = JSON5.stringify(cat.current.config, null, 4);

          if (cat.current.hasValidSchema) {
              console.log('... and it is valid. Making a nice form.');
              makeForm(cat);
          }
      });
  }

  function sync(cat, printStatus) {
      function IsJsonString(str) {
          try {
              JSON5.parse(str);
          } catch (e) {
              return false;
          }
          return true;
      }

      // set current config
      if (cat.current.settingsView == 'text') {
          var text = cat.controls.settingsInput.node().value;

          if (IsJsonString(text)) {
              var settings = JSON5.parse(text);
              var json = JSON.stringify(settings, null, 4);

              if (cat.printStatus) {
                  cat.statusDiv.append('div').html('Successfully loaded settings from text input.').classed('success', true);
              }

              cat.controls.settingsInput.node().value = json;
              cat.current.config = settings;
          } else {
              if (cat.printStatus) {
                  cat.statusDiv.append('div').html("Couldn't load settings from text. Check to see if you have <a href='https://jsonlint.com/?json=" + text + "'>valid JSON</a>.").classed('error', true);
              }
          }

          if (cat.current.hasValidSchema) {
              makeForm(cat, cat.current.config);
          }
      } else if (cat.current.settingsView == 'form') {
          //this submits the form which:
          //- saves the current object
          //- updates the hidden text view
          //$(".settingsForm form").trigger("submit");
          //get settings object from form
          cat.current.config = cat.current.form.getData();
          //update settings text field to match form
          cat.controls.settingsInput.node().value = JSON.stringify(cat.current.config, null, 4);
      }
  }

  /*------------------------------------------------------------------------------------------------\
    Define controls object.
  \------------------------------------------------------------------------------------------------*/

  var settings = {
      set: set$1,
      sync: sync,
      setStatus: setStatus
  };

  function chartCreateStatus(statusDiv, main, sub) {
      var message = sub ? 'Created the chart by calling <i>' + main + '.' + sub + '()</i>.' : 'Created the chart by calling <i>' + main + '()</i>.';

      statusDiv.append('div').html(message).classed('info', true);
  }

  function chartInitStatus(statusDiv, success, err, htmlExport) {
      if (success) {
          //hide all non-error statuses
          statusDiv.selectAll('div:not(.error)').classed('hidden', true);

          // Print basic success message
          statusDiv.append('div').attr('class', 'initSuccess').html("All Done. Your chart should be below. <span class='showLog'>Show full log</span>").classed('info', true);

          //Click to show all statuses
          statusDiv.select('div.initSuccess').select('span.showLog').style('cursor', 'pointer').style('text-decoration', 'underline').style('float', 'right').on('click', function () {
              d3.select(this).remove();
              statusDiv.selectAll('div').classed('hidden', false);
          });

          //generic caution (hidden by default)
          statusDiv.append('div').classed('hidden', true).classed('info', true).html("&#9432; Just because there are no errors doesn't mean there can't be problems. If things look strange, it might be a problem with the settings/data combo or with the renderer itself.");

          //export source code (via copy/paste)
          statusDiv.append('div').classed('hidden', true).classed('export', true).classed('minimized', true).html("Click to see chart's full source code");

          statusDiv.select('div.export.minimized').on('click', function () {
              d3.select(this).classed('minimized', false);
              d3.select(this).html('<strong>Source code for chart:</strong>');
              d3.select(this).append('code').html(htmlExport.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;'));
          });
      } else {
          //if init fails (success == false)
          statusDiv.append('div').html("There might've been some problems initializing the chart. Errors include:<br><small><i>" + err + '</i></small>').classed('error', true);
      }
  }

  function saveToServer(cat) {
      var serverDiv = cat.statusDiv.append('div').attr('class', 'info').text('Enter your name and click save for a reusable URL. ');
      var nameInput = serverDiv.append('input').property('placeholder', 'Name');
      var saveButton = serverDiv.append('button').text('Save').property('disabled', true);

      nameInput.on('input', function () {
          saveButton.property('disabled', nameInput.node().value.length == 0);
      });

      saveButton.on('click', function () {
          //remove the form
          d3.select(this).remove();
          nameInput.remove();

          //format an object for the post
          var dataFile = cat.controls.dataFileSelect.node().value;
          var dataFilePath = cat.config.dataURL + dataFile;
          var chartObj = {
              name: nameInput.node().value,
              renderer: cat.current.name,
              version: cat.controls.versionSelect.node().value,
              dataFile: dataFilePath,
              chart: btoa(cat.current.htmlExport)
          };

          //post the object, get a URL back
          $.post('./export/', chartObj, function (data) {
              serverDiv.html("Chart saved as <a href='" + data.url + "'>" + data.url + '</a>');
          }).fail(function () {
              serverDiv.text("Sorry. Couldn't save the chart.").classed('error', true);
              console.warn('Error :( Something went wrong saving the chart.');
          });
      });
  }

  function loadStatus(statusDiv, passed, path, library, version) {
      var message = passed ? 'Successfully loaded ' + path : 'Failed to load ' + path;

      if (library != undefined & version != undefined) message = message + ' (Library: ' + library + ', Version: ' + version + ')';

      statusDiv.append('div').html(message).classed('error', !passed);
  }

  /*------------------------------------------------------------------------------------------------\
    Define controls object.
  \------------------------------------------------------------------------------------------------*/

  var status = {
      chartCreateStatus: chartCreateStatus,
      chartInitStatus: chartInitStatus,
      saveToServer: saveToServer,
      loadStatus: loadStatus
  };

  function createCat() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
      var config = arguments[1];

      var cat = {
          element: element,
          config: config,
          init: init,
          layout: layout,
          controls: controls,
          setDefaults: setDefaults,
          settings: settings,
          status: status
      };

      return cat;
  }

  var index = {
      createCat: createCat
  };

  return index;

})));
