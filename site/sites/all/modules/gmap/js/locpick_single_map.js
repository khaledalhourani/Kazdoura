/* $Id: locpick.js,v 1.4 2009/04/06 17:28:00 bdragon Exp $ */

/**
 * @file
 * Location chooser interface.
 */

/*global $, Drupal, GEvent, GLatLng, GMarker */

Drupal.gmap.addHandler('gmap', function (elem) {
  var obj = this;

  var binding = obj.bind("locpickchange", function () {
    if (obj.locpick_coord[obj.current_locpick]) {
      GEvent.trigger(obj.map, "click", null, obj.locpick_coord[obj.current_locpick]);
    }
  });

  obj.bind("locpickremove", function () {
    obj.map.removeOverlay(obj.locpick_point[obj.current_locpick]);
    obj.locpick_coord[obj.current_locpick] = null;
    obj.change('locpickchange', -1, obj.current_locpick);
  });

  obj.bind("init", function () {
    if (obj.vars.behavior.locpick) {
      obj.locpick_coord = [];
      obj.locpick_point = [];
      obj.locpick_invalid = [];
      var i = 0;
      obj.current_locpick = -1;

      GEvent.addListener(obj.map, "click", function (overlay, point) {
        obj.map.checkResize();
        if (!overlay) {
   //       if (!obj.locpick_point) {
   //         obj.map.addOverlay(obj.locpick_point[obj.current_locpick] = new GMarker(point, {draggable: true}));
   //       }
          // obj.locpick count is the number of locpicks available so only allow that many markers
          // If this is the initial loading then use the obj.current_locpick that is already set.
          obj.full = true;
          for (i = 0; i < obj.locpick_count; i++) {
            if (obj.locpick_coord[i] == null || obj.locpick_point[i] == null) {
              obj.full = false;
            }
          }
          if (obj.full == false) {
            if (obj.locpick_set == false) {
              obj.current_locpick = -1;
              for (i = 0; i < obj.locpick_coord.length; i++) {
                if (obj.locpick_coord[i] == null) {
                  if (obj.current_locpick == -1) {
                    obj.current_locpick = i;
                  }
                }
              }
            }
            if (obj.current_locpick == -1) {
              obj.current_locpick = obj.locpick_coord.length;
            }

            if (obj.current_locpick != null) {
              obj.locpick_coord[obj.current_locpick] = new GLatLng(obj.vars.latitude, obj.vars.longitude);
            }

            obj.map.addOverlay(obj.locpick_point[obj.current_locpick] = new GMarker(point, {draggable: true}));

            GEvent.addListener(obj.locpick_point[obj.current_locpick], 'dragstart', function() {
              // Get the current marker.
              obj.current_locpick = -1;
              for (i = 0; i < obj.locpick_coord.length; i++) {
                if (obj.locpick_coord[i] == this.getLatLng()) {
                  if (obj.current_locpick == -1) {
                    obj.current_locpick = i;
                  }
                }
              }
            });

            obj.locpick_point[obj.current_locpick].setLatLng(point);
            GEvent.addListener(obj.locpick_point[obj.current_locpick], 'drag', function () {
              obj.locpick_coord[obj.current_locpick] = obj.locpick_point[obj.current_locpick].getLatLng();
              obj.change('locpickchange', binding);
            });
            GEvent.addListener(obj.locpick_point[obj.current_locpick], 'dragend', function () {
              obj.locpick_coord[obj.current_locpick] = obj.locpick_point[obj.current_locpick].getLatLng();
              obj.map.panTo(obj.locpick_coord[obj.current_locpick]);
              obj.change('locpickchange', binding);
            });

            obj.locpick_coord[obj.current_locpick] = point;
            obj.map.panTo(point);
            obj.change('locpickchange', binding);
          }
        }
        else {
          if (overlay instanceof GMarker) {
            obj.current_locpick = -1;
            for (i = 0; i < obj.locpick_coord.length; i++) {
             if (obj.locpick_coord[i] == overlay.getLatLng()) {
                if (obj.current_locpick == -1) {
                  obj.current_locpick = i;
                }
              }
            }
          }
          // Unsetting the location
          obj.change('locpickremove', -1);
        }
      });
    }
  });

  obj.bind("ready", function () {
    // Fake a click to set the initial point, if one was set.
    if (obj.vars.behavior.locpick) {
      obj.locpick_set = true;
      for (i = 0; i < obj.locpick_count; i++) {
        obj.current_locpick = i;
        if (!obj.locpick_invalid[obj.current_locpick]) {
          if (obj.locpick_coord[obj.current_locpick] != null) {
            obj.change('locpickchange', -1);
          }
        }
      }
      obj.locpick_set = false;
//      if (!obj.locpick_invalid) {
//        obj.change('locpickchange', -1);
//      }
    }
  });

});

Drupal.gmap.addHandler('locpick_latitude',function(elem) {
  var obj = this;
  if (isNaN(elem.id.substring(elem.id.length - 3)) == false) {
    var locpick_lat_id = elem.id.substring(elem.id.length - 3) * 1;
  }
  else if (isNaN(elem.id.substring(elem.id.length - 2)) == false) {
    var locpick_lat_id = elem.id.substring(elem.id.length - 2) * 1;
  }
  else {
    var locpick_lat_id = elem.id.substring(elem.id.length - 1) * 1;
  }

  if (!obj.locpick_count || obj.locpick_count < (locpick_lat_id + 1)){
    obj.locpick_count = (locpick_lat_id + 1);
  }

  obj.bind("init", function() {
    if (elem.value != '') {
      obj.vars.latitude = Number(elem.value);
      if (obj.locpick_coord[locpick_lat_id]) {
        obj.locpick_coord[locpick_lat_id] = new GLatLng(obj.vars.latitude, obj.locpick_coord[locpick_lat_id].lng());
      }
      else {
        obj.locpick_coord[locpick_lat_id] = new GLatLng(obj.vars.latitude, obj.vars.longitude);
      }
      obj.locpick_invalid[locpick_lat_id] = false;
    }
    else {
      obj.locpick_coord[locpick_lat_id] = null;
      obj.locpick_invalid[locpick_lat_id] = true;
    }
  });

  var binding = obj.bind("locpickchange", function() {
    if (obj.locpick_coord[locpick_lat_id]) {
      elem.value = obj.locpick_coord[locpick_lat_id].lat();
    }
    else {
      elem.value = '';
    }
  });

  $(elem).change(function() {
    obj.current_locpick = locpick_lat_id;
    if (elem.value != '') {
      if (obj.locpick_coord[locpick_lat_id]) {
        obj.locpick_coord[locpick_lat_id] = new GLatLng(Number(elem.value), obj.locpick_coord[locpick_lat_id].lng());
        obj.locpick_set = true;
        obj.change('locpickchange', binding);
        obj.locpick_set = false;
      }
      else {
        obj.locpick_coord[locpick_lat_id] = new GLatLng(Number(elem.value), 0.0);
      }
    }
    else {
      obj.change('locpickremove', -1);
    }
  });
});

Drupal.gmap.addHandler('locpick_longitude', function(elem) {
  var obj = this;

  if (isNaN(elem.id.substring(elem.id.length - 3)) == false) {
    var locpick_lng_id = elem.id.substring(elem.id.length - 3) * 1;
  }
  else if (isNaN(elem.id.substring(elem.id.length - 2)) == false) {
    var locpick_lng_id = elem.id.substring(elem.id.length - 2) * 1;
  }
  else {
    var locpick_lng_id = elem.id.substring(elem.id.length - 1) * 1;
  }

  if (!obj.locpick_count || obj.locpick_count < (locpick_lng_id + 1)) {
    obj.locpick_count = (locpick_lng_id + 1);
  }

  obj.bind("init", function() {
    if (elem.value != '') {
      obj.vars.longitude = Number(elem.value);
      if (obj.locpick_coord[locpick_lng_id]) {
        obj.locpick_coord[locpick_lng_id] = new GLatLng(obj.locpick_coord[locpick_lng_id].lat(), obj.vars.longitude);
      }
      else {
        obj.locpick_coord[locpick_lng_id] = new GLatLng(obj.vars.latitude, obj.vars.longitude);
      }
      obj.locpick_invalid[locpick_lng_id] = false;
    }
    else {
      obj.locpick_invalid[locpick_lng_id] = true;
    }
  });

  var binding = obj.bind("locpickchange", function() {
    if (obj.locpick_coord[locpick_lng_id]) {
      elem.value = obj.locpick_coord[locpick_lng_id].lng();
    }
    else {
      elem.value = '';
    }
  });

  $(elem).change(function() {
    obj.current_locpick = locpick_lng_id;
    if (elem.value != '') {
      if (obj.locpick_coord[locpick_lng_id]) {
        obj.locpick_coord[locpick_lng_id] = new GLatLng(obj.locpick_coord[locpick_lng_id].lat(), Number(elem.value));
        obj.locpick_set = true;
        obj.change('locpickchange', binding);
        obj.locpick_set = false;
      }
      else {
        obj.locpick_coord[locpick_lng_id] = new GLatLng(0.0, Number(elem.value));
      }
    }
    else {
      obj.change('locpickremove', -1);
    }
  });
});
