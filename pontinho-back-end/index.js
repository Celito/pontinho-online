const http = require('http');
const mongoConnect = require('./util/database').mongoConnect;
var app = require('./config/express')();
mongoConnect(() => {
  http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server escutando na porta ' + app.get('port'));
  })
});