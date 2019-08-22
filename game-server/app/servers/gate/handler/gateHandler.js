let dispatcher = require('../../../util/dispatcher');

module.exports = function (app) {
    return new Handler(app);
};

let Handler = function(app) {
    this.app = app;
};

let handler = Handler.prototype;

handler.queryEntry = function(msg, session, next) {
    let uid = msg.uid;
    if (!uid) {
        next(null, {code: 500});
        return;
    }

    let connectors = this.app.getServersByType('connector');
    if (!connectors || connectors.length === 0) {
        next(null, {code: 500});
        return;
    }

    let res = dispatcher.dispatch(uid, connectors);
    next(null, {code: 200, host: res.host, port: res.clientPort});
};