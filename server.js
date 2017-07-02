'use strict';

var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    mongoose = require('mongoose'),
    ehs = require('express-handlebars'),
    Jobs = require('./models/jobs.js'),
    bodyParser = require("body-parser"),
    methodOverride = require('method-override'),
    PORT = process.env.PORT || 3012,
    app = express();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));



// use static files  in public directory
app.use(express.static('public'));

// use method-override to allow put and delete request.
app.use(methodOverride('_method'))

// set handlebars as view engine
app.engine('handlebars', ehs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// establish connection to mongoDB
mongoose.connect('mongodb://localhost/newjobsDB');

var db = mongoose.connection;

db.on('error', function(err) {
    console.log('Connection error: ' + err);
});

db.once('open', function() {
    console.log('Housten, we have a connection!');
});


// routes
app.get('/', function(req, resp) {
    resp.render('index');
});


// shows most recent job postings
app.get('/get-stories', function(req, res) {
    request('https://www.dice.com/jobs/q-Full_Stack-l-Atlanta%2C_GA-radius-30-startPage-1-jobs?searchid=1991182663953&stst=', function(err, resp, html) {
        var $ = cheerio.load(html),
                result = [];
        $('#serp').each(function(i, article) {
          var position = 0,
              counter = 0,
              temp = {};
          $(article).children('.serp-result-content').each(function(i, content){ 
            temp = {}
            var description = $(this).children('div.shortdesc').text().trim().replace(/[\n\t\r]/g,"").split('...')
            temp.description = description[0];
            $(this).children('ul.list-inline').each(function(i, jobss) {
              if (position === 0) {
                $(jobss).children().children().each(function(j, jobsLink){ 
                  // ==============================================
                  if(j == 0){
                  var htmlArray = [];
                  htmlArray.push($(jobsLink).html());
                  var link = htmlArray.toString();
                  var href = link.trim().replace(/[\n\t\r]/g,"").replace('Stack&amp', 'href="').replace(/["']/g, "").split('href=');            
                  temp.link = href[1];
                  temp.id = counter
                  counter++
                }
                // =======================================================
                })
                temp.position = $(jobss).children().children().text().trim();
                position++;
              } else {
                  temp.about = $(jobss).children().children().text().trim().replace(/[\n\t\r]/g,"");
                  result.push(temp);
                  position = 0
              }
            });
          });
      });
        res.render('articles', {jobs: result})
    });
});



// adding saved jobs to db
app.post('/jobs/save', function(req, resp){
  var saveJobs = new Jobs ({
      title: req.body.position,
      description: req.body.description,
      link: req.body.link, 
      about: req.body.location, 
  });  
  saveJobs.save(function(err, doc){
    if (err) console.log(err);
  })
});

// deletes saved jobs
app.delete('/jobs/save', function(req, resp){
  var id = req.body.post
  Jobs.findOne({_id: id}).remove().exec();
});


// find the notes for all of the saved jobs
app.get('/jobs/save/notes', function(req, resp){
  Jobs.find({}, 'notes',function(err, doc){
    if (err) console.log(err);
    resp.json(doc);
  });
});




// jobs that have been applied too
app.get('/open-application', function(req, resp){
  Jobs.find({}, function(err, doc){
    if(err) console.log(err);
    resp.render('savedJobs', {jobs: doc})
  });
})


app.post('/open-application/note', function(req, resp) {
  var id = req.body.id;
  var newNote = req.body.note;
  Jobs.update({_id: id}, {$addToSet: {notes: newNote}}, function(err, doc){
    if (err) console.log(err);
  })  
})

app.delete('/open-application/note', function(req, resp) {
  var id = req.body.id;
  var note = req.body.note;
  Jobs.update({_id: id}, {$pull: {notes: note}}, function(err, doc){
    if (err) console.log(err);
  })  
})



app.listen(PORT, function() {
    console.log('Connected on PORT 3012');
});
