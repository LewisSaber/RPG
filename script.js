let currentmap
let loaded = 0
let isMapModeOn
let mobtospawn = ""
let mobs = []
let caneat = true
let currethowl
const maxbackpackslot = 33 //size of biggest backpack
const maxaccesoriesslots = 33 //size of maxed accessory bag
const maxCompactorSlots = 16
/** How many packpacks Right Inventory Gui can have */
const backPacksInGui = 24
const SkillsDesc = "Skills"
const CollectionsDesc = "Collections "
const AccesoryBagDesc =
  "Accessory Bag<br><br> " +
  color("ONLY 1", "red") +
  " Accessory Of Each Family<br> will be active at time<br>"

function LOADING() {
  loadIDS()
  createTextures()
  mapX = 0
  mapY = 0
  loadMode()
  loadSession()

  window.onmousemove = function (evt) {
    timer = setTimeout(positionElement(evt), 1)
  }

  if (session.nick == "admin") loadmapFromCloud()
  if (!isMapModeOn) {
    buildaccessoryGui()

    loadPlayer(session.nick)

    loadrecipes()
    // window.addEventListener("keydown",test);
    addKeysEvent()
    window.addEventListener("keyup", upButtonHandler)
    window.addEventListener("wheel", ScrollHandler)

    //window.addEventListener("mousedown", test);
    buildAccountSelector()
    buildHotbar()
    buildCraftingTable()
    buildInventory()
    buildArmorGui()
    buildBackpacks()
    buildmachines()
    buildBackpacksGui()
    buildSkills()
    buildCollections()
    buildEnchantingBook()
    buildGlitchedCompactor()
    buildSuperCompactor()
    loadskills()
    loadCollections()
    steve.updateheathbar()
    for (let i = 0; i < steve.inventorySlots; i++) {
      putItemInslot(
        steve.inventory[i],
        e.inventory["slot" + i],
        e.inventory["slot" + i + "amount"]
      )
    }

    window.onbeforeunload = function () {
      onBeforeUnload()
    }

    window.onmouseup = function () {
      keys[5] = 0
    }

    e.inventory["slot" + currentHotbarSlot].style.borderWidth = "0.6vh"
    e.inventory["slot" + currentHotbarSlot].style.margin = "0.1vh"

    selectHotbarItem(currentHotbarSlot)
    steve.addCoins(0)
    steve.addHealth(1000000)
    goToNextMap()
  } else {
    window.onbeforeunload = function (evt) {
      if (isMapModeOn && session.nick == "admin") {
        saveMapToCloud()
      }
    }

    mapMode()
  }
  loaded = 1
  console.log("loaded")
}
function onBeforeUnload() {
  if (ShouldSaveOnLeave) {
    dumbtoinventory(craftingTableItems)
    dumbtoinventory([itemInCursor])
    savePlayer(session.nick)
    saveSession()
  }
}
function positionElement(evt) {
  e.tooltip.style.top = evt.y + (istooltip ? -100 : -10) + "px"
  e.tooltip.style.left = evt.x + 5 + "px"

  timer = false
}

function test(evt) {
  console.log(evt)
}
let movetimer
let isShiftOn = 0
/**
 * W,A,S,D,E,LMB,R,U,Esc
 */
let keys = [0, 0, 0, 0, 0, 0, 0, 0]
let currentHotbarSlot = 0
let selectedItem
function downButtonHandler(evt) {
  // console.log("down");
  if (evt.key == "e" && !keys[4] && !isSettingsOpen) {
    if (isNeiOpen) {
      toggleNei()
      toggleInventory()
    } else if (thismachinei != -2) {
      thismachinei = -2
      toggleInventory()
    } else {
      toggleGui()
      toggleInventory()
    }
  }
  if (evt.key == "r" && !keys[6] && isGuiOpen) {
    findCraftingRecipes()
    if (RecipeGueue.length > 0) {
      if (itemInCursor == "none") {
        if (isNeiOpen) {
          toggleNei()
        }
        makeToolTip(new classes.empty())

        toggleNei()
      }
    } else {
      if (isNeiOpen) {
        toggleNei()
        toggleInventory()
      }
    }
  }
  if (evt.key == "u" && !keys[7] && isGuiOpen) {
    findUsageRecipes()

    if (RecipeGueue.length > 0) {
      if (isNeiOpen) toggleNei()
      toggleNei()
      makeToolTip(new classes.empty())
    } else {
      if (isNeiOpen) {
        toggleNei()
        toggleInventory()
      }
    }
  }
  if (evt.key == "Escape" && !isGuiOpen) {
    OpenSettingsMenu()
  }

  switch (evt.key) {
    case "w":
      keys[0] = 1
      break
    case "a":
      keys[1] = 1
      break
    case "s":
      keys[2] = 1
      break
    case "d":
      keys[3] = 1

      break
    case "e":
      keys[4] = 1
      break
    case "r":
      keys[6] = 1
      break
    case "u":
      keys[7] = 1
      break
    case "Shift":
      isShiftOn = 1
      break
    case "Escape":
      keys[8] = 1
      break
  }
  switch (evt.key) {
    case "w":
    case "s":
    case "a":
    case "d":
      if (!movetimer) {
        steve.move()
        movetimer = setInterval(function () {
          steve.move()
        }, Math.ceil(200 / steve.getSpeed()))
      }

      break
  }
  if (/\b[1-9]/.test(evt.key) && !isInventoryopen) {
    let key = +evt.key
    key--

    e.inventory["slot" + currentHotbarSlot].style.borderWidth = "0.2vh"
    e.inventory["slot" + currentHotbarSlot].style.margin = "0.5vh"
    currentHotbarSlot = key
    e.inventory["slot" + currentHotbarSlot].style.borderWidth = "0.6vh"
    e.inventory["slot" + currentHotbarSlot].style.margin = "0.1vh"
    selectHotbarItem(key)
  }
}
isNeiOpen = 0
function toggleNei() {
  isNeiOpen = !isNeiOpen
  if (RecipeGueue.length > 0 || !isNeiOpen) {
    if (isNeiOpen) {
      disableInventoryGuis()
      ShowRecipe(0)
      e.craftingtable.style.marginLeft = "20vh"
      e.nei.style.display = "block"
    } else {
      thismachinei = -2
      craftingTableItems.set(new classes.empty(), 9)
      e.nei.style.display = "none"
      craftingTableItems.forEach((x, i) => {
        putItemInslot(
          x,
          e.craftingtable["slot" + i],
          e.craftingtable["slot" + i + "amount"]
        )
      })
      setCraftingTableOutput()
    }
  }
}
function selectHotbarItem(i) {
  selectedItem = steve.inventory[i]
  steve.equipItem(selectedItem)
  steve.itemInHand = selectedItem
  e.playertool.className = selectedItem.name
  putItemInslot(
    steve.inventory[i],
    e.inventory["slot" + i],
    e.inventory["slot" + i + "amount"]
  )
}
function upButtonHandler(evt) {
  switch (evt.key) {
    case "w":
      keys[0] = 0
      break
    case "a":
      keys[1] = 0
      break
    case "s":
      keys[2] = 0
      break
    case "d":
      keys[3] = 0
      break
    case "e":
      keys[4] = 0
      break
    case "r":
      keys[6] = 0
      break
    case "u":
      keys[7] = 0
      break
    case "Shift":
      isShiftOn = 0
      break
    case "Escape":
      keys[8] = 0
      break
  }
}
function random(r) {
  r = Math.round(r)
  return Math.floor(Math.random() * r) == 0
}

function switchmode() {
  if (isMapModeOn && nick == "admin") {
    saveMapToCloud()
  }
  localStorage.setItem("RPGeditmode", JSON.stringify(!isMapModeOn))
  window.location.reload()
}

function loadMode() {
  isMapModeOn = JSON.parse(localStorage.getItem("RPGeditmode"))
  if (isMapModeOn == null) isMapModeOn = 1
}

isInventoryopen = false

function putItemInslot(item, codeslot, codeamount) {
  codeslot.className = "guiSlot " + item.name
  if (codeamount != undefined)
    codeamount.innerText = item.amount > 1 ? item.amount : ""
}
isGuiOpen = false
function toggleGui() {
  if (!isGuiOpen) {
    e.guihandler.style.display = "block"
  } else e.guihandler.style.display = "none"
  isGuiOpen = !isGuiOpen
}

function toggleInventory() {
  if (!isInventoryopen && isGuiOpen) {
    // window.removeEventListener("mousedown", leftclick);
    e.inventory.style.display = "block"
    e.hotbar.style.bottom = "11vh"
    e.armorgui.style.display = "block"
    e.coins.style.display = "block"
    e.craftingtable.style.marginLeft = "1vh"
    e.craftingtable.style.display = "block"
    e.machines.style.display = "block"
    e.backpacks.style.display = "block"
    e.trashcan.style.display = "block"
    e.guibuttons.style.display = "block"
    e.playerStats.style.display = "block"
    if (lastmachine != undefined) e[lastmachine].style.display = "none"
    for (let i = 0; i < steve.inventorySlots; i++) {
      putItemInslot(
        steve.inventory[i],
        e.inventory["slot" + i],
        e.inventory["slot" + i + "amount"]
      )
      craftingTableItems.forEach((x, i) => {
        putItemInslot(
          x,
          e.craftingtable["slot" + i],
          e.craftingtable["slot" + i + "amount"]
        )
      })
      for (let i = 0; i < armornames.length; i++) {
        steve[armornames[i]].name == "empty"
          ? (e.armorgui[armornames[i]].className =
              "guiSlot " + armornames[i] + "gui")
          : putItemInslot(steve[armornames[i]], e.armorgui[armornames[i]])
      }
    }
    isInventoryopen = !isInventoryopen
  } else {
    e.hotbar.style.bottom = "0vh"
    dumbtoinventory(craftingTableItems)
    doRecipe(craftingTableItems)

    setCraftingTableOutput()
    //  window.addEventListener("mousedown", leftclick);
    disableInventoryGuis()
  }
}

let breaktimer = 0
let currentblock = {}

function PutInSlotFull(slot, codeslot, codeamount) {
  if (slot.name == "empty" || slot.name == "machine") {
    slot = itemInCursor

    itemInCursor = "none"
    e.tooltip.className = ""
    makeToolTip(slot)
  } else if (slot.name == itemInCursor.name) {
    if (slot.getEmpty() >= itemInCursor.amount) {
      slot.amount += itemInCursor.amount
      itemInCursor = "none"
      e.tooltip.className = ""
    } else {
      itemInCursor.amount -= slot.getEmpty()
      slot.amount = slot.maxStackSize
    }
  }
  if (codeamount != undefined) putItemInslot(slot, codeslot, codeamount)
  else putItemInslot(slot, codeslot, codeamount)
  return slot
}

function PutInSlotOne(slot, codeslot, codeamount) {
  if (slot.name == "empty") {
    slot = Object.assign(
      Object.create(Object.getPrototypeOf(itemInCursor)),
      itemInCursor
    )

    slot.amount = 1
    itemInCursor.amount -= 1
  } else if (slot.name == itemInCursor.name) {
    if (slot.getEmpty() >= 1) {
      slot.amount += 1
      itemInCursor.amount -= 1
    }
  }
  if (itemInCursor.amount == 0) {
    itemInCursor = "none"
    e.tooltip.className = ""
  }
  putItemInslot(slot, codeslot, codeamount)
  return slot
}
function putInCursor() {
  if (itemInCursor.name == "empty") {
    itemInCursor = "none"
    e.tooltip.className = ""
  } else {
    e.tooltip.className = itemInCursor.name + " block"
    if (istooltip)
      e.tooltip.style.top = +e.tooltip.style.top.slice(0, -2) + 90 + "px"
    istooltip = false
    e.tooltip.innerText = ""
  }
}

function putInCursorFull(slot, codeslot, codeamount) {
  if (slot.name != "empty") {
    itemInCursor = Object.assign(
      Object.create(Object.getPrototypeOf(slot)),
      slot
    )
    e.tooltip.className = itemInCursor.name + " block"
    if (istooltip)
      e.tooltip.style.top = +e.tooltip.style.top.slice(0, -2) + 90 + "px"
    istooltip = false

    e.tooltip.innerText = ""
    slot = new classes.empty()
  }
  if (codeamount != undefined) putItemInslot(slot, codeslot, codeamount)
  else putItemInslot(slot, codeslot, codeamount)
  return slot
}
function AddItemToCursor(item) {
  item = Object.assign(Object.create(Object.getPrototypeOf(item)), item)
  if (
    itemInCursor == "none" ||
    (itemInCursor.name == item.name && itemInCursor.getEmpty() >= item.amount)
  ) {
    item.amount += itemInCursor == "none" ? 0 : itemInCursor.amount
    itemInCursor = item
    e.tooltip.className = itemInCursor.name + " block"
    if (istooltip)
      e.tooltip.style.top = +e.tooltip.style.top.slice(0, -2) + 90 + "px"
    istooltip = false

    e.tooltip.innerText = ""
    return true
  }
  return false
}
function putInCursorHalf(slot, codeslot, codeamount) {
  let amount = Math.ceil(slot.amount / 2)
  itemInCursor = Object.assign(Object.create(Object.getPrototypeOf(slot)), slot)

  itemInCursor.amount = amount
  e.tooltip.className = itemInCursor.name + " block"
  if (istooltip)
    e.tooltip.style.top = +e.tooltip.style.top.slice(0, -2) + 90 + "px"
  istooltip = false

  e.tooltip.innerText = ""
  if (slot.amount - amount == 0) {
    slot = new classes.empty()
  } else {
    slot.amount -= amount
  }
  putItemInslot(slot, codeslot, codeamount)
  return slot
}
function deleteItemInCursor() {
  itemInCursor = "none"
  e.tooltip.className = ""
  makeToolTip(new classes.empty())
}

function removeItemFromSlot(codeslot, codeamount) {
  codeslot.className = "guiSlot empty"
  codeamount.innerText = ""
}
function RclickOnSlot(i, type = "inventory", key = "none", slotid = 0) {
  playClickSound()
  if (!isNeiOpen) {
    if (itemInCursor == "none") {
      switch (type) {
        case "inventory":
          steve.inventory[i] = putInCursorHalf(
            steve.inventory[i],
            e.inventory["slot" + i],
            e.inventory["slot" + i + "amount"]
          )
          if (i == currentHotbarSlot) selectHotbarItem(i)
          break
        case "craftingtable":
          craftingTableItems[i] = putInCursorHalf(
            craftingTableItems[i],
            e.craftingtable["slot" + i],
            e.craftingtable["slot" + i + "amount"]
          )
          craftingArray[i] = craftingTableItems[i].name
          craftingAmounts[i] = craftingTableItems[i].amount
          setCraftingTableOutput()
          break
        case "machineslot":
          if (!key.includes("output")) {
            steve.machines[i].inventory[key] = putInCursorHalf(
              steve.machines[i].inventory[key],
              e[steve.machines[i].machinetype]["slot" + slotid],
              e[steve.machines[i].machinetype]["slot" + slotid + "amount"]
            )
          }
          steve.machines[i].doRecipe()
          break
        case "backpackslot":
          steve.backpacks[i].inventory[key] = putInCursorHalf(
            steve.backpacks[i].inventory[key],
            e.backpack[key],
            e.backpack[key + "amount"]
          )

          break
      }
    } else {
      switch (type) {
        case "inventory":
          steve.inventory[i] = PutInSlotOne(
            steve.inventory[i],
            e.inventory["slot" + i],
            e.inventory["slot" + i + "amount"]
          )
          if (i == currentHotbarSlot) selectHotbarItem(i)
          break
        case "craftingtable":
          craftingTableItems[i] = PutInSlotOne(
            craftingTableItems[i],
            e.craftingtable["slot" + i],
            e.craftingtable["slot" + i + "amount"]
          )
          craftingArray[i] = craftingTableItems[i].name
          craftingAmounts[i] = craftingTableItems[i].amount
          setCraftingTableOutput()
          break
        case "machineslot":
          if (!key.includes("output")) {
            steve.machines[i].inventory[key] = PutInSlotOne(
              steve.machines[i].inventory[key],
              e[steve.machines[i].machinetype]["slot" + slotid],
              e[steve.machines[i].machinetype]["slot" + slotid + "amount"]
            )
          }
          steve.machines[i].doRecipe()
          break
        case "backpackslot":
          steve.backpacks[i].inventory[key] = PutInSlotOne(
            steve.backpacks[i].inventory[key],
            e.backpack[key],
            e.backpack[key + "amount"]
          )

          break
      }
    }
  }
}

let itemInCursor = "none"
function LclickOnSlot(i, type = "inventory", key = "none", slotid = 0) {
  playClickSound()
  if (!isNeiOpen) {
    if (itemInCursor == "none") {
      switch (type) {
        case "inventory":
          if (isShiftOn) {
            if (thismachinei > -2) {
              steve.inventory[i] = steve.machines[thismachinei].addToInventory(
                steve.inventory[i]
              )
              steve.machines[thismachinei].doRecipe()
              putItemInslot(
                steve.inventory[i],
                e.inventory["slot" + i],
                e.inventory["slot" + i + "amount"]
              )
              if (i == currentHotbarSlot) selectHotbarItem(i)
            } else if (thismachinei <= -1000) {
              steve.inventory[i] = steve.backpacks[
                -1 * thismachinei - 1000
              ].addToInventory(steve.inventory[i])

              putItemInslot(
                steve.inventory[i],
                e.inventory["slot" + i],
                e.inventory["slot" + i + "amount"]
              )
              if (i == currentHotbarSlot) selectHotbarItem(i)
            } else if (thismachinei == -3) {
              steve.inventory[i] = steve.accessorybag.addToInventory(
                steve.inventory[i]
              )

              putItemInslot(
                steve.inventory[i],
                e.inventory["slot" + i],
                e.inventory["slot" + i + "amount"]
              )
              if (i == currentHotbarSlot) selectHotbarItem(i)
            } else {
              if (i < 9) {
                steve.inventory[i] = steve.addToInventory(
                  steve.inventory[i],
                  9,
                  36
                )
              } else {
                steve.inventory[i] = steve.addToInventory(
                  steve.inventory[i],
                  0,
                  9
                )
              }
              putItemInslot(
                steve.inventory[i],
                e.inventory["slot" + i],
                e.inventory["slot" + i + "amount"]
              )
              if (i == currentHotbarSlot) selectHotbarItem(i)
            }

            if (istooltip && steve.inventory[i].amount == 0)
              e.tooltip.style.display = "none"
          } else {
            steve.inventory[i] = putInCursorFull(
              steve.inventory[i],
              e.inventory["slot" + i],
              e.inventory["slot" + i + "amount"]
            )
            if (i == currentHotbarSlot) selectHotbarItem(i)
          }

          break
        case "craftingtable":
          if (isShiftOn) {
            craftingTableItems[i] = steve.addToInventory(craftingTableItems[i])
            if (istooltip) e.tooltip.style.display = "none"

            putItemInslot(
              craftingTableItems[i],
              e.craftingtable["slot" + i],
              e.craftingtable["slot" + i + "amount"]
            )
          } else {
            craftingTableItems[i] = putInCursorFull(
              craftingTableItems[i],
              e.craftingtable["slot" + i],
              e.craftingtable["slot" + i + "amount"]
            )
          }
          craftingArray[i] = craftingTableItems[i].name
          craftingAmounts[i] = craftingTableItems[i].amount
          setCraftingTableOutput()

          break
        case "machine":
          if (steve.machines[i].name != "machine") {
            steve.machines[i].stoprecipe()
            steve.machines[i].inventoryslotid = -1
            putInCursorFull(steve.machines[i], e.machines["slot" + i])

            steve.machines[i] = new classes.machine()
            e.machines["slot" + i].className = "guiSlot machine"
          }
          break
        case "machineslot":
          if (isShiftOn) {
            steve.machines[i].inventory[key] = steve.addToInventory(
              steve.machines[i].inventory[key]
            )

            if (istooltip) e.tooltip.style.display = "none"

            putItemInslot(
              steve.machines[i].inventory[key],
              e[steve.machines[i].machinetype]["slot" + slotid],
              e[steve.machines[i].machinetype]["slot" + slotid + "amount"]
            )
          } else {
            steve.machines[i].inventory[key] = putInCursorFull(
              steve.machines[i].inventory[key],
              e[steve.machines[i].machinetype]["slot" + slotid],
              e[steve.machines[i].machinetype]["slot" + slotid + "amount"]
            )
          }

          steve.machines[i].doRecipe()
          if (!steve.machines[i].checkvalidnes()) steve.machines[i].stoprecipe()
          break
        case "anviloutput":
          new Howl({
            src: ["./sounds/random/anvil_use.ogg"],
          }).play()
          steve.machines[i].inventory.input = new classes.empty()
          putItemInslot(
            steve.machines[i].inventory.input,
            e[steve.machines[i].name]["slot0"],
            e[steve.machines[i].name]["slot0amount"]
          )
          steve.machines[i].inventory.output = putInCursorFull(
            steve.machines[i].inventory.output,
            e[steve.machines[i].name]["slot" + slotid],
            e[steve.machines[i].name]["slot" + slotid + "amount"]
          )
          break
        case "backpack":
          if (/*steve.backpacks[i].name != "backpack"*/ true) {
            //steve.machines[i].inventoryslotid = -1;
            putInCursorFull(steve.backpacks[i], e.backpacks["slot" + i])

            steve.backpacks[i] = new classes.empty()
            e.backpacks["slot" + i].className = "guiSlot empty"
          }
          break
        case "backpackslot":
          if (isShiftOn) {
            steve.backpacks[i].inventory[key] = steve.addToInventory(
              steve.backpacks[i].inventory[key]
            )

            if (istooltip) e.tooltip.style.display = "none"

            putItemInslot(
              steve.backpacks[i].inventory[key],
              e.backpack[key],
              e.backpack[key + "amount"]
            )
          } else {
            steve.backpacks[i].inventory[key] = putInCursorFull(
              steve.backpacks[i].inventory[key],
              e.backpack[key],
              e.backpack[key + "amount"]
            )
          }
          break
        case "accessory":
          if (isShiftOn) {
            let item = steve.accessorybag.removeFromInventory(i)
            item = steve.addToInventory(item)
            if (item.name != "empty")
              item = steve.accessorybag.addToInventory(item)

            if (istooltip) e.tooltip.style.display = "none"
          } else {
            itemInCursor = steve.accessorybag.removeFromInventory(i)
            putInCursor()
          }
          break
      }
      if (armornames.includes(type)) {
        steve.removeStats(steve[type])
        steve.removeEnchants(steve[type])
        if (steve[type].DeActivate != undefined) steve[type].DeActivate()
        steve[type] = putInCursorFull(steve[type], e.armorgui[type])
        e.armorgui[type].className = "guiSlot " + type + "gui"
      }
    } else {
      switch (type) {
        case "inventory":
          if (isShiftOn) {
            if (istooltip) e.tooltip.style.display = "none"
            if (thismachinei > -2) {
              steve.inventory[i] = steve.machines[thismachinei].addToInventory(
                steve.inventory[i]
              )
              steve.machines[thismachinei].doRecipe()
              putItemInslot(
                steve.inventory[i],
                e.inventory["slot" + i],
                e.inventory["slot" + i + "amount"]
              )
              if (i == currentHotbarSlot) selectHotbarItem(i)
            } else if (thismachinei <= -1000) {
              steve.inventory[i] = steve.backpacks[
                -1 * thismachinei - 1000
              ].addToInventory(steve.inventory[i])

              putItemInslot(
                steve.inventory[i],
                e.inventory["slot" + i],
                e.inventory["slot" + i + "amount"]
              )
              if (i == currentHotbarSlot) selectHotbarItem(i)
            } else if (thismachinei == -3) {
              steve.inventory[i] = steve.accessorybag.addToInventory(
                steve.inventory[i]
              )

              putItemInslot(
                steve.inventory[i],
                e.inventory["slot" + i],
                e.inventory["slot" + i + "amount"]
              )
              if (i == currentHotbarSlot) selectHotbarItem(i)
            } else {
              if (i < 9) {
                steve.inventory[i] = steve.addToInventory(
                  steve.inventory[i],
                  9,
                  36
                )
              } else {
                steve.inventory[i] = steve.addToInventory(
                  steve.inventory[i],
                  0,
                  9
                )
              }
              putItemInslot(
                steve.inventory[i],
                e.inventory["slot" + i],
                e.inventory["slot" + i + "amount"]
              )
              if (i == currentHotbarSlot) selectHotbarItem(i)
            }
          } else {
            steve.inventory[i] = PutInSlotFull(
              steve.inventory[i],
              e.inventory["slot" + i],
              e.inventory["slot" + i + "amount"]
            )
            if (i == currentHotbarSlot) selectHotbarItem(i)
          }

          break
        case "craftingtable":
          if (isShiftOn) {
            craftingTableItems[i] = steve.addToInventory(craftingTableItems[i])

            if (istooltip) e.tooltip.style.display = "none"
            craftingTableItems[i] = new classes.empty()

            putItemInslot(
              craftingTableItems[i],
              e.craftingtable["slot" + i],
              e.craftingtable["slot" + i + "amount"]
            )
          } else {
            craftingTableItems[i] = PutInSlotFull(
              craftingTableItems[i],
              e.craftingtable["slot" + i],
              e.craftingtable["slot" + i + "amount"]
            )
          }

          craftingArray[i] = craftingTableItems[i].name
          craftingAmounts[i] = craftingTableItems[i].amount
          setCraftingTableOutput()
          break
        case "machine":
          if (steve.machines[i].name == "machine") {
            if (itemInCursor.type == "machine") {
              steve.machines[i] = PutInSlotFull(
                steve.machines[i],
                e.machines["slot" + i]
              )
              steve.machines[i].inventoryslotid = i
              steve.machines[i].doRecipe()
            }
          }
          break
        case "machineslot":
          if (isShiftOn) {
            steve.machines[i].inventory[key] = steve.addToInventory(
              steve.machines[i].inventory[key]
            )

            if (istooltip) e.tooltip.style.display = "none"

            putItemInslot(
              steve.machines[i].inventory[key],
              e[steve.machines[i].machinetype]["slot" + slotid],
              e[steve.machines[i].machinetype]["slot" + slotid + "amount"]
            )
          } else {
            if (!key.includes("output")) {
              steve.machines[i].inventory[key] = PutInSlotFull(
                steve.machines[i].inventory[key],
                e[steve.machines[i].machinetype]["slot" + slotid],
                e[steve.machines[i].machinetype]["slot" + slotid + "amount"]
              )
            }
          }
          steve.machines[i].doRecipe()
          if (!steve.machines[i].checkvalidnes()) steve.machines[i].stoprecipe()
          break
        case "backpack":
          if (/*steve.machines[i].name == "machine"*/ true) {
            if (itemInCursor.type == "backpack") {
              steve.backpacks[i] = PutInSlotFull(
                steve.backpacks[i],
                e.backpacks["slot" + i]
              )
              //steve.machines[i].inventoryslotid = i;
            }
          }
          break
        case "backpackslot":
          if (isShiftOn) {
            steve.backpacks[i].inventory[key] = steve.addToInventory(
              steve.backpacks[i].inventory[key]
            )

            if (istooltip) e.tooltip.style.display = "none"

            putItemInslot(
              steve.backpacks[i].inventory[key],
              e.backpack[key],
              e.backpack[key + "amount"]
            )
          } else {
            steve.backpacks[i].inventory[key] = PutInSlotFull(
              steve.backpacks[i].inventory[key],
              e.backpack[key],
              e.backpack[key + "amount"]
            )
          }
          break
        case "accessory":
          if (isShiftOn) {
            let item = steve.accessorybag.removeFromInventory(i)
            item = steve.addToInventory(item)
            if (item.name != "empty")
              item = steve.accessorybag.addToInventory(item)

            if (istooltip) e.tooltip.style.display = "none"
          } else {
            if (itemInCursor.type == "accessory")
              itemInCursor = steve.accessorybag.addToInventory(itemInCursor)
            putInCursor()
          }
          break
      }
      if (armornames.includes(type)) {
        if (steve[type].name == "empty") {
          if (
            itemInCursor.type == type ||
            itemInCursor.type == type.slice(0, -1)
          ) {
            steve.equipItem(itemInCursor, steve[type])

            steve[type] = PutInSlotFull(steve[type], e.armorgui[type])
            if (steve[type].Activate != undefined) steve[type].Activate()
          }
        }
      }
    }
  }
}

function saveInventory() {
  localStorage.setItem("RPGinventory", JSON.stringify(steve.inventory))
}


function blockreplacement(mapLayoutY, mapLayoutX, y, x, replacement, layer) {
  MAP.mapLayout[mapLayoutY][mapLayoutX][y][x][layer] = replacement
  if (mapX == mapLayoutX && mapY == mapY) {
    maphtml[y][x][layer].classList =
      (layer ? "blockfloor " : "block ") + replacement
    currentmap[y][x][layer] = replacement
  }
}
function makestats(item, plus = "+") {
  let str = ""
  for (const key in item.stats) {
    if (!hiddenstats.includes(key)) {
      str +=
        color(getName(key) + ": ", "lightgray") +
        color(
          (typeof item.stats[key] == "string"
            ? item.stats[key]
            : item.stats[key] >= 0
            ? plus + item.stats[key]
            : item.stats[key]) + "<br> ",
          getStatColor(key)
        )
    }
  }
  return str
}

function makeinventory(item) {
  let str = ""
  if (item.inventory != undefined) {
    let iter = 1
    for (const key in item.inventory) {
      if (item.inventory[key].name != "empty") {
        str +=
          (item.inventory[key].Rname == ""
            ? color(
                getName(item.inventory[key].name),
                raritycolors[item.inventory[key].rarity]
              )
            : color(
                item.inventory[key].Rname,
                item.inventory[key].customcolor
              )) +
          " x" +
          item.inventory[key].amount +
          ", "

        if (iter % 2 == 0) str += "<br>"
        iter++
      }
    }
    if (str != "") str = br + color("Inventory: ", "lime") + br + str
    str += "<br>"
  }
  return str
}
function makeConsumable(item) {
  let str = ""
  if (item.addedstats != undefined) {
    str +=
      "<br>" +
      color(
        "Effects(Other Then Health)<br>Lasts For " +
          HumanReadibleTime(item.effectLength) +
          "<br>",
        "lime"
      )
    for (const key in item.addedstats) {
      str +=
        getName(key) +
        ": " +
        color(
          item.addedstats[key] >= 0
            ? "+ " + item.addedstats[key]
            : "- " + item.addedstats[key].toString().substr(1),
          getStatColor(key)
        ) +
        br
    }
  }
  return str
}
function makeEnchants(item) {
  let str = ""
  if (item.enchants != undefined) {
    if (item.name == "enchantingpaste") {
      for (const key in item.enchants) {
        str +=
          br +
          color(
            (Names[key] || key[0].toUpperCase() + key.slice(1)) +
              " " +
              RomanNumerals.toRoman(item.enchants[key]),
            "lightblue"
          ) +
          br +
          getEnchantDescription(key, item.enchants[key]) +
          br
      }
    } else {
      str = br
      let iter = 0
      for (const key in item.enchants) {
        str +=
          color(
            (Names[key] || key[0].toUpperCase() + key.slice(1)) +
              " " +
              RomanNumerals.toRoman(item.enchants[key]),
            "lightblue"
          ) + "  "

        if (iter % 2 == 1) str += br
        iter++
      }
      if (iter % 2 == 1) str += br
      str += br
    }
  }
  return str
}

function makeCollectionToolTip(item) {
  if (itemInCursor == "none") {
    itemintooltip = item.name //used in recipe search
    e.tooltip.className = "tooltipimg"
    istooltip = true
    e.tooltip.style.top = +e.tooltip.style.top.slice(0, -2) - 100 + "px"
    e.tooltip.style.display = "block"
    e.tooltip.innerHTML =
      color(
        Names[item] || item[0].toUpperCase() + item.substring(1),
        "yellow"
      ) +
      br +
      color("Collection amount: ", "gray") +
      color(steve.collectionitems[item], "green") +
      br +
      br +
      color("Rewards: ", "yellow") +
      br
    const ca = getCollectionAmounts(item)
  
    for(const key in collections[item]){
      e.tooltip.innerHTML += (steve.collectionlevels[item] < key
        ? color(ca[key].formate(3, 1) + ": ", "lightgray") +
          color(collections[item][key].message, "lightblue")
        : color(ca[key].formate(3, 1) + ": " + collections[item][key].message, "lime")) + br
    
    }
   
  }
}
let br = "<br>"

let itemintooltip
let istooltip
/**
 * Gets Localized Name, if no localized name, returns name with first letter Uppercase
 *
 */
function getName(name) {
  let str = ""
  if (name.includes("glitched")) {
    str = "Glitched "
    name = name.slice(8)
  }
  str += Names[name] || name[0].toUpperCase() + name.substring(1)
  return str
}
function makeSteveToolTip() {
  if (itemInCursor == "none") {
    e.tooltip.className = "tooltipimg"
    istooltip = true
    e.tooltip.style.top = +e.tooltip.style.top.slice(0, -2) - 100 + "px"
    e.tooltip.style.display = "block"
    e.tooltip.innerHTML =
      steve.nick + br + br + br + makestats(steve, "") +  br + "Total kills: " + steve.kills.color("red") + br+
      "Playtime: " + playerAgeString() + br
  }
}

function makeToolTip(item) {
  if (itemInCursor == "none") {
    if (item.name == "empty" || item.name == "machine") {
      e.tooltip.style.display = "none"
    } else {
      itemintooltip = item.name //used in recipe search
      e.tooltip.className = "tooltipimg"
      istooltip = true
      e.tooltip.style.top = +e.tooltip.style.top.slice(0, -2) - 100 + "px"
      e.tooltip.style.display = "block"
      e.tooltip.innerHTML =
        (item.Rname == ""
          ? color(getName(item.name), raritycolors[item.rarity]) + br
          : color(item.Rname, item.customcolor) + br) +
        (item.description == "" ? "" : item.description + br) +
        (item.burnvalue > 0
          ? color("Burn Time: " + item.burnvalue + " ticks", "gray") + br
          : "") +
        makeEnchants(item) +
        (item.family == undefined
          ? ""
          : "Talisman Family: " + color(getName(item.family), "magenta") + br) +
        makeinventory(item) +
        makestats(item) +
        makeConsumable(item) +
        (item.description2 == "" ? "" : item.description2 + br) +
        "<br><br>" +
        color(
          " " +
            raritynames[item.rarity] +
            " " +
            (item.type == "none" ? "" : item.type) +
            (item.stats == undefined || item.stats.tool == undefined
              ? ""
              : item.stats.tool == "none"
              ? ""
              : item.stats.tool),
          raritycolors[item.rarity],
          800
        )
    }
    return true
  }
  return false
}

function breakblock(block) {
  keys[5] = 1
  let clickX = (+block.style.left.slice(0, -2) / 5) >> 0
  let clickY = (+block.style.top.slice(0, -2) / 5) >> 0
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
      ]()
      currentblock["maxhardness"] = currentblock.block.hardness
      currentblock["x"] = clickX
      currentblock["y"] = clickY
      currentblock["layer"] = currentmap[clickY][clickX][0] == "air" 
      ? 1 : 0
     
      if (currentblock.block.isBreakable && steve.isInRange(currentblock)) {
        if (
          currentblock.block.tier <= steve.stats.tooltier &&
          (!currentblock.block.restrictTool ||
            steve.stats.tool.match1word(currentblock.block.tool))
        ) {
          if (breaktimer == 0) {
            if (steve.getMiningSpeed() >= currentblock.block.hardness) {
             
              steve.breakblock(currentblock)
            } else {
              
              e.progressbar.style.display = "block"
              e.progressbarInside.style.backgroundColor = "green"
              e.progressbartext.innerText = ""

              breaktimer = setTimeout(function () {
                steve.breakblock(currentblock)
              }, 100)
            }
          }
        }
      }
    }
  }
}
let steve = new player()
function savePlayer(Nick) {
  players[Nick] = steve
  localStorage.setItem("RPGPlayer", JSON.stringify(players))
}
let players
function loadPlayer(Nick) {
  players = JSON.parse(localStorage.getItem("RPGPlayer"))
  if (players == undefined || players == null) players = {}
  if (players[Nick.toLowerCase()] != undefined) {
    pl = players[Nick.toLowerCase()]
    for (const key1 in pl) {
      if (toload.includes(key1)) {
        if (key1 == "inventory") {
          for (let i = 0; i < pl.inventorySlots; i++) {
            steve.inventory[i] = loadInventoryItem(pl[key1][i])
          }
        } else if (armornames.includes(key1)) {
          steve[key1] = loadInventoryItem(pl[key1])
          steve.addStats(steve[key1])
          steve.addEnchants(steve[key1])
          if (steve[key1].Activate != undefined) steve[key1].Activate()
        } else if (key1 == "machines") {
          for (let i = 0; i < 9; i++) {
            steve.machines[i] = loadInventoryItem(pl[key1][i])
            steve.machines[i].inventoryslotid = i
            //pl[key1][i].inventoryslotid;
            if (steve.machines[i].name == "furnace")
              steve.machines[i].fuel = pl[key1][i].fuel
          }
        } else if (key1 == "backpacks") {
          for (let i = 0; i < 24; i++) {
            steve.backpacks[i] = loadInventoryItem(pl[key1][i])
          }
        } else if (key1 == "skillxp") {
          for (const key2 in pl.skillxp) steve.skillxp[key2] = pl.skillxp[key2]
        } else if (key1 == "collectionitems") {
          for (const key2 in pl.collectionitems)
            steve.collectionitems[key2] = pl.collectionitems[key2]
        } else if (key1 == "accessorybag") {
          for (let i = 0; i < maxaccesoriesslots; i++) {
            steve.accessorybag.addToInventory(
              loadInventoryItem(pl[key1].inventory[i]),
              i
            )
          }
        } else steve[key1] = pl[key1]
      }
    }
  } else {
    steve.nick = Nick
    players[Nick.toLowerCase()] = steve
  }
  steve.createPlayer()
  session.nick = session.nick.toLowerCase()
}
function loadInventoryItem(item) {
  let result = new classes[item.name](item.amount)
  result.Rname = item.Rname
  result.customcolor = item.customcolor
  if (item.enchants != undefined) result.enchants = item.enchants
  if (item.inventory != undefined) {
    for (const key2 in item.inventory) {
      result.inventory[key2] = loadInventoryItem(item.inventory[key2])
    }
  }
  return result
}
let lastmachine
/**
 * 0+  : steve.machines ,
 * -1,-2 : miscellaneos ,
 * -3: accesories,
 * -4: villager,
 * -1000 -> -inf : backpacks ,
 *
 *
 */
let thismachinei = -2
function openMachineGui(machine, id = 0) {
  if (machine.name != "machine" && machine.name != "empty") {
    if (id != -2) {
      if (lastmachine != undefined) e[lastmachine].style.display = "none"
    }
    makeToolTip(new classes.empty())
    disableInventoryGuis()
    if (!isNeiOpen) {
      e.inventory.style.display = "block"
    }
    let iter = 0
    if (machine.type == "backpack") {
      lastmachine = "backpack"
      e.backpackname.innerText =
        steve.backpacks[id].Rname == ""
          ? Names[steve.backpacks[id].name] ||
            steve.backpacks[id].name[0].toUpperCase() +
              steve.backpacks[id].name.substring(1)
          : steve.backpacks[id].Rname
      e.backpack.style.display = "block"
      thismachinei = -1000 - id
      for (const key in machine.inventory) {
        putItemInslot(
          machine.inventory[key],
          e.backpack["slot" + iter],
          e.backpack["slot" + iter + "amount"]
        )
        e.backpack["slot" + iter].setAttribute(
          "onclick",
          "LclickOnSlot( " + id + ",'backpackslot','" + key + "'," + iter + ")"
        )
        e.backpack["slot" + iter].setAttribute(
          "oncontextmenu",
          "RclickOnSlot( " +
            id +
            ",'backpackslot','" +
            key +
            "'," +
            iter +
            "); return false"
        )
        e.backpack["slot" + iter].setAttribute(
          "onmouseenter",
          "makeToolTip(steve.backpacks[" + id + "].inventory." + key + ")"
        )

        e.backpack["slot" + iter].setAttribute(
          "onmouseleave",
          "if(istooltip) e.tooltip.style.display ='none'"
        )
        iter++
      }
      for (let i = 0; i < maxbackpackslot; i++) {
        e.backpack["slot" + i].style.display =
          i < steve.backpacks[id].inventorySlots ? "block" : "none"
      }
    } else if (machine.name == "accessorybag") {
      lastmachine = "accessorybag"

      e.accessorybag.style.display = "block"
      thismachinei = -3
      machine.inventory.forEach((x, iter) => {
        putItemInslot(
          x,
          e.accessorybag["slot" + iter],
          e.accessorybag["slot" + iter + "amount"]
        )
        e.accessorybag["slot" + iter].setAttribute(
          "onclick",
          "LclickOnSlot( " + iter + ",'accessory')"
        )

        e.accessorybag["slot" + iter].setAttribute(
          "onmouseenter",
          "makeToolTip(steve.accessorybag.inventory[" + iter + "])"
        )

        e.accessorybag["slot" + iter].setAttribute(
          "onmouseleave",
          "if(istooltip) e.tooltip.style.display ='none'"
        )
      })
      for (let i = 0; i < maxaccesoriesslots; i++) {
        e.accessorybag["slot" + i].style.display =
          i < steve.stats.accessorybagslots ? "block" : "none"
      }
    } else if (machine.name == "villager") {
      lastmachine = "villagergui"
      toggleGui()
      disableInventoryGuis()
      e.coins.style.display = "block"
      e.inventory.style.display = "block"
      e.villagergui.style.display = "flex"
      e.villagergui.innerHTML = makeVillagerNameTag(machine.villagerName)
      thismachinei = -4
      villagerTrades[machine.villagerName].forEach((x, i) => {
        let tag = document.createElement("div")
        let amount = document.createElement("div")
        amount.setAttribute("class", "itemamount")

        // tag.setAttribute("oncontextmenu", "RclickOnSlot(" + i + "); return false")
        tag.setAttribute(
          "onmouseenter",
          "makePriceToolTip(   villagerTrades['" +
            machine.villagerName +
            "'][" +
            i +
            "].item," +
            x.price +
            ",'" +
            x.pricetype +
            "')"
        )

        tag.setAttribute(
          "onmouseleave",
          "if(istooltip) e.tooltip.style.display ='none'"
        )
        tag.className = "guiSlot "

        putItemInslot(x.item, tag, amount)
        tag.setAttribute(
          "onclick",
          "buyItem(villagerTrades['" +
            machine.villagerName +
            "'][" +
            i +
            "].item," +
            x.price +
            ",'" +
            x.pricetype +
            "')"
        )
        tag.appendChild(amount)
        e.villagergui.appendChild(tag)
      })
    } else {
      e[machine.machinetype].style.display = "block"
      thismachinei = id
      lastmachine = machine.machinetype
      if (this.inventory != undefined) {
        if (machine.machinetype == "supercompactor")
          for (let i = 0; i < maxCompactorSlots; i++) {
            e.supercompactor["slot" + i].style.display =
              i < machine.inventorySlots ? "block" : "none"
          }
        for (const key in machine.inventory) {
          putItemInslot(
            machine.inventory[key],
            e[machine.machinetype]["slot" + iter],
            e[machine.machinetype]["slot" + iter + "amount"]
          )
          if (isNeiOpen) {
            e[machine.machinetype]["slot" + iter].setAttribute(
              "onmouseenter",
              "makeToolTip(RecipeGueue[" + id + "].inventory." + key + ")"
            )
            e[machine.machinetype]["slot" + iter].setAttribute(
              "onmouseleave",
              "if(istooltip) e.tooltip.style.display ='none'"
            )
          } else {
            if (machine.machinetype == "anvil" && iter == 1) {
              e[machine.machinetype]["slot" + iter].setAttribute(
                "onclick",
                "LclickOnSlot( " +
                  id +
                  ",'anviloutput','" +
                  key +
                  "'," +
                  iter +
                  ")"
              )
            } else
              e[machine.machinetype]["slot" + iter].setAttribute(
                "onclick",
                "LclickOnSlot( " +
                  id +
                  ",'machineslot','" +
                  key +
                  "'," +
                  iter +
                  ")"
              )
            e[machine.machinetype]["slot" + iter].setAttribute(
              "oncontextmenu",
              "RclickOnSlot( " +
                id +
                ",'machineslot','" +
                key +
                "'," +
                iter +
                "); return false"
            )
            e[machine.machinetype]["slot" + iter].setAttribute(
              "onmouseenter",
              "makeToolTip(steve.machines[" + id + "].inventory." + key + ")"
            )

            e[machine.machinetype]["slot" + iter].setAttribute(
              "onmouseleave",
              "if(istooltip) e.tooltip.style.display ='none'"
            )
          }
          iter++
        }
      }
    }
  }
}
function reduceStack(input, amount) {
  input.amount -= amount
  return input.amount <= 0 ? new classes.empty() : input
}

function ScrollHandler(evt) {
  if (isNeiOpen) {
    if (evt.deltaY < 0) ShowRecipe(CurrentRecipeI - 1)
    if (evt.deltaY > 0) ShowRecipe(CurrentRecipeI + 1)
  } else if (!isGuiOpen) {
    e.inventory["slot" + currentHotbarSlot].style.borderWidth = "0.2vh"
    e.inventory["slot" + currentHotbarSlot].style.margin = "0.5vh"
    if (evt.deltaY < 0) currentHotbarSlot--
    if (evt.deltaY > 0) currentHotbarSlot++
    if (currentHotbarSlot > 8) currentHotbarSlot = 0
    if (currentHotbarSlot < 0) currentHotbarSlot = 8
    e.inventory["slot" + currentHotbarSlot].style.borderWidth = "0.6vh"
    e.inventory["slot" + currentHotbarSlot].style.margin = "0.1vh"
    selectHotbarItem(currentHotbarSlot)
  } else {
    if (evt.deltaY < 0)
      e.tooltip.style.top = +e.tooltip.style.top.slice(0, -2) - 6 + "px"
    if (evt.deltaY > 0)
      e.tooltip.style.top = +e.tooltip.style.top.slice(0, -2) + 6 + "px"
  }
  //deltaY == -100 scrollup
  //deltay == 100 scrolldown
}
function give(item, amount = 1) {
  steve.addToInventory(new classes[item](amount))
}
function clearMobs() {
  for (let i = 0; i < mobs.length; i++) {
    mobs[i].destroy()
  }

  mobs = []
}

function makeMonsterHotbar(id) {
  if (mobs[id].name == "villager") {
    e.progressbartext.innerText =
      getName(mobs[id].name) + " " + getName(mobs[id].villagerName)
  } else {
    e.progressbar.style.display = "block"
    e.progressbarInside.style.backgroundColor = "red"
    e.progressbartext.innerText =
      getName(mobs[id].name) +
      " [Lvl " +
      mobs[id].lvl +
      "] HP: " +
      mobs[id].stats.health +
      "/" +
      mobs[id].stats.maxhealth
    e.progressbarInside.style.width =
      (mobs[id].stats.health / mobs[id].stats.maxhealth) * 100 + "%"
  }
}

function openNoInventoryGui(name) {
  toggleInventory()
  e[name].style.display = "block"
  lastmachine = name
  thismachinei = -10000
}
function disableInventoryGuis() {
  isInventoryopen = false
  e.playerStats.style.display = "none"
  e.trashcan.style.display = "none"
  e.craftingtable.style.display = "none"
  e.armorgui.style.display = "none"
  e.machines.style.display = "none"
  e.guibuttons.style.display = "none"
  e.backpacks.style.display = "none"
  e.coins.style.display = "none"
  e.inventory.style.display = "none"
}
function HumanReadibleTime(seconds) {
  let minutes
  if (seconds >= 60) {
    minutes = Math.trunc(seconds / 60)
    seconds -= minutes * 60
  }
  seconds = "0" + seconds
  if (minutes > 0) return minutes + ":" + seconds.slice(-2)
  else return "0:" + seconds.slice(-2)
}
function color(text, color, weigth = 400) {
  return (
    "<span style='color:" +
    color +
    ";font-weight:" +
    weigth +
    " ;'>" +
    text +
    "</span>"
  )
}
function coin(size) {
  return (
    "<img style='width:" +
    size +
    "vh;height:" +
    size +
    "vh;display:inline;' src = 'img/coin.png'>"
  )
}
function recalculateStats() {
  let health = steve.stats.health
  const oldarmor = {}
  armornames.forEach((x) => {
    oldarmor[x] = steve[x]
    if (steve[x].DeActivate != undefined) {
      steve[x].DeActivate()
    }
    steve[x] = new classes.empty()
  })
  steve.stats = Object.assign(
    Object.create(Object.getPrototypeOf(steve.basicstats)),
    steve.basicstats
  )
  steve.itemInHand = new classes.empty()
  selectHotbarItem(currentHotbarSlot)
  steve.accessorybag.addAll()
  armornames.forEach((x) => {
    steve[x] = oldarmor[x]
    steve.addStats(oldarmor[x])
    steve.addEnchants(oldarmor[x])

    if (steve[x].Activate != undefined) {
      steve[x].Activate()
    }
  })
  for (const key in steve.skilllevels) {
    for (let i = 0; i < steve.skilllevels[key]; i++) {
      giveSkillReward(key, i, 1)
    }
  }
  steve.addAllFood()
  steve.setHealth(health)
}
function createTextures() {
  for (const key in classes) {
    if (!texturefilter.includes(key)) {
      let style = document.createElement("style")
      if (key.includes("glitched")) {
        style.innerHTML =
          "." +
          key +
          "{ background-image: url(img/" +
          key.slice(8) +
          ".png);  animation: paths 10s step-end infinite , colorRotate 6s linear 0s infinite; }"
      } else
        style.innerHTML =
          "." + key + "{ background-image: url(img/" + key + ".png); }"
      document.getElementsByTagName("head")[0].appendChild(style)
    }
  }
}
function randomAmount(amount, chance = 100) {
  if (random100(chance)) {
    return Math.floor(Math.random() * amount + 1)
  }
  return 0
}
function getEnchantCost(item) {
  let cost = 0
  for (const key in item.enchants) {
    cost += Enchants[key].cost * item.enchants[key]
  }

  return cost
}
function getStatColor(stat) {
  switch (stat) {
    case "maxhealth":
      return "#fa4a43"
    case "defence":
      return "#02a604"
    case "damage":
    case "strength":
      return "#ad2c28"
    case "speed":
      return "white"
    case "range":
      return "green"
    case "criticalchance":
    case "criticaldamage":
      return "#1373bd"
    case "accessorybagslots":
      return "lightblue"
    default:
      return "#ffd000"
  }
}
function getEnchantDescription(enchant, lvl) {
  switch (enchant) {
    case "sharpness":
      return "+" + 10 * lvl + "% Damage to mobs"
    case "smite":
      return "+" + 12 * lvl + "% Damage to  Undead mobs"
    case "efficiency":
      return "You mine " + 8 * lvl + "% faster"
    case "smeltingtouch":
      return "Automatically Smelt Blocks When Mining"

    default:
      return ""
  }
}
function MakeTextToolTip(text) {
  if (itemInCursor == "none") {
    e.tooltip.className = "tooltipimg"
    istooltip = true
    e.tooltip.style.top = +e.tooltip.style.top.slice(0, -2) - 100 + "px"
    e.tooltip.style.display = "block"
    e.tooltip.innerHTML = text
    if (text == "Skills") {
      e.tooltip.innerHTML += br + "Levels: " + br
      for (const key in skillnames) {
        e.tooltip.innerHTML +=
          skillnames[key] +
          ": " +
          color(steve.skilllevels[key], "yellow") +
          " (" +
          (
            (steve.skillxp[key] / skilllevelxp[steve.skilllevels[key]]) *
            100
          ).toFixed(0) +
          "%)" +
          br
      }
    }
    if (text.includes("Accessory")) {
      let iter = 0
      e.tooltip.innerHTML += br + "Currently Stores: " + br
      steve.accessorybag.inventory.forEach((x, i) => {
        if (x.name != "empty") {
          e.tooltip.innerHTML +=
            color(getName(x.name), raritycolors[x.rarity]) + ",  "
          iter++
          if (iter % 3 == 2) e.tooltip.innerHTML += br
        }
      })
      if (iter == 0) e.tooltip.innerHTML = text

      e.tooltip.innerHTML += br + br + br
    }
  }
}

let RV = {
  1000: "M",
  900: "CM",
  500: "D",
  400: "CD",
  100: "C",
  90: "XC",
  50: "L",
  40: "XL",
  10: "X",
  9: "IX",
  5: "V",
  4: "IV",
  1: "I",
}

RomanNumerals = {
  toRoman(value) {
    let str = ""
    let Val = Object.entries(RV).reverse()
    Val.forEach((x) => {
      if (value > 0) {
        str += x[1].repeat((value / +x[0]) >> 0)
        value -= ((value / +x[0]) >> 0) * +x[0]
      }
    })
    return str
  },
  fromRoman(value) {
    value = value.split("")
    let number = 0

    const f = (obj) =>
      Object.fromEntries(Object.entries(obj).map((a) => a.reverse()))
    let Val = f(RV)
    for (let i = 0; i < value.length; i++) {
      if (Val[value[i] + value[i + 1]] != undefined) {
        number += +Val[value[i] + value[i + 1]]
        i++
      } else if (Val[value[i]]) {
        number += +Val[value[i]]
      }
    }
    return number
  },
}

function enchantsConflict(item, enchantToAdd) {
  for (const key in item.enchants) {
    if (Enchants[key].conflict.includes(enchantToAdd)) return true
    //  if(key == "sharpness" && (enchantToAdd == "smite" || enchantToAdd == "baneofarthropods")) return true
    //  if(key == "smite" && (enchantToAdd == "sharpness" ||  enchantToAdd =="baneofarthropods")) return true
    //  if(key == "baneofarthropods" && (enchantToAdd == "smite" ||  enchantToAdd =="sharpness")) return true
  }
  return false
}

const harvestingTools = "pick axe"
const combatTools = "sword"

Enchants = {
  sharpness: {
    maxlvl: 5,
    tool: combatTools,
    cost: 100,
    conflict: "smite",
  },
  smite: {
    maxlvl: 5,
    tool: combatTools,
    cost: 100,
    conflict: "sharpness",
  },
  smeltingtouch: {
    maxlvl: 1,
    tool: harvestingTools,
    cost: 500,
    conflict: "",
  },
  efficiency: {
    maxlvl: 5,
    tool: harvestingTools,
    cost: 100,
    conflict: "",
  },
}

function givepaste(enchant, lvl = 5) {
  let paste = new classes.enchantingpaste(1)
  paste.enchants[enchant] = lvl
  steve.addToInventory(paste)
}
/**
 * Stores Nick Of Current Player
 */
let nick
let session = {
  nick: "",
  settings: {},
}
function loadObject(Original, LoadOne) {
  for (const key in LoadOne) {
    if (typeof LoadOne[key] == "object")
      Original[key] = loadObject(Original[key], LoadOne[key])
    else Original[key] = LoadOne[key]
  }
  return Original
}

function loadSession() {
  const cSession = JSON.parse(localStorage.getItem("RPGsessiondata"))
  if (cSession == null) {
    session.nick = prompt("Enter Your Nick") || "default"
  }
  session = loadObject(session, cSession)
}

function saveSession() {
  localStorage.setItem("RPGsessiondata", JSON.stringify(session))
}
let ShouldSaveOnLeave = true
function changeAccount(Nick) {
  onBeforeUnload()
  if (Nick == "newaccount") Nick = prompt("Enter Nick") || "default"
  session.nick = Nick
  saveSession()
  ShouldSaveOnLeave = false

  window.location.reload()
}
function removeKeysEvent() {
  window.removeEventListener("keydown", downButtonHandler)
}
function addKeysEvent() {
  window.addEventListener("keydown", downButtonHandler)
}
function wipeInput(element) {
  element.value = ""
}
let backpackContains = []
function formBackPackContains() {
  backpackContains = []
  steve.backpacks.forEach((x, i) => {
    let str = ""
    if (x.name != empty) {
      for (const y in x.inventory) {
        if (x.inventory[y].name != empty) {
          str += x.inventory[y].name + x.inventory[y].Rname
        }
      }
    }
    backpackContains.push(str)
  })
}
function highLightBackPacks() {
  for (let i = 0; i < backPacksInGui; i++) {
    if (
      e.backpackSeach.value != "" &&
      backpackContains[i].includes(e.backpackSeach.value)
    ) {
      e["backpackGui" + i].style.backgroundColor = "lime"
    } else e["backpackGui" + i].style.backgroundColor = "transparent"
  }
}
/**
 * Check if Item Is Empty
 *
 */
const isEmpty = (item) => {
  return item.name == "empty"
}
let isSettingsOpen = false
function OpenSettingsMenu() {
  if (!isGuiOpen) {
    if (isSettingsOpen) {
      e.settings.style.display = "none"
    } else {
      e.settings.style.display = "block"
    }
    isSettingsOpen = !isSettingsOpen
  }
}
function alphabetCode(length = 8) {
  let str = ""
  for (let i = 0; i < length; i++)
    str += codeAlphabet[Math.floor(Math.random() * 36)]
  return str
}
function changeSkin(skinpath = "default") {
  steve.skin = skinpath
  steve.applySkin()
}

function changeNick() {
  const NewNick = prompt("Enter New Nick")
  if (NewNick != null) {
    delete players[session.nick]
    session.nick = NewNick.toLowerCase()
    steve.nick = NewNick
    players[session.nick] = steve
    buildAccountSelector()
  }
}

function changeSkin() {
  const skin = prompt("Paste Skin Url Here")
  if (skin != null) {
    steve.skin = skin
    steve.applySkin()
  }
}
function deleteAccount(elem) {
  if (confirm("Are u sure you want to delete account: " + elem.value + "?")) {
    delete players[elem.value]
    buildAccountSelector()
  }
}
function makePriceToolTip(item, price, pricetype = "coins") {
  if (makeToolTip(item)) {
    e.tooltip.innerHTML += (br + "Price: " + price + " " + pricetype).color(
      "yellow"
    )
  }
}

function buyItem(item, price, pricetype) {
  if (itemInCursor == "none" || itemInCursor.name == item.name) {
    let isAffordable = false

    if (pricetype == "coins") {
      if (steve.coins >= price) isAffordable = true
    }
    if (isAffordable) {
      if (
        itemInCursor == "none" ||
        (itemInCursor != "none" && item.amount <= itemInCursor.getEmpty())
      ) {
        AddItemToCursor(item)
        if (pricetype == "coins") steve.addCoins(-1 * price)
      }
    }
  }
}
function makeVillagerNameTag(name) {
  return "<p class='villagername'>" + getName(name) + "</p>"
}
/**
 * coords are 5x
 */
function checkMapForBlock(y, x) {
  y = y >> 0
  x = x >> 0
  return !allowedblocks.includes(currentmap[y][x][0].slice(0, 9))
}
function playClickSound() {
  new Howl({
    src: ["./sounds/random/click.ogg"],
  }).play()
}
 
// //Experiment Area
// function createRandom(length,val = 100){
// let A = []
// for(let i = 0 ; i < length;i++){
//   A.push(Math.floor(Math.random() * val))
// }
// return A
// }
// function mySort(Arr){
//   let date = new Date()
// //const max = Math.max(...Arr)
// let end = new Array()
// for(let i = 0 ; i < Arr.length;i++){
//   end[Arr[i]] = Arr[i]

// }
// let end2 = []
// for(let i = 0 ; i < end.length;i++){
//   if(end[i] != undefined)
//   end2.push(end[i])

// }
// let endDate = new Date()
// console.log("Time: ",endDate - date )
// return end2

// }
// function defaultsort(A)
// {
//   let date = new Date()
//   A.sort()
//   let endDate = new Date()
//   console.log("Time: ",endDate - date )
// }

function getMobSound(mobname) {
  switch (mobname) {
    case "brutezombie":
      return "zombie"

    default:
      return mobname
  }
}

let mobHowl = 0
function playMobHowl(mobname, type, random = 2) {
  mobHowl = new Howl({
    src: [
      "./sounds/mob/" +
        getMobSound(mobname) +
        "/" +
        type +
        (random == 0 ? "" : 1 + Math.floor(Math.random() * random)) +
        ".ogg",
    ],
  })

  mobHowl.play()
}
function isBlockBetween(target1, target2) {
  let center1 = {
    x: target1.x + (target1.width / 2 || 2.5),
    y: target1.y + (target1.height / 2 || 2.5),
  }
  let center2 = {
    x: target2.x + (target2.width / 2 || 2.5),
    y: target2.y + (target2.height / 2 || 2.5),
  }
  let hipon = Math.sqrt(
    (center1.x - center2.x) ** 2 + (center1.y - center2.y) ** 2
  )
  let angleSin = Math.abs(center1.x - center2.x) / hipon

  let vectorspeed = [
    +(5 * angleSin).toFixed(2),
    +(5 * Math.cos(Math.asin(angleSin))).toFixed(2),
  ]
  if (center1.x > center2.x) vectorspeed[0] *= -1
  if (center1.y > center2.y) vectorspeed[1] *= -1
  for (let i = 0; i < Math.round(hipon) / 5; i++) {
    if (checkMapForBlock(center1.y / 5, center1.x / 5)) return true
    center1.x += vectorspeed[0]
    center1.y += vectorspeed[1]
  }
  return false
}
function stopBreakingOnMouseLeave(){
  steve.stopBreakingBlock()
}
function startBreakingOnMouseEnter(element){
  if(keys[5] == 1) breakblock(element)
}
function playerAgeString(){
  let age = steve.age
  let date = {
    days: steve.age/86400 >> 0,
    hours: steve.age/3600 >> 0,
    minutes: steve.age/60 >> 0 ,
    seconds: steve.age
  }
  date.seconds -= date.minutes*60
  date.minutes -= date.hours * 60
  date.hours -= date.days * 24
  return (date.days > 0? date.days.color("#069c03") + " Days " : "") +
  (date.hours > 0 || date.days > 0  ? date.hours.color("#069c03") + " Hours " : "") + 
  (date.days > 0 ? "" : date.minutes.color("#069c03") + " Minutes ") + 
  (date.hours > 0 || date.days > 0 ? "" : date.seconds.color("#069c03") + " Seconds")

}