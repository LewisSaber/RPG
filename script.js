let currentmap;
let loading = 0;
let isMapModeOn;
function LOADING() {
  loadIDS();
  loadmap();
  mapX = 0;
  mapY = 0;
  loadMode();

  if (!isMapModeOn) {
    generateMap();

    steve = new player();
    window.addEventListener("keydown", downButtonHandler);
    window.addEventListener("keyup", upButtonHandler);

    window.addEventListener("mousedown", leftclick);
    buildHotbar();
    buildInventory();

    window.onbeforeunload = function (evt) {
      saveInventory();
      savemap();
    };

    window.onmousemove = function (evt) {
      timer = setTimeout(positionElement(evt), 1);
    };
    window.onmouseup = function () {
      keys[5] = 0;
    };
  } else mapMode();

  console.log("loaded");
}

function positionElement(evt) {
  e.cursor.style.top = evt.y + 5 + "px";
  e.cursor.style.left = evt.x + 5 + "px";

  timer = false;
}

function test(evt) {
  console.log(evt);
}
let movetimer;
let keys = [0, 0, 0, 0, 0, 0, 0]; //w,a,s,d,e,lmouse
let oldhotbarslot;
let selectedItem;
function downButtonHandler(evt) {
  if (evt.key == "e" && !keys[4]) openInventory();

  switch (evt.key) {
    case "w":
      keys[0] = 1;
      break;
    case "a":
      keys[1] = 1;
      break;
    case "s":
      keys[2] = 1;
      break;
    case "d":
      keys[3] = 1;

      break;
    case "e":
      keys[4] = 1;
  }
  switch (evt.key) {
    case "w":
    case "s":
    case "a":
    case "d":
      if (!movetimer) {
        steve.move();
        movetimer = setInterval(function () {
          steve.move();
        }, Math.ceil(200 / steve.getSpeed()));
      }

      break;
  }
  if (/\b[1-9]/.test(evt.key) && !isInventoryopen) {
    let key = +evt.key;
    key--;

    oldhotbarslot.style.borderWidth = "0.2vh";
    oldhotbarslot.style.margin = "0.5vh";
    e.inventory["slot" + key].style.borderWidth = "0.6vh";
    e.inventory["slot" + key].style.margin = "0.1vh";
    oldhotbarslot = e.inventory["slot" + key];
    selectedItem = steve.inventory[key];
    steve.equipItem(selectedItem);
    steve.itemInHand = selectedItem;
  }
}

function upButtonHandler(evt) {
  switch (evt.key) {
    case "w":
      keys[0] = 0;
      break;
    case "a":
      keys[1] = 0;
      break;
    case "s":
      keys[2] = 0;
      break;
    case "d":
      keys[3] = 0;
      break;
    case "e":
      keys[4] = 0;
      break;
  }
}
function random(r) {
  r = Math.round(r);
  return Math.floor(Math.random() * r) == 0;
}

function switchmode() {
  if (isMapModeOn) {
    maps[mapY][mapX] = currentmap;
    savemap();
  }
  isMapModeOn = !isMapModeOn;
  localStorage.setItem("RPGeditmode", JSON.stringify(isMapModeOn));
  window.location.reload();
}

function loadMode() {
  isMapModeOn = JSON.parse(localStorage.getItem("RPGeditmode"));
  if (isMapModeOn == null) isMapModeOn = 1;
}
function buildHotbar() {
  e.hotbar.style.display = "block";
  e.hotbar.innerText = "";
  for (let i = 0; i < 9; i++) {
    let tag = document.createElement("div");
    let amount = document.createElement("div");
    amount.setAttribute("class", "itemamount");
    e.inventory["slot" + i + "amount"] = amount;
    tag.setAttribute("oncontextmenu", "RclickOnSlot(" + i + "); return false");
    tag.setAttribute("class", "guiSlot");
    tag.setAttribute("onclick", "LclickOnslot(" + i + ")");
    amount.setAttribute("onclick", "LclickOnslot(" + i + ")");
    e.inventory["slot" + i] = tag;
    oldhotbarslot = tag;
    tag.appendChild(amount);
    e.hotbar.appendChild(tag);
    putItemInslot(
      steve.inventory[i],
      e.inventory["slot" + i],
      e.inventory["slot" + i + "amount"]
    );
  }
}
function buildInventory() {
  for (let i = steve.inventorySlots - 1; i > 8; i--) {
    let tag = document.createElement("div");
    let amount = document.createElement("div");
    amount.setAttribute("class", "itemamount");
    e.inventory["slot" + i + "amount"] = amount;
    tag.setAttribute("onclick", "LclickOnslot(" + i + ")");
    tag.setAttribute("oncontextmenu", "RclickOnSlot(" + i + "); return false");
    amount.setAttribute("onclick", "LclickOnslot(" + i + ")");
    tag.setAttribute("class", "guiSlot");
    e.inventory["slot" + i] = tag;

    tag.appendChild(amount);
    e.inventory.appendChild(tag);
  }
}
isInventoryopen = false;

function putItemInslot(item, codeslot, codeamount) {
  codeslot.className = "guiSlot " + item.name;
  codeamount.innerText = item.amount > 1 ? item.amount : "";
}

function openInventory() {
  if (!isInventoryopen) {
    window.removeEventListener("mousedown", leftclick);
    e.inventory.style.display = "block";
    e.hotbar.style.bottom = "41.5vh";
    for (let i = 0; i < steve.inventorySlots; i++) {
      putItemInslot(
        steve.inventory[i],
        e.inventory["slot" + i],
        e.inventory["slot" + i + "amount"]
      );
    }
  } else {
    window.addEventListener("mousedown", leftclick);
    e.inventory.style.display = "none";
    e.hotbar.style.bottom = "1vh";
  }

  isInventoryopen = !isInventoryopen;
}

let breaktimer;
let currentblock = {};
function leftclick(evt) {
  keys[5] = 1;
  let clickX = (evt.x / percent / 5) >> 0;
  let clickY = (evt.y / percent / 5) >> 0;
  if (clickX < mapW && clickY < mapH) {
    if (
      classes[
        currentmap[clickY][clickX][
          currentmap[clickY][clickX][0] == "air" ? 1 : 0
        ]
      ] != undefined
    ) {
      currentblock["block"] = new classes[
        currentmap[clickY][clickX][
          currentmap[clickY][clickX][0] == "air" ? 1 : 0
        ]
      ]();
      currentblock["x"] = clickX;
      currentblock["y"] = clickY;
      currentblock["layer"] = currentmap[clickY][clickX][0] == "air" ? 1 : 0;
      if (currentblock.block.isBreakable && steve.isInRange(currentblock)) {
        if (
          currentblock.block.tier <= steve.stats.tooltier &&
          (!currentblock.block.restrictTool ||
            steve.stats.tool.includes(currentblock.block.tool))
        ) {
          moveProgressBar(
            (currentblock.block.hardness / steve.stats.miningspeed) >> 0
          );
          console.log(currentblock);
          if (steve.stats.miningspeed >= currentblock.block.hardness) {
            console.log("this");
            breaktimer = setInterval(function () {
              steve.breakblock(currentblock);
            }, 10);
          } else
            breaktimer = setInterval(function () {
              steve.breakblock(currentblock);
            }, 100);
        }
      }
    }
  }
}
function PutInSlotFull(slot, codeslot, codeamount) {
  if (slot.name == "empty") {
    slot = itemInCursor;
    itemInCursor = "none";
    e.cursor.className = "";
  } else if (slot.name == itemInCursor.name) {
    if (slot.getEmpty() >= itemInCursor.amount) {
      slot.amount += itemInCursor.amount;
      itemInCursor = "none";
      e.cursor.className = "";
    } else {
      itemInCursor.amount -= slot.getEmpty();
      slot.amount = slot.maxStackSize;
    }
  }

  putItemInslot(slot, codeslot, codeamount);
  return slot;
}
function PutInSlotOne(slot, codeslot, codeamount) {
  if (slot.name == "empty") {
    slot = Object.assign(
      Object.create(Object.getPrototypeOf(itemInCursor)),
      itemInCursor
    );

    slot.amount = 1;
    itemInCursor.amount -= 1;
  } else if (slot.name == itemInCursor.name) {
    if (slot.getEmpty() >= 1) {
      slot.amount += 1;
      itemInCursor.amount -= 1;
    }
  }
  if (itemInCursor.amount == 0) {
    itemInCursor = "none";
    e.cursor.className = "";
  }
  putItemInslot(slot, codeslot, codeamount);
  return slot;
}
function putInCursorFull(slot,codeslot,codeamount){
  if (slot.name != "empty") {
    itemInCursor = Object.assign(
      Object.create(Object.getPrototypeOf(slot)),
      slot
    );
    e.cursor.classList.add(itemInCursor.name);
   slot = new classes.empty();
    
  }
  putItemInslot(slot, codeslot, codeamount);
return slot
}
function putInCursorHalf(slot,codeslot,codeamount){

}

function removeItemFromSlot(codeslot, codeamount) {
  codeslot.className = "guiSlot empty";
  codeamount.innerText = "";
}
function RclickOnSlot(i, type = "inventory") {
  if (itemInCursor == "none") {
    switch (type) {
      case "inventory":
        let amount = Math.ceil(steve.inventory[i].amount / 2);
        itemInCursor = Object.assign(
          Object.create(Object.getPrototypeOf(steve.inventory[i])),
          steve.inventory[i]
        );

        itemInCursor.amount = amount;

        e.cursor.classList.add(itemInCursor.name);
        if (steve.inventory[i].amount - amount == 0) {
          steve.inventory[i] = new classes.empty();
          removeItemFromSlot(
            e.inventory["slot" + i],
            e.inventory["slot" + i + "amount"]
          );
        } else {
          steve.inventory[i].amount -= amount;
          putItemInslot(
            steve.inventory[i],
            e.inventory["slot" + i],
            e.inventory["slot" + i + "amount"]
          );
        }

        break;
    }
  } else {
    switch (type) {
      case "inventory": {
        steve.inventory[i] = PutInSlotOne(
          steve.inventory[i],
          e.inventory["slot" + i],
          e.inventory["slot" + i + "amount"]
        );
      }
    }
  }
}

let itemInCursor = "none";
function LclickOnslot(i, type = "inventory") {
  if (itemInCursor == "none") {
    switch (type) {
      case "inventory":
        steve.inventory[i] = putInCursorFull(steve.inventory[i], e.inventory["slot" + i],e.inventory["slot" + i + "amount"])
       /* if (steve.inventory[i].name != "empty") {
          itemInCursor = Object.assign(
            Object.create(Object.getPrototypeOf(steve.inventory[i])),
            steve.inventory[i]
          );
          e.cursor.classList.add(itemInCursor.name);
          steve.inventory[i] = new classes.empty();
          putItemInslot(
            steve.inventory[i],
            e.inventory["slot" + i],
            e.inventory["slot" + i + "amount"]
          );
        }*/
        break;
    }
  } else {
    switch (type) {
      case "inventory": {
        steve.inventory[i] = PutInSlotFull(
          steve.inventory[i],
          e.inventory["slot" + i],
          e.inventory["slot" + i + "amount"]
        );
      }
    }
  }
}

function saveInventory() {
  localStorage.setItem("RPGinventory", JSON.stringify(steve.inventory));
}
let progressbarwidth = 0;

function moveProgressBar(length) {
  progressbarwidth = progressbarwidth >= 100 ? 0 : progressbarwidth + 1;

  e.progressbarInside.style.width = progressbarwidth + "%";
  if (progressbarwidth >= 1) setTimeout(moveProgressBar, length, length);
}
function blockreplacement(mapsY, mapsX, y, x, replacement, layer) {
  maps[mapsY][mapsX][y][x][layer] = replacement;
  if (mapX == mapsX && mapY == mapY) {
    maphtml[y][x][layer].classList =
      (layer ? "blockfloor " : "block ") + replacement;
    currentmap[y][x][layer] = replacement;
  }
}
