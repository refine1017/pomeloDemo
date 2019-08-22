module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

Handler.prototype.hello = function(msg, session, next) {
	let name = msg.name;
  	next(null, {code: 200, msg: {"msg": 'hello ' + name}});
};

Handler.prototype.login = function (msg, session, next) {
	let self = this;
	let rid = msg.rid;
	let uid = msg.username + '*' + rid;
	let sessionService = self.app.get('sessionService');

	// duplicate login
	if (!! sessionService.getByUid(uid)) {
		next(null, {code: 500, error: true});
		return;
	}

	session.bind(uid);
	session.set('rid', rid);
	session.push('rid', function(err) {
		if (err) {
			console.error('set rid for session service failed! error is : %j', err.stack);
		}
	});
	session.on('closed', onUserLeave.bind(null, self.app));

	// put user into channel
	self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users) {
		next(null, {users: users});
	});
};

let onUserLeave = function(app, session) {
	if (!session || !session.uid) {
		return;
	}

	app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null)
};
