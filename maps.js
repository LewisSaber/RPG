let maps = [[]]
  

let mapW = 30;
let mapH = 18;

function generateEmptyMap() {
  let gm = [];
  for (let i = 0; i < mapH; i++) {
    gm[i] = new Array();
    for (let j = 0; j < mapW; j++) {
      gm[i][j] = new Array();
      gm[i][j].push("0");
      gm[i][j].push("0");
    }
  }
  return gm;
}

let selectorblocks = ["air", "stone", "sponge", "snow", "cactus", "obsidian"];
let selectedBlock = "stone";
function loadSelectedBlocks() {
  selectorblocks.forEach((x) => {
    let tag = document.createElement("button");

    tag.classList.add("blockselector", x);

    tag.setAttribute("onclick", "selectedBlock='" + x + "'");
    e.blocksSelector.appendChild(tag);
  });
}

let maphtml = [];
function generateMap() {
  let map = maps[mapY][mapX]
  e.map.innerText = "";
  for (let y = 0; y < mapH; y++) {
    //  maphtml[y] = new Array()
    for (let x = 0; x < mapW; x++) {
      //  maphtml[y][x] = new Array()
      for (let l = 0; l < 2; l++) {
        if (map[y][x][l] != "0") {
          let tag = document.createElement("div");
          if (l == 0) tag.classList.add("block", map[y][x][l]);
          else tag.classList.add("blockfloor", map[y][x][l]);

          tag.style.top = y * 5 + "vh";
          tag.style.left = x * 5 + "vh";
          // maphtml[y][x][l] = tag
          e.map.appendChild(tag);
        }
      }
    }
  }
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
  e.map.style.display ="block"
e.mapsGui.style.display =  "none"
if(maps[mapY] == undefined)
maps[mapY]  = new Array()

  if (maps[mapY][mapX] == undefined){ generatedMap =  generateDebugMap();
    console.log(generatedMap)
    maps[mapY][mapX] = generatedMap
   // generateMap()
  }
  else {
let map = maps[mapY][mapX]
    e.map.innertext = "";
    for (let y = 0; y < mapH; y++) {
      maphtml[y] = new Array();
      for (let x = 0; x < mapW; x++) {
        maphtml[y][x] = new Array();
        for (let l = 0; l < 2; l++) {
          let tag = document.createElement("div");
          if (l == 0)
            tag.classList.add(
              "block",
              map[y][x][l] == "0" ? "air" : map[y][x][l]
            );
          else tag.classList.add("blockfloor", map[y][x][l]);

          tag.style.top = y * 5 + "vh";
          tag.style.left = x * 5 + "vh";
          maphtml[y][x][l] = tag;
          e.map.appendChild(tag);
        }
      }
    }
    console.log(map)
    generatedMap  = map
  }
 
  
}
function exportMap(map = generatedMap) {
  let mapx = "[";
  for (let y = 0; y < mapH; y++) {
    mapx += "[";
    for (let x = 0; x < mapW; x++) {
      mapx += "['" + map[y][x][0] + "','" + map[y][x][1] + "'],";
    }
    mapx = mapx.slice(0, -1);
    mapx += "],";
  }
  mapx = mapx.slice(0, -1);
  mapx += "]";
  return mapx;
}
//[r][c] - R-rows; C-columns
let percent = window.innerHeight / 100;
let generatedMap = [];
function mapMode() {
  e.editmode.style.display = "block";
  loadSelectedBlocks();
  e.map.style.border = " solid red 1px";
  editmap()
  window.addEventListener("mousedown", onMapModeClick);
}
let oldclicks = [-1, -1];
let features = [0, 0, 0];
let floormode = 0;

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
        generatedMap[clickY][clickX][floormode] = selectedBlock;
        if (floormode)
          maphtml[clickY][clickX][1].classList = "blockfloor " + selectedBlock;
        else maphtml[clickY][clickX][0].classList = "block " + selectedBlock;
      }
    }
  oldclicks = [clickY, clickX];
}
function fill3x3(clickY, clickX) {
  clickY--;
  clickX--;
  for (let y = 0; y < 3; y++) {
    if (generatedMap[clickY + y] != undefined)
      for (let x = 0; x < 3; x++) {
        if (generatedMap[clickY + y][clickX + x] != undefined) {
          generatedMap[clickY + y][clickX + x][floormode] = selectedBlock;
          maphtml[clickY + y][clickX + x][floormode].classList =(floormode == 0 ? "block " : "blockfloor ") + selectedBlock;
        }
      }
  }
}

function fillVericalLine(clickX) {
  for (let y = 0; y < mapH; y++) {
    generatedMap[y][clickX][floormode] = selectedBlock;
    maphtml[y][clickX][floormode].classList = (floormode == 0 ? "block " : "blockfloor ") + selectedBlock;
  }
}
function fillHorizontalLine(clickY) {
  for (let x = 0; x < mapW; x++) {
    generatedMap[clickY][x][floormode] = selectedBlock;
    maphtml[clickY][x][floormode].classList =(floormode == 0 ? "block " : "blockfloor ") + selectedBlock;
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
function savemap() {
  localStorage.setItem("RPGmaps", JSON.stringify(maps));
}
function loadmap() {
  maps = JSON.parse(localStorage.getItem("RPGmaps"));
  
  if (maps == null) {
    maps = [[]];
    maps[0][0] = generateEmptyMap();
  }
}

function OpenMapGui()
{
e.map.style.display = "none"
e.mapsGui.style.display = "block"
e.mapsGui.innerText = ""
for(let y = 0; y <= maps.length;y++){
let div  = document.createElement("div")
div.setAttribute("class","mapGuiRow")
let length = y==maps.length ? maps[y-1].length : maps[y].length
for(let x = 0; x <= length;x++){
let tag = document.createElement("button")
tag.setAttribute("class","mapGuiButton")
if(x == length || y == maps.length) tag.innerText = "+"
tag.setAttribute("onclick","mapX = " +x+" ; mapY = "+y+"; editmap()")
div.appendChild(tag)
}
e.mapsGui.appendChild(div)


}
}