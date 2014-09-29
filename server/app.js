'use strict';

var express = require('express');
var app = express();

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://lyft-pricing.local:8888');
    next();
});

app.get('/tips', require('./controllers/tips'));

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});