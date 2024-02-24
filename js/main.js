
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
            data.dataseries.forEach(element => {
                var strDate = String(element.date);
                var date = new Date(strDate.substring(0,4),strDate.substring(4,6), strDate.substring(6));
                var img = "images/" + element.weather + ".png";
                console.log(img+"   element.date "+element.date+"   date "+date)
                const markup = `<image src=${img} alt=${element.weather}></image> <li>${date}</li> <br></br>`;
                document.querySelector('ul').insertAdjacentHTML('afterbegin', markup);
            });
        }).catch(error => console.log(error));
}