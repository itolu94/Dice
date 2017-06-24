'use strict';

var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    mongoose = require('mongoose'),
    ehs = require('express-handlebars'),
    job = require('./models/jobs.js'),
    app = express();


// establish connection to mongoDB
mongoose.connect('mongodb://localhost/newjobsDB');
var db = mongoose.connection;

db.on('error', function(err){
    console.log('Connection error: ' + err);
});

db.once('open', function(){
    console.log('Housten, we have a connection!');
});


app.use(express.static('public'));
app.engine('handlebars', ehs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', function(req, resp) {
    resp.send(index.html);
});



app.get('/get-stories', function(req, res) {
    request('https://www.dice.com/jobs/q-Full_Stack-l-Atlanta%2C_GA-radius-30-startPage-1-jobs?searchid=1991182663953&stst=', function(err, resp, html) {
        var $ = cheerio.load(html);
        var result = []
        // $('#serp').each(function(i, listing){
        //     $(listing).children('a').each(function(i, what){
        //         console.log($(what).attr())
        //     })
        // })

        $('#serp').each(function(i, article) {
            // var position = '#position' + i
            // console.log('div #position: ' + position);
            // console.log($(article).children('.serp-result-content'));
        	$(article).children('.serp-result-content').each(function(i, content){
                $(this).children('ul.list-inline').each(function(i, jobss){
                  console.log($(this).children('#position2').attr());  
                })
            });
            result.push({ article: (i), title: $(this).children().attr('title'), link: $(this).attr('data-video-id') });
        })
        res.send('hello');
    });
});


app.listen(3012, function() {
    console.log('Connected on PORT 3012');
});
