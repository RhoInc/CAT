// Nice script loader from here: https://stackoverflow.com/questions/538745/how-to-tell-if-a-script-tag-failed-to-load

export function scriptLoader() {}

scriptLoader.prototype = {
  timer: function(
    times, // number of times to try
    delay, // delay per try
    delayMore, // extra delay per try (additional to delay)
    test, // called each try, timer stops if this returns true
    failure, // called on failure
    result // used internally, shouldn't be passed
  ) {
    var me = this;
    if (times == -1 || times > 0) {
      setTimeout(function() {
        result = test() ? 1 : 0;
        me.timer(
          result ? 0 : times > 0 ? --times : times,
          delay + (delayMore ? delayMore : 0),
          delayMore,
          test,
          failure,
          result
        );
      }, result || delay < 0 ? 0.1 : delay);
    } else if (typeof failure == "function") {
      setTimeout(failure, 1);
    }
  },

  addEvent: function(el, eventName, eventFunc) {
    if (typeof el != "object") {
      return false;
    }

    if (el.addEventListener) {
      el.addEventListener(eventName, eventFunc, false);
      return true;
    }

    if (el.attachEvent) {
      el.attachEvent("on" + eventName, eventFunc);
      return true;
    }

    return false;
  },

  // add script to dom
  require: function(url, args) {
    var me = this;
    args = args || {};

    var scriptTag = document.createElement("script");
    var headTag = document.getElementsByTagName("head")[0];
    if (!headTag) {
      return false;
    }

    setTimeout(function() {
      var f = typeof args.success == "function" ? args.success : function() {};
      args.failure = typeof args.failure == "function"
        ? args.failure
        : function() {};
      var fail = function() {
        if (!scriptTag.__es) {
          scriptTag.__es = true;
          scriptTag.id = "failed";
          args.failure(scriptTag);
        }
      };
      scriptTag.onload = function() {
        scriptTag.id = "loaded";
        f(scriptTag);
      };
      scriptTag.type = "text/javascript";
      scriptTag.async = typeof args.async == "boolean" ? args.async : false;
      scriptTag.charset = "utf-8";
      me.__es = false;
      me.addEvent(scriptTag, "error", fail); // when supported
      // when error event is not supported fall back to timer
      me.timer(
        15,
        1000,
        0,
        function() {
          return scriptTag.id == "loaded";
        },
        function() {
          if (scriptTag.id != "loaded") {
            fail();
          }
        }
      );
      scriptTag.src = url;
      setTimeout(function() {
        try {
          headTag.appendChild(scriptTag);
        } catch (e) {
          fail();
        }
      }, 1);
    }, typeof args.delay == "number" ? args.delay : 1);
    return true;
  }
};
