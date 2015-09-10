module.exports = function(Collection) {

  // hold
  var uCollection = undefined;
  var gCollection = undefined;
  var callback = undefined;
  var skipIt = undefined;

  Collection.findCollection = function(userId, cb) {

    console.log(userId);
    // load up cb only the first time
    callback = typeof callback == 'undefined' ? cb : callback;

    Collection.getCollections(userId);

  }

  Collection.remoteMethod(
    'findCollection',
    {
      http: { path: '/', verb: 'get'},
      accepts: {arg: 'id', type: 'string', http: { source: 'query'}, required: true, description:["Valid user id"] },
      returns: {arg: 'collection', type: 'array'}
    }
  );

  Collection.getCollections = function(userId){

    if (typeof uCollection == 'undefined') {

      // user collections
      Collection.getUserCollection(userId, Collection.getCollections);

    } else if (typeof gCollection == 'undefined') {

      // global collections
      Collection.getGlobalCollection(Collection.getCollections);

    } else {

      // cb
      callback(null, {user: uCollection, global: gCollection});

      // clean up
      uCollection = undefined;
      gCollection = undefined;
      callback = undefined;
      skipIt = undefined;

    }
  }

  Collection.getUserCollection = function(uid, cb){

    //console.log(Collection.app.models);
    var uc = Collection.app.models['user-collection'];

    var filter = {fields:['recommended', 'wishlist', 'nearBy'], where: { userId: uid}};

    uc.find(filter, function (err, instance){

      // error condition... abort.
      if (err) {
        console.log(err.message);
        return callback(err);
      }

      uCollection = instance;

      cb(uid);

    });
  }

  Collection.getGlobalCollection = function(cb){

    var gc = Collection.app.models['global-collection'];

    var filter = {fields:['featuredArtists', 'trending', 'newlyCurated']};

    gc.find(filter, function (err, instance){

      // error condition... abort.
      if (err) {
        console.log(err.message);
        return callback(err);
      }

      gCollection = instance;

      cb();

    });
  }

};
