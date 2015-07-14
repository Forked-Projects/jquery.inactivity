/*

 jQuery Inactivity plugin 1.0
 The simplest yet effective jQuery inactivity (idle) plugin
 
 Copyright (C) 2015 AFK - Alexandros Filos Kaparelos
 Available via the MIT license

 https://github.com/afklondon/jquery.inactivity for details

*/

(function ($) {
  "use strict";

  // initialize variables
  var timeout;
  var firstEvent = true;

  $.fn.inactivity = function (options) {
    
    var element = $(this);
    
    // if destroy requested
    if (options === "destroy") {
      reset(); // reset plugin
      return;
    }
    
    // set default settings
    var settings = $.extend({
      interval: 3000,
      mouse: true,
      keyboard: true,
      customEvents: "",
      triggerAll: false
    }, options);

    reset(); // reset plugin
    
    // set event listeners
    if (settings.mouse) element.on("mousemove", onActivity);
    if (settings.keyboard) element.on("keypress", onActivity);
    if (settings.customEvents !== '') element.on(settings.customEvents, onActivity);

    // called when any type of set event is captured
    function onActivity() {

      window.clearTimeout(timeout); // clear timeout
      timeout = window.setTimeout(onInactivity, settings.interval); // set a new timeout

      if (!settings.triggerAll && firstEvent) { // if not triggering all events and this is the first event captured
        $(document).trigger("activity"); //fire global event
        firstEvent = false;
      } else if (settings.triggerAll) { // else if triggering all events
        $(document).trigger("activity"); //fire global event
      }
      
    };

    // called when the timeout finishes
    function onInactivity() {
      if (!settings.triggerAll) firstEvent = true; // if not triggering all events reset variable
      $(document).trigger("inactivity"); //fire global event
    };

    // resets all event listeners and variables
    function reset() {
      element.off("mousemove keypress");
      if (settings !== undefined){if(settings.customEvents !== ""){element.off(settings.customEvents)}};
      timeout = undefined;
      firstEvent = undefined;
    };

  }

})(jQuery);
