$(document).ready(function(){
  $('button').click(function(){
    //leggo il valore del placeholder
    var titolo_film = $('input').val();
    //richiamo la funzione stampaFilm
    stampaFilm(titolo_film);
    //resetto il valore dell'input
    $('input').val('');
  });

  function stampaFilm (titolo) {
    //richiamo la funzione ajax
    $.ajax ({
      'url': 'https://api.themoviedb.org/3/search/movie',
      'method': 'GET',
      'data': {
        'api_key': 'a3de8b7adbae4fffc969329bd553724a',
        'query': titolo,
        'language': 'it'
      },
      'success': function (data, status){
        //visualizzo l'array "elenco_film", contenente gli oggetti "film"
        var elenco_film = data.results;
        //resetto l'html prima di stampare i risultati del film cercato
        $('.schede-film').html('');
        if (elenco_film.length == 0) {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'La ricerca non ha prodotto alcun risultato'
          })
        } else {
          //ciclo all'interno dell'array composto dagli oggetti/film
          for (var i = 0; i < elenco_film.length; i++) {
            var film = elenco_film[i];

            var source = $("#card-template").html();
            var template_film = Handlebars.compile(source);

            var film = {
              'titolo': film.title,
              'titolo_originale': film.original_title,
              'lingua': film.original_language,
              'voto': film.vote_average
            }
            var html = template_film(film);
            // console.log('Titolo: ' + titolo + ' Titolo originale: ' + titolo_originale + ' Lingua: ' + lingua +  ' Voto: ' + voto );
            $('.schede-film').append(html);
          }
        }
      },
      'error': function (){
        console.log('Errore!!!');
      }
    });
  }

});
