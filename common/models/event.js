module.exports = function (Event) {
    Event.validatesPresenceOf(
        'name',
        'description'
    );

    Event.validatesLengthOf('name', {
        min: 3,
        message: {
            min: 'name is too short'
        }
    });

    Event.validatesLengthOf('description', {
        min: 3,
        message: {
            min: 'description is too short'
        }
    });

    Event.validatesInclusionOf('type', {
        in: [
            'auction',
            'artshow'
        ]
    });

    var exp = /^((0[1-9]|1[012])\/([123]0|[012][1-9]|31)\/(19[0-9]{2}|2[0-9]{3})\s+([01][0-9]|2[0-3]):([0-5][0-9]))$/;

    Event.validatesFormatOf('startDate', {
        with: exp,
        message: 'Must provide a valid date like MM/DD/YYYY hh:mm'
    });

    Event.validatesFormatOf('endDate', {
        with: exp,
        message: 'Must provide a valid date like MM/DD/YYYY hh:mm'
    });
};
