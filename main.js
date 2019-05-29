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
    $('.schede-film').html('');
    //richiamo la funzione ajax
    $.ajax ({
      'url': 'https://api.themoviedb.org/3/search/tv',
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
  // function chiamataAjaxFilm (query) {
  //
  // }
  function stampaFilm (elenco_film) {
    var source = $("#card-template").html();
    var template_film = Handlebars.compile(source);

    var sourceSerie = $("#serie-template").html();
    var template_serie = Handlebars.compile(sourceSerie);
    //ciclo all'interno dell'array composto dagli oggetti/film
    for (var i = 0; i < elenco_film.length; i++) {
      var film = elenco_film[i];
      var lingua_originale = film.original_language;

      var film_context = {
        'titolo': film.title,
        'titolo_originale': film.original_title,
        'data_lingua': flagIcon(lingua_originale),
        'voto': film.vote_average,
        'stelle': votoInStelle(film.vote_average),
        'poster': film.poster_path,
      }
      var serie_context = {
        'titolo': film.name,
        'titolo_originale': film.original_title,
        'data_lingua': flagIcon(lingua_originale),
        'voto': film.vote_average,
        'stelle': votoInStelle(film.vote_average),
        'poster': film.poster_path,
      }

      var html = template_film(film_context);
      var html = template_film(serie_context);
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
  function flagIcon (lingua) {
    switch (lingua) {
      case 'en':
        lingua_originale = '<img src="https://www.countryflags.io/gb/flat/24.png">';
        break;
      case 'es':
        lingua_originale = '<img src="https://www.countryflags.io/es/flat/24.png">';
        break;
      case 'it':
        lingua_originale = '<img src="https://www.countryflags.io/it/flat/24.png">';
        break;
      case 'fr':
        lingua_originale = '<img src="https://www.countryflags.io/fr/flat/24.png">';
        break;
      case 'ja':
        lingua_originale = '<img src="https://www.countryflags.io/jp/flat/24.png">';
        break;
      case 'zh':
        lingua_originale = '<img src="https://www.countryflags.io/cn/flat/24.png">';
        break;
      case 'ko':
        lingua_originale = '<img src="https://www.countryflags.io/kr/flat/24.png">';
        break;
      default:
        lingua_originale = '<span>' + lingua_originale + '</span>'
    }
    return lingua_originale
  }
});
