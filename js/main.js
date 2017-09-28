$(function(){

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
    $("#divTable").hide(100);
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
    $("#divTable").hide(100);
    getTable();
  }

  //Gibt die jetztige Woche zurück mit dem Jahr im WW-YYYY Format
  //Hab keine fertige Funktion gefunden, die das macht deshalb errechne ich es selber
  function getTodayWeek(){
    //Datum von Heute holen
    var today = new Date();

    //Die Millisekunden holen, welche im aktuellen Jahr schon vergangen sind
    var milisecInYear = today.getTime() - ( ( today.getFullYear() - 1970 ) * 31536000000 );//31536000000 ist 1 Jahr in Millisekunden
    //Die Millisekunden holen vom Anfang dieser Woche
    milisecInYear = milisecInYear - (( today.getDay() + 1 ) * 86400000) //86400000 ist 1 Tag in Millisekunden
    //Die vergangenen Millisekunden vom Anfang dieser Woche durch Wochen teilen --> gibt Anzahl vergangenen Wochen
    var week = milisecInYear / 604800000;//604800000 ist 1 Woche in Millisekunden
    //Runden und zur korrektur -1 rechnen
    week = Math.round(week)-1;
    week = week + '-' + today.getFullYear();
    //In den Button einsetzen
    $('#weekButton').html(week);
  }

  function getTable(){
    var tage = {
      1: 'Montag',
      2: 'Dienstag',
      3: 'Mittwoch',
      4: 'Donnerstag',
      5: 'Freitag',
      6: 'Samstag',
      7: 'Sonntag'
    };
    var selectedKlasse = $('#klasse').val();
    var thisWeek = $('#weekButton').html();
    $('#divDate').show();
    $('#divTable').show(100);
    $.getJSON('http://home.gibm.ch/interfaces/133/tafel.php?klasse_id=' + selectedKlasse + '&woche=' + thisWeek, function(result){
          $('#table').find("tr:gt(0)").remove();
          $.each(result, function(i, field){
            var tr = '<tr><td>' + field.tafel_datum + '</td><td>' + tage[field.tafel_wochentag] + '</td><td>' + field.tafel_von + '</td><td>' + field.tafel_bis
             + '</td><td>' + field.tafel_lehrer + '</td><td>' + field.tafel_fach + '</td><td>' + field.tafel_raum + '</td></tr>';
            $('#table').append(tr);
          });
    }).fail(function(jqXHR, textStatus, errorThrown) {
      alert('Fehler');
    });
  }



  function getKlassen(){
    var selectedBeruf = $('#beruf').val();
    $('#divTable').hide();
    $('#divDate').hide();
    $('#klasse option[value="0"]').prop('selected',true);
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
