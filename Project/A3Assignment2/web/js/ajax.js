var current_user = null;
var weight = null;
var height = null;
var gender = null;
var log = "n";
var mapp = 0;
//var map;

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

function createTableFromJSON2(data) {
    var count = Object.keys(data).length;
    console.log(count);
    var html = '';
    //html += '<div id="Map" style="height:200px; width:200px"></div>';
    //html += "<div id='divID'></div>";
    if (mapp !== 0) {
    markers.removeMarker(mar);
    } else {
    map = new OpenLayers.Map("Map");
    var mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);
    }
    mapp = 1;
    function setPosition(lat, lon) {
        var fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984
        var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
        var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection,
                toProjection);
        return position;
    }
    /*
    function handler(position, message) {
        var popup = new OpenLayers.Popup.FramedCloud("Popup",
                position, null,
                message, null,
                true // <-- true if we want a close (X) button, false otherwise
                );
        map.addPopup(popup);
        console.log('Energopoihthike');
    }
    */
    //Markers
    var markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);

    for (var i = 0; i < count; i++) {
        html += "<table><tr><th>Category</th><th>Value</th></tr>";
        html += "<tr><td> First Name </td><td>" + data[i].firstname + "</td></tr>";
        html += "<tr><td> Last Name </td><td>" + data[i].lastname + "</td></tr>";
        html += "<tr><td> Address </td><td>" + data[i].address + "</td></tr>";
        html += "<tr><td> City </td><td>" + data[i].city + "</td></tr>";
        html += "<tr><td> Info </td><td>" + data[i].doctor_info + "</td></tr>";
        html += "<tr><td> Specialty </td><td>" + data[i].specialty + "</td></tr>";
        html += "<tr><td> Telephone </td><td>" + data[i].telephone + "</td></tr>";
        html += "</table><br>";
        var position=setPosition(data[i].lat,data[i].lon);
        pos = position;
        var mar=new OpenLayers.Marker(position);
        markers.addMarker(mar);
        var msg = data[i].firstname+' '+data[i].lastname;
        //mar.events.register(true, mar, function(evt){handler(position, msg);});
        console.log(data[i].firstname+' '+data[i].lastname);
    }
    //Orismos zoom
    const zoom = 11;
    map.setCenter(pos, zoom);
    return html;

}

function createTableFromJSON3(data) {
    var count = Object.keys(data).length;
    console.log(count);
    console.log(data);
    var html = "";
    for (var i = 0; i < count; i++) {
        html += "<button class='block' value='" + data[i].username + "' onclick='showDelete(this.value)'>";
        html += "<table><tr><th>Category</th><th>Value</th></tr>";
        html += "<tr><td> Username </td><td>" + data[i].username + "</td></tr>";
        html += "<tr><td> First Name </td><td>" + data[i].firstname + "</td></tr>";
        html += "<tr><td> Last Name </td><td>" + data[i].lastname + "</td></tr>";
        html += "<tr><td> Birth Date </td><td>" + data[i].birthdate + "</td></tr>";
        html += "</table>Press to delete</button><br>";
    }

    return html;

}

function createTableFromJSON4(data) {
    var count = Object.keys(data).length;
    console.log(count);
    var html = "";
    for (var i = 0; i < count; i++) {
        html += "<button class='block' value='" + data[i].username + "' onclick='doCertified(this.value)'>"
        html += "<table><tr><th>Category</th><th>Value</th></tr>";
        html += "<tr><td> First Name </td><td>" + data[i].firstname + "</td></tr>";
        html += "<tr><td> Last Name </td><td>" + data[i].lastname + "</td></tr>";
        html += "<tr><td> Address </td><td>" + data[i].address + "</td></tr>";
        html += "<tr><td> City </td><td>" + data[i].city + "</td></tr>";
        html += "<tr><td> Info </td><td>" + data[i].doctor_info + "</td></tr>";
        html += "<tr><td> Specialty </td><td>" + data[i].specialty + "</td></tr>";
        html += "<tr><td> Telephone </td><td>" + data[i].telephone + "</td></tr>";
        html += "</table>Press to certify</button><br>";
    }

    return html;

}

function isLoggedIn() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            if (log === "su") {
                setChoicesForLoggedUser();
                document.getElementById("title").innerHTML = "User";
            } else if (log === "a") {
                setChoicesForAdmin();
                document.getElementById("title").innerHTML = "Administrator";
            } else {
                document.getElementById("title").innerHTML = "Doctor";
            }
            $("#ajaxContent").html("Welcome again " + xhr.responseText);
        } else if (xhr.status !== 200) {
            $("#choices").load("logins.html");
            document.getElementById("title").innerHTML = "Login Choices";
            //alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    current_user = localStorage.getItem("current_user");
    log = localStorage.getItem("log");
    xhr.open('GET', 'Login?current_user=' + current_user);
    xhr.send();
}

function userLogin() {
    $("#choices").load("login.html");
    document.getElementById("title").innerHTML = "User Login";
    $("#ajaxContent").html("");
    log = "su";
    localStorage.setItem("log", log);
}

function doctorLogin() {
    $("#choices").load("docLogin.html");
    document.getElementById("title").innerHTML = "Doctor Login";
    $("#ajaxContent").html("");
    log = "d";
    localStorage.setItem("log", log);
}

function adminLogin() {
    $("#choices").load("adminLogin.html");
    document.getElementById("title").innerHTML = "Administrator Login";
    $("#ajaxContent").html("");
    log = "a";
    localStorage.setItem("log", log);
}

function guestLogin() {
    $("#choices").html("");
    document.getElementById("title").innerHTML = "Guest";
    $("#choices").append("<h2>Choices:</h2>");
    $("#choices").append("<button onclick='getCertifiedDoctors()'  class='button'>Get All Certified Doctors</button><br>");
    $("#choices").append("<button onclick='userLogin()' class='button' >Loggin as Simple User</button><br>");
    $("#choices").append("<a class='button' target='_blank' href='http://localhost:8080/A3-Assignment1'>Register</a><br>");
    $("#choices").append("<br><h2>Useful links:</h2>");
    $("#choices").append('<a href="https://www.vrisko.gr/efimeries-farmakeion/irakleio" target="_blank"><img src="https://www.vrisko.gr/graphlink/Pharmacies/image/160x60_Banner_n/?Region=irakleio&SmallRegion=true&NativeRegion=%ce%97%cf%81%ce%ac%ce%ba%ce%bb%ce%b5%ce%b9%ce%bf&" border="0" alt="Εφημερεύοντα Φαρμακεία Ηράκλειο" /></a><br>');
    $("#choices").append('<a href="https://www.vrisko.gr/efimeries-nosokomeion?SelectedCity=hrakleio" target="_blank"><img src="https://www.vrisko.gr/graphlink/Hospitals/image/160x60_Banner_n/?Prefecture=hrakleio&SmallPrefecture=true&NativePrefecture=%ce%97%ce%a1%ce%91%ce%9a%ce%9b%ce%95%ce%99%ce%9f&" border="0" alt="Εφημερεύοντα Νοσοκομεία ΗΡΑΚΛΕΙΟ" /></a><br>');
    $("#choices").append('<a href="https://covid19.gov.gr/" target="_blank" class="button">Info for Covid-19</a><br>');
    $("#choices").append("<br><button onclick='isLoggedIn()'  class='button'>Back</button><br>");
    $("#ajaxContent").html("");
}

function loginPost() {
    //let myForm = document.getElementById('loginForm');
    //let formData = new FormData(myForm);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            if (log === "su") {
                $("#ajaxContent").html("Successful User Login.");
                document.getElementById("title").innerHTML = "User";
                setChoicesForLoggedUser();
            } else if (log === "a") {
                $("#ajaxContent").html("Successful Administrator Login.");
                document.getElementById("title").innerHTML = "Administrator";
                setChoicesForAdmin();
            } else {
                $("#ajaxContent").html("Successful Doctor Login.");
                document.getElementById("title").innerHTML = "Doctor";
            }
            //$("#ajaxContent").html(createTableFromJSON(JSON.parse(xhr.responseText)));
        } else if (xhr.status === 405) {
            $("#ajaxContent").html("Login as Administrator.");
            $('#choices').load("logins.html");
            current_user = null;
            localStorage.setItem("current_user", current_user);
        } else if (xhr.status === 406) {
            $("#ajaxContent").html("Login as Simple User.");
            $('#choices').load("logins.html");
            current_user = null;
            localStorage.setItem("current_user", current_user);
        } else if (xhr.status !== 200) {
            $("#ajaxContent").html("User does not exists!");
            current_user = null;
            localStorage.setItem("current_user", current_user);
        }
    };
    var data = $('#loginForm').serialize();
    current_user = document.getElementById('username').value;
    localStorage.setItem("current_user", current_user);
    console.log(current_user);
    //const data = {};
    //formData.forEach((value, key) => (data[key] = value));
    //console.log(data);
    if (log === "a") {
        xhr.open('Post', 'AdminLogin');
    } else if (log === "su") {
        xhr.open('Post', 'Login');
        console.log("mphke login log=su");
    } else {

    }
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
    //xhr.send(JSON.stringify(data));

}

function setChoicesForLoggedUser() {
    $("#choices").html("");
    $("#choices").append("<h2>Choices:</h2>");
    $("#choices").append("<button onclick='getDataRequest()' class='button' >See Your Data</button><br>");
    $("#choices").append("<button onclick='changeDataRequest()' class='button' >Change Your Data</button><br>");
    $("#choices").append("<button onclick='getWH()'  class='button'>Get BMI</button><br>");
    $("#choices").append("<button onclick='getWG()'  class='button'>Get Ideal Weight</button><br>");
    $("#choices").append("<button onclick='getCertifiedDoctors()'  class='button'>Get All Certified Doctors</button><br>");
    $("#choices").append("<button onclick='logout()'  class='button'>Logout</button><br>");

}

function setChoicesForAdmin() {
    $("#choices").html("");
    $("#choices").append("<h2>Choices:</h2>");
    $("#choices").append("<button onclick='getAllUsers()' class='button' >See All Users</button><br>");
    $("#choices").append("<button onclick='getUncertifiedDoctors()' class='button' >See Pending Applications</button><br>");
    $("#choices").append("<button onclick='getDataRequest()' class='button' >See Your Data</button><br>");
    $("#choices").append("<button onclick='changeDataRequest()' class='button' >Change Your Data</button><br>");
    $("#choices").append("<button onclick='getWH()'  class='button'>Get BMI</button><br>");
    $("#choices").append("<button onclick='getWG()'  class='button'>Get Ideal Weight</button><br>");
    $("#choices").append("<button onclick='getCertifiedDoctors()'  class='button'>Get All Certified Doctors</button><br>");
    $("#choices").append("<button onclick='logout()'  class='button'>Logout</button><br>");
}

function logout() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            $('#choices').load("logins.html");
            document.getElementById("title").innerHTML = "Login Choices";
            $("#ajaxContent").html("Successful Logout");
            current_user = null;
            localStorage.setItem("current_user", current_user); //new
            console.log(localStorage.getItem("current_user"));
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('POST', 'Logout');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}

function getDataRequest() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            $('#ajaxContent').html("<h2>Your Data</h2>");
            $('#ajaxContent').append(createTableFromJSON(responseData));
            // $("#myForm").hide();
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    var current_user = localStorage.getItem("current_user");
    xhr.open('GET', 'Data?current_user=' + current_user);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function changeDataRequest() {
    $('#ajaxContent').load("form.html");
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            //$('#ajaxContent').html("<h2>Your Updated Data</h2>");
            //$('#ajaxContent').append(createTableFromJSON(responseData));
            console.log(responseData);
            for (const x in responseData) {
                var category = x;
                var value = responseData[x];
                if (!!document.getElementById(category) === true) {
                    document.getElementById(category).value = value;
                    //console.log("mphke " + category);
                } else {
                    //console.log("den mphke " + category);
                }
            }
            //updateData();
            // $("#myForm").hide();
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    var current_user = localStorage.getItem("current_user");
    xhr.open('GET', 'Data?current_user=' + current_user);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function ChangePOST() {
    let myForm = document.getElementById('form_log');
    let formData = new FormData(myForm);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            if (document.getElementById('type_user').value === "doctor") {
                $('#ajaxContent').html("Successful Update for doctor.!<br>");
            } else {
                $('#ajaxContent').html("Successful Update for simple user.!<br>");
            }
            $('#ajaxContent').append(createTableFromJSON(responseData));
        } else if (xhr.status !== 200) {
            $('#ajaxContent').append('Request failed. Returned status of ' + xhr.status + "<br>");
            const responseData = JSON.parse(xhr.responseText);
            for (const x in responseData) {
                $('#ajaxContent').append("<p style='color:red'>" + x + "=" + responseData[x] + "</p>");
            }
        }

    };
    var current_user = localStorage.getItem("current_user");
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    console.log(data);
    if (document.getElementById('type_user').value === "doctor") {
        xhr.open('POST', 'UpdateDoctor');
    } else {
        xhr.open('POST', 'Update?current_user=' + current_user);
    }
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}

function getWH() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            weight = responseData.weight;
            height = responseData.height;
            console.log(height);
            console.log(weight);

        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
        getBMI();
    };
    var current_user = localStorage.getItem("current_user");
    xhr.open('GET', 'Data?current_user=' + current_user);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function getBMI() {
    if (weight !== null && height !== null) {
        const data = null;
        const xhr2 = new XMLHttpRequest();
        xhr2.withCredentials = true;
        xhr2.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                //console.log(this.responseText);
                const obj = JSON.parse(xhr2.responseText);
                var bmi = obj.data.bmi;
                var health = obj.data.health;
                $('#ajaxContent').html("");
                $('#ajaxContent').append("<p>Your BMI: " + bmi + "</p>");
                $('#ajaxContent').append("<p>Your health: " + health + "</p>");
            }
        });
        xhr2.open("GET", "https://fitness-calculator.p.rapidapi.com/bmi?age=25&weight=" + weight + "&height=" + height);
        xhr2.setRequestHeader("x-rapidapi-host", "fitness-calculator.p.rapidapi.com");
        xhr2.setRequestHeader("x-rapidapi-key", "6b730ae955msh5f457b704330367p14336ejsn5ac4c877648c");
        xhr2.send(data);
    } else {
        $('#ajaxContent').html("");
        $('#ajaxContent').append("<p>No height or weight</p>");
    }
}

function getWG() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            height = responseData.height;
            gender = responseData.gender;
            gender = gender.toLowerCase();
            console.log(height);
            console.log(gender);
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
        getIdealWeight();
    };
    var current_user = localStorage.getItem("current_user");
    xhr.open('GET', 'Data?current_user=' + current_user);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function getIdealWeight() {
    if (height !== null) {
        const data = null;
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                console.log(this.responseText);
                const obj = JSON.parse(xhr.responseText);
                var Devine = obj.data.Devine;
                $('#ajaxContent').html("");
                $('#ajaxContent').append("<p>Your Ideal Weight: " + Devine + " kg.</p>");
            }
        });

        xhr.open("GET", "https://fitness-calculator.p.rapidapi.com/idealweight?gender=" + gender + "&height=" + height);
        xhr.setRequestHeader("x-rapidapi-host", "fitness-calculator.p.rapidapi.com");
        xhr.setRequestHeader("x-rapidapi-key", "6b730ae955msh5f457b704330367p14336ejsn5ac4c877648c");

        xhr.send(data);
    } else {
        $('#ajaxContent').html("");
        $('#ajaxContent').append("<p>No height</p>");
    }
}

function getCertifiedDoctors() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            console.log(responseData);
            $('#ajaxContent').html("<h2>Certified Doctors:</h2>");
            $('#ajaxContent').append('<div id="Map" style="height:300px; width:100%"></div>');
            $('#ajaxContent').append("<div id='divID'></div>");
            $('#ajaxContent').append(createTableFromJSON2(responseData));
            // $("#myForm").hide();
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    //var current_user = localStorage.getItem("current_user");
    xhr.open('GET', 'CertifiedDoctors');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function getUncertifiedDoctors() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            console.log(responseData);
            $('#ajaxContent').html("<h2>Uncertified Doctors:</h2>");
            $('#ajaxContent').append(createTableFromJSON4(responseData));
            // $("#myForm").hide();
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    //var current_user = localStorage.getItem("current_user");
    xhr.open('GET', 'UncertifiedDoctors');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function getAllUsers() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            console.log(responseData);
            $('#ajaxContent').html("<h2>All Users:</h2>");
            $('#ajaxContent').append(createTableFromJSON3(responseData));
            // $("#myForm").hide();
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    //var current_user = localStorage.getItem("current_user");
    xhr.open('GET', 'AllUsers');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function showDelete(name) {
    console.log(name);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //const responseData = JSON.parse(xhr.responseText);
            //console.log(responseData);
            $('#ajaxContent').html("Successful Delete.");
            //getAllUsers();
            // $("#myForm").hide();
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    //var current_user = localStorage.getItem("current_user");
    xhr.open('DELETE', 'AllUsers?name=' + name);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function doCertified(username) {
    console.log(username);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //const responseData = JSON.parse(xhr.responseText);
            //console.log(responseData);
            $('#ajaxContent').html("Successful Certification.");
            //getAllUsers();
            // $("#myForm").hide();
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    //var current_user = localStorage.getItem("current_user");
    xhr.open('PUT', 'UncertifiedDoctors?username=' + username);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}