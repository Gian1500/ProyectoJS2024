
$(function() {
    function cargarCanciones(){
        $.ajax({
            url:'/canciones'
        }).done(function(canciones) {
            var lista = $('.lista-canciones');
            lista.empty();
            canciones.forEach(function(cancion) {
                var nuevoElemento = $('<li class="cancion">'+ cancion.nombre+'</li>');
                nuevoElemento.appendTo(lista);
            })
        }).fail(function() {
            alert('no pude cargar las canciones :c');
        })
    }

    cargarCanciones();
});

