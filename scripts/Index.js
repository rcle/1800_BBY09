var smallScreen;

function moveLogin(){
    setScreenSize();
    changeLogin();
}

function setScreenSize() {
    if( $(window).width() < 1000){
        smallScreen = 1;
    } else{
        smallScreen = 0;
    }
}

function changeLogin(){
    login = document.getElementById("firebaseui-auth-container");
    if(smallScreen == 1){
        document.getElementsByClassName("modal-body")[0].appendChild(login);
    } else{
        document.getElementById("hiddenLogin").appendChild(login);
    }
}