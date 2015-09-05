module.exports = function(Collection) {

  //recommended
  Collection.recommended = function(cb) {
    res = [
      {
        url: "url1",
        userId: "userId1"
      },
      {
        url: "url2",
        "userId": "userId2"
      }
    ];
    cb(null, res);
  }

  Collection.remoteMethod(
    'recommended',
    {
      http: {path: '/recommended', verb: 'get'},
      returns: {arg: "recommended", type: 'Array'}
    }
  );
  //nearBy
  //featuredArtist
  //wishlist
  //newlyCurated
  //trending

};
