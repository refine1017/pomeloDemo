module.exports = function (app) {
    return new ChatRemote(app);
};

let ChatRemote = function(app) {
    this.app = app;
    this.channelService = app.get('channelService');
};

ChatRemote.prototype.add = function(uid, sid, name, flag, cb) {
    let channel = this.channelService.getChannel(name, flag);
    let username = uid.split('*')[0];
    channel.pushMessage({
        route: 'onAdd',
        user: username,
    });
    if (!! channel) {
        channel.add(uid, sid);
    }
    cb(this.get(name, flag))
};

ChatRemote.prototype.get = function(name, flag) {
    let users = [];

    let channel = this.channelService.getChannel(name, flag);
    if (!! channel) {
        users = channel.getMembers();
    }

    for(let i = 0; i < users.length; i++) {
        users[i] = users[i].split('*')[0];
    }

    return users;
};

ChatRemote.prototype.kick = function(uid, sid, name, cb) {
    let channel = this.channelService.getChannel(name, false);
    if (!! channel) {
        channel.leave(uid, sid);
    }

    let username = uid.split('*')[0];
    channel.pushMessage({
        route: 'onLeave',
        user: username,
    });

    cb();
};