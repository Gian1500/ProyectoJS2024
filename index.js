var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var mediaserver = require('mediaserver');
var multer = require('multer');

var opcionesMulter = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, path.join(__dirname, 'canciones'));
    },
    filename: function(req,file,cb){
        cb(null, file.originalname)
    }

});

var upload = multer({storage: opcionesMulter});


app.use(express.static('public'));
app.use('/jquery', express.static(path.join(__dirname,'node_modules','jquery','dist')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'index.html'));
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

app.post('/canciones', upload.single('cancion'), function(req, res) {
    // Verificar si se ha enviado un archivo
    if (!req.file) {
        // Redirigir al usuario a index.html si no se envió ningún archivo
        return res.redirect('/');
    }

    var archivoCanciones = path.join(__dirname, 'canciones.json');
    var nombre = req.file.originalname;

    fs.readFile(archivoCanciones, 'utf8', function(err, archivo) {
        if (err) throw err;
        var canciones = JSON.parse(archivo);
        
        // Verificar si la canción ya existe en el archivo
        var cancionExistente = canciones.find(function(cancion) {
            return cancion.nombre === nombre;
        });
        
        if (!cancionExistente) {
            // Si la canción no existe, añadirla al archivo
            canciones.push({ nombre: nombre });
            fs.writeFile(archivoCanciones, JSON.stringify(canciones), function(err) {
                if (err) throw err;
                res.sendFile(path.join(__dirname, 'index.html'));
            });
        } else {
            // Si la canción ya existe, responder con un mensaje de error
            return res.redirect('/');
        }
    });
});



app.listen(3000, function(){
    console.log('Aplicacion on');
})



