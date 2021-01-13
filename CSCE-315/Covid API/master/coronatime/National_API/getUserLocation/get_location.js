var x = document.getElementById("coordinate");
var y = document.getElementById("json");

function getLocation() { // returns lat and long
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " +position.coords.longitude;

  //Create query for the API.
  var latitude = "latitude=" + position.coords.latitude;
  var longitude = "&longitude=" + position.coords.longitude;
  var query = latitude + longitude + "&localityLanguage=en";

  const Http = new XMLHttpRequest();

  var bigdatacloud_api =
    "https://api.bigdatacloud.net/data/reverse-geocode-client?";

  bigdatacloud_api += query;

  Http.open("GET", bigdatacloud_api);
  Http.send();

  Http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      console.log(myObj);
      y.innerHTML += "Postcodes =" + myObj.postcode + "<br>City = " + myObj.locality + "<br>Country = " + myObj.countryName;
      
    }
  };
}