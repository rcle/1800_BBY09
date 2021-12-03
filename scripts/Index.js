/* boolean that represents the state of the screen
    true: screen is small (less than 1000px)
    false: screen is large
*/
var smallScreen;

/*
triggers the proper functions to change the location of the firebase
login ui depending on screen size.

Input: none
Output: none
*/
function moveLogin(){
    setScreenSize();
    changeLogin();
}

/*
sets the smallScreen flag depending on the current screensize.
A screen is considered small if it less than 1000 pixels wide.

Input: none
Output: none
*/
function setScreenSize() {
    if( $(window).width() < 1000){
        smallScreen = true;
    } else{
        smallScreen = false;
    }
}

/*
changes the location of the firebase login ui. Makes it a modal if it is 
in the mobile version, and displays it on the right on desktop view.

Input: none
Output: none
*/
function changeLogin(){
    login = document.getElementById("firebaseui-auth-container");
    if(smallScreen){
        document.getElementsByClassName("modal-body")[0].appendChild(login);
    } else{
        document.getElementById("hiddenLogin").appendChild(login);
    }
}