var mach = 0;
var date = 0;
var addr = 0;
var mapp = 0;
var obj;
var obj2;
var mar;
var markers;
var weak = 1;

function check() {
  if (document.getElementById('password').value == document.getElementById('confirm_password').value) {
    document.getElementById('message').style.color = 'green';
    document.getElementById('message').innerHTML = 'Matching';
    mach = 1;
  } else {
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').innerHTML = 'Not Matching';
    mach = 0;
  }
}

function Visible() {
  var x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
    document.getElementById("sp").value = "Hide Password";
  } else {
    x.type = "password";
    document.getElementById("sp").value = "Show Password";
  }
}
function Visible2() {
  var x = document.getElementById("confirm_password");
  if (x.type === "password") {
    x.type = "text";
    document.getElementById("sp1").value = "Hide Password";
  } else {
    x.type = "password";
    document.getElementById("sp1").value = "Show Password";
  }
}

function validate() {
  var x = document.getElementById("submit");
  if (!document.getElementById("use").checked) {
    document.getElementById('error').style.color = 'red';
    document.getElementById('error').innerHTML = 'not checked';
    //console.log("false1")
    return false;
  }
  if (mach === 0 || date === 0 || addr === 0 || weak === 1) {
    //console.log("false2")
    return false;
  }
}

function PasswordStrength() {
  var txtpass = document.forms["form_log"]["password"].value;
  var half = txtpass.length / 2;
  var eighty = 8 * txtpass.length / 10
  var numberPattern = /\d+/g;
  var matches = txtpass.match(numberPattern);
  var numbers_count = 0;
  var alph_count = 0;
  var max = alph_count;
  var unique_char = 0;

  if (matches != null) {
    for (var i = 0; i < matches.length; i++) {
      for (var j = 0; j < matches[i].length; j++) {
        numbers_count++;
      }
    }
  }
  for (var i = 0; i < txtpass.length; i++) {
    for (var j = i; j < txtpass.length; j++) {
      //if (/[a-z]/.test(txtpass[i]) || /[A-Z]/.test(txtpass[i])) {
      if (txtpass[i] === txtpass[j]) {
        alph_count++;
      }
      //}
    }
    if (alph_count > max) {
      max = alph_count;
    }
    if (alph_count === 1) {
      unique_char++;
    }
    alph_count = 0;
  }

  if ((numbers_count >= half) || (max >= half) || (txtpass.length < 8)) {
    document.getElementById('message1').style.color = 'red';
    document.getElementById('message1').innerHTML = 'weak password';
    weak=1;
  } else if (unique_char >= eighty) {
    document.getElementById('message1').style.color = 'green';
    document.getElementById('message1').innerHTML = 'strong password';
    weak=0;
  } else {
    document.getElementById('message1').style.color = 'orange';
    document.getElementById('message1').innerHTML = 'medium password';
    weak=0;
  }
}

function doctor_options() {
  if (document.forms["form_log"]["type_user"].value == "doctor") {
    document.getElementById('addr').innerHTML = "*Doctor's Address";
    document.getElementById("doctor_info").style = ""
    document.getElementById("br1").style = ""
    document.getElementById("br2").style = ""
    document.getElementById("ds").style = ""
    document.getElementById("specialty").style = ""
  } else {
    document.getElementById('addr').innerHTML = "*Street Address";
    document.getElementById("doctor_info").style = "display:none"
    document.getElementById("br1").style = "display:none"
    document.getElementById("br2").style = "display:none"
    document.getElementById("ds").style = "display:none"
    document.getElementById("specialty").style = "display:none"
  }
}

function date_amka() {
  var x = document.forms["form_log"]["birthdate"].value;
  var y = document.forms["form_log"]["amka"].value;
  var year = x.slice(2, 4)
  var month = x.slice(5, 7)
  var day = x.slice(8, 10)
  var day2 = y.slice(0, 2)
  var month2 = y.slice(2, 4)
  var year2 = y.slice(4, 6)
  //console.log(x)
  if (year === year2 && month === month2 && day === day2) {
    date = 1;
    document.getElementById('amka_error').style.color = 'green';
    document.getElementById('amka_error').innerHTML = "Maching!";
  } else {
    date = 0;
    document.getElementById('amka_error').style.color = 'red';
    document.getElementById('amka_error').innerHTML = "Not Maching!";
  }
}

function loadDoc() {
  document.getElementById("demo").innerHTML = "";
  document.getElementById("vm").style.display = "none";
  document.getElementById("vm").value = "View Map";
  document.getElementById("Map").style.display = "none"
  const data = null;
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      if (JSON.parse(this.responseText)[0] != null) {
        addr = 1;
        document.getElementById("vm").style.display = "block";
        //console.log(this.responseText);
        obj = JSON.parse(this.responseText);
        var text = obj[0].display_name;
        //console.log(obj[0]);
        CreateMap();

        if (text.includes("Crete") != true) {
          addr = 0;
          document.getElementById("demo").style.color = 'red';
          document.getElementById("demo").innerHTML = "Service available only in Crete!";
        } else {
          document.getElementById("demo").style.color = 'green';
          document.getElementById("demo").innerHTML = "The Address is okay.";
        }
      } else {
        addr = 0;
        document.getElementById("demo").style.color = 'red';
        document.getElementById("demo").innerHTML = "The Address doesn't exist!";
      }
    }
  });
  var addressName = document.forms["form_log"]["address"].value; //"Chandakos"
  //var number = document.forms["form_log"]["number-address"].value; //18
  var city = document.forms["form_log"]["city"].value; //"Heraklion";
  var country = document.forms["form_log"]["country"].value; //"Greece";
  var address = addressName + " " /*+ number + " " */+ city + " " + country/*"New%20York%20City%20NY%20USA"*//*YOUR_ADDRESS*/;

  xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=" + address + "&accept-language=en&polygon_threshold=0.0");

  xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
  var key = "6b730ae955msh5f457b704330367p14336ejsn5ac4c877648c"/*YOUR_KEY*/;
  xhr.setRequestHeader("x-rapidapi-key", key);

  xhr.send(data);
}

function CreateMap() {
  //console.log(mapp)
  if (mapp != 0) {
    markers.removeMarker(mar);
  } else {
    map = new OpenLayers.Map("Map");
    var mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);
  }
  mapp = 1;
  //Orismos Thesis
  function setPosition(lat, lon) {
    var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);
    return position;
  }
  //Orismos Handler
  function handler(position, message) {
    var popup = new OpenLayers.Popup.FramedCloud("Popup",
      position, null,
      message, null,
      true // <-- true if we want a close (X) button, false otherwise
    );
    map.addPopup(popup);
    var div = document.getElementById('divID');
    div.innerHTML += 'Energopoitihike o Handler<br>';

  }
  //Markers	
  markers = new OpenLayers.Layer.Markers("Markers");
  map.addLayer(markers);
  //Marker	
  var position = setPosition(obj[0].lat, obj[0].lon/*35.3053121, 25.0722869*/);
  mar = new OpenLayers.Marker(position);
  markers.addMarker(mar);
  mar.events.register('mousedown', mar, function (evt) {
    handler(position, 'Address');
  }
  );
  //Orismos zoom
  map.setCenter(position, 10);
}

function VisibleMap() {
  if (mapp == 1) {
    document.getElementById("Map").style.display = "block"
    document.getElementById("vm").value = "Hide Map";
    mapp++;
  } else if (mapp == 2) {
    document.getElementById("Map").style.display = "none"
    document.getElementById("vm").value = "View Map";
    mapp--;
  }

}

function recive() {
  var x = document.getElementById("gps");
  getLocation()

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function showPosition(position) {
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        obj2 = JSON.parse(this.responseText);
        console.log(obj2);
        var Country = obj2.address.country;
        //console.log(Country);
        document.getElementById("country").value = Country;
        var City = obj2.address.city.split(" ")[0];
        //console.log(City);
        document.getElementById("city").value = City;
        var Street = obj2.address.road;
        //console.log(Street);
        document.getElementById("address").value = Street;
        loadDoc();

      }
    });
    var lat = position.coords.latitude;
    document.getElementById("lat").value = lat;
    document.getElementById("lat").style = "";
    var lon = position.coords.longitude;
    document.getElementById("lon").value = lon;
    document.getElementById("lon").style = "";
    
    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=" + lat + "&lon=" + lon + "&accept-language=en&format=json&polygon_threshold=0.0"); //new problem fix &format=json (never before had the problem)
    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "6b730ae955msh5f457b704330367p14336ejsn5ac4c877648c");

    xhr.send(data);
    //console.log("Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude);
  }
  
}

function createTableFromJSON(data) {
    var html = "<table><tr><th>Category</th><th>Value</th></tr>";
    for (const x in data) {
        var category = x;
        var value = data[x];
        html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
    }
    html += "</table>";
    return html;

}

function RegisterPOST() {
    let myForm = document.getElementById('form_log');
    let formData = new FormData(myForm);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            if (document.getElementById('type_user').value === "doctor"){
                $('#ajaxContent').html("Successful Registration, wait to be certified.!<br>");
            }else{
                $('#ajaxContent').html("Successful Registration.!<br>");
            }
            $('#ajaxContent').append(createTableFromJSON(responseData));
        } else if (xhr.status === 403){
            $('#ajaxContent').append('Request failed. Returned status of ' + xhr.status + ". User already exists!<br>");
        } else if (xhr.status === 402){
            $('#ajaxContent').append('Request failed. Returned status of ' + xhr.status + ". Email already exists!<br>");
        } else if (xhr.status === 401){
            $('#ajaxContent').append('Request failed. Returned status of ' + xhr.status + ". Amka already exists!<br>");
        } else if (xhr.status !== 200) {
            $('#ajaxContent').append('Request failed. Returned status of ' + xhr.status + "<br>");
           const responseData = JSON.parse(xhr.responseText);
            for (const x in responseData) {
                $('#ajaxContent').append("<p style='color:red'>" + x + "=" + responseData[x] + "</p>");
            }
        }
        
    };
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    console.log(data);
    if(document.getElementById('type_user').value === "doctor"){
        xhr.open('POST', 'RegisterDoctor');
    }else{
        xhr.open('POST', 'Register');
    }
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
    //xhr.send(data);
}