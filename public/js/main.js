$(function() {
   
    var audio = $('audio')[0];

    
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
            alert('No pude cargar las canciones :c');
        });
    }

    
    function play(evento) {
        audio.pause();
        audio.src = '/canciones/' + evento.data.nombre;
        audio.play();

        // Inicializar el ecualizador después de reproducir la canción
        initEqulizador();
    }

    // Función para inicializar el ecualizador
    function initEqulizador(){

        var canvas = document.getElementById('analyzer_render');
        var ctx = canvas.getContext('2d');

    
        var context = new (window.AudioContext || window.webkitAudioContext)();
        var analyser = context.createAnalyser();

        var source = context.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(context.destination);

        // Función para dibujar el ecualizador
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

        // Iniciar el dibujado del ecualizador
        frameLooper();
    }

 
    cargarCanciones();

});
