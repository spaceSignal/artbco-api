module.exports = function (Artwork) {

Artwork.validatesUniquenessOf('serialNumber', {message: 'the serial number is not unique'});
Artwork.validatesInclusionOf('status', {in: ['active', 'inactive', 'hold']});

};
