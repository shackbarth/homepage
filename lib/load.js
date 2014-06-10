(function () {

  var _ = require("underscore"),
    async = require('async'),
    fs = require('fs'),
    marked = require("marked"),
    path = require('path');

  var contentFiles = fs.readdirSync(path.join(__dirname, "../content"));
  var imageFiles = fs.readdirSync(path.join(__dirname, "../public/images"));
  var loadContentFile = function (filename, done) {
    if (!_.contains([".markdown", ".md"], path.extname(filename))) {
      done();
      return;
    }

    fs.readFile(path.join(__dirname, "../content", filename), "utf8", function (err, data) {
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
      var imageName = _.find(imageFiles, function (imageFile) {
        return path.basename(imageFile, path.extname(imageFile)) === basename;
      });
      var imagePath = imageName ?
        "../images/" + imageName :
        "http://placekitten.com/g/1024/768";

      console.log("image is", imagePath);
      done(null, {
        markdown: markdown,
        file: basename,
        image: imagePath,
        title: title,
        subtitle: subtitle
      });
    });
  };

  var loadContentFiles = function (callback) {
    async.map(contentFiles, loadContentFile, callback);
  };

  exports.loadContentFiles = loadContentFiles;

}());
