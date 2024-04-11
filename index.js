var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var mediaserver = require('mediaserver');


app.use(express.static('public'));
app.use('/jquery', express.static(path.join(__dirname,'node_modules','jquery','dist')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'/index.html'))
})

app.get('/canciones', function(req, res){
    fs.readFile(path.join(__dirname, 'canciones.json'), 'utf8', function(error, canciones){
        if(error) throw error;
        res.json(JSON.parse(canciones));
    })
}) 


app.get('/canciones/:nombre',function(req,res) {
    var cancion = path.join(__dirname,'canciones',req.params.nombre);
    console.log(req.params.nombre);
    mediaserver.pipe(req,res,cancion);
})

app.listen(3000, function(){
    console.log('Aplicacion on');
})



