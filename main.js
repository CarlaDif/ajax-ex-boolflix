$(document).ready(function(){
  $('button').click(function(){
    //leggo il valore del placeholder
    var titolo_film = $('input').val();
    console.log(titolo_film);
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
        console.log(data);
        console.log(status);
      },
      'error': function (){
        console.log('qualcosa non va');
      }
    });
  });

});
