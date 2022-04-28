let currentmap;
let loading = 0;
let isMapModeOn;
const maxbackpackslot = 36 //size of biggest backpack
function LOADING() {
  loadIDS();
  loadmap();
  mapX = 2;
  mapY = 1;
  loadMode();

  if (!isMapModeOn) {
    generateMap();
    loadPlayer();
    loadrecipes();
    // window.addEventListener("keydown",test);
    window.addEventListener("keydown", downButtonHandler);
    window.addEventListener("keyup", upButtonHandler);
    window.addEventListener("wheel", ScrollHandler);

    // window.addEventListener("mousedown", leftclick);
    buildHotbar();
    buildCraftingTable();
    buildInventory();
    buildArmorGui();
    buildBackpacks();
    buildmachines();
    buildBackpacksGui();

    window.onbeforeunload = function (evt) {
      dumbtoinventory(craftingTableItems);
      dumbtoinventory([itemInCursor]);
      savePlayer();
      savemap();
    };

    window.onmousemove = function (evt) {
      timer = setTimeout(positionElement(evt), 1);
    };
    window.onmouseup = function () {
      keys[5] = 0;
    };

    e.inventory["slot" + currentHotbarSlot].style.borderWidth = "0.6vh";
    e.inventory["slot" + currentHotbarSlot].style.margin = "0.1vh";
    selectHotbarItem(currentHotbarSlot);
  } else mapMode();

  console.log("loaded");
}

function positionElement(evt) {
  e.tooltip.style.top = evt.y + (istooltip ? -100 : -10) + "px";
  e.tooltip.style.left = evt.x + 5 + "px";

  timer = false;
}

function test(evt) {
  console.log(evt);
}
let movetimer;
let isShiftOn = 0;
let keys = [0, 0, 0, 0, 0, 0, 0, 0]; //w,a,s,d,e,lmouse,r,u
let currentHotbarSlot = 0;
let selectedItem;
function downButtonHandler(evt) {
  // console.log("down");
  if (evt.key == "e" && !keys[4]) {
    if (isNeiOpen) {
      toggleNei();
    } else if (thismachinei != -2) {
      thismachinei = -2;
      toggleInventory();
      toggleInventory();
    } else {
      toggleGui();
      toggleInventory();
    }
  }
  if (evt.key == "r" && !keys[6]) {
    findCraftingRecipes();
    if (RecipeGueue.length > 0) {
      if (itemInCursor == "none") {
        if (isNeiOpen) {
          toggleNei();
        }
        makeToolTip(new classes.empty());

        toggleNei();
      }
    }
  }
  if (evt.key == "u" && !keys[7]) {
    findUsageRecipes();
    if (RecipeGueue.length > 0) {
      if (isNeiOpen) toggleNei();
      toggleNei();
      makeToolTip(new classes.empty());
    }
  }

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
      break;
    case "r":
      keys[6] = 1;
      break;
    case "u":
      keys[7] = 1;
      break;
    case "Shift":
      isShiftOn = 1;
      break;
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

    e.inventory["slot" + currentHotbarSlot].style.borderWidth = "0.2vh";
    e.inventory["slot" + currentHotbarSlot].style.margin = "0.5vh";
    currentHotbarSlot = key;
    e.inventory["slot" + currentHotbarSlot].style.borderWidth = "0.6vh";
    e.inventory["slot" + currentHotbarSlot].style.margin = "0.1vh";
    selectHotbarItem(key);
  }
}
isNeiOpen = 0;
function toggleNei() {
  isNeiOpen = !isNeiOpen;
  if (RecipeGueue.length > 0 || !isNeiOpen) {
    toggleInventory();
    if (isNeiOpen) {
      ShowRecipe(0);
      e.craftingtable.style.marginLeft = "20vh";
      e.nei.style.display = "block";
    } else {
      craftingTableItems.set(new classes.empty(), 9);
      e.nei.style.display = "none";
      craftingTableItems.forEach((x, i) => {
        putItemInslot(
          x,
          e.craftingtable["slot" + i],
          e.craftingtable["slot" + i + "amount"]
        );
      });
      setCraftingTableOutput();
    }
  }
}
function selectHotbarItem(i) {
  selectedItem = steve.inventory[i];
  steve.equipItem(selectedItem);
  steve.itemInHand = selectedItem;
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
    case "r":
      keys[6] = 0;
      break;
    case "u":
      keys[7] = 0;
      break;
    case "Shift":
      isShiftOn = 0;
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

isInventoryopen = false;

function putItemInslot(item, codeslot, codeamount) {
  codeslot.className = "guiSlot " + item.name;
  if (codeamount != undefined)
    codeamount.innerText = item.amount > 1 ? item.amount : "";
}
isGuiOpen = 0;
function toggleGui() {
  if (!isGuiOpen) {
    e.guihandler.style.display = "block";
  } else e.guihandler.style.display = "none";
  isGuiOpen = !isGuiOpen;
}

function toggleInventory() {
  if (!isInventoryopen) {
    // window.removeEventListener("mousedown", leftclick);
    e.inventory.style.display = "block";
    e.hotbar.style.bottom = "11vh";
    e.armorgui.style.display = "block";
    e.craftingtable.style.marginLeft = "1vh";
    e.craftingtable.style.display = "block";
    e.machines.style.display = "block";
    e.backpacks.style.display = "block";
    if (lastmachine != undefined) e[lastmachine].style.display = "none";
    for (let i = 0; i < steve.inventorySlots; i++) {
      putItemInslot(
        steve.inventory[i],
        e.inventory["slot" + i],
        e.inventory["slot" + i + "amount"]
      );
      craftingTableItems.forEach((x, i) => {
        putItemInslot(
          x,
          e.craftingtable["slot" + i],
          e.craftingtable["slot" + i + "amount"]
        );
      });
      for (let i = 0; i < armornames.length; i++) {
        steve[armornames[i]].name == "empty"
          ? (e.armorgui[armornames[i]].className =
              "guiSlot " + armornames[i] + "gui")
          : putItemInslot(steve[armornames[i]], e.armorgui[armornames[i]]);
      }
      /*
      for (let i = 0; i < steve.machines.length; i++) {
        putItemInslot(steve.machines[i], e.machines["slot" + i]);
      }
      */
    }
  } else {
    dumbtoinventory(craftingTableItems);
    doRecipe(craftingTableItems);
    setCraftingTableOutput();
    //  window.addEventListener("mousedown", leftclick);
    e.inventory.style.display = "none";
    e.hotbar.style.bottom = "1vh";
    e.machines.style.display = "none";
    e.armorgui.style.display = "none";
    e.craftingtable.style.display = "none";
    e.backpacks.style.display = "none";
  }

  isInventoryopen = !isInventoryopen;
}

let breaktimer;
let currentblock = {};

function PutInSlotFull(slot, codeslot, codeamount) {
  if (slot.name == "empty" || slot.name == "machine") {
    slot = itemInCursor;

    itemInCursor = "none";
    e.tooltip.className = "";
    makeToolTip(slot);
  } else if (slot.name == itemInCursor.name) {
    if (slot.getEmpty() >= itemInCursor.amount) {
      slot.amount += itemInCursor.amount;
      itemInCursor = "none";
      e.tooltip.className = "";
    } else {
      itemInCursor.amount -= slot.getEmpty();
      slot.amount = slot.maxStackSize;
    }
  }
  if (codeamount != undefined) putItemInslot(slot, codeslot, codeamount);
  else putItemInslot(slot, codeslot, codeamount);
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
    e.tooltip.className = "";
  }
  putItemInslot(slot, codeslot, codeamount);
  return slot;
}
function putInCursorFull(slot, codeslot, codeamount) {
  if (slot.name != "empty") {
    itemInCursor = Object.assign(
      Object.create(Object.getPrototypeOf(slot)),
      slot
    );
    e.tooltip.className = itemInCursor.name + " block";
    if (istooltip)
      e.tooltip.style.top = +e.tooltip.style.top.slice(0, -2) + 90 + "px";
    istooltip = false;

    e.tooltip.innerText = "";
    slot = new classes.empty();
  }
  if (codeamount != undefined) putItemInslot(slot, codeslot, codeamount);
  else putItemInslot(slot, codeslot, codeamount);
  return slot;
}
function AddItemInCursor(item) {
  if (
    itemInCursor == "none" ||
    (itemInCursor.name == item.name && itemInCursor.getEmpty() >= item.amount)
  ) {
    item.amount += itemInCursor == "none" ? 0 : itemInCursor.amount;
    itemInCursor = item;
    e.tooltip.className = itemInCursor.name + " block";
    if (istooltip)
      e.tooltip.style.top = +e.tooltip.style.top.slice(0, -2) + 90 + "px";
    istooltip = false;

    e.tooltip.innerText = "";
    return true;
  }
  return false;
}
function putInCursorHalf(slot, codeslot, codeamount) {
  let amount = Math.ceil(slot.amount / 2);
  itemInCursor = Object.assign(
    Object.create(Object.getPrototypeOf(slot)),
    slot
  );

  itemInCursor.amount = amount;
  e.tooltip.className = itemInCursor.name + " block";
  if (istooltip)
    e.tooltip.style.top = +e.tooltip.style.top.slice(0, -2) + 90 + "px";
  istooltip = false;

  e.tooltip.innerText = "";
  if (slot.amount - amount == 0) {
    slot = new classes.empty();
  } else {
    slot.amount -= amount;
  }
  putItemInslot(slot, codeslot, codeamount);
  return slot;
}

function removeItemFromSlot(codeslot, codeamount) {
  codeslot.className = "guiSlot empty";
  codeamount.innerText = "";
}
function RclickOnSlot(i, type = "inventory", key = "none", slotid = 0) {
  if (!isNeiOpen) {
    if (itemInCursor == "none") {
      switch (type) {
        case "inventory":
          steve.inventory[i] = putInCursorHalf(
            steve.inventory[i],
            e.inventory["slot" + i],
            e.inventory["slot" + i + "amount"]
          );
          if (i == currentHotbarSlot) selectHotbarItem(i);
          break;
        case "craftingtable":
          craftingTableItems[i] = putInCursorHalf(
            craftingTableItems[i],
            e.craftingtable["slot" + i],
            e.craftingtable["slot" + i + "amount"]
          );
          craftingArray[i] = craftingTableItems[i].name;
          craftingAmounts[i] = craftingTableItems[i].amount;
          setCraftingTableOutput();
          break;
        case "machineslot":
          if (!key.includes("output")) {
            steve.machines[i].inventory[key] = putInCursorHalf(
              steve.machines[i].inventory[key],
              e[steve.machines[i].name]["slot" + slotid],
              e[steve.machines[i].name]["slot" + slotid + "amount"]
            );
          }
          steve.machines[i].doRecipe();
          break;
        case "backpackslot":
          steve.backpacks[i].inventory[key] = putInCursorHalf(
            steve.backpacks[i].inventory[key],
            e.backpack[key],
            e.backpack[key + "amount"]
          );

          break;
      }
    } else {
      switch (type) {
        case "inventory":
          steve.inventory[i] = PutInSlotOne(
            steve.inventory[i],
            e.inventory["slot" + i],
            e.inventory["slot" + i + "amount"]
          );
          if (i == currentHotbarSlot) selectHotbarItem(i);
          break;
        case "craftingtable":
          craftingTableItems[i] = PutInSlotOne(
            craftingTableItems[i],
            e.craftingtable["slot" + i],
            e.craftingtable["slot" + i + "amount"]
          );
          craftingArray[i] = craftingTableItems[i].name;
          craftingAmounts[i] = craftingTableItems[i].amount;
          setCraftingTableOutput();
          break;
        case "machineslot":
          if (!key.includes("output")) {
            steve.machines[i].inventory[key] = PutInSlotOne(
              steve.machines[i].inventory[key],
              e[steve.machines[i].name]["slot" + slotid],
              e[steve.machines[i].name]["slot" + slotid + "amount"]
            );
          }
          steve.machines[i].doRecipe();
          break;
          case "backpackslot":
            steve.backpacks[i].inventory[key] = PutInSlotOne(
              steve.backpacks[i].inventory[key],
              e.backpack[key],
              e.backpack[key + "amount"]
            );
  
            break;
      }
    }
  }
}

let itemInCursor = "none";
function LclickOnSlot(i, type = "inventory", key = "none", slotid = 0) {
  if (!isNeiOpen) {
    if (itemInCursor == "none") {
      switch (type) {
        case "inventory":
          if (isShiftOn) {
            if (thismachinei > -2) {
              steve.inventory[i] = steve.machines[thismachinei].addToInventory(
                steve.inventory[i]
              );
              steve.machines[thismachinei].doRecipe();
              putItemInslot(
                steve.inventory[i],
                e.inventory["slot" + i],
                e.inventory["slot" + i + "amount"]
              );
              if (i == currentHotbarSlot) selectHotbarItem(i);
            }else
            if(thismachinei <= -3){
              steve.inventory[i] = steve.backpacks[-1 *thismachinei -3].addToInventory(
                steve.inventory[i]
              );
      
              putItemInslot(
                steve.inventory[i],
                e.inventory["slot" + i],
                e.inventory["slot" + i + "amount"]
              );
              if (i == currentHotbarSlot) selectHotbarItem(i);
            } else {
              if (i < 9) {
                steve.inventory[i] = steve.addToInventory(
                  steve.inventory[i],
                  9,
                  36
                );
              } else {
                steve.inventory[i] = steve.addToInventory(
                  steve.inventory[i],
                  0,
                  9
                );
              }
              putItemInslot(
                steve.inventory[i],
                e.inventory["slot" + i],
                e.inventory["slot" + i + "amount"]
              );
              if (i == currentHotbarSlot) selectHotbarItem(i);
            }

            if (istooltip && steve.inventory[i].amount == 0)
              e.tooltip.style.display = "none";
          } else {
            steve.inventory[i] = putInCursorFull(
              steve.inventory[i],
              e.inventory["slot" + i],
              e.inventory["slot" + i + "amount"]
            );
            if (i == currentHotbarSlot) selectHotbarItem(i);
          }

          break;
        case "craftingtable":
          if (isShiftOn) {
            craftingTableItems[i] = steve.addToInventory(craftingTableItems[i]);
            if (istooltip) e.tooltip.style.display = "none";

            putItemInslot(
              craftingTableItems[i],
              e.craftingtable["slot" + i],
              e.craftingtable["slot" + i + "amount"]
            );
          } else {
            craftingTableItems[i] = putInCursorFull(
              craftingTableItems[i],
              e.craftingtable["slot" + i],
              e.craftingtable["slot" + i + "amount"]
            );
          }
          craftingArray[i] = craftingTableItems[i].name;
          craftingAmounts[i] = craftingTableItems[i].amount;
          setCraftingTableOutput();

          break;
        case "machine":
          if (steve.machines[i].name != "machine") {
            steve.machines[i].stoprecipe();
            steve.machines[i].inventoryslotid = -1;
            putInCursorFull(steve.machines[i], e.machines["slot" + i]);

            steve.machines[i] = new classes.machine();
            e.machines["slot" + i].className = "guiSlot machine";
          }
          break;
        case "machineslot":
          if (isShiftOn) {
            steve.machines[i].inventory[key] = steve.addToInventory(
              steve.machines[i].inventory[key]
            );

            if (istooltip) e.tooltip.style.display = "none";

            putItemInslot(
              steve.machines[i].inventory[key],
              e[steve.machines[i].name]["slot" + slotid],
              e[steve.machines[i].name]["slot" + slotid + "amount"]
            );
          } else {
            steve.machines[i].inventory[key] = putInCursorFull(
              steve.machines[i].inventory[key],
              e[steve.machines[i].name]["slot" + slotid],
              e[steve.machines[i].name]["slot" + slotid + "amount"]
            );
          }

          steve.machines[i].doRecipe();
          if (!steve.machines[i].checkvalidnes())
            steve.machines[i].stoprecipe();
          break;
        case "anviloutput":
          steve.machines[i].inventory.input = new classes.empty();
          putItemInslot(
            steve.machines[i].inventory.input,
            e[steve.machines[i].name]["slot0"],
            e[steve.machines[i].name]["slot0amount"]
          );
          putInCursorFull(
            steve.machines[i].inventory.output,
            e[steve.machines[i].name]["slot" + slotid],
            e[steve.machines[i].name]["slot" + slotid + "amount"]
          );
          break;
        case "backpack":
          if (/*steve.backpacks[i].name != "backpack"*/ true) {
            //steve.machines[i].inventoryslotid = -1;
            putInCursorFull(steve.backpacks[i], e.backpacks["slot" + i]);

            steve.backpacks[i] = new classes.empty();
            e.backpacks["slot" + i].className = "guiSlot empty";
          }
          break;
        case "backpackslot":
          if (isShiftOn) {
            steve.backpacks[i].inventory[key] = steve.addToInventory(
              steve.backpacks[i].inventory[key]
            );

            if (istooltip) e.tooltip.style.display = "none";

            putItemInslot(
              steve.backpacks[i].inventory[key],
              e.backpack[key],
              e.backpack[key + "amount"]
            );
          } else {
            steve.backpacks[i].inventory[key] = putInCursorFull(
              steve.backpacks[i].inventory[key],
              e.backpack[key],
              e.backpack[key + "amount"]
            );
          }
          break;
      }
      if (armornames.includes(type)) {
        steve.removeStats(steve[type]);
        steve[type] = putInCursorFull(steve[type], e.armorgui[type]);
        e.armorgui[type].className = "guiSlot " + type + "gui";
      }
    } else {
      switch (type) {
        case "inventory":
          if (isShiftOn) {
            if (istooltip) e.tooltip.style.display = "none";
            if (thismachinei > -2) {
              steve.inventory[i] = steve.machines[thismachinei].addToInventory(
                steve.inventory[i]
              );
              steve.machines[thismachinei].doRecipe();
              putItemInslot(
                steve.inventory[i],
                e.inventory["slot" + i],
                e.inventory["slot" + i + "amount"]
              );
              if (i == currentHotbarSlot) selectHotbarItem(i);
            }else
            if(thismachinei <=-3){
              steve.inventory[i] = steve.backpacks[-1 *thismachinei + 3].addToInventory(
                steve.inventory[i]
              );
              putItemInslot(
                steve.inventory[i],
                e.inventory["slot" + i],
                e.inventory["slot" + i + "amount"]
              );
              if (i == currentHotbarSlot) selectHotbarItem(i);
            } else {
              if (i < 9) {
                steve.inventory[i] = steve.addToInventory(
                  steve.inventory[i],
                  9,
                  36
                );
              } else {
                steve.inventory[i] = steve.addToInventory(
                  steve.inventory[i],
                  0,
                  9
                );
              }
              putItemInslot(
                steve.inventory[i],
                e.inventory["slot" + i],
                e.inventory["slot" + i + "amount"]
              );
              if (i == currentHotbarSlot) selectHotbarItem(i);
            }
          } else {
            steve.inventory[i] = PutInSlotFull(
              steve.inventory[i],
              e.inventory["slot" + i],
              e.inventory["slot" + i + "amount"]
            );
            if (i == currentHotbarSlot) selectHotbarItem(i);
          }

          break;
        case "craftingtable":
          if (isShiftOn) {
            craftingTableItems[i] = steve.addToInventory(craftingTableItems[i]);

            if (istooltip) e.tooltip.style.display = "none";
            craftingTableItems[i] = new classes.empty();

            putItemInslot(
              craftingTableItems[i],
              e.craftingtable["slot" + i],
              e.craftingtable["slot" + i + "amount"]
            );
          } else {
            craftingTableItems[i] = PutInSlotFull(
              craftingTableItems[i],
              e.craftingtable["slot" + i],
              e.craftingtable["slot" + i + "amount"]
            );
          }

          craftingArray[i] = craftingTableItems[i].name;
          craftingAmounts[i] = craftingTableItems[i].amount;
          setCraftingTableOutput();
          break;
        case "machine":
          if (steve.machines[i].name == "machine") {
            if (itemInCursor.type == "machine") {
              steve.machines[i] = PutInSlotFull(
                steve.machines[i],
                e.machines["slot" + i]
              );
              steve.machines[i].inventoryslotid = i;
              steve.machines[i].doRecipe();
            }
          }
          break;
        case "machineslot":
          if (isShiftOn) {
            steve.machines[i].inventory[key] = steve.addToInventory(
              steve.machines[i].inventory[key]
            );

            if (istooltip) e.tooltip.style.display = "none";

            putItemInslot(
              steve.machines[i].inventory[key],
              e[steve.machines[i].name]["slot" + slotid],
              e[steve.machines[i].name]["slot" + slotid + "amount"]
            );
          } else {
            if (!key.includes("output")) {
              steve.machines[i].inventory[key] = PutInSlotFull(
                steve.machines[i].inventory[key],
                e[steve.machines[i].name]["slot" + slotid],
                e[steve.machines[i].name]["slot" + slotid + "amount"]
              );
            }
          }
          steve.machines[i].doRecipe();
          if (!steve.machines[i].checkvalidnes())
            steve.machines[i].stoprecipe();
          break;
        case "backpack":
          if (/*steve.machines[i].name == "machine"*/ true) {
            if (itemInCursor.type == "backpack") {
              steve.backpacks[i] = PutInSlotFull(
                steve.backpacks[i],
                e.backpacks["slot" + i]
              );
              //steve.machines[i].inventoryslotid = i;
            }
          }
          break;
        case "backpackslot":
          if (isShiftOn) {
            steve.backpacks[i].inventory[key] = steve.addToInventory(
              steve.backpacks[i].inventory[key]
            );

            if (istooltip) e.tooltip.style.display = "none";

            putItemInslot(
              steve.backpacks[i].inventory[key],
              e.backpack[key],
              e.backpack[key + "amount"]
            );
          } else {
            steve.backpacks[i].inventory[key] = PutInSlotFull(
              steve.backpacks[i].inventory[key],
              e.backpack[key],
              e.backpack[key + "amount"]
            );
          }
          break;
      }
      if (armornames.includes(type)) {
        if (steve[type].name == "empty") {
          if (
            itemInCursor.type == type ||
            itemInCursor.type == type.slice(0, -1)
          ) {
            steve.equipItem(itemInCursor, steve[type]);
            steve[type] = PutInSlotFull(steve[type], e.armorgui[type]);
          }
        }
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
function makestats(item) {
  let str = "";
  for (const key in item.stats) {
    str +=
      (statsnames[key] || key[0].toUpperCase() + key.substring(1)) +
      ": " +
      (typeof item.stats[key] == "string"
        ? item.stats[key]
        : item.stats[key] >= 0
        ? "+ " + item.stats[key]
        : "- " + item.stats[key].toString().substr(1)) +
      "<br> ";
  }
  return str;
}
let itemintooltip;
let istooltip;
function makeToolTip(item) {
  if (itemInCursor == "none") {
    if (item.name == "empty" || item.name == "machine") {
      e.tooltip.style.display = "none";
    } else {
      itemintooltip = item.name; //used in recipe search
      e.tooltip.className = "tooltipimg";
      istooltip = true;
      e.tooltip.style.top = +e.tooltip.style.top.slice(0, -2) - 100 + "px";
      e.tooltip.style.display = "block";
      e.tooltip.innerHTML =
        (item.Rname == ""
          ? '<p style="color:lightblue">' +
            (blocknames[item.name] ||
              item.name[0].toUpperCase() + item.name.substring(1))
          : '<p style="color:red">' + item.Rname) +
        "</p><br><br>" +
        (item.burnvalue > 0
          ? '<p style="color:gray">Burn Value: ' +
            item.burnvalue +
            " ticks</p><br>"
          : "") +
        makestats(item) +
        "<br><br>";
    }
  }
}

function breakblock(block) {
  keys[5] = 1;
  let clickX = (+block.style.left.slice(0, -2) / 5) >> 0;
  let clickY = (+block.style.top.slice(0, -2) / 5) >> 0;
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
          if (steve.stats.miningspeed >= currentblock.block.hardness) {
            breaktimer = setInterval(function () {
              steve.breakblock(currentblock);
            }, 10);
          } else {
            e.progressbar.style.display = "block";
            breaktimer = setInterval(function () {
              steve.breakblock(currentblock);
            }, 100);
          }
        }
      }
    }
  }
}
let steve = new player();
function savePlayer() {
  localStorage.setItem("RPGPlayer", JSON.stringify(steve));
}

function loadPlayer() {
  let pl = JSON.parse(localStorage.getItem("RPGPlayer"));
  if (pl != null) {
    for (const key1 in pl) {
      if (toload.includes(key1)) {
        if (key1 == "inventory") {
          for (let i = 0; i < pl.inventorySlots; i++) {
            steve.inventory[i] = loadInventoryItem(pl[key1][i]);
          }
        } else if (armornames.includes(key1)) {
          steve[key1] = loadInventoryItem(pl[key1]);
          steve.addStats(steve[key1]);
        } else if (key1 == "machines") {
          for (let i = 0; i < 9; i++) {
            steve.machines[i] = loadInventoryItem(pl[key1][i]);
            steve.machines[i].inventoryslotid = i;
            //pl[key1][i].inventoryslotid;
            if (steve.machines[i].name == "furnace")
              steve.machines[i].fuel = pl[key1][i].fuel;
          }
        } else if(key1 == "backpacks") {
          for (let i = 0; i < 24; i++) {
            steve.backpacks[i] = loadInventoryItem(pl[key1][i]);
          }
        }
        else steve[key1] = pl[key1];
      }
    }
  }
  steve.createPlayer();
}
function loadInventoryItem(item) {
 
  let result = new classes[item.name](item.amount);
  result.Rname = item.Rname;
  if (item.inventory != undefined) {
    for (const key2 in item.inventory) {
      result.inventory[key2] = loadInventoryItem(item.inventory[key2]);
    }
  }
  return result;
}
let lastmachine;
let thismachinei = -2;
function openMachineGui(machine, id) {
  if (machine.name != "machine") {
    makeToolTip(new classes.empty());

    e.craftingtable.style.display = "none";
    e.armorgui.style.display = "none";
    e.machines.style.display = "none";
    e.backpacks.style.display = "none";

    let iter = 0;
    if (machine.type == "backpack") {
      lastmachine = "backpack";
      e.backpackname.innerText =  (steve.backpacks[id].Rname == ""
      ? (blocknames[steve.backpacks[id].name] ||
          steve.backpacks[id].name[0].toUpperCase() + steve.backpacks[id].name.substring(1))
      :  steve.backpacks[id].Rname)
      e.backpack.style.display = "block";
      thismachinei = -3 -id;
      for (const key in machine.inventory) {
        putItemInslot(
          machine.inventory[key],
          e.backpack["slot" + iter],
          e.backpack["slot" + iter + "amount"]
        );
        e.backpack["slot" + iter].setAttribute(
          "onclick",
          "LclickOnSlot( " + id + ",'backpackslot','" + key + "'," + iter + ")"
        );
        e.backpack["slot" + iter].setAttribute(
          "oncontextmenu",
          "RclickOnSlot( " +
            id +
            ",'backpackslot','" +
            key +
            "'," +
            iter +
            "); return false"
        );
        e.backpack["slot" + iter].setAttribute(
          "onmouseenter",
          "makeToolTip(steve.backpacks[" + id + "].inventory." + key + ")"
        );

        e.backpack["slot" + iter].setAttribute(
          "onmouseleave",
          "if(istooltip) e.tooltip.style.display ='none'"
        );
        iter++;
      }
      for(let i = 0; i < maxbackpackslot;i++){
       
          e.backpack["slot" + i].style.display =  i < steve.backpacks[id].inventorySlots ? "block" : "none"
        
        
      }
    } else {
      e[machine.name].style.display = "block";
      thismachinei = id;
      lastmachine = machine.name;
      for (const key in machine.inventory) {
        putItemInslot(
          machine.inventory[key],
          e[machine.name]["slot" + iter],
          e[machine.name]["slot" + iter + "amount"]
        );
        if (isNeiOpen) {
          e[machine.name]["slot" + iter].setAttribute(
            "onmouseenter",
            "makeToolTip(RecipeGueue[" + id + "].inventory." + key + ")"
          );
          e[machine.name]["slot" + iter].setAttribute(
            "onmouseleave",
            "if(istooltip) e.tooltip.style.display ='none'"
          );
        } else {
          if (machine.name == "anvil" && iter == 1) {
            e[machine.name]["slot" + iter].setAttribute(
              "onclick",
              "LclickOnSlot( " +
                id +
                ",'anviloutput','" +
                key +
                "'," +
                iter +
                ")"
            );
          } else
            e[machine.name]["slot" + iter].setAttribute(
              "onclick",
              "LclickOnSlot( " +
                id +
                ",'machineslot','" +
                key +
                "'," +
                iter +
                ")"
            );
          e[machine.name]["slot" + iter].setAttribute(
            "oncontextmenu",
            "RclickOnSlot( " +
              id +
              ",'machineslot','" +
              key +
              "'," +
              iter +
              "); return false"
          );
          e[machine.name]["slot" + iter].setAttribute(
            "onmouseenter",
            "makeToolTip(steve.machines[" + id + "].inventory." + key + ")"
          );

          e[machine.name]["slot" + iter].setAttribute(
            "onmouseleave",
            "if(istooltip) e.tooltip.style.display ='none'"
          );
        }
        iter++;
      }
    }
  }
}
function reduceStack(input, amount) {
  input.amount -= amount;
  return input.amount <= 0 ? new classes.empty() : input;
}
function ScrollHandler(evt) {
  if (isNeiOpen) {
    if (evt.deltaY < 0) ShowRecipe(CurrentRecipeI - 1);
    if (evt.deltaY > 0) ShowRecipe(CurrentRecipeI + 1);
  } else if (!isGuiOpen) {
    e.inventory["slot" + currentHotbarSlot].style.borderWidth = "0.2vh";
    e.inventory["slot" + currentHotbarSlot].style.margin = "0.5vh";
    if (evt.deltaY < 0) currentHotbarSlot--;
    if (evt.deltaY > 0) currentHotbarSlot++;
    if (currentHotbarSlot > 8) currentHotbarSlot = 0;
    if (currentHotbarSlot < 0) currentHotbarSlot = 8;
    e.inventory["slot" + currentHotbarSlot].style.borderWidth = "0.6vh";
    e.inventory["slot" + currentHotbarSlot].style.margin = "0.1vh";
    selectHotbarItem(currentHotbarSlot);
  }
  //deltaY == -100 scrollup
  //deltay == 100 scrolldown
}
function give(item, amount) {
  steve.addToInventory(new classes[item](amount));
}
