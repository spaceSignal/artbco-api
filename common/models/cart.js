module.exports = function(Cart) {
  Cart.validatesPresenceOf(
        'subtotal'
    );

  Cart.validatesInclusionOf('status', {
        in: [
            'inCart',
            'checkout',
            'paymentInfo'
        ]
    });

  Cart.validatesInclusionOf('type', {
        in: [
            'pickup',
            'delivery'
        ]
    });
};
