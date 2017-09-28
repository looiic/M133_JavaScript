$(function(){

  getBerufe();

  $('#beruf').on('change', getKlassen);
  $('#klasse').on('change', getTable);


  function getTable(){
    var selectedKlasse = $('#klasse').val();
    $.getJSON('http://home.gibm.ch/interfaces/133/tafel.php?klasse_id=' + selectedKlasse, function(result){
          $('#divTable').show();
          $('#table').find("tr:gt(0)").remove();
          $.each(result, function(i, field){
            //hier weiterschaffen
            var tr = '<tr><td>' + field.tafel_datum + '</td><td>' + field.tafel_wochentag + '</tr>'
            $('#table').append();
          });
    }).fail(function(jqXHR, textStatus, errorThrown) {
      alert('Fehler');
    });
  }



  function getKlassen(){
    var selectedBeruf = $('#beruf').val();
    $.getJSON('http://home.gibm.ch/interfaces/133/klassen.php?beruf_id=' + selectedBeruf, function(result){
          $('#divKlasse').show();
          $('#klasse').find("option:gt(0)").remove();
          $.each(result, function(i, field){
            $('#klasse').append($('<option/>', {
                value: field.klasse_id,
                text : field.klasse_longname
            }));
          });
    }).fail(function(jqXHR, textStatus, errorThrown) {
      alert('Fehler');
    });

  }

  function getBerufe(){

    $.getJSON('http://home.gibm.ch/interfaces/133/berufe.php', function(result){
          $.each(result, function(i, field){
            $('#beruf').append($('<option/>', {
                value: field.beruf_id,
                text : field.beruf_name
            }));
          });
    }).fail(function(jqXHR, textStatus, errorThrown) {
      $('#content').before('<p style=\"color:red\" id=\"alert\">AJAX Fehler: ' + textStatus + '</p>');
    });

  }

});
