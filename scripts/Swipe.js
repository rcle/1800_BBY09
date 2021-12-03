/* 
Array that contains the restaurants thats been found from the getRestaurants
function. The items in the array are place_id's gotten from googlemapsAPI
*/
var foundRest= [];

/* 
Index of the foundRest array. Used in functions to access a specific
place_id in the foundRest array. 
*/
var foundRestIndex = 0;

/*
Accepted Restaurant array. Contains all of the approved restaurants of
a user from a single swipe session. 
*/
var acceptedRest = [];

/*
Initializes an object so the googlemapsAPI functions can be used. Gets the
users current position in latitude and longitude as well. Calls getRestaurants
when after position is found and object is created.

Input: none
Output: none
*/
function initMap(){
    let location = new Object();
    navigator.geolocation.getCurrentPosition(function(pos){
        location.lat = pos.coords.latitude;
        location.long = pos.coords.longitude;
        getRestaurants(location);
    });
}

/*
Gets the nearby restauarants information using the googlemapsAPI nearby
search method. Uses a request which contains
  location: users location in lat + long
  radius: radius in meters around the location
  rating: restaurant rating according to google
  price_level: price level for the restaurant (cheap to expesnive).
  type: set to restaurants

Input: location - object that contains a users location 
Output: none
*/
function getRestaurants(location){
    var distanceFromCurrent = Number(window.localStorage.getItem("distance"));
    var thousand = 1000;
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
    service.nearbySearch(request, addToFoundRest);
}  

/*
Add the restaurants found in the nearby search to the foundRest array

Input: results - array containing search results from getRestaurants
       status - status of the search (successful or not)
Output: none
*/
function addToFoundRest(results, status){
    if (status == google.maps.places.PlacesServiceStatus.OK){
        results.forEach(element => {
          if( element.rating >= window.localStorage.getItem("rating")){
            foundRest.push(element.place_id);
          }
        });
    }
    findCardInfo();
}


/*
Turns the price level from local storage to a range from 

$ - $$$$

which is used in getRestaurants for price_level in the request

Input: level - price level as shown in local storage
Output: none
*/
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

/*
Navigates to the main.html (parameter) page

Input: none
Output: none
*/
function toParam() {
  window.location.replace("main.html");
}

/*
Sets the value of the max approved restaurants using the value from
localstorage.

Input: none
Output: none
*/
function setToApprove(){
  document.getElementById("toApprove").innerHTML = window.localStorage.getItem("maxAppr");
}


/*
Increments the value of the counter on the swipe page if user clicks
like a restaurant. If they reach the max amount of restaurant selects 
a restaurant. Otherwise add it to the accepted restaurants array

Input: none
Output: none
*/
function upCounter() {

  var element = document.getElementById("liked");
  var value = element.innerHTML;
  var maxApprove = document.getElementById("toApprove").innerHTML;
  var restaurantId = document.getElementById("restCard").getAttribute("value");
  
  ++value;
  document.getElementById("liked").innerHTML = value;

  /*
 Randomizes the restaurants in the accepted restaurants array if
 the number if liked restuarants is the same as the limit for max approved
 restaurants or if the foundRest array has no more items to be looked at. Otherwise
 add the restaurant to the array.

 Input: none
 Output: none
 */
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


/*
Selects a random restaurant (place_id) from the array of accepted
restaurants from the current session.
 
Input: none
Output: none
*/
function randomizeRestaurant(){
  var restaurantId = acceptedRest[Math.floor(Math.random() * acceptedRest.length)];
  foundRest = [restaurantId]
  foundRestIndex = 0;
  
  findCardInfo();
  clearEverything("Found a Restaurant to you");
}

/*
Clears all of the uncessary information on the swiping page and displays only
the restaurant card, given text, navbar and the parameter selection button.
 
Input: text - text to be displayed when everything is cleared
Output: none
*/
function clearEverything(text){
  document.getElementsByClassName("countContainer")[0].style.display = "none";
  document.getElementsByClassName("panel-body")[0].style.display = "none";
  document.getElementById("swiping").innerHTML = text;
}

/*
Finds the restaurant info or if there are no more restaurants left, to like
randomize them. If there were no restaurants were liked, update the card

Input: none
Output: none
*/
function findCardInfo(){
  if(foundRestIndex < foundRest.length){
    findPlaceByID(foundRest[foundRestIndex] , updateCard);
  } else if(foundRestIndex == foundRest.length && acceptedRest.length > 0){
    randomizeRestaurant();
  }else {
    updateCard();
  }
}

/*
Updates the card on the swiping page, uses the passed in place for details
on the restaurant page.

Input: place - Place object that contains restaurant information
 Output: none
*/
function updateCard(place) {
        var container  =  document.getElementById("theRestCards");
        container.style.display = "grid";
        var card = document.getElementsByClassName("col")[0];

        if(foundRestIndex < foundRest.length){
          card.querySelector('.card-title').innerHTML = place.name;
          card.querySelector('.card-text').innerHTML = place.formatted_phone_number;
          card.querySelector('.card-textaddr').innerHTML = place.adr_address;
          card.querySelector('.card-rating').innerHTML = "rating: " + place.rating;
          card.querySelector('.favButton').setAttribute("src" ,"../images/heartOutline.png" );
          card.querySelector(".card-title").setAttribute("value" , place.place_id);
          
          if(place.photos != undefined){
            card.querySelector(".card-img-top").src = place.photos[0].getUrl();
          } else {
            card.querySelector(".card-img-top").src = "../images/FoodDelivery.jpg";
          }

          card.querySelector('.btn').setAttribute("id", place.place_id);
          foundRestIndex++;
        } else{
            card.querySelector('.card-title').innerHTML = "no restaurant found";
            card.querySelector('.card-text').innerHTML = "Try searching using different parameters";
            card.querySelector('.card-textaddr').innerHTML = "";
            card.querySelector('.card-rating').innerHTML = "";
            card.querySelector('.favButton').setAttribute("src" ,"../images/heartOutline.png" );
            card.querySelector(".card-img-top").src = "../images/noParamsFound.jpg";
            clearEverything("Sorry there are no more restaurants");
        }
}

