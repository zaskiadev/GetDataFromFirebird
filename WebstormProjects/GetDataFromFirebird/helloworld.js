/*var dt = require('./learningfunction');
var url = require('url'); //used for getting data from link
var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var q = url.parse(req.url, true).query; //url used
    var txt = q.year + " " + q.month+" "+q.day;
    res.end(txt);
    //res.write("The Date Time Currently Is : "+dt.myDateTime());
    //res.end();
}).listen(8080);*/
const express = require('express');
const exphbs = require('express-handlebars');
var firebird = require('node-firebird');
const app = express();
var options={};
options.host = '192.168.9.105';
options.port = 3050;
options.database = 'DESKTOP-7OUD29N:C:\\Users\\Public\\Documents\\Firebird\\Employee.fdb';
options.user = 'SYSDBA';
options.password = 'masterkey';
options.lowercase_keys = false; // set to true to lowercase keys
options.role = null;            // default
options.pageSize = 4096;        // default when creating database
options.pageSize = 4096;        // default when creating database
options.retryConnectionInterval = 1000; // reconnect interval in case of connection drop
//setup templating
app.engine('hbs', exphbs.engine({
    layoutsDir: __dirname + '/views',
    defaultLayout: 'base',
    extname: '.hbs',
    partialsDir: __dirname + '/views/partials/'

}));

//CSS location
app.use(express.static('public'))

app.set('view engine', 'hbs');

//app navigation
app.get('/', function (req, res) {
    res.render('home', {

    });
});


app.get('/data_employee', function (req, res) {
var resultDB;
    firebird.attach(options,function (err, db){
        if (err)
            throw err

        db.query('SELECT EMP_NO,FULL_NAME,PHONE_EXT,HIRE_DATE,SALARY  FROM EMPLOYEE', function(err, result) {
            // IMPORTANT: close the connection
        resultDB=result;
            db.detach();
        });

    });

    res.render('data_employee', {dataDB:resultDB

    });
});

app.get('/add_employee', function (req, res) {
    res.render('add_employee', {

    });
});

app.listen(8888, () => {
    console.log('The web server has started on port 8888');
});