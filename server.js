var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var RoutingContext = Router.RoutingContext;
var routes = require('./client/app/routes');
//image server, serves static files
var express = require('express');
var app = express();
var morgan = require('morgan');
var parser = require('body-parser');
var cors = require('cors');
var cookieParser = require('cookie-parser');
// var routes = require('./server/routes.js');
var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/richHomiePrep';
var initServer = function() {
  // attaches all the routes to the server
  // routes.setup(app);
  var port = process.env.PORT || 3001;
  var server = app.listen(port);
  console.log("Express server listening on %d in %s mode", port, app.settings.env)
}

mongoose.connect(dbUrl);
app.use(morgan('tiny'));
app.use(express.static(__dirname + '../client/public'));
app.use(parser.urlencoded({extended: true}));
app.use(parser.json());
//React Router
app.use(function(req, res) {
  Router.match({ routes: routes, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = ReactDOM.renderToString(<RoutingContext {...renderProps} />);
      var page = swig.renderFile('client/views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

initServer();
exports.app = app;

