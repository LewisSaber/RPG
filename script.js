let isLoaded = 0
let isMapModeOn
let mobs = []
let caneat = true
let currethowl
//WIP let Events = {}

const maxbackpackslot = 33 //size of biggest backpack
const maxaccesoriesslots = 33 //size of maxed accessory bag
const maxCompactorSlots = 16
/** How many packpacks Right Inventory Gui can have */
const backPacksInGui = 24
const SkillsDesc = "Skills"

function LOADING() {
  loadIDS()
  createTextures()
  mapX = 0
  mapY = 0
  loadMode()
  loadSession()
  generateMap()
  let armorArray = []
  armornames.forEach((x) => {
    armorArray.push(steve.armor[x])
  })
  inventoryGui.slots = steve.inventory.concat(armorArray)
  e.map.onmousedown = onMapClick

  window.onmousemove = function (evt) {
    timer = setTimeout(cursor.position(evt), 20)
  }
  window.oncontextmenu = function (evt) {
    steve.getItemInHandSlot().useAbility(evt)
    return false
  }

  if (!isMapModeOn) {
    e.map.onmousemove = cursorMoveOnMap
    loadPlayer(session.nick)
    steve.loadAccessoryBagGui()
    loadrecipes()
    // window.addEventListener("keydown",test);
    addKeysEvent()
    window.addEventListener("keyup", upButtonHandler)
    window.addEventListener("wheel", ScrollHandler)

    //window.addEventListener("mousedown", test);
    buildAccountSelector()
    buildvillagerGui()
    buildHotbar()
    buildArmorGui()
    buildBackpacks()
    buildmachines()
    buildSkills()
    buildCollections()
    loadskills()
    loadCollections()
    inventoryGui.close()
    mapGui.open()
    steve.accessorybag.onClick()
    steve.updateheathbar()
    // for (let i = 0; i < steve.inventorySlots; i++) {
    //   putItemInslot(
    //     steve.inventory[i],
    //     e.inventory["slot" + i],
    //     e.inventory["slot" + i + "amount"]
    //   )
    // }

    window.onbeforeunload = function () {
      onBeforeUnload()
    }

    window.onmouseup = function () {
      keys[5] = 0
    }

    steve.inventory[currentHotbarSlot].select()
    e.playertool.className = steve.getItemInHand().name
    steve.addCoins(0)
    steve.addHealth(1000000)
    steve.spawn()
    steve.machines.forEach(x =>{x.item.doRecipe?.()})

    // goToNextMap()
  } else {
    window.onbeforeunload = function (evt) {
      saveMap()
    }
    window.addEventListener("keydown", downButtonHandlerMap)
    window.addEventListener("keyup", upButtonHandlerMap)

    mapMode()
    centerMap()
  }
  isLoaded = 1
  //comsole.log("loaded")
}
function onBeforeUnload() {
  //comsole.log(isMapModeOn)
  if (isMapModeOn) {
    saveMap()
  }
  if (ShouldSaveOnLeave) {
    craftingTable.dumpTable()
    dumbtoinventory([cursor.getItem()])
    savePlayer(session.nick)
    saveSession()
  }
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
let keyStates = {}
let currentHotbarSlot = 0
let selectedItem
let isGuiOpen = false
function downButtonHandler(evt) {
  ////comsole.log(evt)
  // //comsole.log("down");
  if (
    (evt.code == "KeyE" && !keys[4]) ||
    (evt.code == "Escape" && !keyStates.Escape)
  ) {
    if (isNeiOpen) {
      isNeiOpen = false
      RecipeGueue = []
      lastGui.open()
    } else if (isGuiOpen) {
      if (activeGui.name == "inventory" || activeGui.name == "settings" || activeGui.name == "villager") {
        isGuiOpen = false
        mapGui.open()
      } else inventoryGui.open()
    } else {
      isGuiOpen = true
      inventoryGui.open()
    }
    // if (isNeiOpen) {
    //   toggleNei()
    //   toggleInventory()
    // } else if (thismachinei != -2) {
    //   thismachinei = -2
    //   toggleInventory()
    // } else {
    //   toggleGui()
    //   toggleInventory()
    // }
  }
  if (evt.code == "KeyR" && !keys[6]) {
    findCraftingRecipes()
    ShowRecipe(currentRecipeI)
  }

  if (evt.code == "KeyU" && !keys[7]) {
    findUsageRecipes()
    ShowRecipe(currentRecipeI)
  }
  if (evt.code == "KeyM" && !keyStates.m) {
    steve.sortInventory()
  }
  if (evt.code == "ShiftLeft" && !isShiftOn) {
    isShiftOn = true
    if (lastToolTip != "none") {
      makeToolTip(lastToolTip.value, lastToolTip.addSelling)
    }
   
  }

  switch (evt.code) {
    case "KeyW":
      keys[0] = 1
      break
    case "KeyA":
      keys[1] = 1
      break
    case "KeyS":
      keys[2] = 1
      break
    case "KeyD":
      keys[3] = 1

      break
    case "KeyE":
      keys[4] = 1
      break
    case "KeyR":
      keys[6] = 1
      break
    case "KeyU":
      keys[7] = 1
      break
    case "ShiftLeft":
      isShiftOn = 1
      break

    default:
      keyStates[evt.code] = 1
      break
  }
  switch (evt.code) {
    case "KeyW":
    case "KeyA":
    case "KeyS":
    case "KeyD":
      if (!movetimer) {
        steve.move()
        movetimer = setInterval(function () {
          steve.move()
        }, 25)
      }

      break
  }
  if (/\b[1-9]/.test(evt.key) && !isInventoryopen) {
    let key = +evt.key
    key--
    steve.inventory[currentHotbarSlot].unSelect()
    currentHotbarSlot = key
    steve.inventory[currentHotbarSlot].select()
    e.playertool.className = steve.getItemInHand().name
  }
}
isNeiOpen = false

function upButtonHandler(evt) {
  if (evt.code == "ShiftLeft" && isShiftOn) {
    isShiftOn = false
    if (lastToolTip != "none") {
      makeToolTip(lastToolTip.value, lastToolTip.addSelling)
    }
    
  }

  switch (evt.code) {
    case "KeyW":
      keys[0] = 0
      break
    case "KeyA":
      keys[1] = 0
      break
    case "KeyS":
      keys[2] = 0
      break
    case "KeyD":
      keys[3] = 0

      break
    case "KeyE":
      keys[4] = 0
      break
    case "KeyR":
      keys[6] = 0
      break
    case "KeyU":
      keys[7] = 0
      break
    case "ShiftLeft":
      isShiftOn = 0
      break

    default:
      keyStates[evt.code] = 0
      break
  }
}
function random(r) {
  r = Math.round(r)
  return Math.floor(Math.random() * r) == 0
}

function switchmode() {
  localStorage.setItem("RPGeditmode", JSON.stringify(!isMapModeOn))

  window.location.reload()
}

function loadMode() {
  isMapModeOn = JSON.parse(localStorage.getItem("RPGeditmode"))
  if (isMapModeOn == null) isMapModeOn = 0
}

isInventoryopen = false
isGuiOpen = false

const inventoryGui = new Gui(
  "inventory",
  [
    $("#inventory")[0],
    $("#craftingtable")[0],
    $("#backpacks")[0],
    $("#coins")[0],
    $("#guibuttons")[0],
    $("#hotbar")[0],
    $("#armorgui")[0],
    $("#machines")[0],
    $("#trashcan")[0],
    $("#playerStats")[0],
  ],
  undefined,
  {
    onopen: function () {
      craftingTable.dumpTable()
    },
  }
)
const mapGui = new Gui(
  "map",
  [$("#hotbar")[0], $("#healthbar")[0]],
  undefined,
  {
    needsHandler: false,
    movesHotbar: false,
    onopen: function () {
      e.playertool.className = steve.getItemInHand().name
    },
  }
)
const collectionGui = new Gui(
  "collections",
  [$("#collections")[0]],
  undefined,
  { movesHotbar: false }
)
const skillGui = new Gui("skills", [$("#skills")[0]], undefined, {
  movesHotbar: false,
})
let activeGui = mapGui

let breaktimer = 0
let currentblock = {}

function deleteItemInCursor() {
  cursor.putItem(new classes.empty())
  // e.tooltip.className = ""
  makeToolTip(new classes.empty())
}

function saveInventory() {
  localStorage.setItem("RPGinventory", JSON.stringify(steve.inventory))
}

function blockreplacement(y, x, layer, replacement) {
  map.layout[y][x][layer] = replacement
  if (replacement.includes("tree")) {
    let tag = document.getElementById(replacement + " " + x + " " + y)
    tag.className = replacement + " mapblock"
  } else drawMapBlock(x, y)
}
function makeStatSpan(amount, statname, symbolflag = "+") {
  return (
    (amount >= 0 ? symbolflag : "") +
    amount.formateComas(0) +
    getStatIcon(statname)
  ).color(getStatColor(statname))
}

function makestats(item, plus = "+") {
  let str = ""
  for (const key in item.stats) {
    if (!hiddenstats.includes(key)) {
      str +=
        color(getName(key) + ": ", "lightgray") +
        (typeof item.stats[key] == "string"
          ? item.stats[key].color(getStatColor(key))
          : makeStatSpan(item.stats[key], key, plus)) +
        br
    }
  }
  return str + br
}

function makeinventory(item, inventoryName = "Inventory: ") {
  let str = ""
  if (item.inventory != undefined) {
    let iter = 0
    let list = {}
    for (const key in item.inventory) {
      if (
        typeof item.inventory[key] != "function" &&
        item.inventory[key].getItem().name != "empty"
      ) {
        if (item.inventory[key].getItem().Rname) {
          if (!list[item.inventory[key].getItem().Rname]) {
            list[item.inventory[key].getItem().Rname] = {
              amount: item.inventory[key].getItem().amount,
              name: item.inventory[key].getItem().Rname,
              color: item.inventory[key].getItem().customcolor,
            }
          } else {
            list[item.inventory[key].getItem().Rname].amount +=
              item.inventory[key].getItem().amount
          }
        } else {
          if (!list[item.inventory[key].getItem().name]) {
            list[item.inventory[key].getItem().name] = {
              amount: item.inventory[key].getItem().amount,
              name: getName(item.inventory[key].getItem().name),
              color: raritycolors[item.inventory[key].getItem().rarity],
            }
          } else {
            list[item.inventory[key].getItem().name].amount +=
              item.inventory[key].getItem().amount
          }
        }
      }
    }
    for (const key in list) {
      str +=
        "x" +
        list[key].amount +
        " " +
        list[key].name.color(list[key].color) +
        ", "
      if (iter % 2 == 1) str += br
      iter++
    }
    if (str != "")
      str = br + color(inventoryName, "#a62525") + br + str + br + br
  }
  return str
}
/**
 * creates String like:
 * Protection V
 * Sharpness V
 */
const enchantTooltip = (enchant, lvl) =>
  getName(enchant) + " " + RomanNumerals.toRoman(lvl)
const enchantsColorInToolTip = "#1df700"
function makeEnchants(item) {
  let str = ""
  if (item.enchants != undefined) {
    if (
      item.name == "enchantingpaste" ||
      Object.keys(item.enchants).length <= session.settings.enchDescLimit
    ) {
      let iter = 0
      for (const key in item.enchants) {
        str +=
          enchantTooltip(key, item.enchants[key]).color(
            enchantsColorInToolTip
          ) +
          br +
          Enchants[key].getDescriprion(item.enchants[key]) +
          br
        // br +
        // color(
        //   (Names[key] || key[0].toUpperCase() + key.slice(1)) +
        //     " " +
        //     RomanNumerals.toRoman(item.enchants[key]),
        //   "lightblue"
        // ) +
        // br +
        // Enchants[key].getDescriprion(item.enchants[key])
        // +
        // br
        iter++
      }
      str += br
      if (iter == 0) str = ""
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
  let str =
    getName(item).color("yellow") +
    br +
    "Collection amount: ".color("lightgray") +
    steve.collectionitems[item].formateComas().color("lime") +
    br +
    br +
    "REWARDS:".color("yellow") +
    br

  for (const key of collections[item]) {
    str +=
      (steve.collectionitems[item] < key.amount
        ? color(key.amount.formate(3, 1) + ": ", "lightgray") +
          color(key.message, "lightblue")
        : color(key.amount.formate(3, 1) + ": " + key.message, "lime")) + br
  }
  makeToolTip(str)
}

let br = "<br>"

let itemintooltip

/**
 * Gets Localized Name, if no localized name, returns name with first letter Uppercase
 *
 */
function getName(name) {
  let str = ""
  if (Names[name] == undefined) {
    for (let i = 0; i < keywords.length; i++) {
      if (name.includes(keywords[i])) {
        name = name.replace(
          keywords[i],
          " " + keywords[i].toUpperLetter() + " "
        )
        str = name
          .split(" ")
          .map((x) => (x == "" ? "" : Names[x] ? Names[x] : x.toUpperLetter()))
          .join(" ")

        i = 1000
      }
    }
    if (str == "") str += name.toUpperLetter()
  } else str += Names[name]
  return str
}

function makeSteveToolTip() {
  let str =
    steve.nick +
    br.repeat(3) +
    "Health: " +
    makeStatSpan(steve.getMaxHealth(), "maxhealth", "") +
    br +
    "Defense: " +
    makeStatSpan(steve.getDefense(""), "defense", "") +
    br +
    "Strength: " +
    makeStatSpan(steve.getStat("strength"), "strength", "") +
    br +
    "Speed: " +
    makeStatSpan(steve.getStat("speed"), "speed", "") +
    br +
    "Crit Chance: " +
    makeStatSpan(steve.getStat("criticalchance"), "criticalchance", "") +
    br +
    "Crit Damage: " +
    makeStatSpan(steve.getCriticalDamage(""), "criticaldamage", "") +
    br +
    "Mining Speed: " +
    makeStatSpan(steve.getMiningSpeed(""), "miningspeed", "") +
    br

  for (const key in steve.fortunes) {
    if (key != "none") {
      str +=
        getName(key) +
        " Fortune: " +
        makeStatSpan(steve.fortunes[key]() * 100, key + "fortune", "") +
        br
    }
  }
  str +=
    "Magic Find: " +
    makeStatSpan(steve.getStat("magicfind"), "magicfind", "") +
    br

  str +=
    "Total kills: " +
    (steve.kills + "💀").color("red") +
    br +
    "Playtime: " +
    playerAgeString() +
    br

  makeToolTip(str)
}

function makeConsumable(item) {
  let str = ""
  if (item.addedstats != undefined) {
   str += "Effects: ".color("lime") + br
   if(item.effectLength)
   str += "- Duration: " + HumanReadibleTime(item.effectLength).color("orange") + br
    for (const key in item.addedstats) {
      str += "- " +
        color(getName(key) + ": ", "lightgray") +
        makeStatSpan(item.addedstats[key], key, "+") +
        br
    }
    str += br
  }
 
  return str
}

function breakblock(x, y) {
  keys[5] = 1

  if (
    classes[map.layout[y][x][map.layout[y][x][0] == "air" ? 1 : 0]] != undefined
  ) {
    currentblock["block"] = new classes[
      map.layout[y][x][map.layout[y][x][0] == "air" ? 1 : 0]
    ]()
    currentblock["maxhardness"] = currentblock.block.hardness
    currentblock["x"] = x
    currentblock["y"] = y
    currentblock["layer"] = map.layout[y][x][0] == "air" ? 1 : 0

    if (currentblock.block.isBreakable && steve.isInRange(currentblock)) {
      //comsole.log(currentblock.block.tier)
      if (
        currentblock.block.tier <= steve.getToolTier() &&
        (!currentblock.block.restrictTool ||
          steve.getTool().match1word(currentblock.block.tool))
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
function removeSlotInstance(object) {
  if (object != null) {
    for (const key in object) {
      if (object[key] instanceof Slot) {
        object[key] = object[key].item
      } else if (
        typeof object[key] == "object" &&
        !(object[key] instanceof HTMLElement)
      ) {
        object[key] = removeSlotInstance(object[key])
      }
    }
  }
  return object
}
const itemSaveValues = [
  "name",
  "Rname",
  "enchants",
  "inventory",
  "kills",
  "customcolor",
  "obitained",
  "amount",
]
/**
 * Removes useless data from item
 */
function removeUselessItemInfo(item) {
  for (const key in item) {
    if (!itemSaveValues.includes(key)) {
      delete item[key]
    }
    if (key == "inventory") {
      item[key] = removeSlotInstance(item[key])
      item[key] = removeUselessItemData(item[key])
    }
  }
  return item
}
/**
 * Detects all items in container
 * @param {itemContainer} object
 * @returns
 */
function removeUselessItemData(object) {
  for (const key in object) {
    if (object[key].name) {
      object[key] = removeUselessItemInfo(object[key])
    } else if (typeof object[key] == "object") {
      object[key] = removeUselessItemData(object[key])
    }
  }
  return object
}
/**
 * @type {player}
 */
let steve = new player()
function savePlayer(Nick) {
  players[Nick] = Object.assign(
    Object.create(Object.getPrototypeOf(steve)),
    steve
  )

  for (const key in players[Nick]) {
    if (!toSave.includes(key)) {
      delete players[Nick][key]
    }
  }
  players[Nick] = removeSlotInstance(players[Nick])
  players[Nick] = removeUselessItemData(players[Nick])
  localStorage.setItem("RPGPlayer", JSON.stringify(players))
}

let players
function loadPlayer(Nick) {
  players = JSON.parse(localStorage.getItem("RPGPlayer"))
  if (players == undefined || players == null) players = {}
  if (players[Nick.toLowerCase()] != undefined) {
    pl = players[Nick.toLowerCase()]
    for (const key1 in pl) {
      if (toSave.includes(key1)) {
        // console.log(key1)
        if (key1 == "inventory") {
          for (let i = 0; i < pl.inventorySlots; i++) {
            steve.inventory[i].putItem(loadInventoryItem(pl[key1][i]))
          }
        } else if (armornames.includes(key1)) {
          steve.armor[key1].putItem(loadInventoryItem(pl[key1]))
        } else if (key1 == "armor") {
          armornames.forEach((x) => {
            steve.armor[x].putItem(loadInventoryItem(pl.armor[x]))
          })
        } else if (key1 == "machines") {
          console.log("loaing machines")
          for (let i = 0; i < 9; i++) {
            steve.machines[i].putItem(loadInventoryItem(pl[key1][i]))
            if (steve.machines[i].item.name == "anvil") {
              steve.machines[i].item.id = 3

              steve.machines[i].item.inventory[0].properties.onPostClick()
            }

            //pl[key1][i].inventoryslotid;
            if (steve.machines[i].name == "furnace")
              steve.machines[i].item.fuel = pl[key1][i].fuel
          }
        } else if (key1 == "backpacks") {
          for (let i = 0; i < 24; i++) {
            steve.backpacks[i].putItem(loadInventoryItem(pl[key1][i]))
          }
        } else if (key1 == "skillxp") {
          for (const key2 in pl.skillxp) steve.skillxp[key2] = pl.skillxp[key2]
        } else if (key1 == "collectionitems") {
          for (const key2 in pl.collectionitems)
            steve.collectionitems[key2] = pl.collectionitems[key2]
        } else if (key1 == "accessorybag") {
          for (let i = 0; i < maxaccesoriesslots; i++) {
            steve.accessorybag.inventory[i].putItem(
              loadInventoryItem(pl[key1].inventory[i])
            )
          }
        } else if (key1 == "sellHistory") {
          pl.sellHistory.forEach((x) => {
            let Obj = {
              price: x.price,
              item: loadInventoryItem(x.item),
            }
            steve.sellHistory.push(Obj)
          })
        } else steve[key1] = pl[key1]
      }
    }
  } else {
    steve.nick = Nick
    players[Nick.toLowerCase()] = steve
  }
  armornames.forEach((x) => {
    if (steve.armor[x].Activate != undefined) steve.armor[x]?.Activate()
  })
  steve.createPlayer()
  session.nick = session.nick.toLowerCase()
}
function loadInventoryItem(item) {
  let result = new classes[item.name](item.amount)
  result.Rname = item.Rname
  result.customcolor = item.customcolor
  if (result.obitained && item.obitained)
    result.obitained = new Date(item.obitained)
  if (item.kills != undefined) result.kills = item.kills
  if (item.enchants != undefined) result.enchants = item.enchants
  if (result.inventory != undefined) {
    for (const key2 in result.inventory) {
      if (typeof result.inventory[key2] != "function")
        result.inventory[key2].putItem(loadInventoryItem(item.inventory[key2]))
    }
  }
  result.postloadConstructor()
  return result
}


function reduceStack(input, amount) {
  input.amount -= amount
  return input.amount <= 0 ? new classes.empty() : input
}
const scrollingSpeed = 12
function ScrollHandler(evt) {
  if (isNeiOpen) {
    if (evt.deltaY < 0) ShowRecipe(CurrentRecipeI - 1)
    if (evt.deltaY > 0) ShowRecipe(CurrentRecipeI + 1)
  } else if (activeGui.name == "map") {
    steve.inventory[currentHotbarSlot].unSelect()
    if (evt.deltaY < 0) currentHotbarSlot--
    if (evt.deltaY > 0) currentHotbarSlot++
    if (currentHotbarSlot > 8) currentHotbarSlot = 0
    if (currentHotbarSlot < 0) currentHotbarSlot = 8
    steve.inventory[currentHotbarSlot].select()
    e.playertool.className = steve.getItemInHand().name
  } else {
    if (evt.deltaY < 0 && cursor.isToolTip) {
      if (isShiftOn) {
        e.tooltip.style.left =
          +e.tooltip.style.left.slice(0, -2) - scrollingSpeed + "px"
        session.tooltipXOffset += -scrollingSpeed
      } else {
        e.tooltip.style.top =
          +e.tooltip.style.top.slice(0, -2) - scrollingSpeed + "px"
        session.tooltipYOffset += -scrollingSpeed
      }
    }
    if (evt.deltaY > 0 && cursor.isToolTip) {
      if (isShiftOn) {
        e.tooltip.style.left =
          +e.tooltip.style.left.slice(0, -2) + scrollingSpeed + "px"
        session.tooltipXOffset += scrollingSpeed
      } else {
        e.tooltip.style.top =
          +e.tooltip.style.top.slice(0, -2) + scrollingSpeed + "px"
        session.tooltipYOffset += scrollingSpeed
      }
    }
  }
  //deltaY == -100 scrollup
  //deltay == 100 scrolldown
}
function give(item, amount = 1) {
  dumbtoinventory([new classes[item](amount)])
}

function makeMonsterHotbar(mob) {
  e.progressbar.style.display = "block"
  if (mob.name == "villager") {
    e.progressbarInside.style.backgroundColor = "red"
    e.progressbartext.innerText =
      getName(mob.name) + " " + getName(mob.villagerName)
  } else {
    e.progressbarInside.style.backgroundColor = "red"
    e.progressbartext.innerText =
      getName(mob.name) +
      " [Lvl " +
      mob.lvl +
      "] HP: " +
      mob.stats.health +
      "/" +
      mob.stats.maxhealth
    e.progressbarInside.style.width =
      (mob.stats.health / mob.stats.maxhealth) * 100 + "%"
  }
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

function createTextures() {
  const head = document.getElementsByTagName("head")[0]
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
      head.appendChild(style)
    }
  }
  let style = document.createElement("style")
  style.innerHTML =
    ".mapblock{position:absolute; width:" +
    blocksize.px() +
    ";height: " +
    blocksize.px() +
    "; background-size: 100% 100%;  pointer-events: all;}"
  head.appendChild(style)
}
function randomAmount(amount, chance = 100) {
  if (random100(chance)) {
    return Math.floor(Math.random() * amount + 1)
  }
  return 0
}
function randomItem(min, max, chance) {
  if (random1000(chance)) {
    return randomNumber(min, max + 1)
  }
}

function random1000(chance) {
  return Math.floor(Math.random() * 1000 + 1) <= chance * 10
}
function getEnchantCost(item1,item2) {
  if(item1.name == "enchantingpaste") return 0
  let cost = 0
 console.log(item2)
  for(const key in item2.enchants){
     if(canEnchantApply(item1,key,item2.enchants[key]))
     cost += Enchants[key].cost * item2.enchants[key]
     
  }
  console.log("Cost",cost)
  

  return cost
}
function getStatColor(stat) {
  switch (stat) {
    case "health":
    case "maxhealth":
      return "#fa4a43"
    case "defense":
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
    case "miningfortune":
      return "#03fcc2"
    case "farmingfortune":
      return "#02d6a5"
    case "combatfortune":
      return "#02c799"
    case "foragingfortune":
      return "#059e7a"
    case "magicfind":
      return "#00ddff"
    case "emotionaldamage":
      return "#f59842"
    default:
      return "#ffd000"
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
const armor = "helmet chestplate leggins boots"
const harvestingTools = "pickaxe axe shears"
const combatTools = "sword"
/**
 * @example
 *  Scavenger
 *  Coins
 *  Per
 *  Mob
 *  Lvl
 *  Per
 *  Level
 *  Of
 *  Enchant
 */
const SCPMLPLOE = 0.3

Enchants = {
  sharpness: {
    maxlvl: 5,
    tool: combatTools,
    cost: 100,
    conflict: "smite",
    getDescriprion: (lvl) => "+" + 10 * lvl + "% Damage to mobs",
  },
  smite: {
    maxlvl: 5,
    tool: combatTools,
    cost: 100,
    conflict: "sharpness",
    getDescriprion: (lvl) => "+" + 12 * lvl + "% Damage to  Undead mobs",
  },
  smeltingtouch: {
    maxlvl: 1,
    tool: harvestingTools,
    cost: 500,
    conflict: "",
    getDescriprion: (lvl) => "Automatically Smelt Blocks When Mining",
  },
  efficiency: {
    maxlvl: 5,
    tool: harvestingTools,
    cost: 100,
    conflict: "",
    getDescriprion: (lvl) =>
      makeStatSpan(lvl * 25, "miningspeed") + " Mining Speed",
  },
  protection: {
    maxlvl: 5,
    tool: armor,
    cost: 100,
    conflict: "",
    getDescriprion: (lvl) => makeStatSpan(lvl * 3, "defense") + " Defense",
  },
  scavenger: {
    maxlvl: 5,
    tool: combatTools,
    cost: 200,
    conflict: "",
    getDescriprion: (lvl) =>
      "Enemies Drop " +
      (SCPMLPLOE * lvl + " coins").color("yellow") +
      " per Mob Level",
  },
  critical: {
    maxlvl: 5,
    tool: combatTools,
    cost: 1000,
    conflict: "",
    getDescriprion: (lvl) =>
      "	Increases critical damage by " +
      makeStatSpan(10 * lvl, "criticaldamage"),
  },
  growth: {
    maxlvl: 5,
    tool: armor,
    cost: 500,
    conflict: "",
    getDescriprion: (lvl) =>
      "Grants " + makeStatSpan(15 * lvl, "health") + " Health",
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

  settings: {
    volume: "50",
    fullStackPrice: false,
    font: "Minecraftia",
    toolTipFontSize: 2,
    bodycolor: "white",
    KcoinsNotation: false,
    enchDescLimit: 4,
    obitained: false,
  },
  tooltipYOffset: 0,
  tooltipXOffset: 0,
}

function loadObject(Original, LoadOne) {
  for (const key in LoadOne) {
    if (typeof LoadOne[key] == "object" && !Array.isArray(LoadOne[key])) {
      Original[key] = loadObject(Original[key], LoadOne[key])
    } else {
      Original[key] = LoadOne[key]
    }
  }

  return Original
}

function loadSession() {
  let cSession = JSON.parse(localStorage.getItem("RPGsessiondata"))
  if (cSession == null) {
    cSession = {}
    cSession.nick = prompt("Enter Your Nick") || "Unnamed"
  }

  loadObject(session, cSession)
  e.enchDescRange.value = session.settings.enchDescLimit
  e.enchDesc.innerHTML =
    "Enchant Description Limit : " + session.settings.enchDescLimit
  e.musicRange.value = session.settings.volume

  setVolume(session.settings.volume)
  e.shopPriceCheckBox.checked = session.settings.fullStackPrice
  e.coinsNotationCheckbox.checked = session.settings.KcoinsNotation
  e.obitainedCheckBox.checked = session.settings.obitained
  e.fontRange.value = session.settings.toolTipFontSize * 10
  setFont(session.settings.font)
  setToolTipFontSize(session.settings.toolTipFontSize)

  e.mapframe.style.backgroundColor = session.settings.bodycolor
  e.body.style.backgroundColor = session.settings.bodycolor
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
    if (!x.isEmpty()) {
      x.getItem().inventory.forEach((y) => {
        if (!y.isEmpty()) str += y.getItem().name + x.getItem().Rname
      })
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
      steve.backpacks[i].tag.style.backgroundColor = "lime"
    } else {
      steve.backpacks[i].tag.style.backgroundColor = "transparent"
    }
  }
}
/**
 * Check if Item Is Empty
 *
 */
const isEmpty = (item) => {
  return item.name == "empty" || item.name == "machine"
}
const settingsGui = new Gui("settings", [$("#settings")[0]], undefined, {
  needsHandler: false,
})

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

function getBuyBatch(item) {
  return ((item.maxStackSize / item.amount) >> 0) * item.amount
}

function makeVillagerNameTag(name) {
  return "<p class='villagername'>" + getName(name) + "</p>"
}
/**
 * coords are 5x
 */

function checkMapForBlock(y, x, width = 0, height = 0) {
  if (y < 0 || x < 0 || y >= map.height || x >= map.width) return true
  // console.log("corner 1:",map.layout[y>> 0][x >> 0])
  // console.log("corner 2:",map.layout[y>> 0][x + width-0.01 >> 0])
  // console.log("corner 3:",map.layout[y + height -0.01>> 0][x >> 0])
  // console.log("corner 4:",map.layout[y + height -0.01>> 0][x + width - 0.01 >> 0])

  return (
    !allowedblocks.includes(map.layout[y >> 0][x >> 0][0]) ||
    !allowedblocks.includes(map.layout[(y + height - 0.01) >> 0][x >> 0][0]) ||
    !allowedblocks.includes(map.layout[y >> 0][(x + width - 0.01) >> 0][0]) ||
    !allowedblocks.includes(
      map.layout[(y + height - 0.01) >> 0][(x + width - 0.01) >> 0][0]
    )
  )
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
// //comsole.log("Time: ",endDate - date )
// return end2

// }
// function defaultsort(A)
// {
//   let date = new Date()
//   A.sort()
//   let endDate = new Date()
//   //comsole.log("Time: ",endDate - date )
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
    x: target1.x + (target1.width / 2 || 0.5),
    y: target1.y + (target1.height / 2 || 0.5),
  }
  let center2 = {
    x: target2.x + (target2.width / 2 || 0.5),
    y: target2.y + (target2.height / 2 || 0.5),
  }
  let hipon = Math.sqrt(
    (center1.x - center2.x) ** 2 + (center1.y - center2.y) ** 2
  )
  let angleSin = Math.abs(center1.x - center2.x) / hipon

  let vectorspeed = [
    +angleSin.toFixed(2),
    +Math.cos(Math.asin(angleSin)).toFixed(2),
  ]
  if (center1.x > center2.x) vectorspeed[0] *= -1
  if (center1.y > center2.y) vectorspeed[1] *= -1
  for (let i = 0; i < Math.round(hipon); i++) {
    if (checkMapForBlock(center1.y, center1.x)) return true
    center1.x += vectorspeed[0]
    center1.y += vectorspeed[1]
  }
  return false
}
function stopBreakingOnMouseLeave() {
  steve.stopBreakingBlock()
}
function startBreakingOnMouseEnter(element) {
  if (keys[5] == 1) breakblock(element)
}
function playerAgeString() {
  let age = steve.age
  let date = {
    days: (steve.age / 86400) >> 0,
    hours: (steve.age / 3600) >> 0,
    minutes: (steve.age / 60) >> 0,
    seconds: steve.age,
  }
  date.seconds -= date.minutes * 60
  date.minutes -= date.hours * 60
  date.hours -= date.days * 24
  return (
    (date.days > 0
      ? date.days.color("#069c03") + " Day" + isS(date.days) + " "
      : "") +
    (date.hours > 0 || date.days > 0
      ? date.hours.color("#069c03") + " Hour" + isS(date.hours) + " "
      : "") +
    (date.days > 0 ? "" : date.minutes.color("#069c03") + " Minutes ") +
    (date.hours > 0 || date.days > 0
      ? ""
      : date.seconds.color("#069c03") + " Seconds")
  )
}
function setVolume(volume) {
  Howler.volume(volume / 100)
  session.settings.volume = volume
  e.volumeP.innerText = "Volume: " + volume
}

function sellItem(item) {
  if (item.sellValue) {
    const cost = item.sellValue * item.amount * 1.5
    steve.addCoins(cost)
    steve.sellHistory.push({
      item: item,
      price: cost,
    })
    item = new classes.empty()
    e.sellHistory.style.display = "block"
    e.sellHistorySlot.className =
      "guiSlot " + steve.sellHistory[steve.sellHistory.length - 1].item.name
  }
  return item
}
function sellHistorySlot() {
  let tag = document.createElement("div")
  tag.id = "sellHistorySlot"
  tag.className = "guiSlot "
  if (steve.sellHistory.length == 0) tag.style.display = "none"
  else
    tag.className =
      "guiSlot " + steve.sellHistory[steve.sellHistory.length - 1].item.name
  tag.setAttribute(
    "onmouseenter",
    " makePriceToolTip(steve.sellHistory[steve.sellHistory.length - 1].item,{ coins: steve.sellHistory[steve.sellHistory.length - 1].price },true)"
  )
  tag.onmouseleave=leaveElement
  tag.setAttribute("onclick", "buyItemFromSellHistory()")

  e["sellHistorySlot"] = tag

  return tag
}
function buyItemFromSellHistory() {
  if (
    steve.sellHistory.length > 0 &&
    isShiftOn &&
    steve.isEmptySlotInInventory() &&
    steve.coins >= steve.sellHistory[steve.sellHistory.length - 1].price
  ) {
    steve.addToInventory(steve.sellHistory[steve.sellHistory.length - 1].item)
    steve.addCoins(steve.sellHistory[steve.sellHistory.length - 1].price * -1)
    steve.sellHistory.pop()
    if (steve.sellHistory.length == 0) {
      e.sellHistorySlot.style.display = "none"
    } else {
      e.sellHistorySlot.style.display = "block"
      e.sellHistorySlot.className =
        "guiSlot " + steve.sellHistory[steve.sellHistory.length - 1].item.name
      if (itemInCursor == "none")
        makePriceToolTip(
          steve.sellHistory[steve.sellHistory.length - 1].item,
          { coins: steve.sellHistory[steve.sellHistory.length - 1].price },
          true
        )
      // e.sellHistorySlot.setAttribute("onmouseenter","makePriceToolTip(steve.sellHistory[steve.sellHistory.length-1].item,steve.sellHistory[steve.sellHistory.length-1].price),'coins',true")
      // e.sellHistorySlot.setAttribute(  "onmouseleave", "if(istooltip) e.tooltip.style.display ='none'")
    }
  }
}
function isInVillage() {
  return /Village|village|town|Town/.test(currentLocation)
}
function isZombie(mobName) {
  return /zombie/.test(mobName)
}
function isInForest() {
  return /forest/.test(currentBiome)
}

const staticons = {
  defense: "❈",
  speed: "✦",
  health: "❤",
  maxhealth: "❤",
  strength: "❁",
  damage: "❁",
  criticalchance: "☣",
  criticaldamage: "☠",
  accessorybagslots: "🎒",
  range: "➚",
  miningspeed: "⸕",
  miningfortune: "☘",
  farmingfortune: "☘",
  combatfortune: "☘",
  foragingfortune: "☘",
  magicfind: "✯",
}
function getStatIcon(statname) {
  let icon = staticons[statname] || ""
  if (icon == "") return icon
  return (
    "<span style='font-size: " +
    (session.settings.toolTipFontSize + 0.4) +
    "vh;'>" +
    icon +
    "</span>"
  )
}
function setFont(font) {
  e.body.style.fontFamily = font
  let list = document.getElementsByTagName("button")
  for (let item of list) {
    item.style.fontFamily = font
  }
  list = document.getElementsByTagName("select")
  for (let item of list) {
    item.style.fontFamily = font
  }
  list = document.getElementsByTagName("input")
  for (let item of list) {
    item.style.fontFamily = font
  }
}

function changeFont() {
  let font = prompt("Input Font Name(Default: Minecraftia)")
  if (font != undefined) {
    session.settings.font = font
    setFont(font)
  }
}

function setToolTipFontSize(value) {
  session.settings.toolTipFontSize = value
  e.tooltip.style.fontSize = session.settings.toolTipFontSize + "vh"
  e.fontExample.innerText = "ToolTip FontSize: " + value * 10
  e.tooltip.style.lineHeight = value + 0.8 + "vh"
}
let lastToolTip = "none"
function leaveElement() {
  itemintooltip = "none"
  lastToolTip = "none"
  setTimeout(function () {
    cursor.hideOnLeave()
  }, 100)
}
let randomNumber = (from, to) => from + Math.floor(Math.random() * (to - from))
let randomPlusMinus = () => (Math.floor(Math.random() * 2) == 1 ? 1 : -1)

function changeBodyColor() {
  let color = prompt("Type font color in HEX format(example: #57FA22)")
  if (color != undefined) {
    session.settings.bodycolor = color
    e.mapframe.style.backgroundColor = color
    e.body.style.backgroundColor = color
  }
}

function compareObjects(item, tag) {
  let state = true
  for (const key in tag) {
    if (state) {
      if (typeof tag[key] == "object") {
        state = compareObjects(item[key], tag[key])
      } else if (item[key] != tag[key]) state = false
    }
  }
  return state
}

function notification(text) {
  if (isLoaded) {
    $.notify(text, "recipe")
  }
}

const isS = (amount) => (amount == 1 ? "" : "s")
/**
 *
 * @param {{x,y}} a
 * @param {{x,y}} b
 * @returns distance:number
 */

const distnaseBetweenTargets = (a, b) =>
  ((a.x - b.x) ** 2 + (a.y - b.y) ** 2) ** (1 / 2)

function getCoords(evt) {
  return { x: (evt.x / percent) >> 0, y: (evt.y / percent) >> 0 }
}
let cursorCoordsOnMap = {
  x: 0,
  y: 0,
}

function onMapClick(evt, isOnMap = true, id) {
  let clickX = isOnMap ? (evt.offsetX / blocksize) >> 0 : evt.offsetX
  let clickY = isOnMap ? (evt.offsetY / blocksize) >> 0 : evt.offsetY
  //comsole.log(evt)
  if (isMapModeOn) {
    console.log("x:", clickX, "y:", clickY)
    //  if (clickX != oldclicks[1] || clickY != oldclicks[0])
    if (clickX >= 0 && clickY >= 0) {
      if (features[0]) {
        fill3x3(clickY, clickX)
      }
      // else if (features[1]) {
      //   fillVericalLine(clickX);
      // } else if (features[2]) {
      //   fillHorizontalLine(clickY);
      // }
      else {
        if (map.layout[clickY] == undefined) map.layout[clickY] = new Array()
        if (map.layout[clickY][clickX] == undefined)
          map.layout[clickY][clickX] = ["air", "air"]
        if (map.layout[clickY][clickX][floormode].includes("tree")) {
          let t = document.getElementById(
            map.layout[clickY][clickX][floormode] + " " + clickX + " " + clickY
          )
          t.remove()
        }
        if (!isUndefined(id)) {
          mobs[id].destroy()

          delete map.mobs[id]
        }

        map.layout[clickY][clickX][floormode] = selectedblockedit
        if (selectedblockedit.includes("tree")) {
          let tag = document.createElement("div")
          tag.className = selectedblockedit + " mapblock"
          tag.setAttribute(
            "onmousedown",
            "onMapClick({offsetY:" + clickY + ",offsetX:" + clickX + "},false)"
          )
          tag.id = map.layout[clickY][clickX][0] + " " + clickX + " " + clickY
          tag.style.left = clickX.blocks().px()
          tag.style.top = clickY.blocks().px()
          e.mapcontainer.appendChild(tag)
        } else if (selectedblockedit.includes("mob")) {
          let mobi = 0
          for (let i = 0; i < 10000; i++) {
            if (isUndefined(map.mobs[i])) {
              mobi = i
              i = 10001
              map.mobs[mobi] = {
                name: selectedblockedit.substring(4),
                x: clickX,
                y: clickY,
              }
            }
          }
          let mob
          if (selectedblockedit.includes("villager")) {
            mob = new classes.villager(
              clickX,
              clickY,
              mobi,
              selectedblockedit.substring(13)
            )
          } else
            mob = new classes[selectedblockedit.substring(4)](
              clickX,
              clickY,
              mobi
            )
          mob.create()
          mob.spawn()
          map.layout[clickY][clickX][floormode] = "air"
        } else {
          mapContext.clearRect(
            clickX * blocksize,
            clickY * blocksize,
            blocksize,
            blocksize
          )
          drawMapBlock(clickX, clickY)
        }
        // oldclicks = [clickY, clickX];
      }
    }
  } else {
    if((evt.button>>0) == 0)
    breakblock(clickX, clickY)
  }
}

function isUndefined(value) {
  return value == undefined || value == null
}

const downloadTxtFile = (text) => {
  const element = document.createElement("a")
  const file = new Blob([text], {
    type: "text/plain",
  })
  element.href = URL.createObjectURL(file)
  element.download = "mapfile.txt"
  document.body.appendChild(element)
  element.click()
  element.remove()
  delete element
}
const centerMapOnPlayer = () => {
  centerMap()
  //   e.mapcontainer.style.left = (steve.offset.x - steve.x - borderwidth)
  //   .blocks()
  //   .px()
  // e.mapcontainer.style.top = (steve.offset.y - steve.y - borderwidth)
  //   .blocks()
  //   .px()
  //   //void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  //   mapContext.clearRect(0,0,canvasWidth.blocks(),canvasHeight.blocks())
  //    mapContext.drawImage(mapimg, (steve.x - steve.offset.x).blocks(), (steve.y - steve.offset.y).blocks(), canvasWidth.blocks(), canvasHeight.blocks(),0,0,canvasWidth.blocks(),canvasHeight.blocks())
}
const centerMap = function () {
  e.mapcontainer.style.left = (steve.offset.x - steve.x - borderwidth)
    .blocks()
    .px()
  e.mapcontainer.style.top = (steve.offset.y - steve.y - borderwidth)
    .blocks()
    .px()
  e.map.style.left = (steve.offset.x - steve.x - borderwidth).blocks().px()
  e.map.style.top = (steve.offset.y - steve.y - borderwidth).blocks().px()
}
let cursorLocationOnMap = {
  x: 0,
  y: 0,
}
function cursorMoveOnMap(evt) {
  const x = (evt.offsetX / blocksize) >> 0
  const y = (evt.offsetY / blocksize) >> 0
  if (cursorLocationOnMap.x != x || cursorLocationOnMap.y != y) {
    steve.stopBreakingBlock()
    if (keys[5] == 1) {
      breakblock(x, y)
    }
  }

  cursorLocationOnMap = { x: x, y: y }
}
/**
    (1-5]% - RARE drop;
    (0,1%-1%] - Legendary drop;
    (inf - 0,1%] - IMPOSSIBLE DROP
   * @param {string} dropname 
 * @param {number} chance 
 */
function notifyRareDrop(dropname, chance) {
  if (chance <= 5) {
    let str = ""
    if (chance <= 0.1) {
      str += "IMPOSSIBLE drop".color("red")
    } else if (chance <= 1) {
      str += "LEGENDARY drop".color("yellow")
    } else str += "RARE drop".color("blue")
    str += br + getName(dropname) + br
    let magicfind = steve.getStat("magicfind")
    if (magicfind) {
      str += (
        "+" +
        magicfind.formateComas() +
        "% " +
        getName("magicfind")
      ).color(getStatColor("magicfind"))
    }

    $.notify(str, "drop")
  }
}

function toArray(object) {
  let arr = []
  for (const key in object) {
    arr.push(object[key])
  }
  return arr
}

function makeToolTip(value, addSelling = true) {
  lastToolTip = {
    value: value,
    addSelling: addSelling,
  }
  if (cursor.becomeToolTip()) {
    //Detecting Items
    if (value.name) {
      cursor.setBorderColor(raritycolors[value.rarity])
      if (isEmpty(value)) {
        cursor.hide()
        itemintooltip = "none"
        return
      }
      cursor.show()
      itemintooltip = value.name
      e.tooltip.innerHTML =
        //ItemName
        (value.Rname
          ? value.Rname.color(value.customcolor)
          : getName(value.name).color(raritycolors[value.rarity])) +
        br +
        //Description
        (value.description ? value.description.color("#818181") + br : "") +
        //Burnvalue
        (value.burnvalue
          ? ("Burn Time: " + value.burnvalue + " seconds").color("gray") + br
          : "") +
        //Talisman Family
        (value.family
          ? "Talisman Family: " + color(getName(value.family), "magenta") + br
          : "") +
        //Stats
        makestats(value) +
        //Enchants
        makeEnchants(value) +
        //Inventory Info
        makeinventory(value) +
        //Consumable Info
        makeConsumable(value) +
        //Secondary Description(Abilitiess etc.)
        (value.description2 ? value.description2 + br + br : "") +
        //Item Sell Value
        (isShiftOn && value.sellValue && !value.isVisual
          ? "Sell Value: " +
            (
              (
                value.sellValue *
                (session.settings.fullStackPrice ? value.amount : 1)
              ).formateComas() + " Coins"
            ).color("yellow") +
            br
          : "") +
        //Item Obitain Date
        (!value.isVisual && value.obitained && session.settings.obitained
          ? "Obtained on: " + value.obitained.toMyFormat().color("#fa4646") + br
          : "") +
        //Rarity Finisher
        (
          " " +
          raritynames[value.rarity] +
          " " +
          (value.type == "none" ? "" : value.type)
        )
          .toUpperCase()
          .color(raritycolors[value.rarity], 1800)
    } else {
      //Non-Item ToolTip
      cursor.setBorderColor(raritycolors[0])
      itemintooltip = "text"
      cursor.show()
      switch (value) {
        case "skills":
          e.tooltip.innerHTML = getSkillToolTip()
          break
        case "accessorybag":
          e.tooltip.innerHTML = getAccesoryBagToolTip()
          break
        case "collections":
          e.tooltip.innerHTML = getCollectionsToolTip()
          break
        default:
          e.tooltip.innerHTML = value
          break
      }
    }
  }
}

// function makeToolTipOld(item, sellValue = true) {
//   document.toolTipText = ""

//   if (cursor.becomeToolTip()) {
//     cursor.setBorderColor(raritycolors[item.rarity])
//     if (item.name == "empty" || item.name == "machine") {
//       e.tooltip.style.display = "none"
//       itemintooltip = "none"
//     } else {
//       itemintooltip = item.name //used in recipe search
//       e.tooltip.className = "tooltipimg"
//       e.tooltip.style.display = "block"
//       e.tooltip.innerHTML =
//         (item.Rname == ""
//           ? color(getName(item.name), raritycolors[item.rarity]) + br
//           : color(item.Rname, item.customcolor) + br) +
//         (item.description ? item.description.color("#818181") + br : "") +
//         (item.burnvalue > 0
//           ? color("Burn Time: " + item.burnvalue + " ticks", "gray") + br
//           : "") +
//         (item.family == undefined
//           ? ""
//           : "Talisman Family: " + color(getName(item.family), "magenta") + br) +
//         makestats(item) +
//         makeEnchants(item) +
//         makeinventory(item) +
//         makeConsumable(item) +
//         (item.description2 == "" ? "" : item.description2 + br) +
//         br +
//         (item.sellValue != undefined && sellValue
//           ? "Sell Value: " +
//             (
//               (
//                 item.sellValue *
//                 (session.settings.fullStackPrice ? item.amount : 1)
//               ).formateComas() + " Coins"
//             ).color("yellow") +
//             br
//           : "") +
//         (thismachinei == -4 && item.sellValue != undefined && sellValue
//           ? "Hold Shift to Sell" + br
//           : "") +
//         (item.obitained && session.settings.obitained
//           ? "Obitained on: " + item.obitained.toMyFormat().color("#fa4646") + br
//           : "") +
//         (
//           " " +
//           raritynames[item.rarity] +
//           " " +
//           (item.type == "none" ? "" : item.type)
//         )
//           .toUpperCase()
//           .color(raritycolors[item.rarity], 1800)
//     }
//     return true
//   }
//   return false
// }

function getSkillToolTip() {
  let str = "Skills " + br + (isShiftOn ? "XP: " : "Levels: ") + br
  for (const key in skillnames) {
    str +=
      skillnames[key] +
      ": " +
      (isShiftOn
        ? (
            steve.skillxp[key].formateComas() +
            "/" +
            skilllevelxp[steve.skilllevels[key]].formateComas()
          ).color("yellow")
        : color(steve.skilllevels[key], "yellow")) +
      " (" +
      (
        (steve.skillxp[key] / skilllevelxp[steve.skilllevels[key]]) *
        100
      ).toFixed(0) +
      "%)" +
      br
  }
  return str
}

function getAccesoryBagToolTip() {
  let str =
    "Accessory Bag<br><br> " +
    color("ONLY 1", "red") +
    " Accessory Of Each Family<br> will be active at time<br>" +
    br +
    "Capacity: " +
    (steve.getStat("accessorybagslots") + " Slots").color("lime") +
    makeinventory(steve.accessorybag, "Currently Stores: ") +
    br +
    br
  return str
}

function getCollectionsToolTip() {
  let str = "Collections" + br
  for (const key in collections) {
    str +=
      getName(key) +
      ": " +
      steve.collectionitems[key].formateComas().color("yellow")
    if (isShiftOn) {
      str += collections[key][steve.collectionlevels[key]]
        ? " (" +
          (((steve.collectionitems[key] /
            collections[key][steve.collectionlevels[key]].amount) *
            100) >>
            0) +
          "%)"
        : " (MAXED)".color("green")
    }
    str += br
  }
  return str
}

function formPriceString(priceObject) {
  let str = "Price<br>".color("orange")
  for (const key in priceObject) {
    str += "- ".color("lightgray") + priceObject[key].formateComas().color("white") + " " + getName(key) + br
  }
  return str.slice(0, -4).color("yellow")
}

function buyItem(parent) {

  function isAffordable() {
    let isAffordable = true
    for (const key in parent.visualItem.price) {
      if (key == "coins") {
        if (steve.coins < parent.visualItem.price[key]) isAffordable = false
      } else if (steve.countItem(key) < parent.visualItem.price[key])
        isAffordable = false
      if (!isAffordable) break
    }
    return isAffordable
  }
  function canBuy() {
    return isShiftOn
      ? steve.isEmptySlotInInventory()
      : cursor.canAddItem(parent.visualItem)
  }
  function removePriceFromPlayer() {
    for (const key in parent.visualItem.price) {
      if (key == "coins") {
        steve.addCoins(-1 * parent.visualItem.price[key])
      } else steve.removeFromInventory(key, parent.visualItem.price[key])
    }
  }
  if (isShiftOn) {
    let maxIterator = parent.visualItem.maxStackSize/parent.visualItem.amount>>0
    let iterator = 0
    while (isAffordable() && canBuy() && iterator < maxIterator) {
      let item = Object.assign(
        Object.create(Object.getPrototypeOf(parent.visualItem)),
        parent.visualItem
      )
      item.onCopy()
      steve.addToInventory(item)
      removePriceFromPlayer()
      iterator++
    }
  } else {
    if (isAffordable() && canBuy()) {
      cursor.addItem(parent.visualItem)
      if (cursor.item.oldDescription2) {
        cursor.item.description2 = cursor.item.oldDescription2
        delete cursor.item.oldDescription2
      }
    }
    removePriceFromPlayer()
  }
}

function canEnchantApply(item,enchantname,enchantLvL){
//check for Tool
if(item.name != "enchantingpaste")
{
  
if(!item.type.match1word(Enchants[enchantname].tool)) return false
console.log("Passed Tool Check");
for(const key in item.enchants){
  if(Enchants[enchantname].conflict != "")
  if(key.match1word(Enchants[enchantname].conflict)) return false
}
console.log("Passed Conflict check")
}

if(item.enchants[enchantname]>> 0 < enchantLvL) return true
if(item.enchants[enchantname] == enchantLvL && enchantLvL< Enchants[enchantname].maxlvl ) return true
return false
}
