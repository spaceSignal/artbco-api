module.exports = function (Artwork) {

Artwork.validatesUniquenessOf('serialNumber', {message: 'the serial number is not unique'});
Artwork.validatesInclusionOf('status', {in: ['active', 'inactive', 'hold']});

// hold
var details = undefined;
var imgs = undefined;
var callback = undefined;


    Artwork.detailView = function(artworkId, cb) {

        // load up cb only the first time
        callback = typeof callback == 'undefined' ? cb : callback;

        Artwork.getDetailsImgs(artworkId);

    }


    Artwork.remoteMethod(
        'detailView',
        {
            http: { path: '/detailview', verb: 'get'},
            accepts: {arg: 'id', type: 'string', http: { source: 'query'}, required: true, description:["Valid Artwork id"] },
            returns: {arg: 'artwork', type: 'array'}
        }
    );

    Artwork.getDetailsImgs = function (artworkId) {

        if (typeof details == 'undefined') {

            // details
            Artwork.getDetail(artworkId);

        } else if (typeof imgs == 'undefined') {

            // images
            Artwork.getImages(artworkId, 'full');

        } else {

            // cb
            callback(null, {'details': details, 'images': imgs});

            // clean up
            details = undefined;
            imgs = undefined;
            callback = undefined;

        }

    };

    Artwork.getDetail = function (artworkId) {

        Artwork.findById( artworkId, function (err, instance){

            // error condition... abort.
            if (err) {
                console.log(err.message);
                return callback(err);
            }

           details = instance;

            Artwork.getDetailsImgs(artworkId);

        });
    };

    Artwork.getImages = function (artworkId, size) {

        var Images = Artwork.app.models.Image;
        filter = { "where": {"imageId":artworkId, "size":size} };

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
};
