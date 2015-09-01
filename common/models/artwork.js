module.exports = function (Artwork) {
    Artwork.validatesPresenceOf(
        'name',
        'salesPrice',
        'leasePrice'
    );

    Artwork.validatesLengthOf('name', {
        min: 5,
        message: {
            min: 'name is too short'
        }
    });

    var validStatuses = ['sale', 'lease', 'sold', 'leased', 'unkwon'];
    var validShapes = ['square', 'circle', 'pentagon'];

    Artwork.validatesInclusionOf('status', {
        in: validStatuses
    });

    Artwork.validatesInclusionOf('shape', {
        in: validShapes
    });
};
