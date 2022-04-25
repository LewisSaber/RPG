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

    window.addEventListener("mousedown",leftclick)
    buildHotbar();
    buildInventory();
     loadInventory();
     window.onbeforeunload = function (evt) {
        saveInventory()
      };



    

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
let oldhotbarslot

function downButtonHandler(evt){
    if(evt.key == "e" && !keys[4] ) openInventory()
       
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
        case "e":
            keys[4] = 1

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
if(/\b[1-9]/.test(evt.key)){
    let key = +evt.key    
    key--
 
    oldhotbarslot.style.borderWidth = "0.2vh"
    oldhotbarslot.style.margin = "0.5vh"
    e.inventory["slot" + key].style.borderWidth = "0.6vh"
    e.inventory["slot" + key].style.margin = "0.1vh"
    oldhotbarslot = e.inventory["slot" + key]

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
        case "e":
            keys[4] = 0
        break;
         
    }
 
    
}
function random(r){
    r = Math.round(r)
      return Math.floor(Math.random()*r) == 0
  }

function switchmode(){
    if(isMapModeOn)
    {
    maps[mapY][mapX] = generatedMap; savemap()
}
    isMapModeOn = !isMapModeOn
    localStorage.setItem("RPGeditmode", JSON.stringify(isMapModeOn));
    window.location.reload();
}

function loadMode(){
    isMapModeOn = JSON.parse(localStorage.getItem("RPGeditmode"));
    if(isMapModeOn == null)
    isMapModeOn = 1
}
function buildHotbar(){
    e.hotbar.style.display = "block"
    e.hotbar.innerText = ""
for(let i = 0 ; i < 9;i++){

   let tag = document.createElement("div")
   let amount = document.createElement("div")
   amount.setAttribute("class","itemamount")
   e.inventory["slot" + i + "amount"] = amount
  
   tag.setAttribute("class","guiSlot")
 e.inventory["slot" +i] = tag
 oldhotbarslot = tag
   tag.appendChild(amount)
  e.hotbar.appendChild(tag)
  
}
}
function buildInventory(){
    for(let i =  steve.inventorySlots-1 ; i > 8;i--){
    let tag = document.createElement("div")
    let amount = document.createElement("div")
    amount.setAttribute("class","itemamount")
    e.inventory["slot" + i + "amount"] = amount
   
    tag.setAttribute("class","guiSlot")
  e.inventory["slot" +i] = tag

    tag.appendChild(amount)
   e.inventory.appendChild(tag)

}
}
isInventoryopen = false
function openInventory(){
    if(!isInventoryopen){
        e.inventory.style.display = "block"
        e.hotbar.style.bottom = "41.5vh"
        for(let i = 0; i < steve.inventorySlots; i++){
            
            e.inventory["slot" +i].className = ("guiSlot "+ steve.inventory["slot" + i].name)
            e.inventory["slot" +i + "amount"].innerText = steve.inventory["slot" + i].amount > 0 ? steve.inventory["slot" + i].amount : ""
        }
       
    }
    else{
        e.inventory.style.display = "none"
        e.hotbar.style.bottom = "1vh"
    }

    
    isInventoryopen = !isInventoryopen
}
let currentblock
function leftclick(evt){
    let clickX = (evt.x / percent / 5) >> 0;
    let clickY = (evt.y / percent / 5) >> 0;
    if (clickX < mapW && clickY < mapH) {

    if(classes[currentmap[clickY][clickX][currentmap[clickY][clickX][0] =="air" ? 1 : 0]] != undefined){
        console.log(currentmap[clickY][clickX][0] =="air" ? 1 : 0)
    currentblock = new classes[currentmap[clickY][clickX][currentmap[clickY][clickX][0] =="air" ? 1 : 0]]()
    steve.addToInventory(currentblock)
    }

}
    
}
let blockInCursor = "none"
function LclickOnslot(id,type = "inventory")
{
    if(blockInCursor == "none"){
        switch(type ) {}  }


}
function saveInventory(){
    localStorage.setItem("RPGinventory", JSON.stringify(steve.inventory));
}
function loadInventory(){

    let inv = JSON.parse(localStorage.getItem("RPGinventory"));
    if(inv != null)
    {
    let i = 0;
    for (const key in inv) {
    
       steve.inventory[key] = new classes[inv[key].name]
        i++
        for(const key2 in inv[key]){
  //console.log(steve.inventory[key][key2])
            steve.inventory[key][key2] = inv[key][key2]
        }

    }
}
}
