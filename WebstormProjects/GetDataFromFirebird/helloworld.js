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
const Console = require("console");
const app = express();
var options={};
options.host = '192.168.9.79';
options.port = 3050;
options.database = '/opt/firebird/examples/empbuild/employee.fdb';
options.user = 'SYSDBA';
options.password = 'masterkey';
options.lowercase_keys = false; // set to true to lowercase keys
options.role = null;            // default
options.pageSize = 4096;        // default when creating database
options.pageSize = 4096;        // default when creating database
options.retryConnectionInterval = 1000; // reconnect interval in case of connection drop

var bodyparser= require('body-parser')

//setup templating
app.engine('hbs', exphbs.engine({
    layoutsDir: __dirname + '/views',
    defaultLayout: 'base',
    extname: '.hbs',
    partialsDir: __dirname + '/views/partials/'

}));
var jsonParser = bodyparser.json()
var urlencodedParser = bodyparser.urlencoded({extended:false})
//CSS location
app.use(express.static('public'));
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

        db.query('SELECT EMP_NO,FULL_NAME,PHONE_EXT,HIRE_DATE,SALARY  FROM EMPLOYEE', function(err, resultData) {
            // IMPORTANT: close the connection
          //  console.log(result)
            //console.log(resultData);
            res.render('data_employee', {resultData:resultData

            });
            db.detach();
        });

    });

    //console.log(resultDB)

});

app.get('/add_employee', function (req, res) {
    firebird.attach(options,function (err, db){
        if (err)
            throw err

        db.query('SELECT first 1 EMP_NO FROM EMPLOYEE order by EMP_NO desc', function(err, resultData) {
            // IMPORTANT: close the connection
            //  console.log(result)
            //console.log(resultData);
            var dataKirim=resultData[0]['EMP_NO']+1

            res.render('add_employee', {dataKirim:dataKirim

            });
            db.detach();
        });

    });

});

app.post('/add_employee', urlencodedParser, function (req, res) {

    const data= req.body
   // console.log(data.FirstName)
    var FirstName= data.FirstName;
    var LastName= data.LastName;

    res.render('home', {

    });
});

app.listen(8877, () => {
    console.log('The web server has started on port 8888');
});