module.exports = function (Artwork) {

Artwork.validatesUniquenessOf('serialNumber', {message: 'the serial number is not unique'});
Artwork.validatesInclusionOf('status', {in: ['status1', 'status2', 'status3']});

};
