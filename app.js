var _ = require("underscore"),
  async = require('async'),
  express = require('express'),
  fs = require('fs'),
  path = require('path'),
  port = Number(process.env.PORT || 3000),
  app = express();

var marked = require("marked");

app.set('view engine', 'ejs');

var contentFiles = fs.readdirSync(path.join(__dirname, "content"));
var loadContentFile = function (filename, done) {
  if (!_.contains([".markdown", ".md"], path.extname(filename))) {
    done();
    return;
  }

  fs.readFile(path.join(__dirname, "content", filename), "utf8", function (err, data) {
    if (err) {
      next(err);
      return;
    }

    var dataLines = data.split("\n");
    var title = dataLines[0].substring(1).trim();
    var subtitle = dataLines[1].substring(3).trim();
    var detitledData = dataLines.splice(2).join("\n");
    var markdown = marked(detitledData);
    var basename = path.basename(filename, path.extname(filename));
    var context = {
      markdown: markdown,
      file: basename,
      title: title,
      subtitle: subtitle
    };
    if (basename !== 'index') {
      console.log("loading page /" + basename);
      app.get("/" + basename, function (req, res) {
        res.render("content", context);
      });
    }
    done(null, context);
  });
};
var afterContentFilesLoaded = function (err, results) {
  var processedResults = _.compact(results);
  var indexResults = _.findWhere(processedResults, {file: "index"});
  processedResults = _.without(processedResults, indexResults);
  app.get("/", function (req, res) {
    res.render("index", _.extend(indexResults, {pages: processedResults}));
  });
  app.listen(port, function () {
    console.log("Listening on " + port);
  });
};

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
async.map(contentFiles, loadContentFile, afterContentFilesLoaded);
