/*
Javascript for the swipe page.
*/

var foundRest= [];
var foundRestIndex = 0;
var acceptedRest = [];

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
    var thousand = 250;
    var currentLocation = new google.maps.LatLng(location.lat, location.long);
    map = new google.maps.Map(document.getElementById('map'), {center: currentLocation, zoom: 15});
    var request = {
        location: currentLocation,
        radius: (distanceFromCurrent * thousand).toString(),
        rating: (window.localStorage.getItem("rating").toString()),
        price_level: (window.localStorage.getItem("budget").toString()),
        type: ['restaurant']
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}  

//callback function assigns results of place search to foundRest
function callback(results, status){
    if (status == google.maps.places.PlacesServiceStatus.OK){
        results.forEach(element => {
          if( element.rating >= window.localStorage.getItem("rating")){
            foundRest.push(element.place_id);
          }
        });
    }
    findCardInfo();
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

function toParam() {
  window.location.replace("main.html");
}

function setToApprove(){
  document.getElementById("toApprove").innerHTML = window.localStorage.getItem("maxAppr");
}

function upCounter() {

  var element = document.getElementById("liked");
  var value = element.innerHTML;
  var maxApprove = document.getElementById("toApprove").innerHTML;
  var restaurantId = document.getElementById("restCard").getAttribute("value");
  
  ++value;
  document.getElementById("liked").innerHTML = value;


  if(value == maxApprove || foundRestIndex == foundRest.length){
    randomizeRestaurant();
  }else if (value > maxApprove) {
    return 
  } 
  else{
    acceptedRest.push(restaurantId);
    findCardInfo();

  }
  
 

}

function randomizeRestaurant(){
  var restaurantId = acceptedRest[Math.floor(Math.random() * acceptedRest.length)];
  foundRest = [restaurantId]
  foundRestIndex = 0;
  
  findCardInfo();
  clearEverything("Found a Restaurant to you");
}

function clearEverything(text){
  document.getElementsByClassName("countContainer")[0].style.display = "none";
  document.getElementsByClassName("panel-body")[0].style.display = "none";
  document.getElementById("swiping").innerHTML = text;
}

function imageClick(id){
  var image = document.getElementById(id);
  heartFilled = "../images/heartFilled.png";
  heartOutline = "../images/heartOutline.png";
  if(image.src.indexOf(heartFilled) > -1){
      image.setAttribute("src" , heartOutline);
  }else{
      image.setAttribute("src" , heartFilled);
  }
}

function findPlaceByID(callback) {

    var request = {
        placeId: foundRest[foundRestIndex],
        fields: ['name', 'rating', 'formatted_phone_number', 'adr_address', 'photo', 'place_id']
    };

    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, callback);
}

function findCardInfo(){
  if(foundRestIndex < foundRest.length){
    findPlaceByID(updateCard);
  } else if(foundRestIndex == foundRest.length && acceptedRest.length > 0){
    randomizeRestaurant();
  }else {
    updateCard();
  }
}



// function to fill card with details of results array one position at a time
function updateCard(place) {
        container  =  document.getElementById("theRestCards");
        container.style.display = "grid";
        card = document.getElementsByClassName("col")[0];
        var title;
        var details;
        var addr;
        var rating;
        var value;
        console.log(foundRest);
        if(foundRestIndex < foundRest.length){
          title = place.name;
          details = place.formatted_phone_number;
          addr = place.adr_address;
          rating = "rating: " + place.rating;
          value = place.place_id;
          card.querySelector(".card-title").setAttribute("value" , value);
          if(place.photos != undefined){
            card.querySelector(".card-img-top").src = place.photos[0].getUrl();
          } else {
            card.querySelector(".card-img-top").src = "../images/FoodDelivery.jpg";
          }

          card.querySelector('.btn').setAttribute("id", place.place_id);
          foundRestIndex++;
        } else{
          title = "no restaurant found";
          details = "Try searching using different parameters";
          addr = "";
          rating = "";

          card.querySelector(".card-img-top").src = "../images/noParamsFound.jpg";
          clearEverything("Sorry there are no more restaurants");
        }

        card.querySelector('.card-title').innerHTML = title;
        card.querySelector('.card-text').innerHTML = details;
        card.querySelector('.card-textaddr').innerHTML = addr;
        card.querySelector('.card-rating').innerHTML = rating;
        card.querySelector('.favButton').setAttribute("src" ,"../images/heartOutline.png" );
        
}

//copied from favourites page
function imageClick(id){
  var image = document.getElementById(id);
  heartFilled = "/images/heartFilled.png";
  heartOutline = "/images/heartOutline.png";
  console.log(image.src);
  if(image.src.indexOf(heartFilled) > -1){
    image.setAttribute("src" , heartOutline);
  }else{
    image.setAttribute("src" , heartFilled);
  }
}

function setFavourite(id) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var userField = db.collection("users").doc(user.uid);
      return userField
        .update({
          favourite: firebase.firestore.FieldValue.arrayUnion(id),
        })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    } else {
      console.log("no user logged in");
    }
  });
}

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

function toParam() {
  window.location.replace("main.html");
}
