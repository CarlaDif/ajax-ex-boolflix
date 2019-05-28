$(document).ready(function(){
  //evento al click sul pulsante "cerca"
  $('#cerca').click(function(){
    //leggo il valore del placeholder
    var titolo_film = $('#testo_ricerca').val();
    //effettuo la chiamata ajax e stampo il risultato della ricerca
    chiamataAjaxFilm (titolo_film);
    //resetto il valore dell'input
    $('#testo_ricerca').val('');
  });
  //evento al tasto invio, quando il cursore si trova dentro l'input
  $('#testo_ricerca').keyup(function(event){
    if (event.which == 13) {
      //leggo il valore del placeholder
      var titolo_film = $(this).val();
      //effettuo la chiamata ajax e stampo il risultato della ricerca
      chiamataAjaxFilm (titolo_film);
      //resetto il valore dell'input
      $(this).val('');
    }
  });

  function chiamataAjaxFilm (query) {
    //richiamo la funzione ajax
    $.ajax ({
      'url': 'https://api.themoviedb.org/3/search/movie',
      'method': 'GET',
      'data': {
        'api_key': 'a3de8b7adbae4fffc969329bd553724a',
        'query': query,
        'language': 'it'
      },
      'success': function (data, stato, error){
        //visualizzo l'array "elenco_film", contenente gli oggetti "film"
        var elenco_film = data.results;
        //resetto l'html prima di stampare i risultati del film cercato
        $('.schede-film').html('');
        stampaFilm(elenco_film);
      },
      'error': function (){
        Swal.fire ({
          'type': 'error',
          'title': 'Oops...',
          'text': 'La ricerca non ha prodotto alcun risultato'
        });
      }
    });
  }
  function stampaFilm (elenco_film) {
    var source = $("#card-template").html();
    var template_film = Handlebars.compile(source);
    //ciclo all'interno dell'array composto dagli oggetti/film
    for (var i = 0; i < elenco_film.length; i++) {
      var film = elenco_film[i];
      console.log(film);
      var lingua_originale = film.original_language;
      //cambio alcune stringhe, in modo che corrispondano al codice-lingua di country flag
      if (lingua_originale == 'en') {
        lingua_originale = 'gb';
      } else if (lingua_originale == 'ja') {
        lingua_originale = 'jp';
      } else if (lingua_originale == 'zh') {
        lingua_originale = 'cn';
      } else if (lingua_originale == 'ko') {
        lingua_originale = 'kr';
      }

      var film_context = {
        'titolo': film.title,
        'titolo_originale': film.original_title,
        'data_lingua': lingua_originale,
        'voto': film.vote_average,
        'stelle': votoInStelle(film.vote_average),
        'poster': film.poster_path
      }
      var html = template_film(film_context);
      $('.schede-film').append(html);
    }
  }
  function votoInStelle (number) {
    //divido il voto per 2 e spitto il risultato,in modo da avere la cifra intera separata da quella decimale
    var half_number = ((number/2).toFixed(1)).split('.');
    //variabile star --- numerica
    var star = 0;
    //variabile sotto forma di stringa per inserire il codice delle stelle piene
    var stelle_disegnate = '';
    //variabile empty_star --- numerica
    var empty_star = 0;
    //variabile sotto forma di stringa per inserire il codice delle stelle vuote
    var stelle_vuote = '';
    //se la cifra decimale è maggiore o uguale a 5
    if (half_number[1] >= 5) {
      //arrotondo la cifra intera per eccesso
      star = (parseInt(half_number[0])) +1;
      //calcolo la differenza tra il totale di stelle e le stelle piene
      empty_star = (5 - star);
    } else {
      //altrimenti arrotondo la cifra intera per difetto
      star = parseInt(half_number[0]);
      //calcolo la differenza tra il totale di stelle e le stelle piene
      empty_star = (5 - star);
    }

    //per ogni stella piena disegno una stella piena
    for (var s = 0; s < star; s++) {
      stelle_disegnate += '<i class="fas fa-star"></i>';
    }

    // per ogni stella vuota, disegno una stella vuota
    for (var e = 0; e < empty_star; e++) {
      stelle_vuote += '<i class="far fa-star"></i>';
    }
    //ritorno una stringa che comprende sia le stelle piene, che quelle vuote, per un totale di cinque stelle
    return stelle_disegnate + stelle_vuote
  }
});
