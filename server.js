
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/dinosaurs');

var DinoSchema = new mongoose.Schema({
    name:String,
    height:Number,
    weight:Number
});

var Dino = mongoose.model('Dino',DinoSchema);







//=====routes

app.get('/', function(req, res) {
    Dino.find({}, function(err, dino) {
     if(err) {
      console.log('something went wrong');
    } else {
       res.render('index',{data:dino})
    }
})  
});

app.get('/new',function(req,res){
    res.render('new')
})

// add new dino

app.post('/new',function(req,res){
    //console.log(req.body);
    var dinoInstance = new Dino({name: req.body.name, height:req.body.height , weight:req.body.weight});
    dinoInstance.save(function(err) {
    if(err) {
      console.log('something went wrong');
    } else {
      console.log('successfully added a Dino!');
      res.redirect('/');
    }
  })
})

//show dino

app.get('/show/:id',function(req,res){
  //console.log(req.params.id)
   Dino.find({ _id: req.params.id }, function(err, response) {
    if (err) { console.log(err); }
    //console.log(response)
    res.render('show', { data: response[0] });
  });
})

app.get('/edit/:id',function(req,res){
   Dino.find({ _id: req.params.id }, function(err, response) {
    if (err) { console.log(err); }
    //console.log(response)
    res.render('edit', { data: response[0] });
  })
})

//update
app.post('/edit/:id',function(req,res){
    //console.log(req.body);
     Dino.update({ _id: req.params.id }, req.body, function(err, result){
    if (err) { console.log(err); }
    res.redirect('/');
  })
});

//delete
app.post('/destroy/:id',function(req,res){
    //console.log(req.params.id)
    Dino.remove({ _id: req.params.id }, function(err, result){
    if (err) { console.log(err); }
    res.redirect('/');
  });
});






app.listen(8000, function() {
    console.log("listening on port 8000");
})
