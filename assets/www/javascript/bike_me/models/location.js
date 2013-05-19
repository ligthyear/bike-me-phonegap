bikeMe.namespace('Models');

bikeMe.Models.Location = function (attributes) {
  this.initialize(attributes);
};

bikeMe.Models.Location.CURRENT_LOCATION = "Current Location";

bikeMe.Models.Location.prototype = {

  initialize: function (attributes) {
    this.longitude = attributes.longitude;
    this.latitude  = attributes.latitude;
    this.address   = attributes.address;
    this.found     = false;
  },

  locate: function () {
    if (this.address.trim() === bikeMe.Models.Location.CURRENT_LOCATION) {
      this.currentCoordinates();
    } else {
      this.fetchCoordinates();
    }
  },

  fetchCoordinates: function () {
    var me = this,
        geocodeUrl = 'http://open.mapquestapi.com/geocoding/v1/address';

    var data = {
      location    : this.address +", Tel Aviv",
      key: "Fmjtd%7Cluub2du1nu%2C8a%3Do5-9u2slw ",
      country: "IL",
      inFormat: "kvp",
      outFormat: "json"
    };

    $.getJSON(geocodeUrl, data).then(function (result) {
        if (result.info.statuscode != 200) {
          $.mobile.loading('hide');
          bikeMe.alert("Problem loading adress:" + result.info.messages[0] ,"Oh Noes!");
          return;
        }

        var location = results.results.locations[0];

        me.longitude = location.latLang.lng;
        me.latitude  = location.latLang.lat;

        me.found = true;
        console.log(me);
        radio('locationFound').broadcast();
      });
  },

  currentCoordinates: function () {
    var options = {maximumAge: 1000, timeout: 7000, enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(this.onCurrentCoordinatesSuccess, this.onCurrentCoordinatesFailure, options);
  },

  onCurrentCoordinatesSuccess: function (position) {
    this.latitude  = position.coords.latitude;
    this.longitude = position.coords.longitude;

    this.found = true;

    radio('locationFound').broadcast();
  },

  onCurrentCoordinatesFailure: function () {
    $.mobile.loading('hide');
    bikeMe.alert("The current location was not found.","Oh Noes!");
  },

  toString: function () {
    return this.address + " (" + this.latitude.toString() + ", " + this.longitude.toString() + ")";
  },

  unsubscribe: function () {
    // Nothing to unsubscribe from for now.
  },

  getLatLng: function() {
    if (_.isUndefined(this.LatLng)){
      this.LatLng = new google.maps.LatLng(this.latitude, this.longitude);
    }
    return this.LatLng;
  }
};
