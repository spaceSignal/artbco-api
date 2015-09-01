module.exports = function (Video) {
    Video.validatesPresenceOf('src', 'caption');
};
