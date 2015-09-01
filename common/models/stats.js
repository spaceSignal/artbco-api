module.exports = function (Stats) {
    function likes (err) {
        if (this.likes < 0) {
            err();
        };
    }

    function dislikes (err) {
        if (this.dislikes < 0) {
            err();
        };
    }

    function viewed (err) {
        if (this.viewed < 0) {
            err();
        };
    }

    function shared (err) {
        if (this.shared < 0) {
            err();
        };
    }

    Stats.validate('likes', likes, { message: 'likes must be >= 0' });
    Stats.validate('dislikes', dislikes, { message: 'dislikes must be >= 0' });
    Stats.validate('viewed', viewed, { message: 'viewed must be >= 0' });
    Stats.validate('shared', shared, { message: 'shared must be >= 0' });
};
