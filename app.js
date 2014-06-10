(function () {

  var _ = require("underscore"),
    express = require('express'),
    fs = require('fs'),
    path = require('path'),
    port = Number(process.env.PORT || 3000),
    app = express();

  var setRoutes = function (err, results) {
    var sitePages = _.compact(results);
    _.each(sitePages, function (page) {
      if (page.file === "index") {
        app.get("/", function (req, res) {
          res.render("index", _.extend(page, {
            pages: _.without(sitePages, _.findWhere(sitePages, {file: "index"}))
          }));
        });
      } else {
        console.log("loading page /" + page.file);
        app.get("/" + page.file, function (req, res) {
          res.render("content", page);
        });
      }
    });

    app.listen(port, function () {
      console.log("Listening on " + port);
    });
  };

  app.set('view engine', 'ejs');


  app.use(require('stylus').middleware(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'public')));
  require("./lib/load").loadContentFiles(setRoutes);
}());
