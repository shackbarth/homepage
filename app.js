var _ = require("underscore"),
  async = require('async'),
  express = require('express'),
  fs = require('fs'),
  path = require('path'),
  port = Number(process.env.PORT || 3000),
  app = express();

var marked = require("marked");

app.set('view engine', 'ejs');
app.get('/', function (req, res){
  res.redirect("./the-gettysburg-sequence.md");
});
app.use(require('express-markdown')({
  directory: __dirname + '/content',
  view: 'content',
  variable: 'markdown'
}));

var contentFiles = fs.readdirSync(path.join(__dirname, "content"));
var loadContentFile = function (filename, next) {
  if (!_.contains([".markdown", ".md"], path.extname(filename))) {
    next();
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
    console.log("title is", title);


    var basename = path.basename(filename, path.extname(filename));
    var context = {
      markdown: markdown,
      file: basename,
      title: title,
      subtitle: subtitle
    };
    console.log("loading /" + basename);
    app.get("/" + basename, function (req, res) {
      res.render("content", context);
    });

    next();

  });

};
var afterContentFilesLoaded = function (err, results) {
  console.log(arguments);
  app.listen(port, function () {
    console.log("Listening on " + port);
  });
};
console.log(contentFiles);


app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
async.each(contentFiles, loadContentFile, afterContentFilesLoaded);
