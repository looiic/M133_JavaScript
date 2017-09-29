$(function(){
  //Diese Methoden werden beim initialisiern aufgerufen
  getTodayWeek();
  getBerufe();

  //Actionlistener setzen
  $('#beruf').on('change', getKlassen);
  $('#klasse').on('change', getTable);
  $('#plus').on('click', plusWeek);
  $('#minus').on('click', minusWeek);


//Wenn Button für eine Woche nach vorne gedrückt wird. Rechnet plus eine Woche und aktualisiert den Stundenplan
  function plusWeek(){
    //Momentan eingestellte Woche ermitteln
    var selectedWeek = $('#weekButton').html();
    var weeks = selectedWeek.split('-')[0];
    if(weeks == '52'){
      //Ende des Jahres ist erreicht... Jahr plus eins und Woche auf 1 stellen
      var year = parseInt(selectedWeek.split('-')[1]) + 1;
      selectedWeek = '1-' + year;
    }else{
      //Woche + 1
      weeks = parseInt(weeks) + 1;
      selectedWeek = weeks + '-' + selectedWeek.split('-')[1];
    }
    $('#weekButton').html(selectedWeek);
    //Stundenplan Animation und Stundenplan neu laden
    $("#divTable").hide(100);
    getTable();
  }
//Wenn Button für eine Woche zurück gedrückt wird. Rechnet minus eine Woche und aktualisiert den Stundenplan
  function minusWeek(){
    //Momentan eingestellte Woche ermitteln
    var selectedWeek = $('#weekButton').html();
    var weeks = selectedWeek.split('-')[0];
    if(weeks == '1'){
      //Anfang des Jahres ist erreich... Jahr minus eins und Woche auf 52 stellen
      var year = parseInt(selectedWeek.split('-')[1]) - 1;
      selectedWeek = '52-' + year;
    }else{
      //Woche - 1
      weeks = parseInt(weeks) - 1;
      selectedWeek = weeks + '-' + selectedWeek.split('-')[1];
    }
    $('#weekButton').html(selectedWeek);
    //Stundenplan Animation und Stundenplan neu laden
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
  //Holt den Stundenplan nach einer Beruf- und Klassenauswahl und setzt den in die Tabelle ein
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
    var selectedBeruf = $('#beruf').val();
    var selectedKlasse = $('#klasse').val();
    var thisWeek = $('#weekButton').html();
    //Cookies setzten
    setCookie('beruf', selectedBeruf);
    setCookie('klasse', selectedKlasse);
    setCookie('week', thisWeek);
    //Wochenauswahl und Stundenplan anzeigen lassen.. Stundenplan mit Animation
    $('#divDate').show();
    $('#divTable').show(100);
    //Holt den Stundenplan für eine Klasse zu einer bestimmten Woche
    $.getJSON('http://home.gibm.ch/interfaces/133/tafel.php?klasse_id=' + selectedKlasse + '&woche=' + thisWeek, function(result){
          //Alles aus der Table löschen ausser Header
          $('#table').find("tr:gt(0)").remove();
          $.each(result, function(i, field){
            //Table-Rows hinzufügen
            var tr = '<tr><td>' + field.tafel_datum + '</td><td>' + tage[field.tafel_wochentag] + '</td><td>' + field.tafel_von + '</td><td>' + field.tafel_bis
             + '</td><td>' + field.tafel_lehrer + '</td><td>' + field.tafel_fach + '</td><td>' + field.tafel_raum + '</td></tr>';
            $('#table').append(tr);
          });
    }).fail(function(jqXHR, textStatus, errorThrown) {
      alert('Fehler');
    });
  }


  //Holt alle Klassen wenn ein Beruf ausgewählt wurde und setzt diese in die Selectbox
  function getKlassen(){
    var selectedBeruf = $('#beruf').val();
    //Falls schonmal ein Stundenplan ausgewählt wurde wird dieser hier wieder versteckt
    $('#divTable').hide();
    $('#divDate').hide();
    //Selectbox soll als vorauswahl die Option mit value=0 haben --> 'Bitte Klasse auswählen'
    $('#klasse option[value="0"]').prop('selected',true);
    $.getJSON('http://home.gibm.ch/interfaces/133/klassen.php?beruf_id=' + selectedBeruf, function(result){
          $('#divKlasse').show();
          //Alle vorherigen einträge in der Selectbox entfernen ausser Header
          $('#klasse').find("option:gt(0)").remove();
          $.each(result, function(i, field){
            //Klassen in Selectbox appenden
            $('#klasse').append($('<option/>', {
                value: field.klasse_id,
                text : field.klasse_longname
            }));
          });
          var klasse = getCookie('klasse');
          var week = getCookie('week');
          if(klasse != "" && week != ""){
            $('#klasse').val(klasse);
            $('#weekButton').html(week);
            $('#divDate').show();
            $('#divTable').show();
            getTable();
          }
    }).fail(function(jqXHR, textStatus, errorThrown) {
      alert('Fehler');
    });

  }
  //Holt alle Berufe und setzt sie in die Selectbox ein
  function getBerufe(){
      $.getJSON('http://home.gibm.ch/interfaces/133/berufe.php', function(result){
            $.each(result, function(i, field){
              //Berufe in Selectbox appenden
              $('#beruf').append($('<option/>', {
                  value: field.beruf_id,
                  text : field.beruf_name
              }));
            });
            var beruf = getCookie('beruf');
            if (beruf != ""){
              $('#beruf').val(beruf);
              $('#divKlasse').show();
              getKlassen();
            }
      }).fail(function(jqXHR, textStatus, errorThrown) {
        alert('Fehler')
      });
    }

  //Setzt ein Cookie
  function setCookie(name,wert) {
    document.cookie = name + "=" + wert + ";path=/";
  }
  //Gibt den Wert eines Cookies zurück
  function getCookie(name) {
    name = name + "=";
    var cookie = decodeURIComponent(document.cookie);
    cookie = cookie.split(';');
    for(var i = 0; i < cookie.length; i++) {
        var c = cookie[i];
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
  }


});
