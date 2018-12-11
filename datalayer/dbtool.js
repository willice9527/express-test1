//mongodb://<dbuser>:<dbpassword>@ds163053.mlab.com:63053/mongoose_001
//dbuser:willice
//dbpassword:willice123

var mongodb =  require('mongoose');
var dburl = 'mongodb://willice:willice123@ds163053.mlab.com:63053/mongoose_001'
mongodb.connect(dburl);
mongodb.Promise = global.Promise;
var dbinstance = mongodb.connection;
dbinstance.on('error', console.error.bind(console, 'db connect error:'));
