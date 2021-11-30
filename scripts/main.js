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
Gets favourite data from user, not implemented yet, but to be used in the
favourites page to populate the data within it

inpupt: none
output:array of favourites or undefined
*/
