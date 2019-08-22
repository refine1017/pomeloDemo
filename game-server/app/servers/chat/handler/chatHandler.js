module.exports = function (app) {
    return new Handler(app);
};

let Handler = function (app) {
    this.app = app;
};

let handler = Handler.prototype;

handler.send = function (msg, session, next) {
    let rid = session.get('rid');
    let username = session.uid.split('*')[0];
    let channelService = this.app.get('channelService');
    let channel = channelService.getChannel(rid, false);

    channel.pushMessage({
        route: 'onChat',
        msg: msg.content,
        from: username
    });

    next(null, {code: 200, msg: {}});
};