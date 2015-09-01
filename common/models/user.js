module.exports = function (User) {
    User.validatesPresenceOf(
        'firstName',
        'lastName',
        'password',
        'email'
    );

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    User.validatesFormatOf('email', {
        with: re,
        message: 'Must provide a valid email'
    });

    User.validatesLengthOf('password', {
        min: 6,
        message: {
            min: 'Password is too short'
        }
    });


    User.validate('phone', userPhoneValidation, {message: 'Phone is too short'});
    function userPhoneValidation(err){
        if (typeof this.phone != 'undefined') {
           if (this.phone.length < 10) err();
        }
    }
};
