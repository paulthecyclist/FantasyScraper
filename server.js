// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var scraper;
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  loadPage("https://fantasyfootball.telegraph.co.uk/premier-league/statscentre/");
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  //response.sendStatus(200);
});

app.post("/getPlayer", function (request, response) {
  console.log(request.query.code)
  
  scrapeNode3({
    // Get the website title (from the top header)
    code: "tr[data-playerid=" + request.query.code + "]:data-playerid"
    // ...and the description
  , name: "tr[data-playerid=" + request.query.code + "]:data-name"
   , points: "tr[data-playerid=" + request.query.code + "]:data-weekpoints"
}, request.query.code
,(err, data) => {
    response.send(err || data);
});
});

app.post("/getPlayers", function (request, response) {
  console.log(request.query.codes)
  
  var codes = request.query.codes.split(',');
  var result = [];
  
  console.log(codes);
  
  for (var counter = 0; counter < codes.length; counter++)
  {
    var code = codes[counter];   
  scrapeNode3({
    // Get the website title (from the top header)
    code: "tr[data-playerid=" + code + "]:data-playerid"
    // ...and the description
  , name: "tr[data-playerid=" + code + "]:data-name"
   , points: "tr[data-playerid=" + code + "]:data-weekpoints"
  }, code
  ,(err, data) => {
    console.log(data);
    result.push(err || data);
  });
}

  response.send(result)
  response.sendStatus(200);
  
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
        var scraper = cheerio.load(body) , pageData = {};
        
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


function scrapeNode(url, data, code, cb) {
    // 1. Create the request
    req(url, (err, body) => {
        if (err) { return cb(err); }
        // 2. Parse the HTML
         var scraper = cheerio.load(body);
         var pageData = {};
         
        // 3. Extract the data
        Object.keys(data).forEach(k => {
            var query = data[k].split(':')[0];
            var attributeName = data[k].split(':')[1];
            console.log(query +  ' : ' + attributeName );
            
            if (attributeName == 'data-points')
            {
                var previousPts = findPlayerPts(code)
                //console.log("Searching Aguero week1: " + previousPts);
                var totalPts = parseInt(scraper(query).attr(attributeName));
                pageData[k] = totalPts - previousPts;
            }
            else { pageData[k] = scraper(query).attr(attributeName); }
        });

        // Send the data in the callback
        cb(null, pageData);
    });
}    



function loadPage(url)
{
  req(url, (err, body) => {
        if (err) { 
          console.log("Error loading FF website");
        }
  
      scraper = cheerio.load(body);
  });
}

function scrapeNode3(data, code, cb) {
    
        var pageData = {};
    
        // 1. Extract the data
        Object.keys(data).forEach(k => {
            var query = data[k].split(':')[0];
            var attributeName = data[k].split(':')[1];
            
            pageData[k] = scraper(query).attr(attributeName);
            
        });

        // Send the data in the callback
        cb(null, pageData);
}
    

function findPlayerPts(code)
{
  for (var i = 0; i < playersWeek1.length; i++)
  {
      if (playersWeek1[i].code == code)
      {
        return playersWeek1[i].pts;
      }
  }
   return 0;
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
var playersWeek1 = [
  {code:'1001', pts:2}, {code:'1002', pts:0}, {code:'1003', pts:-1}, {code:'1004', pts:2}, {code:'1005', pts:2}, {code:'1006', pts:5}, {code:'1007', pts:1}, {code:'1009', pts:0}, {code:'1010', pts:0}, {code:'1011', pts:2}, {code:'1012', pts:0}, {code:'1013', pts:1}, {code:'1014', pts:0}, {code:'1015', pts:1}, {code:'1016', pts:0}, {code:'1017', pts:0}, {code:'1018', pts:2}, {code:'1019', pts:1}, {code:'1020', pts:7}, {code:'1021', pts:7}, {code:'1022', pts:1}, {code:'1023', pts:2}, {code:'1024', pts:2}, {code:'1025', pts:0}, {code:'1026', pts:0}, {code:'1027', pts:0}, {code:'1028', pts:0}, {code:'1029', pts:0}, {code:'1030', pts:0}, {code:'1031', pts:1}, {code:'1032', pts:0}, {code:'1036', pts:0}, {code:'1037', pts:0}, {code:'1038', pts:0}, {code:'1039', pts:0}, {code:'1040', pts:0}, {code:'1042', pts:0}, {code:'1043', pts:0}, {code:'1044', pts:0}, {code:'1045', pts:0}, {code:'1047', pts:0}, {code:'1049', pts:0}, {code:'1050', pts:0}, {code:'1051', pts:0}, {code:'1052', pts:0}, {code:'1054', pts:2}, {code:'1055', pts:0}, {code:'1056', pts:0}, {code:'1057', pts:0}, {code:'1058', pts:2}, {code:'1059', pts:2}, {code:'1060', pts:0}, {code:'1061', pts:0}, {code:'1062', pts:0}, {code:'2001', pts:5}, {code:'2002', pts:0}, {code:'2003', pts:0}, {code:'2004', pts:-1}, {code:'2005', pts:2}, {code:'2006', pts:0}, {code:'2007', pts:2}, {code:'2008', pts:4}, {code:'2009', pts:0}, {code:'2010', pts:-1}, {code:'2011', pts:5}, {code:'2012', pts:2}, {code:'2013', pts:2}, {code:'2014', pts:0}, {code:'2015', pts:2}, {code:'2016', pts:2}, {code:'2017', pts:2}, {code:'2018', pts:2}, {code:'2019', pts:2}, {code:'2020', pts:2}, {code:'2021', pts:3}, {code:'2022', pts:0}, {code:'2023', pts:0}, {code:'2024', pts:1}, {code:'2025', pts:-1}, {code:'2026', pts:0}, {code:'2027', pts:0}, {code:'2028', pts:0}, {code:'2030', pts:-1}, {code:'2031', pts:0}, {code:'2032', pts:1}, {code:'2033', pts:0}, {code:'2034', pts:0}, {code:'2035', pts:0}, {code:'2036', pts:2}, {code:'2037', pts:5}, {code:'2038', pts:0}, {code:'2039', pts:0}, {code:'2040', pts:0}, {code:'2041', pts:1}, {code:'2042', pts:0}, {code:'2043', pts:2}, {code:'2044', pts:0}, {code:'2045', pts:0}, {code:'2046', pts:0}, {code:'2047', pts:0}, {code:'2048', pts:0}, {code:'2049', pts:0}, {code:'2050', pts:0}, {code:'2051', pts:2}, {code:'2052', pts:0}, {code:'2053', pts:0}, {code:'2054', pts:2}, {code:'2055', pts:0}, {code:'2056', pts:2}, {code:'2057', pts:1}, {code:'2058', pts:2}, {code:'2059', pts:7}, {code:'2060', pts:1}, {code:'2062', pts:0}, {code:'2064', pts:1}, {code:'2065', pts:1}, {code:'2066', pts:6}, {code:'2067', pts:2}, {code:'2068', pts:0}, {code:'2069', pts:0}, {code:'2070', pts:6}, {code:'2071', pts:7}, {code:'2072', pts:2}, {code:'2073', pts:0}, {code:'2074', pts:1}, {code:'2075', pts:0}, {code:'2076', pts:0}, {code:'2077', pts:7}, {code:'2078', pts:2}, {code:'2079', pts:0}, {code:'2080', pts:2}, {code:'2081', pts:6}, {code:'2082', pts:1}, {code:'2083', pts:0}, {code:'2084', pts:0}, {code:'2085', pts:2}, {code:'2086', pts:1}, {code:'2087', pts:2}, {code:'2088', pts:2}, {code:'2089', pts:0}, {code:'2090', pts:0}, {code:'2091', pts:4}, {code:'2092', pts:0}, {code:'2093', pts:2}, {code:'2094', pts:0}, {code:'2095', pts:0}, {code:'2096', pts:1}, {code:'2097', pts:0}, {code:'2098', pts:0}, {code:'2099', pts:0}, {code:'2101', pts:2}, {code:'2102', pts:2}, {code:'2103', pts:2}, {code:'2104', pts:5}, {code:'2105', pts:1}, {code:'2106', pts:7}, {code:'2107', pts:0}, {code:'2108', pts:2}, {code:'2109', pts:0}, {code:'2110', pts:0}, {code:'2111', pts:0}, {code:'2112', pts:2}, {code:'2113', pts:2}, {code:'2114', pts:0}, {code:'2115', pts:1}, {code:'2116', pts:0}, {code:'2118', pts:0}, {code:'2119', pts:0}, {code:'2120', pts:0}, {code:'2121', pts:0}, {code:'2122', pts:-2}, {code:'2123', pts:0}, {code:'2124', pts:0}, {code:'2125', pts:1}, {code:'2126', pts:0}, {code:'2127', pts:1}, {code:'2128', pts:3}, {code:'2129', pts:1}, {code:'2130', pts:0}, {code:'2131', pts:5}, {code:'2132', pts:0}, {code:'2133', pts:6}, {code:'2134', pts:0}, {code:'2135', pts:0}, {code:'2137', pts:0}, {code:'2138', pts:0}, {code:'2139', pts:0}, {code:'2140', pts:0}, {code:'2141', pts:0}, {code:'2142', pts:0}, {code:'2143', pts:0}, {code:'2145', pts:0}, {code:'2147', pts:0}, {code:'2150', pts:0}, {code:'2151', pts:0}, {code:'2152', pts:0}, {code:'2153', pts:2}, {code:'2154', pts:0}, {code:'2155', pts:0}, {code:'2156', pts:0}, {code:'2161', pts:0}, {code:'2162', pts:0}, {code:'2164', pts:2}, {code:'2165', pts:0}, {code:'2167', pts:0}, {code:'2168', pts:0}, {code:'2169', pts:0}, {code:'2170', pts:0}, {code:'2172', pts:0}, {code:'2173', pts:0}, {code:'2175', pts:2}, {code:'2177', pts:0}, {code:'2178', pts:0}, {code:'2179', pts:0}, {code:'2180', pts:0}, {code:'2181', pts:0}, {code:'2182', pts:0}, {code:'2183', pts:0}, {code:'2184', pts:0}, {code:'2185', pts:0}, {code:'2186', pts:0}, {code:'2187', pts:0}, {code:'2188', pts:0}, {code:'2189', pts:0}, {code:'2190', pts:0}, {code:'2191', pts:1}, {code:'2192', pts:2}, {code:'2193', pts:0}, {code:'2194', pts:0}, {code:'2195', pts:-1}, {code:'2196', pts:0}, {code:'2197', pts:1}, {code:'2198', pts:7}, {code:'2199', pts:1}, {code:'2203', pts:0}, {code:'2204', pts:0}, {code:'2205', pts:0}, {code:'3001', pts:2}, {code:'3002', pts:0}, {code:'3003', pts:7}, {code:'3004', pts:1}, {code:'3005', pts:2}, {code:'3006', pts:0}, {code:'3007', pts:7}, {code:'3008', pts:2}, {code:'3009', pts:2}, {code:'3010', pts:0}, {code:'3011', pts:15}, {code:'3012', pts:2}, {code:'3013', pts:5}, {code:'3014', pts:7}, {code:'3015', pts:7}, {code:'3016', pts:2}, {code:'3017', pts:5}, {code:'3018', pts:1}, {code:'3019', pts:2}, {code:'3020', pts:2}, {code:'3021', pts:1}, {code:'3022', pts:7}, {code:'3023', pts:9}, {code:'3024', pts:7}, {code:'3025', pts:7}, {code:'3026', pts:2}, {code:'3027', pts:2}, {code:'3028', pts:0}, {code:'3029', pts:0}, {code:'3030', pts:0}, {code:'3031', pts:0}, {code:'3032', pts:2}, {code:'3033', pts:7}, {code:'3034', pts:0}, {code:'3035', pts:2}, {code:'3036', pts:2}, {code:'3037', pts:1}, {code:'3038', pts:7}, {code:'3039', pts:1}, {code:'3040', pts:0}, {code:'3041', pts:0}, {code:'3042', pts:0}, {code:'3043', pts:4}, {code:'3044', pts:0}, {code:'3045', pts:2}, {code:'3046', pts:0}, {code:'3047', pts:1}, {code:'3048', pts:1}, {code:'3049', pts:4}, {code:'3050', pts:2}, {code:'3051', pts:2}, {code:'3052', pts:2}, {code:'3053', pts:0}, {code:'3054', pts:1}, {code:'3055', pts:1}, {code:'3056', pts:1}, {code:'3057', pts:6}, {code:'3058', pts:5}, {code:'3059', pts:1}, {code:'3060', pts:2}, {code:'3061', pts:1}, {code:'3063', pts:0}, {code:'3064', pts:1}, {code:'3065', pts:0}, {code:'3066', pts:2}, {code:'3067', pts:0}, {code:'3069', pts:2}, {code:'3070', pts:1}, {code:'3071', pts:0}, {code:'3072', pts:0}, {code:'3073', pts:0}, {code:'3074', pts:0}, {code:'3075', pts:0}, {code:'3076', pts:2}, {code:'3077', pts:0}, {code:'3078', pts:0}, {code:'3079', pts:0}, {code:'3080', pts:0}, {code:'3081', pts:1}, {code:'3082', pts:2}, {code:'3083', pts:2}, {code:'3084', pts:0}, {code:'3085', pts:2}, {code:'3086', pts:1}, {code:'3087', pts:1}, {code:'3088', pts:0}, {code:'3089', pts:2}, {code:'3090', pts:0}, {code:'3091', pts:2}, {code:'3092', pts:0}, {code:'3093', pts:1}, {code:'3094', pts:2}, {code:'3095', pts:7}, {code:'3096', pts:2}, {code:'3097', pts:0}, {code:'3098', pts:0}, {code:'3099', pts:0}, {code:'3102', pts:1}, {code:'3103', pts:1}, {code:'3104', pts:0}, {code:'3105', pts:2}, {code:'3106', pts:5}, {code:'3107', pts:1}, {code:'3108', pts:2}, {code:'3109', pts:0}, {code:'3110', pts:0}, {code:'3111', pts:2}, {code:'3112', pts:4}, {code:'3113', pts:0}, {code:'3114', pts:4}, {code:'3115', pts:0}, {code:'3116', pts:0}, {code:'3117', pts:0}, {code:'3118', pts:0}, {code:'3120', pts:7}, {code:'3121', pts:7}, {code:'3122', pts:0}, {code:'3124', pts:2}, {code:'3125', pts:0}, {code:'3126', pts:2}, {code:'3127', pts:0}, {code:'3128', pts:2}, {code:'3129', pts:0}, {code:'3130', pts:0}, {code:'3131', pts:2}, {code:'3132', pts:0}, {code:'3133', pts:0}, {code:'3136', pts:2}, {code:'3137', pts:0}, {code:'3138', pts:0}, {code:'3140', pts:2}, {code:'3141', pts:2}, {code:'3142', pts:2}, {code:'3143', pts:1}, {code:'3144', pts:0}, {code:'3145', pts:1}, {code:'3146', pts:1}, {code:'3147', pts:-2}, {code:'3148', pts:0}, {code:'3149', pts:2}, {code:'3150', pts:2}, {code:'3151', pts:0}, {code:'3152', pts:2}, {code:'3153', pts:0}, {code:'3154', pts:2}, {code:'3155', pts:0}, {code:'3156', pts:0}, {code:'3157', pts:0}, {code:'3158', pts:0}, {code:'3159', pts:2}, {code:'3160', pts:0}, {code:'3161', pts:0}, {code:'3162', pts:5}, {code:'3163', pts:0}, {code:'3165', pts:2}, {code:'3166', pts:2}, {code:'3167', pts:2}, {code:'3168', pts:0}, {code:'3169', pts:0}, {code:'3170', pts:2}, {code:'3171', pts:0}, {code:'3172', pts:2}, {code:'3173', pts:0}, {code:'3175', pts:0}, {code:'3176', pts:0}, {code:'3177', pts:1}, {code:'3179', pts:0}, {code:'3181', pts:2}, {code:'3182', pts:0}, {code:'3184', pts:1}, {code:'3185', pts:0}, {code:'3186', pts:0}, {code:'3187', pts:5}, {code:'3189', pts:0}, {code:'3190', pts:0}, {code:'3192', pts:0}, {code:'3194', pts:5}, {code:'3195', pts:2}, {code:'3196', pts:0}, {code:'3197', pts:0}, {code:'3198', pts:0}, {code:'3201', pts:0}, {code:'3203', pts:0}, {code:'3204', pts:0}, {code:'3205', pts:1}, {code:'3206', pts:2}, {code:'3207', pts:0}, {code:'3208', pts:0}, {code:'3210', pts:0}, {code:'3211', pts:0}, {code:'3214', pts:0}, {code:'3215', pts:0}, {code:'3216', pts:0}, {code:'3217', pts:0}, {code:'3221', pts:0}, {code:'3222', pts:0}, {code:'3223', pts:0}, {code:'3226', pts:0}, {code:'3227', pts:0}, {code:'3228', pts:0}, {code:'3229', pts:0}, {code:'3230', pts:0}, {code:'3231', pts:0}, {code:'3232', pts:0}, {code:'3233', pts:0}, {code:'3236', pts:2}, {code:'3237', pts:0}, {code:'3238', pts:1}, {code:'3239', pts:0}, {code:'3240', pts:2}, {code:'3241', pts:2}, {code:'3242', pts:2}, {code:'3243', pts:1}, {code:'3244', pts:1}, {code:'3245', pts:2}, {code:'3246', pts:0}, {code:'3247', pts:1}, {code:'3248', pts:8}, {code:'3249', pts:0}, {code:'3250', pts:4}, {code:'3251', pts:0}, {code:'3252', pts:0}, {code:'3253', pts:0}, {code:'3254', pts:2}, {code:'3257', pts:1}, {code:'3258', pts:0}, {code:'4001', pts:7}, {code:'4002', pts:2}, {code:'4003', pts:1}, {code:'4004', pts:6}, {code:'4005', pts:0}, {code:'4006', pts:0}, {code:'4007', pts:2}, {code:'4008', pts:0}, {code:'4009', pts:0}, {code:'4010', pts:0}, {code:'4011', pts:0}, {code:'4012', pts:7}, {code:'4014', pts:8}, {code:'4015', pts:7}, {code:'4016', pts:1}, {code:'4017', pts:5}, {code:'4018', pts:2}, {code:'4019', pts:1}, {code:'4020', pts:2}, {code:'4021', pts:2}, {code:'4022', pts:2}, {code:'4023', pts:0}, {code:'4024', pts:2}, {code:'4025', pts:0}, {code:'4026', pts:0}, {code:'4027', pts:2}, {code:'4028', pts:0}, {code:'4029', pts:1}, {code:'4030', pts:0}, {code:'4031', pts:0}, {code:'4034', pts:7}, {code:'4035', pts:1}, {code:'4036', pts:5}, {code:'4037', pts:0}, {code:'4038', pts:2}, {code:'4039', pts:0}, {code:'4040', pts:1}, {code:'4041', pts:2}, {code:'4042', pts:5}, {code:'4043', pts:2}, {code:'4044', pts:2}, {code:'4045', pts:1}, {code:'4046', pts:2}, {code:'4047', pts:1}, {code:'4048', pts:2}, {code:'4049', pts:2}, {code:'4050', pts:0}, {code:'4051', pts:1}, {code:'4052', pts:0}, {code:'4053', pts:0}, {code:'4054', pts:0}, {code:'4056', pts:4}, {code:'4057', pts:0}, {code:'4058', pts:0}, {code:'4059', pts:0}, {code:'4060', pts:0}, {code:'4061', pts:0}, {code:'4062', pts:0}, {code:'4063', pts:0}, {code:'4064', pts:1}, {code:'4065', pts:0}, {code:'4066', pts:0}, {code:'4067', pts:0}, {code:'4068', pts:0}, {code:'4069', pts:0}, {code:'4071', pts:0}, {code:'4072', pts:0}, {code:'4073', pts:0}, {code:'4074', pts:7}, {code:'4075', pts:0}, {code:'4078', pts:0}, {code:'4079', pts:0}, {code:'4081', pts:0}, {code:'4082', pts:2}, {code:'4083', pts:0}, {code:'4084', pts:7}, {code:'4085', pts:4}, {code:'4086', pts:2}, {code:'4087', pts:1}, {code:'4088', pts:0}, {code:'4089', pts:0}, {code:'4090', pts:0}, {code:'4091', pts:7}, {code:'4092', pts:5}, {code:'4093', pts:0}, {code:'4094', pts:0}
  ];