
/*
Changes the diplayed heart button on a card. If the heart button is
an outline, switches it to a filled heart. If its a filled heart
changes it back to an outlined heart.

Input: id - variable that is the id of the element clicked to trigger
        the function
        
Output none
*/

function imageClick(id){
    var image = document.getElementById(id);
    heartFilled = "/images/heartFilled.png";
    heartOutline = "/images/heartOutline.png";
    if(image.src.indexOf(heartFilled) > -1){
        image.setAttribute("src" , heartOutline);
    }else{
        image.setAttribute("src" , heartFilled);
    }
}

/*
Gets name name stored in name field from user

input: none
output:string of Name or undefined
*/
function getName(){
    firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        //gets user id
        const uid = user.uid;

        /*checks the db collection users, and gets the doc which
         *contains all the information stored of the current user
         */
        db.collection("users").doc(uid).get().then( function (doc){
            document.getElementById("name").innerHTML = doc.data().name;
        });
    } else {
        console.log("no user logged in");
    }
    });
}

/*
Finds the name, rating, phone number, address and photo of a place. The place
is searched for using the given id and the getDetails function from the 
google.maps.places library. Upon recieving the place information, calls the 
callback function. 
 
Input: id, string thats the place_id of a restaurant to be searched for
Input: callback, Callback function to be used when you get the id results.
Output: None
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
Removes favourite from the user's favourite collection if it is in the collection.
Adds the favourite to the user's favourite collection if  it is not in the collection.

Input: id - place_id of the restaurant to be removed from the collection
Output: None
*/
function toggleFavourite(id) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            
            //gets the user's information from firebase
            var userField = db.collection("users").doc(user.uid);
            userField.get().then((doc) => {
                
                //Gets the favourite array from userdata 
                var favArray = doc.data().favourite;

                //checks if the placeId is in the favourite array
                place_idIndex = favArray.indexOf(id);

                //removes the placeId if it is in the list, adds it if its missing
                if (place_idIndex > -1) {
                    favArray.splice(place_idIndex, 1);
                } else {
                    favArray.push(id);
                }

                //update the favourite collection with the new array
                userField.update({
                    favourite: favArray
                })
                    .then(() => {
                        console.log("Document successfully updated!");
                    })
                    .catch((error) => {
                        console.error("Error updating document: ", error);
                    });
            })
        } else {
            console.log("no user logged in");
        }
    });
}