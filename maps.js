// let MAP = createEmptyMapVariable()

let map = {
  width: 200,
  height: 200,
  layout: [[]],
  mobs: []
}

const borderwidth = 1
const floorTransparency = 0.6
const pixelPerBlock = 6.5
const blocksize = ((window.innerHeight / 100) * pixelPerBlock).fixed(4)
let mapContext

function generateMap() {
  e.mapcontainer.style.width = map.width.blocks().px()
  e.mapcontainer.style.height = map.height.blocks().px()
  e.mapcontainer.style.borderWidth = borderwidth.blocks().px()
  e.map.width = map.width.blocks()
  e.map.height = map.height.blocks()
  mapContext = document.getElementById("map").getContext("2d")
  mapContext.webkitImageSmoothingEnabled = false
  mapContext.mozImageSmoothingEnabled = false
  mapContext.imageSmoothingEnabled = false
  const img = new Image()
  img.src = "map.png"
  img.onload = function () {
    mapContext.drawImage(img, 0, 0, map.width.blocks(), map.height.blocks())
  }
  for (let i = 0; i < map.height; i++) {
    for (let j = 0; j < map.width; j++) {
      if (map.layout[i][j][0].includes("tree")) {
        let tag = document.createElement("div")
          tag.className = map.layout[i][j][0] + " mapblock"
          tag.x = i
          tag.y = j
          tag.setAttribute("onmousedown","onMapClick({offsetY:"+ i +",offsetX:"+j +"},false)")
          tag.id = map.layout[i][j][0] + " " + j + " " + i
          tag.style.left = j.blocks().px()
          tag.style.top = i.blocks().px()
          e.mapcontainer.appendChild(tag) 
      }
    }
  }
  map.mobs.forEach((x,i) =>{
    if(!isUndefined(x))
    {
        let mob = x.name.includes("villager") ? new classes.villager(x.x,x.y,i,x.name.substring(9)) : new classes[x.name](x.x,x.y,i)
      
      mob.create()
      mob.spawn()
    }
  
  })
}
function downloadMap() {
  const url = e.map.toDataURL("image/png")
  const link = document.createElement("a")
  link.download = "map"
  link.href = url
  document.body.appendChild(link)
  link.click()
  link.remove()
  delete link
}

function loadmap() {
  let xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let text = atob(this.responseText)
      if (text != "") {
        const map1 = JSON.parse(atob(this.responseText))
        map = loadObject(map, map1)
      }
      LOADING()
    }
  }
  xhttp.open("Get", "mapfile.txt", true)
  xhttp.send()
}

const biomes = ["plains", "forest", "cave", "desert"]

let allowedblocks = [
  "air",
  "grassPlant",
  "treeoak",
  "empty",
  "mobmobmob",
  "dandelion",
  "sugarcane",
]

function FillMapWithAir() {
  for (let i = 0; i < map.height; i++) {
    if (map.layout[i] == undefined) map.layout[i] = new Array()
    for (let j = 0; j < map.width; j++) {
      if (map.layout[i][j] == undefined) {
        map.layout[i][j] = ["air", "air"]
      }
    }
  }
}

// let mapW = 24;
// let mapH = 16;

// function generateEmptyMap() {
//   let gm = [];
//   for (let i = 0; i < mapH; i++) {
//     gm[i] = new Array();
//     for (let j = 0; j < mapW; j++) {
//       gm[i][j] = new Array();
//       gm[i][j].push("air");
//       gm[i][j].push("air");
//     }
//   }
//   return gm;
// }

let selectedBlock = new classes.empty(0)
let selectedblockedit = "stone"
function loadselectedblockedits() {
  selectorblocks.forEach((x) => {
    let tag = document.createElement("button")
    if(x.includes("mob")) tag.className = x.substring(4) + " blockselector"
    else
    tag.className = "blockselector " + (x != "treeoak" ? x : x + "small")
    //  if(x.slice(0,9) == "mobmobmob")
    //  tag.setAttribute("onclick", "selectedblockedit='"+ x+ "'" );
    //  else
    if (x.includes("villager")) {
      tag.setAttribute(
        "onclick",
        "selectedblockedit='mob villager ' + prompt('name villager') "
      )
    } else tag.setAttribute("onclick", "selectedblockedit='" + x + "'")
    e.blocksSelector.appendChild(tag)
  })
}

// let maphtml = [];
// function generateMap() {
//   clearMobs()
//   let spawneriter = 0
//   let map = MAP.mapLayout[mapY][mapX]
//   currentmap =  MAP.mapLayout[mapY][mapX]
//   currentmap.biome = MAP.biomes[mapY][mapX]
//   currentmap.location = MAP.locations[mapY][mapX]
//   e.map.innerText = "";
//   for (let y = 0; y < mapH; y++) {
//     maphtml[y] = new Array();
//     for (let x = 0; x < mapW; x++) {
//       maphtml[y][x] = new Array();
//       for (let l = 0; l < 2; l++) {
//         if (map[y][x][l] != "air") {
//          // //comsole.log(map[y][x][l])
//           if(map[y][x][l].includes("mobmobmob"))
//           {
//            if(map[y][x][l].includes("villager") ){
//             new classes.villager(x * 5,y*5,spawneriter, map[y][x][l].slice(19))
//            }
//      else
//      new classes[map[y][x][l].slice(10)](x * 5,y*5,spawneriter)
//         spawneriter++

//           }
//           else
//           {
//             let tag = document.createElement("div");
//             if (l == 0) tag.className = "block "+ map[y][x][l];
//             else tag.className = "blockfloor " +  map[y][x][l]
//               tag.setAttribute("onmousedown","breakblock(this)")
//               //  tag.setAttribute("oncontextmenu"," return false")
//               tag.setAttribute("onmouseleave","stopBreakingOnMouseLeave()")
//               tag.setAttribute("onmouseenter","startBreakingOnMouseEnter(this)")
//             tag.style.top = y * 5 + "vh";
//             tag.style.left = x * 5 + "vh";
//              maphtml[y][x][l] = tag
//             e.map.appendChild(tag);
//           }

//         }
//       }
//     }
//   }
//   changeLocation()
// }
// function generateDebugMap() {
//   maphtml  =[]
//   e.map.innerText = "";
//   for (let y = 0; y < mapH; y++) {
//     maphtml[y] = new Array();
//     for (let x = 0; x < mapW; x++) {
//       maphtml[y][x] = new Array();
//       for (let l = 0; l < 2; l++) {
//         let tag = document.createElement("div");
//         if (l == 0) tag.classList.add("block", "air");
//         else tag.classList.add("blockfloor");

//         tag.style.top = y * 5 + "vh";
//         tag.style.left = x * 5 + "vh";
//         maphtml[y][x][l] = tag;
//         e.map.appendChild(tag);
//       }
//     }
//   }
//   return generateEmptyMap();
// }
// function editmap() {
//   window.removeEventListener("mousedown", onMapModeClick);
//   window.addEventListener("mousedown", onMapModeClick);
//   e.map.style.display ="block"
// e.mapsGui.style.display =  "none"
// if(MAP.mapLayout[mapY] == undefined)
// {

//   MAP.mapLayout[mapY]  = new Array()
//   MAP.biomes[mapY] = new Array()
//   MAP.locations[mapY] = new Array()
// }

//   if (MAP.mapLayout[mapY][mapX] == undefined){ currentmap =  generateDebugMap();

//   currentmap.biome = "none"
//   currentmap.location = "none"
//   saveCurrentMap()
//    // generateMap()
//   }
//   else {

// let map = MAP.mapLayout[mapY][mapX]
//     e.map.innerText = "";
//     for (let y = 0; y < mapH; y++) {
//       maphtml[y] = new Array();
//       for (let x = 0; x < mapW; x++) {
//         maphtml[y][x] = new Array();
//         for (let l = 0; l < 2; l++) {
//           let tag = document.createElement("div");
//           if (l == 0)
//             tag.className =
//               "block " +
//               map[y][x][l]

//           else tag.className = "blockfloor " +map[y][x][l]

//           tag.style.top = y * 5 + "vh";
//           tag.style.left = x * 5 + "vh";
//           maphtml[y][x][l] = tag;
//           e.map.appendChild(tag);
//         }
//       }
//     }

//     currentmap  = map
//     if(MAP.biomes[mapY][mapX] != undefined)
//     {

//       currentmap.biome =  MAP.biomes[mapY][mapX]
//       currentmap.location =  MAP.locations[mapY][mapX]
//     }
//     else
//     {
//       currentmap.biome =  "none"
//       currentmap.location = "none"
//     }

//   }
//   e.biomes.value = currentmap.biome

// }

// //[r][c] - R-rows; C-columns
// let percent = window.innerHeight / 100;

function mapMode() {
  e.editmode.style.display = "block"
  loadselectedblockedits()
  buildBiomesSelector()

  // editmap()
}
let oldclicks = [-1, -1]
let features = [0, 0, 0]
let floormode = 0
let randomfillamount = 100
function randomfill(button) {
  if (randomfillamount == 100) {
    randomfillamount = window.prompt("Enter %")
    button.style.backgroundColor = "green"
  } else {
    button.style.backgroundColor = "red"
    randomfillamount = 100
  }
  button.innerText = randomfillamount + "%"
}

function fill3x3(clickY, clickX) {
  const width = e.fillwidthselector.value
  clickX -= width /2 >> 0
  clickY -= width /2 >> 0

  for (let y = 0; y < width; y++) {
    if (clickY + y >= 0) {
      if (isUndefined(map.layout[clickY + y]))
        map.layout[clickY + y] = new Array()
    }
    for (let x = 0; x < width; x++) {
      if (clickX + x >= 0 && random(100 / randomfillamount)) {
        if (isUndefined(map.layout[clickY + y][clickX + x]))
          map.layout[clickY + y][clickX + x] = ["air", "air"]
        map.layout[clickY + y][clickX + x][floormode] = selectedblockedit
       drawMapBlock(clickX + x, clickY + y)
       
      }
    }
  }
}

function drawblock(blockname, x, y, alpha = 1) {
  
   const img = new Image()
  img.src = "img/" + blockname + ".png"
  img.alpha = alpha
  img.onload = function () {
    if(alpha != 1)
    mapContext.clearRect(x.blocks(),y.blocks(),blocksize,blocksize)
    mapContext.globalAlpha = img.alpha
    mapContext.drawImage(
      img,
      x * blocksize,
      y * blocksize,
      blocksize,
      blocksize
    )
    mapContext.globalAlpha = 1
  }
}
function drawfloorblock(blockname, x, y) {
  drawblock(blockname, x, y, floorTransparency)
}
function drawMapBlock(x,y){
  //mapContext.clearRect(x.blocks(),y.blocks(),blocksize,blocksize)
  
  drawfloorblock(map.layout[y][x][1],x,y)
  drawblock(map.layout[y][x][0],x,y)
}


function renderMapFromVariable(width, height, xoffset = 0, yoffset = 0) {
  mapContext.clearRect(
    xoffset.blocks(),
    yoffset.blocks(),
    width.blocks(),
    height.blocks()
  )
  for (let i = yoffset; i < height + yoffset; i++) {
    for (let j = xoffset; j < width + xoffset; j++) {
      if(!map.layout[i][j][0].includes("tree")){

        drawfloorblock(map.layout[i][j][1], j, i)
        drawblock(map.layout[i][j][0], j, i)
      }
    }
  }
  console.log("finished")
}

let mapMovingTimer = 0

const mapMovingSpeed = 4
const mapMovingInterval = 100

function downButtonHandlerMap(evt) {
  if (mapMovingTimer == 0) {
    if (evt.code == "KeyW")
    movemap(evt)
      mapMovingTimer = setInterval(movemap,mapMovingInterval,evt)
  }
  if (evt.code == "ShiftLeft") {
    isShiftOn = 1
  }
}

function movemap(evt){
  if (evt.code == "KeyW")
    e.mapcontainer.style.top =
      +e.mapcontainer.style.top.slice(0, -2) +
      (isShiftOn ? 2 * mapMovingSpeed : mapMovingSpeed).blocks() +
      "px"
if (evt.code == "KeyS")
    e.mapcontainer.style.top =
      +e.mapcontainer.style.top.slice(0, -2) +
      (isShiftOn ? -2 * mapMovingSpeed : -1 * mapMovingSpeed).blocks() +
      "px"
if (evt.code == "KeyA")
    e.mapcontainer.style.left =
      +e.mapcontainer.style.left.slice(0, -2) +
      (isShiftOn ? 2 * mapMovingSpeed : mapMovingSpeed).blocks() +
      "px"
  if (evt.code == "KeyD")
    e.mapcontainer.style.left =
      +e.mapcontainer.style.left.slice(0, -2) +
      (isShiftOn ? -2 * mapMovingSpeed : -1*mapMovingSpeed).blocks() +
      "px"
}

function upButtonHandlerMap(evt) {
  if (evt.code == "ShiftLeft") {
    isShiftOn = 0
  } else {
    clearInterval(mapMovingTimer)
    mapMovingTimer = 0
  }
}

// function fillVericalLine(clickX) {
//   for (let y = 0; y < mapH; y++) {
//     if(random(100/randomfillamount))
//     {
//     currentmap[y][clickX][floormode] = selectedblockedit;
//     maphtml[y][clickX][floormode].classList = (floormode == 0 ? "block " : "blockfloor ") + selectedblockedit;
//     }
//   }
// }
// function fillHorizontalLine(clickY) {
//   for (let x = 0; x < mapW; x++) {
//     if(random(100/randomfillamount))
//     {
//     currentmap[clickY][x][floormode] = selectedblockedit;
//     maphtml[clickY][x][floormode].classList =(floormode == 0 ? "block " : "blockfloor ") + selectedblockedit;
//     }
//   }
// }

function turnButton(id, loc) {
  e.fill3x3.style.backgroundColor = "red"
  // e.fillHorizontalLine.style.backgroundColor = "red"
  // e.fillVericalLine.style.backgroundColor = "red"
  if (features[loc] == 0) {
    e[id].style.backgroundColor = "green"
    features = [0, 0, 0]
    features[loc] = 1
  } else features = [0, 0, 0]
}

function saveMap() {
  downloadMap()
  // saveMapToClipBoard()
  downloadTxtFile(btoa(JSON.stringify(map)))
}

function saveMapToClipBoard() {
  navigator.clipboard.writeText(btoa(JSON.stringify(map))).then(
    function () {},
    function (e) {
      test(e.message)
      alert("Error copying to clipboard, try again...")
    }
  )
  // localStorage.setItem("RPGmaps", JSON.stringify(maps));
}


let currentBiome = "none"
// function getBiome(){
//   // return MAP.biomes[mapY][mapX] || "none"
//   return currentmap.biome || "none"
// }
let currentLocation = "none"
// function getLocation(){
//   // return MAP.locations[mapY][mapX] || "none"
//    return currentmap.location || "none"
// }
// function changeLocation(){
//   if(currentBiome != getBiome() || currentLocation != getLocation()){
//     e.Location.innerHTML = getName( getBiome()) + (getLocation() == "none" ? "" : ": " + getName(getLocation()))
//     e.Location.className = "fade"
//     e.Location.style.display = "block"
//     setTimeout(() => {
//       e.Location.className = ""
//       e.Location.style.display = "none"
//     }, 6000);

//   }
//   currentBiome = getBiome()
//   currentLocation = getLocation()
// }
// function saveCurrentMap(){
//   MAP.mapLayout[mapY][mapX] = currentmap
//   MAP.biomes[mapY][mapX] = currentmap.biome
//   MAP.locations[mapY][mapX] = currentmap.location
// }
// function saveMapToCloud(){
//   saveCurrentMap()
//   localStorage.setItem("RPGmaps", JSON.stringify(MAP))
// }
// function setBiome(){
//   currentmap.biome =e.biomes.value

// }
// function setLocation(){
//   currentmap.location= prompt("Enter location name") || "none"
// }
// function putFileMapToCloud(){
//   let xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//      MAP = JSON.parse(atob(this.responseText))
//      localStorage.setItem("RPGmaps", JSON.stringify(MAP))
//     }
//   };
//   xhttp.open("Get", "mapfile.txt", true);
//   xhttp.send();

//   ShouldSaveOnLeave = false
//   window.location.reload()
// }
// function exportmap(){
//   navigator.clipboard.writeText(btoa(JSON.stringify(MAP))).then(
//         function () {

//         },
//         function (e) {
//           test(e.message)
//           alert("Error copying to clipboard, try again...")
//         }
//       )
// }
