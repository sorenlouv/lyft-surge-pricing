'use strict';

var express = require('express');
var app = express();

// Routes
app.use(express.static('public'));
app.get('/tips', require('./controllers/tips'));

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});