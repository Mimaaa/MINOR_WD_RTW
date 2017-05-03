var express = require('express');
var exphbs = require('express-handlebars');
var dotenv = require('dotenv').config();
var request = require('request');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var util = require('util');
var socketio = require('socket.io');
var socket = require('socket.io-client')('http://localhost');

var app = express()
    .use(express.static(path.join(__dirname, 'public'), {
      index: false,
      maxage: 604800000
    }))
    .use(require('body-parser').urlencoded({extended: true}))
    .engine('handlebars', exphbs({defaultLayout: 'main'}))
    .set('view engine', 'handlebars')
    .get('/', home);

var server = http.createServer(app);
var io = socketio(server);
var api_key = process.env.API_KEY;
var port = process.env.PORT || 3000;

var graphqlhubSchemas = require('graphqlhub-schemas');
var Reddit = graphqlhubSchemas.Reddit;
var _graphql = require('graphql');

var GraphQLSchema = _graphql.GraphQLSchema;
var graphql = _graphql.graphql;

var schema = new GraphQLSchema({
  query: Reddit.QueryObjectType
});

function home (req, res) {
  var query = '{ subreddit(name: "worldnews") { newListings(limit: 10) {title url}}}';
  graphql(schema, query).then(function(result) {
    // console.log(util.inspect(result, false, null))
    res.render('home', {data: result});
  });
}

server.listen(port);
