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
function to get selected radio button value for budget.
getBudgetValue sets an array of elements named btnradio to budgetSelection.
uses a loop to find which radio button is checked then stores that value in local storage
upon see restaurant button being clicked.
*/
function getBudgetValue() {
    var budgetSelection = document.getElementsByName('BudgetButton');
    console.log(budgetSelection);
    for (i = 0; i < budgetSelection.length; i++) {
        if (budgetSelection[i].checked) {
            localStorage.setItem("budget", budgetSelection[i].getAttribute("value"));
            break;
        } else {
            console.log("loop works")
        }

    }
}

/*
function to get selected radio button value for rating.
same as getBudgetValue function. Wrote separately for now bc I'm scared it won't work.
*/

function getRatingValue() {
    var ratingSelection = document.getElementsByName('RatingButton');
    console.log(ratingSelection);
    for (i = 0; i < ratingSelection.length; i++) {
        if (ratingSelection[i].checked) {
            localStorage.setItem("rating", ratingSelection[i].getAttribute("value"));
            break;
        } else {
            console.log("loop works")
        }

    }
}


// function to get slider value

function getDistanceValue() {
    var distanceSelection = slider;
    localStorage.setItem("distance", distanceSelection.getAttribute("value"));
}

// function to get max approved restaurant value

function getMaxApprValue() {
    var maxApprValue = document.getElementById("apprNum");
    console.log(apprNum)
    localStorage.setItem("maxAppr", maxApprValue.getAttribute("value"));
}

// calls the above function to retrieve parameter values
function getValues() {
    getBudgetValue();
    getRatingValue();
    getDistanceValue();
    getMaxApprValue();
    return Promise.resolve("values set");
}



//fills parameter values with most recently set values. 
function loadLocal() {
    if (localStorage.length > 0) {
        var budgetToCheck = document.getElementsByName("BudgetButton");
        var budgetButtonIndex = window.localStorage.getItem("budget") - 1;
        budgetToCheck[budgetButtonIndex].checked = true;

        var ratingToCheck = document.getElementsByName("RatingButton");
        var ratingButtonIndex = window.localStorage.getItem("rating") - 1;
        ratingToCheck[ratingButtonIndex].checked = true;

        var slider = document.getElementById("sliderVal");
        var sliderClass = document.getElementsByClassName("slider");
        slider.innerHTML = localStorage.getItem("distance");
        sliderClass[0].setAttribute("value", localStorage.getItem("distance"));

        var maxApprCheck = document.getElementById("apprNum");
        maxApprCheck.setAttribute("value", localStorage.getItem("maxAppr"));
    }
}