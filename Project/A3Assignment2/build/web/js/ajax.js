var current_user = null;
var weight = null;
var height = null;
var gender = null;
var log = "n";
var mapp = 0;

//show-hide password
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

//print's a table of a simple json 
function createTableFromJSON(data) {
    var html = "<table><tr><th>Category</th><th>Value</th></tr>";
    for (const x in data) {
        var category = x;
        if (category !== "password" && category !== "randevouz_id" && category !== "user_id" && category !== "doctor_id"
                && category !== "lat" && category !== "lon" && category !== "message_id") {
            var value = data[x];
            html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
        }
    }
    html += "</table>";
    return html;

}

//print's a table of a complex json 
//and adds an action (delete or certify) if action!=null
function createTablesFromJSON(data, action) {
    var size = Object.keys(data).length;
    var html = "";
    for (let i = 0; i < size; i++) {
        if (action !== null) {
            if (action === "modifyAppointment" || action === "userAppointment") {
                html += "<button class='block' value='" + data[i].randevouz_id + "' onclick='" + action + "(this.value)'>";
            } else if (action === "messageReply") {
                if (log === "d") {
                    html += "<button class='block' value='" + data[i].user_id + "' onclick='" + action + "(this.value)'>";
                } else {
                    html += "<button class='block' value='" + data[i].doctor_id + "' onclick='" + action + "(this.value)'>";
                }
            } else if (action === "userRandevouzGet") {
                html += "<button class='block' value='" + data[i].doctor_id + "' onclick='" + action + "(this.value)'>";
            } else if (action === "seeChoisesForPatient"){
                html += "<button class='block' value='" + data[i].amka + "' onclick='" + action + "(this.value)'>";
            } else if(action === /*"treatmentform"*/ "TreatmentsGet"){
                //$('#ajaxContent').append("<div id='" + data[i].bloodtest_id + "' ></div>");
                html += "<button class='block' value='" + data[i].bloodtest_id + "' onclick='" + action + "(this.value)'>";
            }else {
                html += "<button class='block' value='" + data[i].username + "' onclick='" + action + "(this.value)'>";
            }
        }
        html += "<table><tr><th>Category</th><th>Value</th></tr>";
        for (const x in data[i]) {
            var category = x;
            if (category !== "password" && category !== "randevouz_id" && /*category !== "user_id" && category !== "doctor_id"
             && */category !== "lat" && category !== "lon" && category !== "message_id") {
                var value = data[i][x];
                html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
            }
        }
        html += "</table>";
        if (action !== null) {
            html += "</buttom><br>";
        } else {
            html += "<br>";
        }
    }
    return html;
}

//print doctors and in map (guest)
function createTableFromJSONmap(data, action) {
    var count = Object.keys(data).length;
    console.log(count);
    var html = "<p>Press doctor's table to send a message";
    //html += '<div id="Map" style="height:200px; width:200px"></div>';
    //html += "<div id='divID'></div>";
    //if (mapp !== 0) {
    //markers.removeMarker(mar);
    //} else {
    map = new OpenLayers.Map("Map");
    var mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);
    //}
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
        if (action != null) {
            html += "<button class='block' value='" + data[i].doctor_id + "' onclick='" + action + "(this.value)'>";
        }
        html += "<table><tr><th>Category</th><th>Value</th></tr>";
        html += "<tr><td> First Name </td><td>" + data[i].firstname + "</td></tr>";
        html += "<tr><td> Last Name </td><td>" + data[i].lastname + "</td></tr>";
        html += "<tr><td> Address </td><td>" + data[i].address + "</td></tr>";
        html += "<tr><td> City </td><td>" + data[i].city + "</td></tr>";
        html += "<tr><td> Info </td><td>" + data[i].doctor_info + "</td></tr>";
        html += "<tr><td> Specialty </td><td>" + data[i].specialty + "</td></tr>";
        html += "<tr><td> Telephone </td><td>" + data[i].telephone + "</td></tr>";
        html += "</table>";
        if (action != null) {
            html += "</buttom><br><br>";
        } else {
            html += "<br>";
        }
        var position = setPosition(data[i].lat, data[i].lon);
        pos = position;
        var mar = new OpenLayers.Marker(position);
        markers.addMarker(mar);
        var msg = data[i].firstname + ' ' + data[i].lastname;
        //mar.events.register(true, mar, function(evt){handler(position, msg);});
        console.log(data[i].firstname + ' ' + data[i].lastname);
    }

    //Orismos zoom
    const zoom = 11;
    map.setCenter(pos, zoom);
    return html;

}

function isLoggedIn() {
    mapp = 0;
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            if (log === "su") {
                setTimeout(getNotificationforAppointment, 1000);
                setChoicesForLoggedUser();
                document.getElementById("title").innerHTML = "User";
            } else if (log === "a") {
                setChoicesForAdmin();
                document.getElementById("title").innerHTML = "Administrator";
            } else {
                setChoicesForDoctor();
                document.getElementById("title").innerHTML = "Doctor";
            }
            current_user = xhr.responseText;
            $("#ajaxContent").html("Welcome again " + current_user);
            console.log(current_user);
        } else if (xhr.status !== 200) {
            $("#choices").load("logins.html");
            document.getElementById("title").innerHTML = "Login Choices";
        }
    };
    log = localStorage.getItem("log");
    console.log(log);
    if (log === "d") {
        xhr.open('GET', 'DoctorLogin');
    } else {
        ;
        xhr.open('GET', 'Login');
    }
    xhr.send();
}

//Loggin optiond
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
    log = "g";
    localStorage.setItem("log", log);
    console.log(log);
    $("#choices").html("");
    document.getElementById("title").innerHTML = "Guest";
    $("#choices").append("<h2>Choices:</h2>");
    $("#choices").append("<button onclick='certifiedDoctorsGet(null)'  class='button'>Get All Certified Doctors</button><br>");
    $("#choices").append("<button onclick='userLogin()' class='button' >Loggin as Simple User</button><br>");
    $("#choices").append("<a class='button' target='_blank' href='http://localhost:8080/A3-Assignment1'>Register</a><br>");
    $("#choices").append("<br><h2>Useful links:</h2>");
    $("#choices").append('<a href="https://www.vrisko.gr/efimeries-farmakeion/irakleio" target="_blank"><img src="https://www.vrisko.gr/graphlink/Pharmacies/image/160x60_Banner_n/?Region=irakleio&SmallRegion=true&NativeRegion=%ce%97%cf%81%ce%ac%ce%ba%ce%bb%ce%b5%ce%b9%ce%bf&" border="0" alt="Εφημερεύοντα Φαρμακεία Ηράκλειο" /></a><br>');
    $("#choices").append('<a href="https://www.vrisko.gr/efimeries-nosokomeion?SelectedCity=hrakleio" target="_blank"><img src="https://www.vrisko.gr/graphlink/Hospitals/image/160x60_Banner_n/?Prefecture=hrakleio&SmallPrefecture=true&NativePrefecture=%ce%97%ce%a1%ce%91%ce%9a%ce%9b%ce%95%ce%99%ce%9f&" border="0" alt="Εφημερεύοντα Νοσοκομεία ΗΡΑΚΛΕΙΟ" /></a><br>');
    $("#choices").append('<a href="https://covid19.gov.gr/" target="_blank" class="button">Info for Covid-19</a><br>');
    $("#choices").append("<br><button onclick='isLoggedIn()'  class='button'>Back</button><br>");
    $("#ajaxContent").html("");
}

//do login
function loginPost() {
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
                setChoicesForDoctor();
            }
        } else if (xhr.status === 405) {
            $("#ajaxContent").html("Login as Administrator.");
            $('#choices').load("logins.html");
            current_user = null;
            localStorage.setItem("current_user", current_user);
        } else if (xhr.status === 406) {
            if (log === 'd') {
                $("#ajaxContent").html("Cannot Login wait to be certified.");
            } else {
                $("#ajaxContent").html("Login as Simple User.");
            }
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
    if (log === "a") {
        console.log("mphke login log=a");
        xhr.open('Post', 'AdminLogin');
    } else if (log === "su") {
        console.log("mphke login log = su!");
        xhr.open('Post', 'Login');
    } else {
        console.log("mphke login log=d");
        xhr.open('POST', 'DoctorLogin');
    }
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
    //xhr.send(JSON.stringify(data));

}

//set Choices
function setChoicesForLoggedUser() {
    $("#choices").html("");
    $("#choices").append("<h2>Choices:</h2>");
    $("#choices").append("<button onclick='dataGet()' class='button' >See Your Data</button><br>");
    $("#choices").append("<button onclick='changeDataRequest()' class='button' >Change Your Data</button><br>");
    $("#choices").append("<button onclick='getWH()'  class='button'>Get BMI</button><br>");
    $("#choices").append("<button onclick='getWG()'  class='button'>Get Ideal Weight</button><br>");
    $("#choices").append("<button onclick='uploadBloodTests()' class='button'>Upload Blood Tests</button><br>");
    $("#choices").append("<button onclick='giveBloodTests()' class='button'>Get Blood Tests</button><br>");
    $("#choices").append("<button onclick='giveDateCompareBloodTests()' class='button'>Compare Blood Tests</button><br>");
    $("#choices").append("<button onclick='certifiedDoctorsGet(null)'  class='button'>Get All Certified Doctors(message)</button><br>");
    $("#choices").append("<button onclick='certifiedDoctorsGet(1)'  class='button'>See Doctors (for appointments)</button><br>");
    $("#choices").append("<button onclick='RandevouGet(\"0\",\"0\",\"modifyAppointment\")' class='button' >See All Your Appointments</button><br>");
    $("#choices").append("<button onclick='messegesGet()'  class='button'>See Your Messeges!</button><br>");
    $("#choices").append("<button onclick='logoutPost()'  class='button'>Logout</button><br>");


}

function setChoicesForDoctor() {
    $("#choices").html("");
    $("#choices").append("<h2>Choices:</h2>");
    $("#choices").append("<button onclick='dataGet()' class='button' >See Your Data</button><br>");
    $("#choices").append("<button onclick='changeDataRequest()' class='button' >Change Your Data</button><br>");
    $("#choices").append("<button onclick='patientsGet()' class='button' >See Your Patients</button><br>");
    $("#choices").append("<button onclick='creatRandevou()' class='button' >Creat Appointment</button><br>");
    $("#choices").append("<button onclick='RandevouGet(\"0\",\"0\",\"modifyAppointment\")' class='button' >See All Your Appointments</button><br>");
    $("#choices").append("<button onclick='appointmentsday()' class='button' >See Your Appointments For A Day</button><br>");
    $("#choices").append("<button onclick='messegesGet()'  class='button'>See Your Messeges</button><br>");
    $("#choices").append("<button onclick='getWH()'  class='button'>Get BMI</button><br>");
    $("#choices").append("<button onclick='getWG()'  class='button'>Get Ideal Weight</button><br>");
    $("#choices").append("<button onclick='logoutPost()'  class='button'>Logout</button><br>");

}

function setChoicesForAdmin() {
    $("#choices").html("");
    $("#choices").append("<h2>Choices:</h2>");
    $("#choices").append("<button onclick='allUsersGet()' class='button' >See All Users</button><br>");
    $("#choices").append("<button onclick='uncertifiedDoctorsGet()' class='button' >See Pending Applications</button><br>");
    $("#choices").append("<button onclick='dataGet()' class='button' >See Your Data</button><br>");
    $("#choices").append("<button onclick='changeDataRequest()' class='button' >Change Your Data</button><br>");
    $("#choices").append("<button onclick='getWH()'  class='button'>Get BMI</button><br>");
    $("#choices").append("<button onclick='getWG()'  class='button'>Get Ideal Weight</button><br>");
    $("#choices").append("<button onclick='certifiedDoctorsGet(null)'  class='button'>Get All Certified Doctors</button><br>");
    $("#choices").append("<button onclick='logoutPost()'  class='button'>Logout</button><br>");
}

function seeChoisesForPatient(amka) {
    $("#ajaxContent").html("<button onclick='BloodtestGet("+amka+")'  class='button'>See Patient's Blood Tests.</button><br>");
    $("#ajaxContent").append("<button onclick='giveDateCompareBloodTests("+amka+")' class='button'>Compare Blood Tests!</button><br>");
    //$("#ajaxContent").html("<button onclick='treatmeBloodtestGetntform(" + 1 + ")'  class='button'>See Patient's Blood Tests</button><br>");
}

function giveBloodTests() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            $('#ajaxContent').html("<h2>Blood Tests:</h2>");
            $('#ajaxContent').append("<p> Press to see bloodtest's treatment</p>")
            $('#ajaxContent').append(createTablesFromJSON(responseData, "TreatmentsGet"));
        } else if (xhr.status === 403) {
            $('#ajaxContent').html("<p style='color:red'>There are no blood tests!<br></p>");
        } else if (xhr.status !== 200) {
            $('#ajaxContent').append('Request failed. Returned status of ' + xhr.status + "<br>");
            const responseData = JSON.parse(xhr.responseText);
            for (const x in responseData) {
                $('#ajaxContent').append("<p style='color:red'>" + x + "=" + responseData[x] + "</p>");
            }
        }
    };
    xhr.open('GET', 'BloodTests');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function sortBloodTests(data) {
    if (data.length > 0) {
        var i;
        for (i = 0; i < data.length - 1; i++) {
            var n = data[i + 1].vitamin_d3 + "           Previous: " + data[i].vitamin_d3 + "   ";
            data[i + 1].vitamin_d3 = n;
            if (data[i + 1].vitamin_d3 > data[i].vitamin_d3) {
                data[i + 1].vitamin_d3_level = "Higher than previous test";
            } else if (data[i + 1].vitamin_d3 < data[i].vitamin_d3) {
                data[i + 1].vitamin_d3_level = "Lower than previous test";
            } else {
                data[i + 1].vitamin_d3_level = "Same as previous test";
            }
            n = data[i + 1].vitamin_b12 + "           Previous: " + data[i].vitamin_b12;
            data[i + 1].vitamin_b12 = n;
            if (data[i + 1].vitamin_b12 > data[i].vitamin_b12) {
                data[i + 1].vitamin_b12_level = "Higher than previous test";
            } else if (data[i + 1].vitamin_b12 < data[i].vitamin_b12) {
                data[i + 1].vitamin_b12_level = "Lower than previous test";
            } else {
                data[i + 1].vitamin_b12_level = "Same as previous test";
            }
            n = data[i + 1].cholesterol + "           Previous: " + data[i].cholesterol;
            data[i + 1].cholesterol = n;
            if (data[i + 1].cholesterol > data[i].cholesterol) {
                data[i + 1].cholesterol_level = "Higher than previous test";
            } else if (data[i + 1].cholesterol < data[i].cholesterol) {
                data[i + 1].cholesterol_level = "Lower than previous test";
            } else {
                data[i + 1].cholesterol_level = "Same as previous test";
            }
            n = data[i + 1].blood_sugar + "           Previous: " + data[i].blood_sugar;
            data[i + 1].blood_sugar = n;
            if (data[i + 1].blood_sugar > data[i].blood_sugar) {
                data[i + 1].blood_sugar_level = "Higher than previous test";
            } else if (data[i + 1].blood_sugar < data[i].blood_sugar) {
                data[i + 1].blood_sugar_level = "Lower than previous test";
            } else {
                data[i + 1].blood_sugar_level = "Same as previous test";
            }
            n = data[i + 1].iron + "           Previous: " + data[i].iron;
            data[i + 1].iron = n;
            if (data[i + 1].iron > data[i].iron) {
                data[i + 1].iron_level = "Higher than previous test";
            } else if (data[i + 1].iron < data[i].iron) {
                data[i + 1].iron_level = "Lower than previous test";
            } else {
                data[i + 1].iron_level = "Same as previous test";
            }

        }
    }
}

function compareBloodTests(amka) {
    $('#ajaxContent').html("");
    var xhr = new XMLHttpRequest();
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);
            $('#ajaxContent').html("Successful blood test showing.!<br>");
            sortBloodTests(responseData);
            $('#ajaxContent').append(createTablesFromJSON(responseData, null));
            if(log==="su"){
                setChoicesForLoggedUser();
            }else{
                setChoicesForDoctor();
            }
        } else if (xhr.status === 403) {
            $('#ajaxContent').html("<p style='color:red'>Patient has no blood tests before that date!<br></p>");
        } else if (xhr.status !== 200) {
            $('#ajaxContent').append('Request failed. Returned status of ' + xhr.status + "<br>");
            const responseData = JSON.parse(xhr.responseText);
            for (const x in responseData) {
                $('#ajaxContent').append("<p style='color:red'>" + x + "=" + responseData[x] + "</p>");
            }
        }
        console.log("compareBloodTests");
    };
    if(log === "d"){
        while(amka.toString().length<11){
            amka = "0"+amka;
        }
        xhr.open('GET', 'BloodTests?date=' + document.getElementById("test_date").value + '&amka='+amka);
    }else{
        xhr.open('GET', 'BloodTests?date=' + document.getElementById("test_date").value);
    }
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

//do Logout
function logoutPost() {
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

function dataGet() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            const responseData = JSON.parse(xhr.responseText);
            $('#ajaxContent').html("<h2>Your Data</h2>");
            $('#ajaxContent').append(createTableFromJSON(responseData));
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('GET', 'Data');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function changeDataRequest() {
    $('#ajaxContent').load("form.html");
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            const responseData = JSON.parse(xhr.responseText);
            //$('#ajaxContent').html("<h2>Your Updated Data</h2>");
            //$('#ajaxContent').append(createTableFromJSON(responseData));
            //console.log(responseData);
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
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('GET', 'Data');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

//call from form.html
//updates/changes the user's data
function ChangePUT() {
    let myForm = document.getElementById('form_log');
    let formData = new FormData(myForm);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            if (log === 'd') {
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
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    //console.log(data);
    if (log === 'd') {
        xhr.open('PUT', 'Data');
    } else {
        xhr.open('PUT', 'Data');
    }
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}

function getWH() {
    //alert(100);
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

function uploadBloodTests() {
    $("#choices").html("");
    $("#ajaxContent").html("");
    $("#choices").append("<h2>Choices:</h2>");
    $("#choices").append('<form id="form_log2" name="form_log2" onsubmit="Bloodtest() ;return false;"></form>');
    $("#form_log2").append('<h3>Input</h3><br>');
    $("#form_log2").append('<label for="date">*Date Of Tests</label> <br>');
    $("#form_log2").append('<input type="date" id="test_date" name="test_date" value="1980-01-01" min="1920-01-01" required> <br><br>');
    $("#form_log2").append('<label for="MedicalCenter">*Medical Center</label><br>');
    $("#form_log2").append('<input type="text" id="medical_center" name="medical_center" required><br>');
    $("#form_log2").append('<span id="amka_error"></span> <br>');
    $("#form_log2").append('<label for="BloodSugar">*Blood Sugar</label><br>');
    $("#form_log2").append('<input type="number" id="blood_sugar" name="blood_sugar" step="0.01" required><br><br>');
    $("#form_log2").append('<label for="Cholesterol">*Cholesterol</label><br>');
    $("#form_log2").append('<input type="number" id="cholesterol" name="cholesterol" step="0.01" required><br><br>');
    $("#form_log2").append('<label for="Iron">*Iron</label><br>');
    $("#form_log2").append('<input type="number" id="iron" name="iron" step="0.01" required><br><br>');
    $("#form_log2").append('<label for="VitaminD3">*Vitamin D3</label><br>');
    $("#form_log2").append('<input type="number" id="vitamin_d3" name="vitamin_d3" step="0.01" required><br><br>');
    $("#form_log2").append('<label for="VitaminB12">*Vitamin B12</label><br>');
    $("#form_log2").append('<input type="number" id="vitamin_b12" name="vitamin_b12" step="0.01" required><br><br>');
    $("#form_log2").append('<input type="submit" class="button" value="Submit" > <br><br>');
    $("#choices").append('<input type="button" onclick="setChoicesForLoggedUser()" class="button" value="Back"><br><br>');
}

function giveDateCompareBloodTests(amka) {
    $("#choices").html("");
    $("#ajaxContent").html("");
    $("#choices").append("<h2>Pick Max Date:</h2>");
    $("#choices").append('<form id="form_log3" name="form_log3" onsubmit="compareBloodTests('+amka+') ;return false;"></form>');
    $("#form_log3").append('<input type="date" id="test_date" name="test_date" value="2018-01-01" min="1920-01-01" required>');
    $("#form_log3").append('<input type="submit" class="button" value="Submit"> <br><br>');
    $("#choices").append('<input type="button" onclick="toShowGraph('+amka+')" class="button" value="Show Graph"> <br><br>');
    if(log==="d"){
        $("#choices").append('<input type="button" onclick="setChoicesForDoctor()" class="button" value="Back"><br><br>');
    }else{
        $("#choices").append('<input type="button" onclick="setChoicesForLoggedUser()" class="button" value="Back"><br><br>');
    }
}

function toShowGraph(amka) {
    $("#choices").html("");
    $("#choices").append('<form id="form_log4" name="form_log4" onsubmit="GetGraphValues('+amka+') ;return false;"></form>');
    $("#form_log4").append('<select id="Test" name="Test"></select>');
    $("#Test").append('<option value="cholesterol">Cholesterol</option>');
    $("#Test").append('<option value="vitamin_d3">Vitamin d3</option>');
    $("#Test").append('<option value="vitamin_b12">Vitamin b12</option>');
    $("#Test").append('<option value="blood_sugar">Blood Sugar</option>');
    $("#Test").append('<option value="iron">Iron</option>');
    $("#form_log4").append('<input type="submit" class="button" value="Submit"> <br><br>');
    $("#choices").append('<input type="button" onclick="giveDateCompareBloodTests('+amka+')" class="button" value="Back"><br><br>');
}

function createTableForGraph(data) {
    var temp = new Array();
    var i;
    var object;
    if (document.getElementById("Test").value == "cholesterol") {
        //alert(data)
        /*alert(data[0].cholesterol);
         alert(data[0].test_date);*/
        temp[0] = ['Test Date', 'Cholesterol'];
        //alert(temp[0].cholesterol);
        for (i = 0; i < data.length; i++) {
            /*={cholesterol:data[i].cholesterol,test_date:data[i].test_date};
             temp.push(object);*///
            temp[i + 1] = [data[i].test_date, data[i].cholesterol];
        }
        drawChart(temp);
        //createTableFromJSON(temp);
    } else if (document.getElementById("Test").value == "vitamin_d3") {
        temp[0] = ['Test Date', 'Vitamin d3'];
        for (i = 0; i < data.length; i++) {
            temp[i + 1] = [data[i].test_date, data[i].vitamin_d3];
        }
        drawChart(temp);
    } else if (document.getElementById("Test").value == "vitamin_b12") {
        temp[0] = ['Test Date', 'Vitamin b12'];
        for (i = 0; i < data.length; i++) {
            temp[i + 1] = [data[i].test_date, data[i].vitamin_b12];
        }
        drawChart(temp);
    } else if (document.getElementById("Test").value == "blood_sugar") {
        temp[0] = ['Test Date', 'Blood Sugar'];
        for (i = 0; i < data.length; i++) {
            temp[i + 1] = [data[i].test_date, data[i].blood_sugar];
        }
        drawChart(temp);
    } else {
        temp[0] = ['Test Date', 'Iron'];
        for (i = 0; i < data.length; i++) {
            temp[i + 1] = [data[i].test_date, data[i].iron];
        }
        drawChart(temp);
    }
}
google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart(temno) {
    var data2 = google.visualization.arrayToDataTable(temno/*[
     ['Contry', 'Mhl'],
     ['Italy',55],
     ['France',49],
     ['Spain',44],
     ['USA',24],
     ['Argentina',15]
     ]*/);
    var options = {
        title: 'Tests'
    };
    var chart = new google.visualization.BarChart(document.getElementById('myChart'));
    chart.draw(data2, options);
}

function GetGraphValues(amka) {
    //alert(document.getElementById("Test").value);
    $('#ajaxContent').html("");
    var xhr = new XMLHttpRequest();
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);
            //createTableForGraph(responseData);
            //$('#ajaxContent').html("Successful bloodest showing.!<br>");
            $('#ajaxContent').html('<div id="myChart" style="width:100%; max-width:600px; height:500px;"></div>');
            var temno = new Array();
            //temno=[['Test Date','Cholesterol'],[responseData[0].test_date,responseData[0].cholesterol],["You","3"]];
            /*temno[0]=['Test Date','Cholesterol'];
             temno[1]=[responseData[0].test_date,responseData[0].cholesterol];*/
            //drawChart(temno);
            createTableForGraph(responseData);
        } else if (xhr.status === 403) {
            $('#ajaxContent').html("<p>Patient has no blood tests.<br></p>");
        }else if (xhr.status !== 200) {
            $('#ajaxContent').append('Request failed. Returned status of ' + xhr.status + "<br>");
            const responseData = JSON.parse(xhr.responseText);
            for (const x in responseData) {
                $('#ajaxContent').append("<p style='color:red'>" + x + "=" + responseData[x] + "</p>");
            }
        }
    };
    if (log==="d"){
        while(amka.toString().length<11){
            amka = "0"+amka;
        }
        xhr.open('GET', 'BloodTests?Test=' + document.getElementById("Test").value + '&amka=' + amka);
    }else{
        xhr.open('GET', 'BloodTests?Test=' + document.getElementById("Test").value);
    }
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function Bloodtest() {
    $('#ajaxContent').html("");
    let myForm = document.getElementById('form_log2');
    let formData = new FormData(myForm);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            $('#ajaxContent').html("Successful bloodest addition.!<br>");
            $('#ajaxContent').append(createTableFromJSON(responseData));
            if(log === "su"){
                concole.log("mphke result bloodtest su");
                setChoicesForLoggedUser();
            }else{
                concole.log("mphke result bloodtest d");
                setChoicesForDoctor();
            }
        } else if (xhr.status !== 200) {
            $('#ajaxContent').append('Request failed. Returned status of ' + xhr.status + "<br>");
            //const responseData = JSON.parse(xhr.responseText);
            //for (const x in responseData) {
            //$('#ajaxContent').append("<p style='color:red'>" + x + "=" + responseData[x] + "</p>");
            //}
        }

    };
    const data = {};
    console.log(1);
    formData.forEach((value, key) => (data[key] = value));
    console.log("mphke sthn post blood test data formas\n" + data);
    xhr.open('POST', 'BloodTests');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
    //uploadBloodTests();
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

function certifiedDoctorsGet(ap) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            console.log(responseData);
            $('#ajaxContent').html("<h2>Certified Doctors:</h2>");
            if (ap === 1) {
                console.log('Press a table to see the doctors available appointments');
                $('#ajaxContent').append('<p> Press a table to see the doctor\'s available appointments.</p>');
                $('#ajaxContent').append(createTablesFromJSON(responseData, "userRandevouzGet"));
            } else {
                $('#ajaxContent').append('<div id="Map" style="height:300px; width:100%"></div>');
                $('#ajaxContent').append("<div id='divID'></div>");
                if (log === "su") {
                    $('#ajaxContent').append(createTableFromJSONmap(responseData, "messageReply"));
                } else {
                    $('#ajaxContent').append(createTableFromJSONmap(responseData, null));
                }
            }
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('GET', 'CertifiedDoctors');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function uncertifiedDoctorsGet() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            console.log(responseData);
            $('#ajaxContent').html("<h2>Uncertified Doctors:</h2>");
            $('#ajaxContent').append("<p>Press a doctor's table to certify</p>");
            $('#ajaxContent').append(createTablesFromJSON(responseData, "certifiedPut"));
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('GET', 'UncertifiedDoctors');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

//get all the users
function allUsersGet() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            const responseData = JSON.parse(xhr.responseText);
            $('#ajaxContent').html("<h2>All Users:</h2>");
            $('#ajaxContent').append("<p>Press a user's table to delete</p>");
            $('#ajaxContent').append(createTablesFromJSON(responseData, "showDelete"));
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('GET', 'AllUsers');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

//deletes a user
//mallon na metakinisw thn doDelete sto Data.java
function showDelete(name) {
    console.log(name);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //const responseData = JSON.parse(xhr.responseText);
            //console.log(responseData);
            $('#ajaxContent').html("Successful Delete.");
            //allUsersGet();
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('DELETE', 'AllUsers?name=' + name);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

//make a doctor certified
function certifiedPut(username) {
    console.log(username);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //const responseData = JSON.parse(xhr.responseText);
            //console.log(xhr.responseText);
            $('#ajaxContent').html("Successful Certification.");
            //allUsersGet();
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('PUT', 'UncertifiedDoctors?username=' + username);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

//loads randevou from
function creatRandevou() {
    var currentdate = new Date();
    var month = (currentdate.getMonth() + 1);
    var datee = currentdate.getDate();
    var hours = currentdate.getHours();
    if (currentdate.getMonth() + 1 < 10) {
        month = "0" + month;
    }
    if (currentdate.getDate() < 10) {
        datee = "0" + datee;
    }
    if (currentdate.getHours() < 10) {
        hours = "0" + hours;
    }
    $('#ajaxContent').html("");
    id = docID();
    $("#choices").load("RandevouForm.html");
    var min = currentdate.getFullYear() + "-" + month + "-" + datee;
    var input = document.getElementById("date");
    input.setAttribute("min", min);
}

//checks if randevou date time is in the past
function righttime() {
    var date = document.getElementById("date").value.toString() + " " + document.getElementById("appt").value.toString() + ":00";
    console.log(date);
    document.getElementById("date_time").value = date;
}

//creates randevou
function RandevouPost() {
    let myForm = document.getElementById('form_randevou');
    let formData = new FormData(myForm);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            console.log(responseData);
            $('#ajaxContent').html("Successfully created!<br>");
        } else if (xhr.status === 404) {
            $('#ajaxContent').append('Request failed. Returned status of ' + xhr.status + "<br>");
            $('#ajaxContent').append(xhr.responseText + "<br>");
        } else if (xhr.status !== 200) {
            $('#ajaxContent').append('Request failed. Returned status of ' + xhr.status + "<br>");
            $('#ajaxContent').append("<p style='color:red'>" + xhr.responseText + "</p>");
        }
    };
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    data["status"] = "free";
    data["user_id"] = 0;
    data["user_info"] = null;
    data["doctor_id"] = id;
    for (const x in data) {
        var category = x;
        var value = data[x];
        //console.log(category+ " " +value);
    }
    xhr.open('POST', 'Randevou');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}

//GET Data.java
//gets doctors ID
function docID() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //console.log(xhr.responseText);
            const responseData = JSON.parse(xhr.responseText);
            //$('#ajaxContent').append(createTableFromJSON(responseData));
            for (const x in responseData) {
                if (x === "doctor_id") {
                    console.log("doctor_id= " + responseData[x]);
                    id = responseData[x];
                }
            }
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('GET', 'Data');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function RandevouGet(day, p, action) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            const responseData = JSON.parse(xhr.responseText);
            $('#ajaxContent').html("<h2>Your Appointments</h2>");
            if (day === '0') {
                console.log(day);
                $('#ajaxContent').append("<p>Press Apointment to modify status.</p>");
                $('#ajaxContent').append(createTablesFromJSON(responseData, action));
            } else {
                $('#ajaxContent').append(createTablesFromJSON(responseData, null));
                console.log(p);
                if (p === "0") {
                    console.log(day);
                    $("#ajaxContent").append("<button onclick='RandevouGet(" + day + "," + "1" + ",\"modifyAppointment\")'  class='button'>Create PDF of the Appointments.</button><br>");
                }
            }
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    console.log(p);
    if (p === 1) {
        xhr.open('GET', 'Randevou?day=' + date + '&p=' + p);
    } else {
        xhr.open('GET', 'Randevou?day=' + day + '&p=' + p);
    }
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function modifyAppointment(r_id) {
    if (log === "d") {
        $("#ajaxContent").html("<button onclick='RandevouPut(\"done\"," + r_id + ")'  class='button'>Change status to Done Appointment</button><br>");
    } else {
        $("#ajaxContent").html("");
    }
    $("#ajaxContent").append("<button onclick='RandevouPut(\"cancelled\"," + r_id + ")'  class='button'>Cancel Appointment</button><br>");
}

//contains unimplemented function BloodtestGet()
function RandevouPut(newstatus, r_id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            
            if (newstatus === "done") {
                $('#ajaxContent').html("<p>Success!</p>");
                var amka = xhr.responseText;
                console.log("amka=" + xhr.responseText);
                if (log === "d") {
                    seeChoisesForPatient(amka);
                }
            }else{
                console.log(xhr.responseText);
                $('#ajaxContent').html("<p>" + xhr.responseText + "</p>");
            }
        } else if (xhr.status === 403) {
            $('#ajaxContent').html("<p style='color:red'>" + xhr.responseText + "</p>");
        } else if (xhr.status === 402) {
            var amka = xhr.responseText;
            console.log("amka=" + xhr.responseText);
            //$('#ajaxContent').html("<p> You can't change the status, but you can see the user's bloodtests.</p>");
            //$("#ajaxContent").append("<button onclick='BloodtestGet()'  class='button'>See blood tests (not ready yet)</button><br>");
            if (log === "d") {
                seeChoisesForPatient(amka);
            }
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    if (newstatus === "selected") {
        setTimeout(getNotificationforAppointment, 10000);
        let myForm = document.getElementById('form_ap');
        let formData = new FormData(myForm);
        const data = {};
        formData.forEach((value, key) => (data[key] = value));
        console.log('mphke sthn selected');
        xhr.open('PUT', 'Randevou?newstatus=' + newstatus + '&r_id=' + r_id + '&user_info=' + data["user_info"]);
    } else {
        xhr.open('PUT', 'Randevou?newstatus=' + newstatus + '&r_id=' + r_id);
    }
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function appointmentsday() {
    $('#ajaxContent').html("<h3>Choose the day that you want to see</h3>");
    $('#ajaxContent').append('<input type="date" id="date" name="date" onchange="day()"/><br>');
    //$('#ajaxContent').html('<input type="date" id="date" name="date"/><br>');
}

function day() {
    date = document.getElementById("date").value.toString();
    console.log(date);
    localStorage.setItem("date", date);
    RandevouGet(date, "0", "modifyAppointment");
}

//gets users that had appointemts with the logged doctor.
function patientsGet() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            const responseData = JSON.parse(xhr.responseText);
            $('#ajaxContent').html("<h2> Your Patients:</h2>");
            $('#ajaxContent').append("<p>Press patient to see more.</p>");
            $('#ajaxContent').append(createTablesFromJSON(responseData, "seeChoisesForPatient"));
        } else if (xhr.status === 403) {
            $('#ajaxContent').html("<p style='color:red'> You don't have patients yet!</p>");
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('GET', 'Patients');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function treatmentform(bloodtest_idtmp) {
    $("#ajaxContent").load("treatmentform.html");
    docID();
    bloodtest_id = bloodtest_idtmp;
    userFromBloodtestIDGet(bloodtest_id);

}

//??
function treatmentsPost() {
    let myForm = document.getElementById('form_treat');
    let formData = new FormData(myForm);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            $('#ajaxContent').html("<p style='color:green'> Success!</p>");
        } else if (xhr.status === 403) {
            $('#ajaxContent').append("<di> That bloodtest already has a treatment!</p>");
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    data["bloodtest_id"] = bloodtest_id;
    data["doctor_id"] = id;
    data["user_id"] = user_id;
    for (const x in data) {
        var category = x;
        var value = data[x];
        console.log(category + "= " + value);
    }
    xhr.open('POST', 'Treatments');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}

function messegesGet() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            const responseData = JSON.parse(xhr.responseText);
            $('#ajaxContent').html("<h2> Your Messeges:</h2>");
            $('#ajaxContent').append("<p>Press messege to reply.</p>");
            $('#ajaxContent').append(createTablesFromJSON(responseData, "messageReply"));
        } else if (xhr.status === 403) {
            $('#ajaxContent').html("<p style='color:red'> You don't have any messeges!</p>");
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('GET', 'Messages');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function messageReply(r_id) {
    console.log(JSON.stringify(r_id));
    $('#ajaxContent').html("<form id='form_reply' name='form_reply' onsubmit='dataGet2(" + r_id + ");return false;'><input type='text' id='message' name='message' placeholder='Insert message..' required><input type='submit' class='button' value='Send'></form>");
}

function messegesPost(r_id, s_id, date_time) {
    let myForm = document.getElementById('form_reply');
    let formData = new FormData(myForm);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            $('#ajaxContent').html("<p style='color:green'> Success, your message was send.</p>");
        } else if (xhr.status === 403) {
            $('#ajaxContent').html("<p style='color:red'>" + xhr.responseText + "</p>");
        } else if (xhr.status !== 200) {
            $('#ajaxContent').html('Request failed. Returned status of ' + xhr.status);
        }
    };
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    if (log === "d") {
        data["sender"] = "doctor";
        data["doctor_id"] = s_id;
        data["user_id"] = r_id;

    } else {
        data["sender"] = "user";
        data["user_id"] = s_id;
        data["doctor_id"] = r_id;
    }
    //data["blood_donation"] = blood_donation;
    //data["bloodtype"] = bloodtype;
    data["date_time"] = date_time;
    console.log(data);
    for (const x in data) {
        var category = x;
        var value = data[x];
        console.log(category + " " + value);
    }
    xhr.open('POST', 'Messages');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}

function dataGet2(r_id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            const responseData = JSON.parse(xhr.responseText);
            console.log(responseData);
            if (log === "d") {
                var s_id = responseData.doctor_id;
            } else {
                var s_id = responseData.user_id;
                var blood_donation = responseData.blooddonor;
                var bloodtype = responseData.bloodtype;
            }
            console.log(r_id);
            //console.log(s_id);
            console.log(blood_donation);
            console.log(bloodtype);
            var currentdate = new Date();
            var month = (currentdate.getMonth() + 1);
            var datee = currentdate.getDate();
            var hours = currentdate.getHours();
            var mins = currentdate.getMinutes()
            currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
            if (currentdate.getMonth() + 1 < 10) {
                month = "0" + month;
            }
            if (currentdate.getDate() < 10) {
                datee = "0" + datee;
            }
            if (currentdate.getHours() < 10) {
                hours = "0" + hours;
            }
            if (currentdate.getMinutes() < 10) {
                mins = "0" + mins;
            }
            var date_time = currentdate.getFullYear() + "-" + month + "-" + datee + " " + hours + ":" + mins + ":00";
            messegesPost(r_id, s_id, date_time);
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('GET', 'Data');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function userRandevouzGet(doc_id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            const responseData = JSON.parse(xhr.responseText);
            $('#ajaxContent').html("<h2> All the Available Appointments:</h2>");
            $('#ajaxContent').append("<p>Press one to book.</p>");
            $('#ajaxContent').append(createTablesFromJSON(responseData, "userAppointment"));
        } else if (xhr.status === 403) {
            $('#ajaxContent').html("<p style='color:red'> There are no available appointments for now!<br></p>");
            $('#ajaxContent').append("<p style='color:red'> Check again later<br></p>");
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('GET', 'userRandevouz?doctor_id=' + doc_id);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function userAppointment(r_id) {
    $('#ajaxContent').html("<form id='form_ap' name='form_ap' onsubmit='RandevouPut(\"selected\"," + r_id + ");return false;'><input type='text' id='user_info' name='user_info' placeholder='Insert some info..'><input type='submit' class='button' value='Send'></form>");
    //RandevouPut("selected",r_id);
}


function userFromBloodtestIDGet(bloodtest_id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //console.log(xhr.responseText);
            const responseData = JSON.parse(xhr.responseText);
            user_id = responseData.user_id;
            console.log("user_id=" + user_id);
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('GET', 'userfromBloodtestID?bloodtest_id=' + bloodtest_id);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function getNotificationforAppointment() {
    console.log("mphke");
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            var size = Object.keys(data).length;
            for (let i = 0; i < size; i++) {
                for (const x in data[i]) {
                    var category = x;
                    if (category === "date_time") {
                        var value = data[i][x];
                        var date = Date.parse(value);
                        var currentTime = new Date().getTime();
                        if (date > currentTime) {
                            var difference = date - currentTime;
                            var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
                            difference -= daysDifference * 1000 * 60 * 60 * 24
                            var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
                            console.log("dif=" + hoursDifference);
                            if (hoursDifference == 4 && data[i].status === "selected") {
                                alert('You have an appointment in 4 hours!');
                            } else {
                                setTimeout(getNotificationforAppointment, 10000);
                            }
                        }
                        //date = date.getTime();
                        //console.log(Date.parse(value).getTime());
                    }
                }
            }
        } else if (xhr.status === 404) {
            console.log("den exei rantevou");
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('GET', 'Randevou');
    xhr.send();
}

function BloodtestGet(amka){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            console.log("eirini"+xhr.responseText);
            $('#ajaxContent').html("<h2>Patient's Bloodtests:</h2> <p>Press to see (add) treatment.<br></p>");
            //$('#ajaxContent').append(createTablesFromJSON(responseData,"treatmentform"));
            $('#ajaxContent').append(createTablesFromJSON(responseData,"TreatmentsGet"));
            
        } else if (xhr.status === 403) {
            $('#ajaxContent').html("<p>Patient has no blood tests.<br></p>");
        }else if (xhr.status !== 200) {
            $('#ajaxContent').append('Request failed. Returned status of ' + xhr.status + "<br>");
            //const responseData = JSON.parse(xhr.responseText);
            //for (const x in responseData) {
            //$('#ajaxContent').append("<p style='color:red'>" + x + "=" + responseData[x] + "</p>");
            //}
        }

    };
    while(amka.toString().length<11){
        amka = "0"+amka;
    }
    xhr.open('GET', 'BloodTests?amka='+amka);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}


function TreatmentsGet(bloodtest_id){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            console.log(xhr.responseText);
            $('#ajaxContent').append("<p>Treatment:<br>(for the above bloodtest)</p>");
            $('#ajaxContent').append(createTableFromJSON(responseData));
        } else if (xhr.status === 403) {
            if(log==="su"){
                $('#ajaxContent').append("<p>There is no treatment for this blood test with id = "+bloodtest_id+".<br></p>");
            }else{
                treatmentform(bloodtest_id);
            }
        }else if (xhr.status !== 200) {
            $('#ajaxContent').append('Request failed. Returned status of ' + xhr.status + "<br>");
        }

    };
    xhr.open('GET', 'Treatments?bloodtest_id='+bloodtest_id);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}