/*
Javascript for the swipe page.
*/

var foundRest;
var foundRestIndex = 0;

//instantiates new google map with current location 
function initMap(){
    let location = new Object();
    navigator.geolocation.getCurrentPosition(function(pos){
        location.lat = pos.coords.latitude;
        location.long = pos.coords.longitude;
        getRestaurants(location);
    });
}

// gets restaurants based on parameters and stores them in an array
function getRestaurants(location){
    var distanceFromCurrent = Number(window.localStorage.getItem("distance"));
    var thousand = 1000;
    var currentLocation = new google.maps.LatLng(location.lat, location.long);
    map = new google.maps.Map(document.getElementById('map'), {center: currentLocation, zoom: 15});
    console.log(distanceFromCurrent);
    var request = {
        location: currentLocation,
        radius: (distanceFromCurrent * thousand).toString(),
        rating: (window.localStorage.getItem("rating").toString()),
        price_level: (window.localStorage.getItem("budget").toString()),
        type: ['restaurant']
    };
    console.log("results");
    console.log(location.lat + " " +location.long)
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}  

//callback function
function callback(results, status){
    console.log(status);
    if (status == google.maps.places.PlacesServiceStatus.OK){
        foundRest = results;
        console.log(foundRest);
        for (var i = 0; i < results.length; i++){
            var place = results[i];
            let price = createPrice(place.price_level);
        }
    }
}

function thing() {
    console.log(foundRest);
}

//turns price_level from number to $-$$$$ value
function createPrice(level){
    if (level !="" && level !=null){
        let out = "";
        for (var x = 0; x < level; x++){
            out += "$";
        }
        return out;
    } else {
        return "?";
    }
} 


// inserts name of user at top of page ugly as heck
function insertName() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid);
      currentUser.get().then((userDoc) => {
        var user_Name = userDoc.data().name;
        $("#name-goes-here").text(user_Name);
      });
    } else {
      // No user is signed in.
    }
  });
}

window.onload = function () {
  insertName();
};

function toParam() {
  window.location.replace("main.html");
}

function upCounter() {
  var element = document.getElementById("checkBtn");
  var value = element.innerHTML;
  ++value;
  console.log(value);
  document.getElementById("checkBtn").innerHTML = value;
}

//find PlaceIDs that meet the minimum parameter requirements(if too difficult, must be exclusively in the chosen parameter)
function findPlaceID() {}

function setFavourite() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var userField = db.collection("users").doc(user.uid);
      return userField
        .update({
          favourites: firebase.firestore.FieldValue.arrayUnion(
            document.getElementById("restCard").getAttribute("value")
          ),
        })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
      console.log("Document written with ID: ", docRef.id);
    } else {
      console.log("no user logged in");
    }
  });
}

function upIndex(){
    foundRestIndex++;
}


function findPlaceByID(id, callback) {
    var request = {
        placeId: id,
        fields: ['name', 'rating', 'formatted_phone_number', 'adr_address', 'photo', 'place_id']
    };

    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, callback);
}

function checkResultsIndex(){

}

// function to fill card with details of results array one position at a time
function showRest() {
        console.log("showRest works");
        var card = document.getElementsByClassName("col");
        var title = place.name;
        var details = place.formatted_phone_number;
        var addr = place.adr_address;
        newcard.id = title;

        //update title card text and images with details from restaurant at index
        card.querySelector('.card-title').innerHTML = title;
        card.querySelector('.card-text').innerHTML = details;
        card.querySelector('.card-textaddr').innerHTML = addr;
        card.querySelector(".card-img-top").src = place.photos[0].getUrl();
}