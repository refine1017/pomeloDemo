let pomelo = require('pomelo');
let route = require('./app/util/route');

/**
 * Init app for client.
 */
let app = pomelo.createApp();
app.set('name', 'game');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 3,
      useDict : true,
      useProtobuf : true
    });
});

// gate
app.configure('production|development', 'gate', function() {
   app.set('connectorConfig', {
       connector: pomelo.connectors.hybridconnector,
       useProtobuf: true
   })
});

app.configure('production|development', function() {
    app.route('chat', route.chat);
    app.filter(pomelo.timeout());
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
