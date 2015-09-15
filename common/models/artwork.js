module.exports = function (Artwork) {

  Artwork.validatesUniquenessOf('serialNumber', {message: 'the serial number is not unique'});
  Artwork.validatesInclusionOf('status', {in: ['active', 'inactive', 'hold']});

  // hold
  var details = undefined;
  var sameArtist = undefined;
  var sameArt = undefined;
  var skipIt = undefined;

  // hard limit on the amount of returning documents
  var limitVal = 10;

  Artwork.remoteMethod(
    'detailView',
    {
      http: { path: '/detailView', verb: 'get'},
      accepts: {arg: 'id', type: 'string', http: { source: 'query'}, required: true, description:["Valid Artwork id"] },
      returns: {arg: 'artwork', type: 'array'}
    }
  );

  Artwork.detailView = function(artworkId, cb) {

    if (typeof details == 'undefined') {

      // details
      Artwork.getDetail(artworkId, 's3', Artwork.detailView, cb);

    } else if (typeof sameArtist == 'undefined') {

      //  images for same artist
      Artwork.getSameArtist(artworkId, 's3', Artwork.detailView, cb);

    } else if (typeof sameArt == 'undefined') {

      // images for same art
      Artwork.getSameArt(artworkId, 's3', 0, Artwork.detailView, cb, true);

    } else {

      // cb
      cb(null, {'details': details, 'sameArtist': sameArtist, 'sameArt': sameArt});

      // clean up
      details = undefined;
      sameArt = undefined;
      sameArtist = undefined;
    }

  }

  Artwork.remoteMethod(
    'sameArt',
    {
      http: { path: '/sameArt', verb: 'get'},
      accepts:[
        {arg: 'id', type: 'string', http: { source: 'query'}, required: true, description:["Valid Artwork Id"] },
        {arg: 'skip', type: 'number', http: { source: 'query'}, required: true, description:["Valid number to skip"] }
      ],
      returns: {arg: 'artwork', type: 'array'}
    }
  );

  Artwork.sameArt = function(artworkId, skip, cb) {

    skipIt = (typeof skipIt == 'undefined') ? skip : skipIt;

    if (typeof details == 'undefined') {

      // details
      Artwork.getDetail(artworkId, 's3', Artwork.sameArt, cb);

    } else if (typeof sameArt == 'undefined') {

      cb = skip;

      // images for same art
      Artwork.getSameArt(artworkId, 's3', skipIt, Artwork.sameArt, cb);

    } else {

      // cb
      cb(null, {'sameArt': sameArt});

      // clean up
      details = undefined;
      sameArt = undefined;
      skipIt = undefined;
    }

  }


 Artwork.getDetail = function (artworkId, size, cb, callback) {

    // filter/inclusion
   var flds = ['id', 'status', 'media', 'name', 'width', 'depth', 'edition', 'editionCount', 'length', 'salesPrice', 'artistId', 'galleryId'];
   var rel = {relation: 'images', scope: {where: {'size': size}}};
   var rel2 = {relation: 'artist', scope:{ fields: ['firstName', 'lastName']}};

   var filter = {fields: flds, include: [rel, rel2 ]};

    Artwork.findById( artworkId, filter, function (err, instance){

      // error condition... abort.
      if (err) {
          console.log(err.message);
          return callback(err);
      }

      if (instance == null) {

        var err = new Error('id is not found.');
        err.statusCode = 400;

        return callback(err);

      } else {

        details = instance;

        cb(artworkId, callback);

      }

    });
  };

  Artwork.getSameArtist = function (artworkId, size, cb, callback) {

    console.log(details.artistId);

    // abort if not available
    if (typeof details == 'undefined') return;

   // filter/inclusion
    var filter = {limit:limitVal, fields:['id'], where: { artistId: details.artistId}, include:{ relation: 'images', scope : { fields:['url'], where: {'size': size} }}};

    Artwork.find( filter, function (err, instance){

      // error condition... abort.
      if (err) {
          console.log(err.message);
          return callback(err);
      }

      if (instance == null) {
        instance = [];
      }

      sameArtist = instance;

      cb(artworkId, callback);


    });

  };

  Artwork.getSameArt = function (artworkId, size, skipDocs, cb, callback, onErrorArray) {

    // abort if not available
    if (typeof details == 'undefined') return;

    // defined whether in case of error do we return an error or an empty array
    onErrorArray = (typeof onErrorArray == 'undefined') ? false : onErrorArray ;

    // filter/inclusion
    var filter = {limit:limitVal, fields:['id'], skip:skipDocs, where: { media: details.media }, include:{ relation: 'images', scope : { fields:['url'], where: {'size': size} }} };

    console.log(skipDocs);

    Artwork.find( filter, function (err, instance){

      // error condition... abort.
      if (err) {
        console.log(err.message);
        return callback(err);
      }

      if (instance == null) {

        if (onErrorArray !== true) {
          var err = new Error('id is not found.');
          err.statusCode = 400;

          return callback(err);

        } else {

          sameArt = [];
          cb(artworkId, skipIt, callback);

        }

      } else {

        sameArt = instance;
        cb(artworkId, skipIt, callback);

      }

    });

  };

  // GEOCODING ARTWORK

  // google map api call using rest connector
  var getGeocode = require('function-rate-limit')(5, 1000, function(){

    var geoService = Artwork.app.dataSources.geocode;
    geoService.geocode.apply(geoService, arguments);

  });

  // call before save
  Artwork.beforeRemote('*.updateAttributes', function(ctx, user, next){

    var body = ctx.req.body;

    if (
        body                              &&
        body.currentAddress               &&
        body.currentAddress.addressLine   &&
        body.currentAddress.city          &&
        body.currentAddress.zipcode
    ) {

      // geocode
      getGeocode(body.currentAddress.addressLine, body.currentAddress.city, body.currentAddress.zipcode, function (err, result) {

        if (result && result[0]) {

          body.currentAddress.geolocation = result[0];
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
