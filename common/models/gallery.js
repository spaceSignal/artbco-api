module.exports = function (Gallery) {
    Gallery.validatesPresenceOf('name');

    Gallery.validatesLengthOf('name', {
        min: 3,
        message: {
            min: 'name is too short'
        }
    });
};
