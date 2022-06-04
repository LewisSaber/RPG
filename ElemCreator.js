let e = {}

function loadIDS() {
  var allElements = document.querySelectorAll("*[id]")
  for (let i = 0, n = allElements.length; i < n; i++) {
    e[allElements[i].id] = allElements[i]
  }
  e.map.style.width = mapW * 5 + "vh"
  e.map.style.height = mapH * 5 + "vh"
  e.guihandler.style.width = window.innerWidth - 100 + "px"
  e.guihandler.style.height = window.innerHeight - 50 + "px"
  // e.behindeveryone.style.width = window.innerWidth - 10 + "px"
  // e.behindeveryone.style.height = window.innerHeight - 130 + "px"
  e.furnace.slot0 = e.furnaceInput
  e.furnace.slot0amount = e.furnaceInputamount
  e.furnace.slot1 = e.furnaceFuel
  e.furnace.slot1amount = e.furnaceFuelamount
  e.furnace.slot2 = e.furnaceOutput
  e.furnace.slot2amount = e.furnaceOutputamount
  e.anvil.slot0 = e.anvilinput
  e.anvil.slot0amount = e.anvilInputamount
  e.anvil.slot1 = e.anviloutput
  e.anvil.slot1amount = e.anvilOutputamount
  e.accessorybagbutton.setAttribute(
    "oncontextmenu",
    "openMachineGui(steve.accessorybag); return false"
  )
  e.skillsbutton.setAttribute(
    "oncontextmenu",
    "openNoInventoryGui('skills'); return false"
  )
  e.collectionsbutton.setAttribute(
    "oncontextmenu",
    "openNoInventoryGui('collections'); return false"
  )
  
}
const codeAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"//abcdefghijklmnopqrstuvwxyz"]
const texturefilter = ["empty", "item", "block", "stonetype"]
const raritycolors = [
  "white",
  "lime",
  "#0244bf",
  "purple",
  "yellow",
  "pink",
  "#6b0000",
]
const raritynames = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
  "Mythic",
  "Bloody",
]
const Names = {
  villagetalisman: "Village Talisman",
  villagecharm: "Village Charm",
  villageartifact: "Village Artifact",
  villagerelic: "Village Relic",
  lewisrelic: "Lewis Relic",
  furnace: "Stone Furnace",
  steeleaf: "Very Sharp Leaf",
  combatfortune:"Combat Fortune",
  farmingfortune: "Farming Fortune",
  accessorybagslots: "Accessory Bag Slots",
  criticaldamage: "Critical Damage",
  criticalchance: "Critical Chance",
  woodpickaxe: "Wooden Pickaxe",
  woodaxe: "Wooden Axe",
  woodsword: "Wooden Sword",
  stoneaxe: "Stone Axe",
  stonepickaxe: "Stone Pickaxe",
  testItem: "Kekw",
  logoak: "Oak Wood Log",
  planksoak: "Oak Wood Plank",
  ironblock: "Block of Iron",
  ironingot: "Iron Ingot",
  smallbackpack: "Small Backpack",
  mediumbackpack: "Medium Backpack",
  largebackpack: "Large Backpack",
  beef: "Raw Beef Meat",
  rawchicken: "Raw Chicken Meat",
  cookedchicken: "Cooked Chicken Meat",
  leatherhelmet: "Leather Helmet",
  leatherchestplate: "Leather Chestplate",
  leatherboots: "Leather Boots",
  leatherleggins: "Leather Leggins",
  diamondsword: "Diamond Sword",
  ironsword: "Iron Sword",
  stonesword: "Stone Sword",
  undeadsword: "Undead Sword",
  efficientaxe: "Efficient Axe",
  zombiehat: "Zombie Hat",
  zombiefang: "Zombie Fang",
  ironore: "Iron Ore",
  coalore: "Coal Ore",
  rottenflesh: "Rotten Flesh",
  glitchcompactor: "Glitch Compactor 3000",
  dyegreen: "Green Dye",
  smeltingtouch: "Smelting Touch",
  enchantingpaste: "Enchanting Paste",
  enchantingbook: "Enchanting Book",
  wolfpaw: "Wolf Paw",
  supercompactor4000: "Super Compactor 4000",
  supercompactor5000: "Super Compactor 5000",
  supercompactor6000: "Super Compactor 6000",
  supercompactor7000: "Super Compactor 7000",
  supercompactor8000: "Super Compactor 8000",
  supercompactor9000: "Super Compactor 9000",
  sugarcane: "Sugar Cane",
  brutezombie: "Brute Zombie",
  tooltier: "Tool tier",
  tool: "Type",
  miningspeed: "Mining Speed",
  foragingfortune: "Foraging Fortune",
  miningfortune: "Mining Fortune",
  maxhealth: "Health",
}


const skillnames = {
  combat: "Combat",
  mining: "Mining",
  foraging: "Foraging",
  farming: "Farming",
}
let selectorblocks = [
  "air",
  "stone",
  "sponge",
  "snow",
  "cactus",
  "obsidian",
  "glass",
  "tnt",
  "ironore",
  "coalore",
  "diamondore",
  "redstoneore",
  "grass",
  "stoneslab",
  "leavesoak",
  "greenwool",
  "grassPlant",
  "bedrock",
  "logoak",
  "treeoak",
  "sand",
  "dirt",
  "mobmobmob zombie",
  "mobmobmob cow",
  "mobmobmob chicken",
  "dandelion",
]

const hiddenstats = ["tool", "undeadbonus","totaldamage","naturalregeneration","totalDamageMultiplier","tooltier","health","zombiedefense"]
const armornames = [
  "ring1",
  "helmet",
  "ring2",
  "chestplate",
  "bracelet",
  "leggins",
  "belt",
  "boots",
]
const toload = [
  "customcolor",
  "age",
  "kills",
  "collectionitems",
  "skillxp",
  "coins",
  "machines",
  "accessorybag",
  "inventory",
  "inventorySlots",
  "backpacks",
  "nick",
  "mapX",
  "mapY",
  "food",
  "skin",
  "sellHistory"
].concat(armornames)

const slayerArmorMilestones = [0,50,300,1000,2000,3000,5000,7500,10000,15000,25000,50000,100000,200000,500000]
const slayerArmorMilestonesDefense = [0,20,50,90,120,150,180,200,220,240,260,280,300,310,315]





Array.prototype.set = function (n, l) {
  for (let i = 0; i < l; i++) {
    this[i] = n
  }
  return this
}
Array.prototype.put = function (n, i) {
  this[i] = n
  return this
}
String.prototype.match1word = function (str) {
  const s = str.split(" ")
  for (const key of s) {
    if (this.includes(key)) return true
  }
  return false
}
String.prototype.give = function(amount = 1){
  give(this,amount)
}
String.prototype.color = function (Color){
  return color(this,Color)
}
Number.prototype.color = function (Color){
  return color(this,Color)
}
function buildHotbar() {
  e.hotbar.style.display = "block"
  e.hotbar.innerText = ""
  for (let i = 0; i < 9; i++) {
    let tag = document.createElement("div")
    let amount = document.createElement("div")
    amount.setAttribute("class", "itemamount")
    e.inventory["slot" + i + "amount"] = amount
    tag.setAttribute("oncontextmenu", "RclickOnSlot(" + i + "); return false")
    tag.setAttribute("class", "guiSlot")
    tag.setAttribute("onclick", "LclickOnSlot(" + i + ")")
    tag.setAttribute("onmouseenter", "makeToolTip(steve.inventory[" + i + "])")
    tag.setAttribute(
      "onmouseleave",
      "if(istooltip) e.tooltip.style.display ='none'"
    )

    e.inventory["slot" + i] = tag

    tag.appendChild(amount)
    e.hotbar.appendChild(tag)
    putItemInslot(
      steve.inventory[i],
      e.inventory["slot" + i],
      e.inventory["slot" + i + "amount"]
    )
  }
}
function buildInventory() {
  for (let i = steve.inventorySlots - 1; i > 8; i--) {
    let tag = document.createElement("div")
    let amount = document.createElement("div")
    amount.setAttribute("class", "itemamount")
    e.inventory["slot" + i + "amount"] = amount
    tag.setAttribute("onclick", "LclickOnSlot(" + i + ")")
    tag.setAttribute("oncontextmenu", "RclickOnSlot(" + i + "); return false")
    tag.setAttribute("onmouseenter", "makeToolTip(steve.inventory[" + i + "])")
    tag.setAttribute(
      "onmouseleave",
      "if(istooltip) e.tooltip.style.display ='none'"
    )

    tag.setAttribute("class", "guiSlot")
    e.inventory["slot" + i] = tag

    tag.appendChild(amount)
    e.inventory.appendChild(tag)
  }
}
function random100(r) {
  return Math.floor(Math.random() * 100) <= r
}
function buildCraftingTable() {
  for (let i = 0; i < 9; i++) {
    let tag = document.createElement("div")
    let amount = document.createElement("div")
    amount.setAttribute("class", "itemamount")
    e.craftingtable["slot" + i + "amount"] = amount

    tag.setAttribute("onclick", "LclickOnSlot(" + i + ",'craftingtable')")
    tag.setAttribute(
      "oncontextmenu",
      "RclickOnSlot(" + i + ",'craftingtable'); return false"
    )
    tag.setAttribute(
      "onmouseenter",
      "makeToolTip(craftingTableItems[" + i + "])"
    )
    tag.setAttribute(
      "onmouseleave",
      "if(istooltip) e.tooltip.style.display ='none'"
    )
    tag.style.position = "absolute"
    tag.style.top = 8 * ((i - (i % 3)) / 3) + 1 + "vh"
    tag.style.left = 8 * (i % 3) + 1 + "vh"

    tag.setAttribute("class", "guiSlot")
    e.craftingtable["slot" + i] = tag

    tag.appendChild(amount)
    e.craftingtable.appendChild(tag)
  }
  let tag = document.createElement("div")
  let amount = document.createElement("div")
  amount.setAttribute("class", "itemamount")
  e.craftingtable["slot9amount"] = amount
  tag.setAttribute("onclick", "doCraftingRecipe()")
  // tag.setAttribute("oncontextmenu", "RclickOnSlot(" + i + ",'craftingtable'); return false");
  tag.setAttribute("onmouseenter", "makeToolTip(craftingTableResult)")
  tag.setAttribute(
    "onmouseleave",
    "if(istooltip) e.tooltip.style.display ='none'"
  )
  tag.setAttribute("class", "guiSlot")
  e.craftingtable["slot9"] = tag
  tag.style.position = "absolute"
  tag.style.top = 9 + "vh"
  tag.style.left = 25 + "vh"
  tag.appendChild(amount)
  e.craftingtable.appendChild(tag)
}

function buildArmorGui() {
  for (let i = 0; i < 8; i++) {
    let tag = document.createElement("div")

    tag.setAttribute(
      "onclick",
      "LclickOnSlot(" + i + ",'" + armornames[i] + "')"
    )
    tag.setAttribute("oncontextmenu", " return false")
    tag.setAttribute(
      "onmouseenter",
      "makeToolTip(steve['" + armornames[i] + "'])"
    )
    tag.setAttribute(
      "onmouseleave",
      "if(istooltip) e.tooltip.style.display ='none'"
    )
    tag.className = "guiSlot " + armornames[i] + "gui"
    e.armorgui[armornames[i]] = tag

    e.armorgui.appendChild(tag)
  }
}
function buildmachines() {
  for (let i = 0; i < 9; i++) {
    let tag = document.createElement("div")

    tag.setAttribute("onclick", "LclickOnSlot(" + i + ",'machine')")
    tag.setAttribute(
      "oncontextmenu",
      "openMachineGui(steve.machines[" + i + "]," + i + "); return false"
    )
    tag.setAttribute("onmouseenter", "makeToolTip(steve.machines[" + i + "])")
    tag.setAttribute(
      "onmouseleave",
      "if(istooltip) e.tooltip.style.display ='none'"
    )

    tag.className = "guiSlot machine"
    e.machines["slot" + i] = tag

    e.machines.appendChild(tag)
    putItemInslot(steve.machines[i], e.machines["slot" + i])
    steve.machines[i].doRecipe()
  }
}
function buildBackpacks() {
  for (let i = 0; i < backPacksInGui; i++) {
    let tag = document.createElement("div")
    tag.setAttribute("onmouseenter", "makeToolTip(steve.backpacks[" + i + "])")
    tag.setAttribute("onclick", "LclickOnSlot(" + i + ",'backpack')")
    tag.setAttribute(
      "onmouseleave",
      "if(istooltip) e.tooltip.style.display ='none'"
    )
    tag.setAttribute(
      "oncontextmenu",
      "openMachineGui(steve.backpacks[" + i + "]," + i + "); return false"
    )
    tag.setAttribute("id","backpackGui" + i)
    e["backpackGui" + i] = tag
    tag.className = "guiSlot"
    e.backpacks["slot" + i] = tag
    e.backpacks.appendChild(tag)
    putItemInslot(steve.backpacks[i], e.backpacks["slot" + i])
  }
}
function buildBackpacksGui() {
  for (let i = 0; i < maxbackpackslot; i++) {
    let tag = document.createElement("div")

    tag.setAttribute(
      "onmouseleave",
      "if(istooltip) e.tooltip.style.display ='none'"
    )
    
    let amount = document.createElement("div")
    amount.setAttribute("class", "itemamount")
    tag.className = "guiSlot empty"

    e.backpack["slot" + i] = tag
    e.backpack["slot" + i + "amount"] = amount
    tag.appendChild(amount)
    e.backpack.appendChild(tag)
  }
}
function buildEnchantingBook() {
  for (let i = 0; i < 3; i++) {
    let tag = document.createElement("div")

    tag.setAttribute(
      "onmouseleave",
      "if(istooltip) e.tooltip.style.display ='none'"
    )
    let amount = document.createElement("div")
    amount.setAttribute("class", "itemamount")
    tag.className = "guiSlot empty"
    tag.setAttribute("id", "enchantingbookslot" + i)
    e.enchantingbook["slot" + i] = tag
    e.enchantingbook["slot" + i + "amount"] = amount
    tag.appendChild(amount)
    e.enchantingbook.appendChild(tag)
  }
}
function buildSkills() {
  for (const key in skillnames) {
    const holder = document.createElement("div")
    holder.className = "skillholder"
    const pic = document.createElement("div")
    pic.className = "skillpicture " + key
    holder.appendChild(pic)
    const nameholder = document.createElement("div")
    nameholder.className = "skillnameholder"
    const name = document.createElement("p")
    name.className = "skillname"
    name.innerText = skillnames[key]
    const level = document.createElement("p")
    level.className = "skilllevel"
    level.innerText = "O"
    nameholder.appendChild(name)
    nameholder.appendChild(level)
    holder.appendChild(nameholder)
    const bar = document.createElement("div")
    bar.className = "skillbar"
    const barinside = document.createElement("div")
    barinside.className = "skillbarinside " //+ key
    bar.appendChild(barinside)
    holder.appendChild(bar)
    const xpAmount = document.createElement("p")
    xpAmount.className = "skillxpAmount"
    holder.appendChild(xpAmount)
    e.skills.appendChild(holder)
    e["skillxpamount" + key] = xpAmount
    e["skillbar" + key] = barinside
    e["skilllevel" + key] = level
  }
}
function buildCollections() {
  for(const key in collections){
    const holder = document.createElement("div")
    holder.className = key + " guiSlot"
    holder.setAttribute("onmouseenter", "makeCollectionToolTip('" + key + "')")
    holder.setAttribute(
      "onmouseleave",
      "if(istooltip) e.tooltip.style.display ='none'"
    )
    e.collections.appendChild(holder)
  }
  
}
function buildGlitchedCompactor() {
  for (let i = 0; i < 6; i++) {
    let tag = document.createElement("div")

    tag.setAttribute(
      "onmouseleave",
      "if(istooltip) e.tooltip.style.display ='none'"
    )
    let amount = document.createElement("div")
    amount.setAttribute("class", "itemamount")
    tag.className = "guiSlot empty"
    //tag.setAttribute("id","enchantingbookslot" + i)
    e.glitchcompactor["slot" + i] = tag
    e.glitchcompactor["slot" + i + "amount"] = amount
    tag.appendChild(amount)
    if (i == 5) {
      tag.setAttribute("id", "enchantedcompacteroutput")
      e.glitchcompactor.appendChild(tag)
    } else e.glitchcompactorinputs.appendChild(tag)
  }
}
function buildaccessoryGui() {
  for (let i = 0; i < maxaccesoriesslots; i++) {
    let tag = document.createElement("div")

    tag.setAttribute(
      "onmouseleave",
      "if(istooltip) e.tooltip.style.display ='none'"
    )
    let amount = document.createElement("div")
    amount.setAttribute("class", "itemamount")
    tag.className = "guiSlot empty"

    e.accessorybag["slot" + i] = tag
    e.accessorybag["slot" + i + "amount"] = amount
    tag.appendChild(amount)
    e.accessorybag.appendChild(tag)
  }
}
function buildSuperCompactor() {
  for (let i = 0; i < maxCompactorSlots; i++) {
    let tag = document.createElement("div")

    tag.setAttribute(
      "onmouseleave",
      "if(istooltip) e.tooltip.style.display ='none'"
    )
    let amount = document.createElement("div")
    amount.setAttribute("class", "itemamount")
    tag.className = "guiSlot empty"
    //tag.setAttribute("id","enchantingbookslot" + i)
    e.supercompactor["slot" + i] = tag
    e.supercompactor["slot" + i + "amount"] = amount
    tag.appendChild(amount)

    e.supercompactor.appendChild(tag)
  }
}
function buildBiomesSelector() {
  biomes.forEach((x) => {
    let tag = document.createElement("option")
    tag.innerText = x
    e.biomes.appendChild(tag)
  })
}
function buildAccountSelector() {
  e.accounts.innerText = ""
  e.accountsToDelete.innerText = ""
  for(const key in players)
{
    let tag = document.createElement("option")
    tag.innerText = players[key].nick
    tag.value= key
    e.accounts.appendChild(tag)
   
  }
  for(const key in players)
  {
    if(key != session.nick){

      let tag = document.createElement("option")
      tag.innerText = players[key].nick
      tag.value= key
      e.accountsToDelete.appendChild(tag)
    }
    e.accountsToDelete.value  = ""
    }
  let option = document.createElement("option")
  option.value = "newaccount"
  option.innerText = "+ Make New Account"
  e.accounts.appendChild(option)
  e.accounts.value = session.nick
}
