
var csv_path = "city_coordinates.csv";
var mp = new Map();

var handleCsv = async function () {
    var dropdown = $('#selectStyle');
    fetch(csv_path)
        .then((res) => res.text())
        .then((text) => {
            line = text.split("\n");
            for (i = 0; i < line.length; i++) {
                row = line[i].split(",");
                var record = (row[2] + ", " + row[3]);
                var obj = {
                    lat: row[0],
                    long: row[1]
                }
                mp.set(record, obj);
                var entry = $('<option>').html(record);
                dropdown.append(entry);
            }
        })
        .catch((e) => console.log(e));
}

handleCsv();

var displayData = function () {

    selectElement = document.querySelector('#selectStyle');
    output = selectElement.options[selectElement.selectedIndex].value;
    const coordinates = mp.get(output);

    const ul = document.getElementById('tabledisplay');
    ul.innerHTML = '';
    console.log(coordinates.lat+"  "+coordinates.long);

    fetch('http://www.7timer.info/bin/api.pl?lon='+coordinates.lat+'&lat='+coordinates.long +'&product=civillight&output=json')
        .then(res => {
            return res.json();
        }).then(data => {
            const mapWeather = new Map();
            mapWeather.set('clear', 'Clear');
            mapWeather.set('cloudy', 'Very Cloudy');
            mapWeather.set('fog', 'Foggy');
            mapWeather.set('humid', 'Humid'); 
            mapWeather.set('ishower', 'Isolated showers');
            mapWeather.set('lightrain', 'Light Rain');
            mapWeather.set('lightsnow', 'Light Snow');
            mapWeather.set('mcloudy', 'Cloudy');
            mapWeather.set('oshower', 'Occasional showers');
            mapWeather.set('pcloudy', 'Partly cloudy');
            mapWeather.set('rain', 'Rain');
            mapWeather.set('rainsnow', 'Rain-Snow Mixed');
            mapWeather.set('snow', 'Snow');
            mapWeather.set('ts', 'Thunderstorm Possible');
            mapWeather.set('tsrain', 'Thunderstorm')
            mapWeather.set('tstorm', 'Thunderstorm Possible');
            mapWeather.set('windy', 'Windy');
            data.dataseries.forEach(element => {
                var strDate = String(element.date);
                var date = new Date(strDate.substring(0,4),strDate.substring(4,6), strDate.substring(6)).toDateString();
                var img = "images/" + element.weather + ".png";
                const markup = `<div class="box"> <p>${date}</p>
                            <img src=${img} alt=${element.weather}></img> 
                            <p> ${mapWeather.get(element.weather)} </p>
                            </div>`;
                document.querySelector('ul').insertAdjacentHTML('afterbegin', markup);
            });
        }).catch(error => console.log(error));
}