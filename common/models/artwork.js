module.exports = function (Artwork) {
    Artwork.validatesPresenceOf(
        'name'
    );

    Artwork.validatesLengthOf('name', {
        min: 5,
        message: {
            min: 'name is too short'
        }
    });
};
