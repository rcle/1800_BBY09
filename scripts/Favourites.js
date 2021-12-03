
/*
Gets the favourites array stored in the favourite field in the user collection. 
The favourite array stores the place_id of restaurants obtained from googlemapsapi.
Passes each id in the array to the findPlaceByID function if the user is logged in.

input: None
Output: None
*/

function getFavourite() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const uid = user.uid;
            
            //reads place_ID's from user's favourite field from firebase
            db.collection("users").doc(uid).get().then(function (doc) {
                doc.data().favourite.forEach(place_id => findPlaceByID(place_id, addFavourite))
            });

        } else {
            console.log("no user logged in");
        }
    });
}

/* 
Examines the text in the search bar and checks to see what restaurants on the favourites page 
contains the same information. Hides all cards that do not contain the text in the search bar. 

Input: None
Output: None
*/
function searchCard() {
    var input = document.getElementById("favSearch");
    var filter = input.value.toUpperCase();
    var favouritesChildren = document.getElementById("favourite").childNodes;
    var restaurantInfo;


    /*
    For each restuaraunt found in the page, combines the text found in them into one string
    retaurant info and check it against filter. Filter is the text found in the search bar.
    If restaurantinfo does not have the text found in filter, change display to none otherwise
    leave it alone
    */
    favouritesChildren.forEach((child) => {
        restaurantInfo = child.querySelector(".card-title").innerHTML.toUpperCase();
        restaurantInfo += child.querySelector(".card-text").innerHTML.toUpperCase();
        restaurantInfo += child.querySelector(".card-textaddr").innerHTML.toUpperCase();
        if (restaurantInfo.indexOf(filter) > -1) {
            child.style.display = "";
        } else {
            child.style.display = "none";
        }
    })

}

/*
Adds the restaurants passed to the function to the favourite page by updating
the DOM and displaying it as a card.

Input: place  - an object that contains all the necessary information users will
                need for a restaurant. place contains a
                    - name
                    - formatted_phone_number
                    - adr_address
                    - place_id
                    - photos

       status - Contains information on whether or not place contains valid information.
                Value is OK if the search was successful. 

Output: None
*/
function addFavourite(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var card = document.getElementsByClassName("col");
        var newcard = card[0].cloneNode(true);
        var title = place.name;
        var details = place.formatted_phone_number;
        var addr = place.adr_address;
        var rating = place.rating;
        newcard.id = title;

        //update title card text and images
        newcard.querySelector('.card-title').innerHTML = title;
        newcard.querySelector('.card-text').innerHTML = details;
        newcard.querySelector('.card-textaddr').innerHTML = addr;
        newcard.querySelector('.card-rating').innerHTML = "Rating: " + rating;

        if(place.photos != undefined){
            newcard.querySelector(".card-img-top").src = place.photos[0].getUrl();
        } else {
            newcard.querySelector(".card-img-top").src = "../images/FoodDelivery.jpg";
        }

        //give unique ids to all elements for future use
        newcard.querySelector('.card-title').setAttribute("id", "ctitle");
        newcard.querySelector('.card-text').setAttribute("id", "ctext");
        newcard.querySelector('.card-textaddr').setAttribute("id", "ctext");
        newcard.querySelector('.btn').setAttribute("id", place.place_id);
        newcard.querySelector('.favButton').setAttribute("id", "favButton" + title);
        document.getElementById("favourite").appendChild(newcard);
    }
}











