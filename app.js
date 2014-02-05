var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.get('/', function (req, res){
  res.render('content', {markdown: "hithere"});
  //res.send('Hello World');
});
app.use(require('express-markdown')({
  directory: __dirname + '/content',
  view: 'content',
  variable: 'markdown'
}));

app.listen(3000);
