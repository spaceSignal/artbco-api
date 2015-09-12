module.exports = function (Event) {
    Event.validatesPresenceOf(
        'name',
        'description'
    );

    Event.validatesLengthOf('name', {
        min: 3,
        message: {
            min: 'name is too short'
        }
    });

    Event.validatesLengthOf('description', {
        min: 3,
        message: {
            min: 'description is too short'
        }
    });

    Event.validatesInclusionOf('type', {
        in: [
            'auction',
            'artshow'
        ]
    });

 /*   var exp = /^((0[1-9]|1[012])\/([123]0|[012][1-9]|31)\/(19[0-9]{2}|2[0-9]{3})\s+([01][0-9]|2[0-3]):([0-5][0-9]))$/;

    Event.validatesFormatOf('startDate', {
        with: exp,
        message: 'Must provide a valid date like MM/DD/YYYY hh:mm'
    });

    Event.validatesFormatOf('endDate', {
        with: exp,
        message: 'Must provide a valid date like MM/DD/YYYY hh:mm'
    });

*/

  // GEOCODING EVENTS

  // google map api call using rest connector
  var getGeocode = require('function-rate-limit')(5, 1000, function(){

    var geoService = Event.app.dataSources.geocode;
    geoService.geocode.apply(geoService, arguments);

  });

  // call before save
  Event.beforeRemote('*.updateAttributes', function(ctx, user, next){

    var body = ctx.req.body;

    console.log(body);

    if (
      body                              &&
      body._address                &&
      body._address.addressLine   &&
      body._address.city          &&
      body._address.zipcode
    ) {

      // geocode
      getGeocode(body._address.addressLine, body._address.city, body._address.zipcode, function (err, result) {

        if (result && result[0]) {

          body._address .geolocation = result[0];
          next();

        } else {

          var errmsg = 'Geocoding attempt was not successful. ';
          console.log(errmsg);

          next(new Error(errmsg));

        }

      });

    } else {

      // information not available... cannot geocode address
      var errmsg = 'ctx.body address information is not set. Geocoding cannot occur.';
      console.log(errmsg);

      next(new Error(errmsg));

    }

  });

};
