// $Id: gdriving.js,v 1.1.2.2 2010/04/12 21:59:05 tyabut Exp $

/**
 * @file
 * GDriving javascript routines.
 */

// Create a namespace
Drupal.gdriving = {};

/**
 * Displays the directions from here form
 */
Drupal.gdriving.directionsFromHereFormDisplay = function() {
  $('.directions, .directionsTo').css({"display": "none", "visibility": "hidden"});
  $('.directionsBack, .directionsFrom').css({"display": "block", "visibility": "visible"});
  $('.infoExtended').css({"display": "none", "visibility": "hidden"});
};

/**
 * Displays the directions to here form
 */
Drupal.gdriving.directionsToHereFormDisplay = function() {
  $('.directions, .directionsFrom').css({"display": "none", "visibility": "hidden"});
  $('.directionsBack, .directionsTo').css({"display": "block", "visibility": "visible"});
  $('.infoExtended').css({"display": "none", "visibility": "hidden"});
}

/**
 * Displays original marker information
 */
Drupal.gdriving.backToNodeInfo = function() {
  $('.directionsBack, .directionsFrom, .directionsTo').css({"display": "none", "visibility": "hidden"});
  $('.directions, .infoExtended').css({"display": "block", "visibility": "visible"});
}

/**
 * Gathers address information and sends it to Google
 */
Drupal.gdriving.getDirections = function() {
  var dirOpts = {"getPolyline": "true", travelMode: G_TRAVEL_MODE_DRIVING};
  if ($("input[name='gdriving_type']:checked", $('div.directionsTo:visible, div.directionsFrom:visible')).val() == "walking") {
	  dirOpts = {"getPolyline": "true", travelMode: G_TRAVEL_MODE_WALKING};
  } 
  $('div.directionsTo:visible .saddr, div.directionsFrom:visible .saddr').each(function(){
    if($(this).val() != '') {
      var saddr = $(this);
      $('div.directionsTo:visible .daddr, div.directionsFrom:visible .daddr').each(function() {
        var daddr = $(this);
        if($(daddr).val() != '') {
          //add markers to directions map
          Drupal.gdriving.gdir.load("from: " + $(saddr).val() + " to: " + $(daddr).val(), dirOpts);
        }
      });
    }
  });
}

/**
 * Themes facebox for map display
 */
Drupal.theme.prototype.gdirections_facebox = function () {
	return '<div id="faceboxD"></div>';
}

/**
 * Themes map address error
 */
Drupal.theme.prototype.gdirections_error = function (intro, reason) {
	return '<strong>' + intro + '</strong><br /><br />' + reason;
}

/**
 * Listens and takes action based on Google response
 */
Drupal.behaviors.gdriving = function (context) {
  Drupal.gdriving.gdir = new GDirections(null, $('.directionsExtended').get(0));
  try {
	  var map = Drupal.settings.gdriving.gdrivingMap;
  } catch(e) {
  }
  
  // define error codes
  var reasons = [];
  reasons[G_GEO_SUCCESS]            = "Success";
  reasons[G_GEO_MISSING_ADDRESS]    = "Missing Address: The address was either missing or had no value.";
  reasons[G_GEO_UNKNOWN_ADDRESS]    = "Unknown Address:  No corresponding geographic location could be found for the specified address.";
  reasons[G_GEO_UNAVAILABLE_ADDRESS]= "Unavailable Address:  The geocode for the given address cannot be returned due to legal or contractual reasons.";
  reasons[G_GEO_BAD_KEY]            = "Bad Key: The API key is either invalid or does not match the domain for which it was given.";
  reasons[G_GEO_TOO_MANY_QUERIES]   = "Too Many Queries: The daily geocoding quota for this site has been exceeded.";
  reasons[G_GEO_SERVER_ERROR]       = "Server error: The geocoding request could not be successfully processed.";
  reasons[G_GEO_BAD_REQUEST]        = "A directions request could not be successfully parsed.";
  reasons[G_GEO_MISSING_QUERY]      = "No query was specified in the input.";
  reasons[G_GEO_UNKNOWN_DIRECTIONS] = "The GDirections object could not compute directions between the points.";

  // listen for errors then display to the user
  GEvent.addListener(Drupal.gdriving.gdir, "error", function() {
    var code = Drupal.gdriving.gdir.getStatus().code;
    var reason = "Code " + code;
    if (reasons[code]) {
      reason = Drupal.t(reasons[code]);
    } 

    $.facebox(Drupal.theme("gdirections_error", Drupal.t("Failed to obtain directions"), reason));
  });

  GEvent.addListener(Drupal.gdriving.gdir,"load", function() {
    var polyline = Drupal.gdriving.gdir.getPolyline();
    var length = polyline.getVertexCount();
    var shapes = [];
    
    shapes.type = 'line';
    shapes.style = ["0000ff", 5, 50, "00ff00", 60];
    
    var points = [];
    
    var baseIcon = new GIcon(G_DEFAULT_ICON);
    baseIcon.shadow = "http://www.google.com/mapfiles/shadow50.png";
    baseIcon.iconSize = new GSize(20, 34);
    baseIcon.shadowSize = new GSize(37, 34);
    baseIcon.iconAnchor = new GPoint(9, 34);
    baseIcon.infoWindowAnchor = new GPoint(9, 2);
    
    
    for(var i = 0; i < length; i++) {
      var vertex = polyline.getVertex(i);
      points.push([vertex.lat(), vertex.lng()]);
      if(i === 0 && i < (length - 1)) {
        var start = [];
        start.latitude = vertex.lat();
        start.longitude = vertex.lng();
        var letteredIcon = new GIcon(baseIcon);
        var letter = String.fromCharCode("A".charCodeAt(0));
        letteredIcon.image = "http://maps.gstatic.com/intl/en_us/mapfiles/icon_green" + letter + ".png";
        start.opts = {icon: letteredIcon}
        var end = [];
        end.latitude = polyline.getVertex(length-1).lat();
        end.longitude = polyline.getVertex(length-1).lng();
        var letteredIcon2 = new GIcon(baseIcon);
        var letter2 = String.fromCharCode("B".charCodeAt(0));
        letteredIcon2.image = "http://maps.gstatic.com/intl/en_us/mapfiles/icon_green" + letter2 + ".png";
        end.opts = {icon: letteredIcon2}
        
        Drupal.gmap.getMap(map).change('clearmarkers', -1);
        Drupal.gmap.getMap(map).vars.markers.marker = [start, end];

        
        Drupal.gmap.getMap(map).change('addmarker', -1, start);
        Drupal.gmap.getMap(map).change('addmarker', -1, end);
      }
    }
    shapes.points = points; 
    Drupal.gmap.getMap(map).change('prepareshape', -1, shapes)
    Drupal.gmap.getMap(map).change('addshape', -1, shapes);
  });
  
  GEvent.addListener(Drupal.gdriving.gdir, "addoverlay", function() {
    $(document).bind('afterReveal.facebox', function() {
	  if($('div#faceboxD').length > 0) {
        $('div.gDirections').css({"display": "block"}).appendTo('div#faceboxD');
        Drupal.gmap.getMap(map).map.checkResize();
        Drupal.gmap.getMap(map).vars.latitude = Drupal.gdriving.gdir.getBounds().getCenter().lat();
        Drupal.gmap.getMap(map).vars.longitude = Drupal.gdriving.gdir.getBounds().getCenter().lng();
        Drupal.gmap.getMap(map).bounds = Drupal.gdriving.gdir.getBounds();
        Drupal.gmap.getMap(map).change('move', -1);
        Drupal.gmap.getMap(map).vars.zoom = Drupal.gmap.getMap(map).map.getBoundsZoomLevel(Drupal.gdriving.gdir.getBounds());
        Drupal.gmap.getMap(map).change('zoom', -1);
        Drupal.gmap.getMap(map).map.setCenter(Drupal.gdriving.gdir.getBounds().getCenter());
      }
    });
    jQuery.facebox(function() {
        $.facebox(Drupal.theme('gdirections_facebox'));
    });
  });
  
  $(document).bind('beforeClose.facebox', function() {
    $('div.gDirections').css({"display": "none"}).appendTo('div#block-gdriving-0 div.content');
    Drupal.gmap.getMap(map).map.checkResize();
    Drupal.gdriving.gdir.clear();
  });
}