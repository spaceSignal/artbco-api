module.exports = function (Address) {
    Address.validatesPresenceOf(
        'addressLine',
        'city',
        'state',
        'zipcode'
    );
    Address.validatesLengthOf('addressLine', {
        min: 3,
        message: {
            min: 'addressLine is too short'
        }
    });
    Address.validatesLengthOf('city', {
        min: 3,
        message: {
            min: 'city is too short'
        }
    });
    Address.validatesLengthOf('state', {
        min: 2,
        message: {
            min: 'state is too short'
        }
    });

    Address.observe('before save', function (ctx, next) {
        if (ctx.instance) {
            console.log('new instance');
            next();
        } else {
            console.log('NOT NEW MODEL');
            next();
        };
    });


};
