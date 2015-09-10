module.exports = function (Artwork) {

Artwork.validatesUniquenessOf('serialNumber', {message: 'the serial number is not unique'});
Artwork.validatesInclusionOf('status', {in: ['active', 'inactive', 'hold']});

  // hold
  var details = undefined;
  var imgs = undefined;
  var callback = undefined;
  var sameArtist = undefined;
  var sameArt = undefined;
  var skipIt = undefined;


  Artwork.detailView = function(artworkId, cb) {

    // load up cb only the first time
    callback = typeof callback == 'undefined' ? cb : callback;

    Artwork.getDetailsImgs(artworkId);

  }

  Artwork.sameArt = function(artworkId, skip, cb) {

    // load up cb only the first time
    callback = typeof callback == 'undefined' ? cb : callback;
    skipIt = typeof skipIt == 'undefined' ? skip : skipIt;

    if (typeof details == 'undefined') {

      // details
      Artwork.getDetail(artworkId, Artwork.sameArt);

    } else if (typeof sameArt == 'undefined') {

      // images for same art
      Artwork.getSameArt(artworkId, 's3', skipIt, Artwork.sameArt);

    } else {

      // cb
      callback(null, {'sameArt': sameArt});

      // clean up
      callback = undefined;
      skipIt = undefined;
      sameArt = undefined;
    }

  }

  Artwork.remoteMethod(
    'detailView',
    {
        http: { path: '/detailView', verb: 'get'},
        accepts: {arg: 'id', type: 'string', http: { source: 'query'}, required: true, description:["Valid Artwork id"] },
        returns: {arg: 'artwork', type: 'array'}
    }
  );

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

  Artwork.getDetailsImgs = function (artworkId) {

    if (typeof details == 'undefined') {

      // details
      Artwork.getDetail(artworkId, Artwork.getDetailsImgs);

    } else if (typeof imgs == 'undefined') {

      // images
      Artwork.getImages(artworkId, 's3');

    } else if (typeof sameArtist == 'undefined') {

      //  images for same artist
      Artwork.getSameArtist(artworkId, 's3');

   } else if (typeof sameArt == 'undefined') {

      // images for same art
     Artwork.getSameArt(artworkId, 's3', 0, Artwork.getDetailsImgs);

    } else {

      // cb
      callback(null, {'details': details, 'images': imgs, 'sameArtist': sameArtist, 'sameArt': sameArt});

      // clean up
      details = undefined;
      imgs = undefined;
      callback = undefined;
      sameArt = undefined;
      sameArtist = undefined;
    }
  };

  Artwork.getDetail = function (artworkId, cb) {

    // filter/inclusion
    var filter = {fields:['id', 'status', 'media', 'name', 'width', 'depth', 'edition', 'editionCount', 'length', 'salesPrice', 'artistId', 'galleryId']};

    Artwork.findById( artworkId, filter, function (err, instance){

      // error condition... abort.
      if (err) {
          console.log(err.message);
          return callback(err);
      }

      details = instance;

      cb(artworkId);

    });
  };

 Artwork.getImages = function (artworkId, size) {

    var Images = Artwork.app.models.Image;

    var filter = { "where": {"imageId":artworkId, "size":size} };

    Images.find( filter, function (err, instance){

      // error condition... abort.
      if (err) {
          console.log(err.message);
          return callback(err);
      }

      imgs = instance;

      Artwork.getDetailsImgs(artworkId);

    });

  };

  Artwork.getSameArtist = function (artworkId, size) {

    // abort if not available
    if (typeof details == 'undefined') return;

   // filter/inclusion
    var filter = {fields:['id'], where: { artistId: details.artistId}, include:{ relation: 'images', scope : { fields:['url'], where: {'size': size} }}};

    Artwork.find( filter, function (err, instance){

      // error condition... abort.
      if (err) {
          console.log(err.message);
          return callback(err);
      }

      sameArtist = instance;

      Artwork.getDetailsImgs(artworkId);

    });

  };

  Artwork.getSameArt = function (artworkId, size, skipDocs, cb) {

    // abort if not available
    if (typeof details == 'undefined') return;

    // filter/inclusion
    var filter = {fields:['id'], skip:skipDocs, where: { media: details.media }, include:{ relation: 'images', scope : { fields:['url'], where: {'size': size} }}, limit:4 };

    Artwork.find( filter, function (err, instance){

      // error condition... abort.
      if (err) {
        console.log(err.message);
        return callback(err);
      }

      sameArt = instance;

      cb(artworkId);

    });

  };

};
