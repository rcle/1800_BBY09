
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