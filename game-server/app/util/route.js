let exp = module.exports;
let dispatcher = require('./dispatcher');

exp.chat = function (session, msg, app, cb) {
    let chatServers = app.getServersByType('chat');

    if (!chatServers || chatServers.length === 0) {
        cb(new Error('can not find chat servers.'));
        return;
    }

    let res = dispatcher.dispatch(session.get('rid'), chatServers);

    cb(null, res.id)
};