module.exports = function (Order) {
    Order.validatesPresenceOf(
        'total',
        'balance'
    );

    Order.validatesInclusionOf('status', {
        in: [
            'paid',
            'unpaid',
            'partial',
            'cancelled',
            'refunded',
            'hold',
            'settled',
            'cart'
        ]
    });

    Order.validatesInclusionOf('type', {
        in: [
            'purchase',
            'recurring',
            'purchase-recurring'
        ]
    });
};
