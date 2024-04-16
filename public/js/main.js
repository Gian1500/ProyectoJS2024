$(function() {
   
    var audio = $('audio')[0];

    $(function() {
        $('#archivo').on('change', function() {
            var nombreArchivo = $(this).val().split('\\').pop();
            $('#nombre-cancion-seleccionada').text(nombreArchivo);
        });
    
        $('.subir-musica').on('submit', function(event) {
            event.preventDefault(); 
            var formData = new FormData(this); 
            $.ajax({
                url: '/canciones',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false, 
                success: function(response) {
                    Swal.fire({
                        title: 'Cargado con éxito',
                        icon: 'success'
                    }).then(function() {
                        window.location.reload();
                    });
                },
                error: function(xhr, status, error) {
                    Swal.fire({
                        title: 'Error al subir la canción',
                        text: 'Ha ocurrido un error al subir la canción. Por favor, inténtalo de nuevo.',
                        icon: 'error'
                    });
                }
            });
        });
    });
    

    $('#borrar-musica').on('click', function() {
        var nombreArchivo = $('.audio').attr('src');
        var nombreCancion = $('.audio').attr('title'); 

        eliminarCancion(nombreArchivo, nombreCancion);
    });
    
    function cargarCanciones(){
        $.ajax({
            url:'/canciones'
        }).done(function(canciones) {
            var lista = $('.lista-canciones');
            lista.empty();
            canciones.forEach(function(cancion) {
                var nuevoElemento = $('<li class="cancion">'+ cancion.nombre+'</li>');
                nuevoElemento.on('click', cancion, play);
                nuevoElemento.appendTo(lista);
            });
        }).fail(function() {
            // Mostrar un mensaje de error con SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No pude cargar las canciones :c'
            });
        });
    }
    
    
    function eliminarCancion(nombreArchivo, nombreCancion) {
        var audio = $('audio')[0];
    
        if (audio.src.endsWith(nombreArchivo)) {
            audio.pause();
            audio.src = ''; 
        }
    
        $.ajax({
            url: nombreArchivo,
            type: 'DELETE'
        }).done(function() {
            $('li:contains("' + nombreCancion + '")').remove();
            
            Swal.fire({
                icon: 'success',
                title: 'Canción eliminada',
                text: 'La canción se ha eliminado correctamente',
                showConfirmButton: false,
                timer: 1500 
            }).then(function() {

                location.reload();
            });
        }).fail(function() {

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la canción :c'
            });
        });
    }
    
    
    // Inicia el Reproductor de música 
    function play(evento) {
        audio.pause();
        audio.src = '/canciones/' + evento.data.nombre;
        audio.play();

        initEqulizador();
    }

    // Función para inicializar el ecualizador
    function initEqulizador(){

        var canvas = document.getElementById('analyzer_render');
        var ctx = canvas.getContext('2d');

        var context = new (window.AudioContext || window.webkitAudioContext)();
        var analyser = context.createAnalyser();

        if (!audio.sourceNode) {
            var source = context.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(context.destination);
            audio.sourceNode = source;
        } else {
            audio.sourceNode.connect(analyser);
        }

        // Función que sirve para dibujar el ecualizador
        function frameLooper(){
            window.requestAnimationFrame(frameLooper);

            var fbc_array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(fbc_array);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#83F442";
            var bars = 100;

            for(var i = 0; i < bars; i++){
                var bar_x = i * 3;
                var bar_width = 2;
                var bar_height = -(fbc_array[i] / 2);
                ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
            }
        }

        frameLooper();
    }


 
    cargarCanciones();

});
