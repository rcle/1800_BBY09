/*
Gets the favourites array stored in the favourite field in the user collection. 
The favourite array stores the place_id of restaurants obtained from googlemapsapi.
Passes each id in the array to the findPlaceByID function if the user is logged in.
*/
function getFavourite() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const uid = user.uid;
            db.collection("users").doc(uid).get().then(function (doc) {
                doc.data().favourite.forEach(place_id => findPlaceByID(place_id, addFavourite))
            });

        } else {
            console.log("no user logged in");
        }
    });
}

function searchCard() {
    var input = document.getElementById("favSearch");
    var filter = input.value.toUpperCase();
    var favouriteDiv = document.getElementById("favourite");
    var favouritesChildren = favouriteDiv.childNodes;
    var restaurantInfo;


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
finds the name, rating, phone number, address and photo of a place. The place
is searched for using the given id and the getDetails function from the 
google.maps.places library. Upon recieving the place information, calls the 
addFavourite function. 
 
input: id, string thats the place_id of a restaurant to be searched for
input: callback, Callback function to be used when you get the id results.
*/
function findPlaceByID(id, callback) {
    var request = {
        placeId: id,
        fields: ['name', 'rating', 'formatted_phone_number', 'adr_address', 'photo', 'place_id']
    };

    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, callback);
}

/*
Adds the restaurants passed to the function to the favourite page by updating
the DOM and displaying it as a card.
*/
function addFavourite(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var card = document.getElementsByClassName("col");
        var newcard;
        newcard = card[0].cloneNode(true);
        var title = place.name;
        var details = place.formatted_phone_number;
        var addr = place.adr_address;
        newcard.id = title;

        //update title and text and image
        newcard.querySelector('.card-title').innerHTML = title;
        newcard.querySelector('.card-text').innerHTML = details;
        newcard.querySelector('.card-textaddr').innerHTML = addr;
        newcard.querySelector(".card-img-top").src = place.photos[0].getUrl();

        //give unique ids to all elements for future use
        newcard.querySelector('.card-title').setAttribute("id", "ctitle");
        newcard.querySelector('.card-text').setAttribute("id", "ctext");
        newcard.querySelector('.card-textaddr').setAttribute("id", "ctext");
        newcard.querySelector('.btn').setAttribute("id", place.place_id);
        newcard.querySelector('.favButton').setAttribute("id", "favButton" + title);
        document.getElementById("favourite").appendChild(newcard);
    }
}

function imageClick(id){
    var image = document.getElementById(id);
    heartFilled = "images/heartFilled.png";
    heartOutline = "images/heartoutline.png";
    if(image.src.indexOf(heartFilled) > -1){
        image.setAttribute("src" , heartOutline);
    }else{
        image.setAttribute("src" , heartFilled);
    }
}

/*
Removes favourite from the user's favourite collection if it is in the collection.
Adds the favourite to the user's favourite collection if  it is not in the collection.
*/
function toggleFavourite(id) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var userField = db.collection("users").doc(user.uid);
            userField.get().then((doc) => {
                var favArray = doc.data().favourite;
                place_idIndex = favArray.indexOf(id);

                if (place_idIndex > -1) {
                    favArray.splice(place_idIndex, 1);
                } else {
                    favArray.push(id);
                }

                return userField.update({
                    favourite: favArray
                })
                    .then(() => {
                        console.log("Document successfully updated!");
                    })
                    .catch((error) => {
                        // The document probably doesn't exist.
                        console.error("Error updating document: ", error);
                    });
            })
        } else {
            console.log("no user logged in");
        }
    });
}


window.onload = function () {
    getFavourite();
};