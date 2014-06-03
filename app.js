var express = require('express');
var path = require('path');
var app = express();

app.set('view engine', 'ejs');
app.get('/', function (req, res){
  res.redirect("./the-gettysburg-sequence.md");
  //res.render('content', {markdown: "hithere"});
  //res.send('Hello World');
});
app.use(require('express-markdown')({
  directory: __dirname + '/content',
  view: 'content',
  variable: 'markdown'
}));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var port = Number(process.env.PORT || 3000);
app.listen(port, function () {
  console.log("Listening on " + port);
});
