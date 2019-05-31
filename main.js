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

  //evento over card-film
  $('.schede-film').on('mouseenter', '.card-film', function(){
    $(this).find('.background-card').hide();
    $(this).find('.info').show();
  }).on('mouseleave', '.card-film', function(){
    $('.card-film').find('.background-card').show();
    $('.card-film').find('.info').hide();
  });

  function chiamataAjax (query) {
    $('.schede-film').html('');
    //richiamo la funzione ajax
    $.ajax ({
      url: 'https://api.themoviedb.org/3/search/multi',
      method: 'GET',
      data: {
        api_key: 'a3de8b7adbae4fffc969329bd553724a',
        query: query,
        language: 'it'
      },
      success: function (data, stato, error){
        //visualizzo l'array "elenco_film", contenente gli oggetti "film"
        stampaFilm(data.results);
      },
      error: function (){
        Swal.fire ({
          type: 'error',
          title: 'Oops...',
          text: 'La ricerca non ha prodotto alcun risultato'
        });
      }
    });
  }
  function stampaFilm (elenco) {
    var source = $("#card-template").html();
    var template_film = Handlebars.compile(source);

    //ciclo all'interno dell'array composto dagli oggetti/film
    for (var i = 0; i < elenco.length; i++) {
      var film = elenco[i];

      var titolo, titolo_originale, lingua_originale, voto;
      var tipo = film.media_type;
      var poster1 = film.poster_path;
      var poster2 = film.backdrop_path;
      var trama = film.overview;
      var id_film = film.id;
      var id_genere_film = film.genre_ids;
      var genere_film = stampa_genere_film(id_film, tipo);

      if (tipo == 'tv') {
        id_film = film.id,
        titolo = film.name;
        titolo_originale = film.original_name;
        lingua_originale = film.original_language;
        voto = film.vote_average;
        testo_tipo = 'Serie TV';
      } else if (tipo == 'movie') {
        id_film = film.id,
        titolo = film.title;
        titolo_originale = film.original_title;
        lingua_originale = film.original_language;
        voto = film.vote_average;
        testo_tipo = 'Movie';
      }

      var film_context = {
        id: id_film,
        titolo: titolo,
        titolo_originale: titolo_originale,
        lingua: flagIcon(lingua_originale),
        stelle: votoInStelle(voto),
        testo_tipo: testo_tipo,
        poster: poster(poster1, poster2),
        trama: trama,
        id_film: id_film
      }

      var html = template_film(film_context);
      $('.schede-film').append(html);

      //richiamo la funzione stampa genere
      stampa_genere_film (id_film, tipo)
    }

    $('.tipo').each(function(){
      var text_tipo = $(this).find('span').text();
      if (text_tipo == 'person') {
        $(this).closest('.card-film').hide();
      }
    });
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
        lingua = '<img src="https://www.countryflags.io/gb/flat/24.png">';
        break;
      case 'es':
        lingua = '<img src="https://www.countryflags.io/es/flat/24.png">';
        break;
      case 'it':
        lingua = '<img src="https://www.countryflags.io/it/flat/24.png">';
        break;
      case 'fr':
        lingua = '<img src="https://www.countryflags.io/fr/flat/24.png">';
        break;
      case 'ja':
        lingua = '<img src="https://www.countryflags.io/jp/flat/24.png">';
        break;
      case 'zh':
        lingua = '<img src="https://www.countryflags.io/cn/flat/24.png">';
        break;
      case 'ko':
        lingua = '<img src="https://www.countryflags.io/kr/flat/24.png">';
        break;
      default:
        lingua = '<span>' + lingua + '</span>'
    }
    return lingua
  }
  function poster (poster1, poster2) {

    var url_base = '<img src="https://image.tmdb.org/t/p/';

    var dimensioni_poster1 = 'w342';
    var dimensioni_poster2 = 'w300';

    var locandina =  url_base + dimensioni_poster1 + poster1 + '">';
    var locandina_alternativa = url_base + dimensioni_poster2 + poster2 + '">';
    var immagine_non_disponibile = '<img src="http://www.cinebowl.co.uk/images/films/image_medium/noimage-medium.jpg">';

    if (poster1 == null || poster1 == 'undefined') {
      locandina = immagine_non_disponibile;
    }
    return locandina
  }
  function stampa_genere_film (id_film, tipo) {
    var _url = 'movie';

      if (tipo == 'tv') {
        _url = 'tv';
      }

    $.ajax ({
      url: 'https://api.themoviedb.org/3/' + _url + '/' + id_film,
      method: 'GET',
      data: {
        api_key: 'a3de8b7adbae4fffc969329bd553724a',
        language: 'it'
      },
      success: function (data, stato, error) {
        //richiamo l'array che mi restituisce tutti gli oggetti "genere" contenuti all'intenro di un film o di una serie tv
        var array_generi = data.genres;
        var stringa_generi = '';

        //ciclo all'interno dell'array generi
        for (var i = 0; i < array_generi.length; i++) {
          var nomi = [];
          //definisco ogni singolo oggetto

          var oggetto_genere = array_generi[i];

          var posizione_elemento_array = array_generi.indexOf(oggetto_genere);

          if (posizione_elemento_array === (array_generi.length -1)) {
            stringa_generi += oggetto_genere.name;
          } else {
            stringa_generi += oggetto_genere.name + ', ';
          }

        }

      //recupero il div genere con l'id film data-genere == id_film

      $('.genere[data-genere="'+ id_film +'"]').children('span').text(stringa_generi);

      },
      error: function (){
        console.log('error');
      }
    });

  }

});
