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
        _.extend(page, {
          tableOfContents: _.without(sitePages, _.findWhere(sitePages, {file: "index"}))
        });
      }

      app.get("/" + page.path, function (req, res) {
        res.render("content", page);
      });
    });

    app.listen(port, function () {
      console.log("Listening on " + port);
    });
  };

  app.set("view engine", "ejs");

  app.get("/javascripts/skrollr.min.js", function (req, res) {
    res.sendfile(path.join(__dirname, "node_modules/skrollr/dist/skrollr.min.js"));
  });
  app.get("/stylesheets/bootstrap.min.css", function (req, res) {
    res.sendfile(path.join(__dirname, "node_modules/bootstrap/dist/css/bootstrap.min.css"));
  });
  app.use(require("stylus").middleware(path.join(__dirname, "public")));
  app.use(express.static(path.join(__dirname, "public")));

  require("./lib/load").loadContentFiles(setRoutes);
}());
