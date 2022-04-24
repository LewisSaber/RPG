let currentmap
let loading = 0
let isMapModeOn = 1
function LOADING(){
   loadIDS()
   loadmap()
   mapX = 0
   mapY = 0

   currentmap = maps[mapY][mapX]
   if(!isMapModeOn)
   {
   generateMap( currentmap)
   
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


