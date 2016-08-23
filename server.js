// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

app.post("/getPlayer", function (request, response) {
  console.log(request.query.code)
  
  scrapeNode("https://fantasyfootball.telegraph.co.uk/premier-league/statscentre/", {
    // Get the website title (from the top header)
    code: "tr[data-playerid=" + request.query.code + "]:data-playerid"
    // ...and the description
  , name: "tr[data-playerid=" + request.query.code + "]:data-name"
   , points: "tr[data-playerid=" + request.query.code + "]:data-points"
}, (err, data) => {
    response.send(err || data);
});
  
  //response.send("Silva");
  //response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
  ];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

//Scraping stuff
// Import the dependencies
const cheerio = require("cheerio")
    , req = require("tinyreq")
    ;
    
// Define the scrape function
function scrape(url, data, cb) {
    // 1. Create the request
    req(url, (err, body) => {
        if (err) { return cb(err); }

        //cheerio('#showall').click()

        // 2. Parse the HTML
        var scraper = cheerio.load(body)
          , pageData = {}
          ;
        
        
        //cheerio.
        console.log("Searching");
        
        // 3. Extract the data
        Object.keys(data).forEach(k => {
            pageData[k] = scraper(data[k]).text();
        });

        // Send the data in the callback
        cb(null, pageData);
    });
}    

function scrapeNode(url, data, cb) {
    // 1. Create the request
    req(url, (err, body) => {
        if (err) { return cb(err); }

        //cheerio('#showall').click()

        // 2. Parse the HTML
        var scraper = cheerio.load(body)
          , pageData = {}
          ;
        
        
        //cheerio.
        console.log("Searching2");
        
        // 3. Extract the data
        Object.keys(data).forEach(k => {
            var query = data[k].split(':')[0];
            var attributeName = data[k].split(':')[1];
            console.log(query);
            pageData[k] = scraper(query).attr(attributeName);
        });

        // Send the data in the callback
        cb(null, pageData);
    });
}    

// Extract some data from my website
/*
scrape("http://ionicabizau.net", {
    // Get the website title (from the top header)
    title: ".header h1"
    // ...and the description
  , description: ".header h2"
}, (err, data) => {
    console.log(err || data);
});


scrape("http://bramernic.com/fsports/tff2016-2017/points.php", {
    // Get the website title (from the top header)
    title: "tr:contains('1054')"
    // ...and the description
  , description: "tr:contains('1054') td:nth-child(2)"
}, (err, data) => {
    console.log(err || data);
});


scrapeNode("https://fantasyfootball.telegraph.co.uk/premier-league/statscentre/", {
    // Get the website title (from the top header)
    code: "tr[data-playerid='3005']:data-playerid"
    // ...and the description
  , name: "tr[data-playerid='3005']:data-name"
  , points: "tr[data-playerid='3005']:data-points"
}, (err, data) => {
    console.log(err || data);
});
*/
//