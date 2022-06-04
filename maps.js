let MAP = createEmptyMapVariable()

const biomes = ["plains","forest","cave"]

let allowedblocks = ["air","grassPlant","treeoak","empty","mobmobmob","dandelion","sugarcane"]
let mapW = 24;
let mapH = 16;

function generateEmptyMap() {
  let gm = [];
  for (let i = 0; i < mapH; i++) {
    gm[i] = new Array();
    for (let j = 0; j < mapW; j++) {
      gm[i][j] = new Array();
      gm[i][j].push("air");
      gm[i][j].push("air");
    }
  }
  return gm;
}

let selectedBlock = new classes.empty(0)
let selectedblockedit = "stone"
function loadselectedblockedits() {
  selectorblocks.forEach((x) => {
    let tag = document.createElement("button");

    tag.className = "blockselector " + ( x != "treeoak" ? x : x + "small")
    //  if(x.slice(0,9) == "mobmobmob")
    //  tag.setAttribute("onclick", "selectedblockedit='"+ x+ "'" );
    //  else
    if(x.includes("villager")){
      tag.setAttribute("onclick", "selectedblockedit='mobmobmob villager ' + prompt('name villager') ");
    }
    else
    tag.setAttribute("onclick", "selectedblockedit='" + x + "'");
    e.blocksSelector.appendChild(tag);
  });
}

let maphtml = [];
function generateMap() {
  clearMobs()
  let spawneriter = 0
  let map = MAP.mapLayout[mapY][mapX]
  currentmap =  MAP.mapLayout[mapY][mapX]
  currentmap.biome = MAP.biomes[mapY][mapX]
  currentmap.location = MAP.locations[mapY][mapX]
  e.map.innerText = "";
  for (let y = 0; y < mapH; y++) {
    maphtml[y] = new Array();
    for (let x = 0; x < mapW; x++) {
      maphtml[y][x] = new Array();
      for (let l = 0; l < 2; l++) {
        if (map[y][x][l] != "air") {
         // console.log(map[y][x][l])
          if(map[y][x][l].includes("mobmobmob"))
          {
           if(map[y][x][l].includes("villager") ){
            new classes.villager(x * 5,y*5,spawneriter, map[y][x][l].slice(19))
           }
     else
     new classes[map[y][x][l].slice(10)](x * 5,y*5,spawneriter)
        spawneriter++
       
          }
          else
          {
            let tag = document.createElement("div");
            if (l == 0) tag.className = "block "+ map[y][x][l];
            else tag.className = "blockfloor " +  map[y][x][l]
              tag.setAttribute("onmousedown","breakblock(this)")
              tag.setAttribute("oncontextmenu","steve.itemInHand.useAbility(); return false")
              tag.setAttribute("onmouseleave","stopBreakingOnMouseLeave()")
              tag.setAttribute("onmouseenter","startBreakingOnMouseEnter(this)")
            tag.style.top = y * 5 + "vh";
            tag.style.left = x * 5 + "vh";
             maphtml[y][x][l] = tag
            e.map.appendChild(tag);
          }
        
        }
      }
    }
  }
  changeLocation()
}
function generateDebugMap() {
  maphtml  =[]
  e.map.innerText = "";
  for (let y = 0; y < mapH; y++) {
    maphtml[y] = new Array();
    for (let x = 0; x < mapW; x++) {
      maphtml[y][x] = new Array();
      for (let l = 0; l < 2; l++) {
        let tag = document.createElement("div");
        if (l == 0) tag.classList.add("block", "air");
        else tag.classList.add("blockfloor");

        tag.style.top = y * 5 + "vh";
        tag.style.left = x * 5 + "vh";
        maphtml[y][x][l] = tag;
        e.map.appendChild(tag);
      }
    }
  }
  return generateEmptyMap();
}
function editmap() {
  window.removeEventListener("mousedown", onMapModeClick);
  window.addEventListener("mousedown", onMapModeClick);
  e.map.style.display ="block"
e.mapsGui.style.display =  "none"
if(MAP.mapLayout[mapY] == undefined)
{

  MAP.mapLayout[mapY]  = new Array()
  MAP.biomes[mapY] = new Array()
  MAP.locations[mapY] = new Array()
}

  if (MAP.mapLayout[mapY][mapX] == undefined){ currentmap =  generateDebugMap();
   
  currentmap.biome = "none"
  currentmap.location = "none"
  saveCurrentMap()
   // generateMap()
  }
  else {
  
let map = MAP.mapLayout[mapY][mapX]
    e.map.innerText = "";
    for (let y = 0; y < mapH; y++) {
      maphtml[y] = new Array();
      for (let x = 0; x < mapW; x++) {
        maphtml[y][x] = new Array();
        for (let l = 0; l < 2; l++) {
          let tag = document.createElement("div");
          if (l == 0)
            tag.className =
              "block " +
              map[y][x][l]
            
          else tag.className = "blockfloor " +map[y][x][l]

          tag.style.top = y * 5 + "vh";
          tag.style.left = x * 5 + "vh";
          maphtml[y][x][l] = tag;
          e.map.appendChild(tag);
        }
      }
    }
    
    currentmap  = map
    if(MAP.biomes[mapY][mapX] != undefined)
    {

      currentmap.biome =  MAP.biomes[mapY][mapX]
      currentmap.location =  MAP.locations[mapY][mapX]
    }
    else
    {
      currentmap.biome =  "none"
      currentmap.location = "none"
    }

   
  }
  e.biomes.value = currentmap.biome
  
}

//[r][c] - R-rows; C-columns
let percent = window.innerHeight / 100;

function mapMode() {
  e.editmode.style.display = "block";
  loadselectedblockedits();
  buildBiomesSelector();
  e.map.style.border = " solid red 1px";
  editmap()
  window.addEventListener("mousedown", onMapModeClick);
}
let oldclicks = [-1, -1];
let features = [0, 0, 0];
let floormode = 0;
let randomfillamount = 100
function randomfill(button)
{
  if(randomfillamount == 100){
randomfillamount = window.prompt("Enter %")
button.style.backgroundColor = "green"

  }else
  {
    button.style.backgroundColor = "red"
    randomfillamount = 100
  }
  button.innerText = randomfillamount + "%"

}

function onMapModeClick(evt) {
  let clickX = (evt.x / percent / 5) >> 0;
  let clickY = (evt.y / percent / 5) >> 0;
  if (clickX != oldclicks[1] || clickY != oldclicks[0])
    if (clickX < mapW && clickY < mapH) {
      if (features[0]) {
        fill3x3(clickY, clickX);
      } else if (features[1]) {
        fillVericalLine(clickX);
      } else if (features[2]) {
        fillHorizontalLine(clickY);
      } else {
        currentmap[clickY][clickX][floormode] = selectedblockedit;
        
          maphtml[clickY][clickX][floormode].classList = (floormode == 0 ? "block " : "blockfloor ") + selectedblockedit;
       
      }
    }
  oldclicks = [clickY, clickX];
}
function fill3x3(clickY, clickX) {
  clickY--;
  clickX--;
  for (let y = 0; y < 3; y++) {
    if (currentmap[clickY + y] != undefined)
      for (let x = 0; x < 3; x++) {
        if (currentmap[clickY + y][clickX + x] != undefined && random(100/randomfillamount)) {
          currentmap[clickY + y][clickX + x][floormode] = selectedblockedit;
          maphtml[clickY + y][clickX + x][floormode].classList =(floormode == 0 ? "block " : "blockfloor ") + selectedblockedit;
        }
      }
  }
}

function fillVericalLine(clickX) {
  for (let y = 0; y < mapH; y++) {
    if(random(100/randomfillamount))
    {
    currentmap[y][clickX][floormode] = selectedblockedit;
    maphtml[y][clickX][floormode].classList = (floormode == 0 ? "block " : "blockfloor ") + selectedblockedit;
    }
  }
}
function fillHorizontalLine(clickY) {
  for (let x = 0; x < mapW; x++) {
    if(random(100/randomfillamount))
    {
    currentmap[clickY][x][floormode] = selectedblockedit;
    maphtml[clickY][x][floormode].classList =(floormode == 0 ? "block " : "blockfloor ") + selectedblockedit;
    }
  }
}

function turnButton(id, loc) {
  e.fill3x3.style.backgroundColor = "red";
  e.fillHorizontalLine.style.backgroundColor = "red";
  e.fillVericalLine.style.backgroundColor = "red";
  if (features[loc] == 0) {
    e[id].style.backgroundColor = "green";
    features = [0, 0, 0];
    features[loc] = 1;
  } else features = [0, 0, 0];
}



function OpenMapGui()
{
  //  savemap();
  saveCurrentMap()
  window.removeEventListener("mousedown", onMapModeClick);
e.map.style.display = "none"
e.mapsGui.style.display = "block"
e.mapsGui.innerText = ""
for(let y = 0; y <= MAP.mapLayout.length;y++){
let div  = document.createElement("div")
div.setAttribute("class","mapGuiRow")
let length = y==MAP.mapLayout.length ? MAP.mapLayout[y-1].length -1 : MAP.mapLayout[y].length
for(let x = 0; x <= length;x++){
let tag = document.createElement("button")
tag.setAttribute("class","mapGuiButton")
if(x == length || y == MAP.mapLayout.length) tag.innerText = "+"
tag.setAttribute("onclick","mapX = " +x+" ; mapY = "+y+"; editmap()")
div.appendChild(tag)
}
e.mapsGui.appendChild(div)
}
}
function resetmaps(){
  MAP.mapLayout = [[]]
  savemap()
}
function goToNextMap(){
  generateMap()
  changeLocation()
  recalculateStats()
  steve.spawn()
 
  
}



// function savemap(){}

function loadmap(){ 

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     MAP = JSON.parse(this.responseText)
     LOADING()
    }
  };
  xhttp.open("Get", "mapfile.json", true);
  xhttp.send();
}
// function savemap() {
//   if(isMapModeOn)
//   MAP.mapLayout[mapY][mapX] = currentmap
//   navigator.clipboard.writeText(JSON.stringify(MAP)).then(
//     function () {
     
//     },
//     function (e) {
//       test(e.message)
//       alert("Error copying to clipboard, try again...")
//     }
//   )
//   // localStorage.setItem("RPGmaps", JSON.stringify(maps));
// }
function createEmptyMapVariable(){
  let MAP = {}
  MAP.mapLayout = [[]]
  MAP.biomes = [[]]
  MAP.locations = [[]]
  return MAP
}

function loadmapFromCloud() {
  MAP = JSON.parse(localStorage.getItem("RPGmaps"));
  if (MAP == null) { // || MAP.biomes[0][0] == null
    MAP = createEmptyMapVariable()
    MAP.mapLayout[0][0] = generateEmptyMap();
    MAP.biomes[0][0] = "none"
    MAP.locations[0][0] = "none"
}

}
let currentBiome = "none"
function getBiome(){
  // return MAP.biomes[mapY][mapX] || "none"
  return currentmap.biome || "none"
}
let currentLocation = "none"
function getLocation(){
  // return MAP.locations[mapY][mapX] || "none"
   return currentmap.location || "none"
}
function changeLocation(){
  if(currentBiome != getBiome() || currentLocation != getLocation()){
    e.Location.innerHTML = getName( getBiome()) + (getLocation() == "none" ? "" : ": " + getName(getLocation()))
    e.Location.className = "fade"
    e.Location.style.display = "block"
    setTimeout(() => {
      e.Location.className = ""
      e.Location.style.display = "none"
    }, 6000);
   
  }
  currentBiome = getBiome()
  currentLocation = getLocation()
}
function saveCurrentMap(){
  MAP.mapLayout[mapY][mapX] = currentmap
  MAP.biomes[mapY][mapX] = currentmap.biome
  MAP.locations[mapY][mapX] = currentmap.location
}
function saveMapToCloud(){
  saveCurrentMap()
  localStorage.setItem("RPGmaps", JSON.stringify(MAP))
}
function setBiome(){
  currentmap.biome =e.biomes.value
  
}
function setLocation(){
  currentmap.location= prompt("Enter location name") || "none"
}
function putFileMapToCloud(){
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     MAP = JSON.parse(this.responseText)
     localStorage.setItem("RPGmaps", JSON.stringify(MAP))
    }
  };
  xhttp.open("Get", "mapfile.json", true);
  xhttp.send();
  
  ShouldSaveOnLeave = false
  window.location.reload()
}

