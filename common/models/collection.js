module.exports = function(Collection) {

  // hold
  var cFeaturedArtist = undefined;
  var cNearBy = undefined;
  var cNewlyCurated = undefined;
  var cRecommended = undefined;
  var cTrending = undefined;
  var cWishlist = undefined;

  var skipIt = undefined;

  // hard limit on the amount of returning documents
  var limitVal = 10;


  //
  // FIND COLLECTION
  //
  Collection.remoteMethod(
    'findCollection',
    {
      http: { path: '/', verb: 'get'},
      accepts: {arg: 'id', type: 'string', http: { source: 'query'}, required: true, description:["Valid user id"] },
      returns: {arg: 'collection', type: 'array'}
    }
  );

  Collection.findCollection = function(userId, cb) {

    if (typeof cRecommended == 'undefined' || typeof cNearBy == 'undefined' || typeof cWishlist == 'undefined') {

      // getAllUserValues
      _getAllUserValues(userId, Collection.findCollection, cb);


    } else if (typeof cFeaturedArtist == 'undefined') {

      // featured artist
      _getcFeaturedArtist(userId, Collection.findCollection, cb);

    } else if (typeof cTrending == 'undefined') {

      // trending
      _getcTrending(userId, Collection.findCollection, cb);

    } else if (typeof cNewlyCurated == 'undefined') {

      // newly curated
      _getcNewlyCurated(userId, Collection.findCollection, cb);

    } else {

      // cb
      cb(null, {'user': { 'recommended':cRecommended, 'wishlist':cWishlist, 'nearBy':cNearBy }, 'global': { 'featuredArtists': cFeaturedArtist, 'trending': cTrending, 'newlyCurated': cNewlyCurated }});

      // clean up
      cFeaturedArtist = undefined;
      cNearBy = undefined;
      cNewlyCurated = undefined;
      cRecommended = undefined;
      cTrending = undefined;
      cWishlist = undefined;

    }

  };

  //
  // FIND NEWLY CURATED
  //
  Collection.remoteMethod(
    'findNewlyCurated',
    {
      http: { path: '/newlycurated', verb: 'get'},
      accepts: {arg: 'skip', type: 'number', http: { source: 'query'}, required: false, description:["Valid number of rows to skip"] },
      returns: {arg: 'newlyCurated', type: 'array'}
    }
  );

  Collection.findNewlyCurated = function(skip, cb) {

    // go get them
    if (typeof cNewlyCurated == 'undefined') {

      // newly curated
      _getcNewlyCurated(skip, Collection.findNewlyCurated, cb);

    } else {

      // cb
      cb(null, cNewlyCurated);

      // clean up
      cNewlyCurated = undefined;

    }

  };

  //
  // FIND TRENDING
  //
  Collection.remoteMethod(
    'findTrending',
    {
      http: { path: '/trending', verb: 'get'},
      accepts: {arg: 'skip', type: 'number', http: { source: 'query'}, required: false, description:["Valid number of rows to skip"] },
      returns: {arg: 'trending', type: 'array'}
    }
  );

  Collection.findTrending = function(skip, cb) {

    // go get them
    if (typeof cTrending == 'undefined') {

      // trending
      _getcTrending(skip, Collection.findTrending, cb);

    } else {

      // cb
      cb(null, cTrending);

      // clean up
      cTrending = undefined;

    }

  };

  //
  // FIND FEATURED ARTIST
  //
  Collection.remoteMethod(
    'findFeaturedArtist',
    {
      http: { path: '/featuredartists', verb: 'get'},
      accepts: {arg: 'skip', type: 'number', http: { source: 'query'}, required: false, description:["Valid number of rows to skip"] },
      returns: {arg: 'featuredArtists', type: 'array'}
    }
  );

  Collection.findFeaturedArtist = function(skip, cb) {

    // go get them
    if (typeof cFeaturedArtist == 'undefined') {

      // featured artists
      _getcFeaturedArtist(skip, Collection.findFeaturedArtist, cb);

    } else {

      // cb
      cb(null, cFeaturedArtist);

      // clean up
      cFeaturedArtist = undefined;

    }

  };

  //
  // PRIVATE METHODS
  //
  function _getAllUserValues(userId, cb, callback) {

    var filter = {limit:limitVal, include: ['Recommended', 'NearBy', 'Wishlist'] };

    var User = Collection.app.models['user'];

    User.findById(userId, filter, function (err, instance){

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

        cRecommended = instance.Recommended();
        cNearBy = instance.NearBy();
        cWishlist = instance.Wishlist();

        cb(userId,callback);

      }

    });

  };

  function _getcFeaturedArtist(userId, cb, callback) {

    var featuredArtist = Collection.app.models['FeaturedArtist'];
    var filter = {limit:limitVal};

    if (typeof skipIt != 'undefined') {
      filter.skip = skipIt;
    }

    featuredArtist.all(filter, function (err, instance){

      // error condition... abort.
      if (err) {
        console.log(err.message);
        return callback(err);
      }

      if (instance == null) {
        instance = [];
      }

      cFeaturedArtist = instance;

      cb(userId, callback);

    });
  };

  function _getcNewlyCurated(userId, cb, callback) {

    var newlyCurated = Collection.app.models['NewlyCurated'];
    var filter = {limit:limitVal};

    if (typeof skipIt != 'undefined') {
      filter.skip = skipIt;
    }

    newlyCurated.all(filter, function (err, instance){

      // error condition... abort.
      if (err) {
        console.log(err.message);
        return callback(err);
      }

      if (instance == null) {
        instance = {};
      }

      cNewlyCurated = instance;

      cb(userId, callback);

    });
  };

  function _getcTrending(userId, cb, callback) {

    var trending = Collection.app.models['Trending'];
    var filter = {limit:limitVal};

    if (typeof skipIt != 'undefined') {
      filter.skip = skipIt;
    }

    trending.all(filter, function (err, instance){

      // error condition... abort.
      if (err) {
        console.log(err.message);
        return callback(err);
      }

      if (instance == null) {
        instance = {};
      }

      cTrending = instance;

      cb(userId, callback);

    });
  };


};
