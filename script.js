let currentmap
let loading = 0
let isMapModeOn 
function LOADING(){
   loadIDS()
   loadmap()
   mapX = 0
   mapY = 0
   loadMode()

  
   if(!isMapModeOn)
   {
   generateMap()
   
    steve = new player()
    window.addEventListener("keydown",downButtonHandler)
    window.addEventListener("keyup",upButtonHandler)
   }
   else
    mapMode()
   
    console.log("loaded")
    
}
function test(evt){
    console.log(evt)
}
let movetimer
let keys = [0,0,0,0]

function downButtonHandler(evt){
    
       
    switch(evt.key){
        case "w":
            keys[0] = 1
        break;
        case "a":
            keys[1] = 1
        break;
        case "s":
            keys[2] = 1
        break;
        case "d":
            keys[3] = 1
        break;

    }
    switch(evt.key){
        case "w":
        case "s":
        case "a":
        case "d":
            if(!movetimer){
                steve.move()
        movetimer = setInterval(function(){steve.move()},Math.floor(20/steve.getSpeed()))
            }
        break;
        
    
    
}
}
function upButtonHandler(evt){
  
    switch(evt.key){
        case "w":
            keys[0] = 0
        break;
        case "a":
            keys[1] = 0
        break;
        case "s":
            keys[2] = 0
        break;
        case "d":
            keys[3] = 0
        break;
         
    }
 
    
}
function random(r){
    r = Math.round(r)
      return Math.floor(Math.random()*r) == 0
  }

function switchmode(){
   
    isMapModeOn = !isMapModeOn
    localStorage.setItem("RPGeditmode", JSON.stringify(isMapModeOn));
    window.location.reload();
}

function loadMode(){
    isMapModeOn = JSON.parse(localStorage.getItem("RPGeditmode"));
    if(isMapModeOn == null)
    isMapModeOn = 1
}

