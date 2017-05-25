/*

 jQuery Inactivity plugin 1.3
 The simplest yet effective jQuery idle plugin

 https://github.com/afklondon/jquery.inactivity

 Available via the MIT license
 by Alexandros Filos K.

*/

(function ($) {
  "use strict";

  // variables
  var timeout;
  var firstEvent = true;
  var settings = {};
  var namespace = '.jq-inactivity';
  var events = {
    mouseEvents: "mousemove mousedown mousewheel wheel DOMMouseScroll MSPointerDown MSPointerMove",
    keyboardEvents: "keypress keydown keyup",
    touchEvents: "touchstart touchmove touchend"
  };

  $.fn.inactivity = function (opts) {
    var $el = $(this);
    var namespacedEvents = {
      mouseEvents: addNamespace(events.mouseEvents),
      keyboardEvents: addNamespace(events.keyboardEvents),
      touchEvents: addNamespace(events.touchEvents)
    };

    // defaults
    settings = $.extend({
      timeout: 3000,
      mouse: true,
      keyboard: true,
      touch: true,
      customEvents: "",
      triggerAll: false
    }, opts);

    clear($el);

    // when requested to destroy
    if (opts === "destroy") {
      return;
    }

    // set listeners
    if (settings.mouse) {
      $el.on(namespacedEvents.mouseEvents, onActivity);
    }

    if (settings.keyboard) {
      $el.on(namespacedEvents.keyboardEvents, onActivity);
    }

    if (settings.touch) {
      $el.on(namespacedEvents.touchEvents, onActivity);
    }

    if (settings.customEvents !== '') {
      $el.on(settings.customEvents, onActivity);
    }

    function onActivity() {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(onInactivity, settings.timeout);

      if (settings.triggerAll || firstEvent) {
        $el.trigger("activity" + namespace);
      }

      if (firstEvent) {
        firstEvent = false;
      }
    }

    function onInactivity() {
      firstEvent = true;
      $el.trigger("inactivity" + namespace);
    }

    function addNamespace(eventString) {
      var events = eventString.split(' ');

      var namespacedEvents = events.map(function (event) {
        return event + namespace;
      });

      return namespacedEvents.join(' ');
    }

    // clear any event listeners and reset plugin
    function clear($el) {
      $el.off(namespacedEvents.mouseEvents);
      $el.off(namespacedEvents.keyboardEvents);
      $el.off(namespacedEvents.touchEvents);

      if (settings.customEvents !== '') {
        $el.off(settings.customEvents);
      }

      window.clearTimeout(timeout);

      firstEvent = true;
    }
  };
})(jQuery);
