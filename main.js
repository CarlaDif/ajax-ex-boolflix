$(document).ready(function(){
  $('button').click(function(){
    //leggo il valore del placeholder
    var titolo_film = $('input').val();
    //richiamo la funzione ajax
    $.ajax ({
      'url': 'https://api.themoviedb.org/3/search/movie',
      'method': 'GET',
      'data': {
        'api_key': 'a3de8b7adbae4fffc969329bd553724a',
        'query': titolo_film,
        'language': 'it'
      },
      'success': function (data, status){
        //visualizzo l'array "elenco_film", contenente gli oggetti "film"
        var elenco_film = data.results;
        //ciclo all'interno dell'array composto dagli oggetti/film
        for (var i = 0; i < elenco_film.length; i++) {
          var film = elenco_film[i];
          var titolo = film.title;
          var titolo_originale = film.original_title;
          var lingua = film.original_language;
          var voto = film.vote_average;
          console.log('Titolo: ' + titolo + ' Titolo originale: ' + titolo_originale + ' Lingua: ' + lingua +  ' Voto: ' + voto );
        }
      },
      'error': function (){
        console.log('qualcosa non va');
      }
    });
  });

});
