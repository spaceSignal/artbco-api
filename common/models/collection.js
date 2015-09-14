module.exports = function(Collection) {

  // hold
  var cFeaturedArtist = undefined;
  var cNearBy = undefined;
  var cNewlyCurated = undefined;
  var cRecommended = undefined;
  var cTrending = undefined;
  var cWishlist = undefined;

  var User = undefined;
  var skipIt = undefined;

  var callback = undefined;

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

    // load up cb only the first time
    callback = typeof callback == 'undefined' ? cb : callback;

    // load up User model
    User = typeof User == 'undefined' ? User = Collection.app.models['user'] : User;

    // go get them
    Collection.getCollections(userId);

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

    // load up cb only the first time
    callback = typeof callback == 'undefined' ? cb : callback;

    // load up skipIt only the first time
    skipIt = typeof skipIt == 'undefined' ? skip : skipIt;

    // go get them
    if (typeof cNewlyCurated == 'undefined') {

      // newly curated
      _getcNewlyCurated(skip, Collection.findNewlyCurated);

    } else {

      // cb
      callback(null, cNewlyCurated);

      // clean up
      cNewlyCurated = undefined;
      skipIt = undefined;
      callback = undefined;
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

    // load up cb only the first time
    callback = typeof callback == 'undefined' ? cb : callback;

    // load up skipIt only the first time
    skipIt = typeof skipIt == 'undefined' ? skip : skipIt;

    // go get them
    if (typeof cTrending == 'undefined') {

      // trending
      _getcTrending(skip, Collection.findTrending);

    } else {

      // cb
      callback(null, cTrending);

      // clean up
      cTrending = undefined;
      skipIt = undefined;
      callback = undefined;
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

    // load up cb only the first time
    callback = typeof callback == 'undefined' ? cb : callback;

    // load up skipIt only the first time
    skipIt = typeof skipIt == 'undefined' ? skip : skipIt;

    // go get them
    if (typeof cFeaturedArtist == 'undefined') {

      // featured artists
      _getcFeaturedArtist(skip, Collection.findFeaturedArtist);

    } else {

      // cb
      callback(null, cFeaturedArtist);

      // clean up
      cFeaturedArtist = undefined;
      skipIt = undefined;
      callback = undefined;
    }

  };

  Collection.getCollections = function(userId){

    if (typeof cRecommended == 'undefined' || typeof cNearBy == 'undefined' || typeof cWishlist == 'undefined') {

        // getAllUserValues
        _getAllUserValues(userId, Collection.getCollections);


      } else if (typeof cFeaturedArtist == 'undefined') {

        // featured artist
        _getcFeaturedArtist(userId, Collection.getCollections);

      } else if (typeof cTrending == 'undefined') {

        // trending
        _getcTrending(userId, Collection.getCollections);

      } else if (typeof cNewlyCurated == 'undefined') {

        // newly curated
        _getcNewlyCurated(userId, Collection.getCollections);


      } else {

        // cb
        callback(null, {'user': {'recommended':cRecommended, 'wishlist':cWishlist, 'nearBy':cNearBy }, 'global': {'featuredArtists': cFeaturedArtist, 'trending': cTrending, 'newlyCurated': cNewlyCurated}});

        // clean up
        cFeaturedArtist = undefined;
        cNearBy = undefined;
        cNewlyCurated = undefined;
        cRecommended = undefined;
        cTrending = undefined;
        cWishlist = undefined;
        User = undefined;
        callback = undefined;

      }
  };


  // Private methods
  function _getAllUserValues(userId, cb) {

    var filter = {limit:limitVal, include: ['Recommended', 'NearBy', 'Wishlist'] };

    User.findById(userId, filter, function (err, instance){

      // error condition... abort.
      if (err) {
        console.log(err.message);
        return callback(err);
      }

      if (instance == null) {

 //       var err = new Error('id is not found.');
 //       err.statusCode = 400;

//        cb(err);

        cRecommended = [];
        cNearBy = [];
        cWishlist = [];

        cb(userId);

      } else {

        cRecommended = instance.Recommended();
        cNearBy = instance.NearBy();
        cWishlist = instance.Wishlist();

        cb(userId);

      }



    });

  };

  function _getcFeaturedArtist(userId, cb) {

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
        instance = {};
      }

      cFeaturedArtist = instance;

      cb(userId);

    });
  };

  function _getcNewlyCurated(userId, cb) {

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

      cb(userId);

    });
  };

  function _getcTrending(userId, cb) {

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

      cb(userId);

    });
  };


};
