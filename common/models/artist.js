module.exports = function (Artist) {

  // GEOCODING ARTIST

  // google map api call using rest connector
  var getGeocode = require('function-rate-limit')(5, 1000, function(){

    var geoService = Artist.app.dataSources.geocode;
    geoService.geocode.apply(geoService, arguments);

  });

  // call before save
  Artist.beforeRemote('*.updateAttributes', function(ctx, user, next){

    var body = ctx.req.body;

    console.log(body);

    if (
      body                              &&
      body._address               &&
      body._address.addressLine   &&
      body._address.city          &&
      body._address.zipcode
    ) {

      // geocode
      getGeocode(body._address.addressLine, body._address.city, body._address.zipcode, function (err, result) {

        if (result && result[0]) {

          body._address.geolocation = result[0];
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
