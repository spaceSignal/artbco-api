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
            'settled'
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
