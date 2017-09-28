$(function(){

  var selectedWeek;
  getTodayWeek();
  getBerufe();

  $('#beruf').on('change', getKlassen);
  $('#klasse').on('change', getTable);
  $('#plus').on('click', plusWeek);
  $('#minus').on('click', minusWeek);


  function plusWeek(){
    var selectedWeek = $('#weekButton').html();
    var weeks = selectedWeek.split('-')[0];
    if(weeks == '52'){
      var year = parseInt(selectedWeek.split('-')[1]) + 1;
      selectedWeek = '1-' + year;
    }else{
      weeks = parseInt(weeks) + 1;
      selectedWeek = weeks + '-' + selectedWeek.split('-')[1];
    }
    $('#weekButton').html(selectedWeek);
    getTable();
  }

  function minusWeek(){
    var selectedWeek = $('#weekButton').html();
    var weeks = selectedWeek.split('-')[0];
    if(weeks == '1'){
      var year = parseInt(selectedWeek.split('-')[1]) - 1;
      selectedWeek = '52-' + year;
    }else{
      weeks = parseInt(weeks) - 1;
      selectedWeek = weeks + '-' + selectedWeek.split('-')[1];
    }
    $('#weekButton').html(selectedWeek);
    getTable();
  }

  function getTodayWeek(){
    var today = new Date();

    var thisYear = today.getFullYear();
    var time1970 = today.getTime();

    var milisecInYear = today.getTime() - ( ( today.getFullYear() - 1970 ) * 31536000000 );//31536000000 is one Year
    milisecInYear = milisecInYear - (( today.getDay() + 1 ) * 86400000) //86400000 is one Day
    var week = milisecInYear / 604800000;//604800000 is one Week
    week = Math.round(week)-1;
    week = week + '-' + today.getFullYear();
    $('#weekButton').html(week);
  }

  function getTable(){
    var selectedKlasse = $('#klasse').val();
    var thisWeek = $('#weekButton').html();
    $.getJSON('http://home.gibm.ch/interfaces/133/tafel.php?klasse_id=' + selectedKlasse + '&woche=' + thisWeek, function(result){
          $('#divTable').show();
          $('#table').find("tr:gt(0)").remove();
          console.log(result);
          $.each(result, function(i, field){
            console.log(field);
            var tr = '<tr><td>' + field.tafel_datum + '</td><td>' + field.tafel_wochentag + '</td><td>' + field.tafel_von + '</td><td>' + field.tafel_bis
             + '</td><td>' + field.tafel_lehrer + '</td><td>' + field.tafel_fach + '</td><td>' + field.tafel_raum + '</td></tr>';
            $('#table').append(tr);
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
