$(document).ready(function(){
  //evento al click sul pulsante "cerca"
  $('#cerca').click(function(){
    //leggo il valore del placeholder
    var titolo_film = $('#testo_ricerca').val();
    //effettuo la chiamata ajax e stampo il risultato della ricerca
    chiamataAjax (titolo_film);
    //resetto il valore dell'input
    $('#testo_ricerca').val('');
  });
  //evento al tasto invio, quando il cursore si trova dentro l'input
  $('#testo_ricerca').keyup(function(event){
    if (event.which == 13) {
      //leggo il valore del placeholder
      var titolo_film = $(this).val();
      //effettuo la chiamata ajax e stampo il risultato della ricerca
      chiamataAjax (titolo_film);
      //resetto il valore dell'input
      $(this).val('');
    }
  });

  function chiamataAjax (query) {
    //richiamo la funzione ajax
    $.ajax ({
      'url': 'https://api.themoviedb.org/3/search/movie',
      'method': 'GET',
      'data': {
        'api_key': 'a3de8b7adbae4fffc969329bd553724a',
        'query': query,
        'language': 'it'
      },
      'success': function (data, stato){
        //visualizzo l'array "elenco_film", contenente gli oggetti "film"
        var elenco_film = data.results;
        //resetto l'html prima di stampare i risultati del film cercato
        $('.schede-film').html('');
        stampaFilm(elenco_film)
      },
      'error': function (){
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'La ricerca non ha prodotto alcun risultato'
        })
      }
    });
  }
  function stampaFilm (elenco_film) {
    var source = $("#card-template").html();
    var template_film = Handlebars.compile(source);
    //ciclo all'interno dell'array composto dagli oggetti/film
    for (var i = 0; i < elenco_film.length; i++) {
      var film = elenco_film[i];

      var stelle_film = votoInStelle(film.vote_average);
      var film_context = {
        'titolo': film.title,
        'titolo_originale': film.original_title,
        'lingua': film.original_language,
        'voto': film.vote_average,
        'stelle': stelle_film
      }
      var html = template_film(film_context);
      $('.schede-film').append(html);
      $('.card-film').append(disegnaStelle(stelle_film, 1));
    }
  }
  function votoInStelle (number) {
    var half_number = ((number/2).toFixed(1)).split('.');
    var star;

    if (half_number[1] >= 5) {
      star = (parseInt(half_number[0])) +1;
    } else {
      star = half_number[0];
    }
    return star
  }
  function disegnaStelle (num_stelle, tot_stelle) {
    for (var s = 0; s < tot_stelle; s++) {
      for (var t = 0; t < num_stelle; t++) {
        var stelle_piene = $('<i class="fas fa-star"></i>');
      }
    }
    return stelle_piene
  }
});
