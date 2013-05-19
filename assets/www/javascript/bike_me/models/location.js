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
    this.onCurrentCoordinatesSuccess = this.onCurrentCoordinatesSuccess.bind(this);
    this.onCurrentCoordinatesFailure = this.onCurrentCoordinatesFailure.bind(this);
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
        // stupid escaping problem ...
        geocodeUrl = 'http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluub2du1nu%2C8a%3Do5-9u2slw';

    var data = {
      location    : this.address +", Tel Aviv",
      country: "IL",
      inFormat: "kvp",
      outFormat: "json"
    };

    $.getJSON(geocodeUrl, data).then(function (result) {
      if (result.info.statuscode) {
        $.mobile.loading('hide');
        bikeMe.alert("Problem loading adress:" + result.info.messages[0] ,"Oh Noes!");
        return;
      }

      var location = result.results[0].locations[0];

      me.longitude = location.latLng.lng;
      me.latitude  = location.latLng.lat;

      me.found = true;
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
      this.LatLng = new L.LatLng(this.latitude, this.longitude);
    }
    return this.LatLng;
  }
};
