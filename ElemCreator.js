/** @type {HTMLElement[]} */
let e = {}

$.notify.defaults({ className: "info", position:"top right", style: 'bootstrap', autoHideDelay: 10000});

function loadIDS() {
  var allElements = document.querySelectorAll("*[id]")
  for (let i = 0, n = allElements.length; i < n; i++) {
    e[allElements[i].id] = allElements[i]
  }
  // e.map.style.width = mapW * 5 + "vh"
  // e.map.style.height = mapH * 5 + "vh"
  e.guihandler.style.width = window.innerWidth - 100 + "px"
  e.guihandler.style.height = window.innerHeight - 50 + "px"
  // e.behindeveryone.style.width = window.innerWidth - 10 + "px"
  // e.behindeveryone.style.height = window.innerHeight - 130 + "px"
  // e.mapframe.style.height = window.innerHeight + "px"
  // e.mapframe.style.width = window.innerWidth + "px"

  // e.anvil.slot0 = e.anvilinput
  // e.anvil.slot0amount = e.anvilInputamount
  // e.anvil.slot1 = e.anviloutput
  // e.anvil.slot1amount = e.anvilOutputamount
  e.accessorybagbutton.oncontextmenu = e.accessorybagbutton.onclick
  e.skillsbutton.oncontextmenu = e.skillsbutton.onclick
  e.collectionsbutton.oncontextmenu = e.collectionsbutton.onclick  
}
const codeAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"//abcdefghijklmnopqrstuvwxyz"]
 const keywords = ["helmet","leggings","chestplate","boots","charm","relic","talisman","artifact","fortune","planks","pickaxe","axe","sword","glitched"]
// const keywords = /helmet|leggings|chestplate|boots|charm|relic|talisman|artifact/
const texturefilter = ["empty", "item", "block", "stonetype","tool","projectile","mob","backpack"]
const raritycolors = [
  "white",
  "lime",
  "#105ae3",
  "purple",
  "yellow",
  "#fc26a7",
  "#6b0000",
]
const raritynames = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
  "Mythic",
  "Bloody"
]
const Names = {
  // revenantchestplate: "Revenant Chestplate",
  // villagetalisman: "Village Talisman",
  // villagecharm: "Village Charm",
  // villageartifact: "Village Artifact",
  // villagerelic: "Village Relic",
  // lewisrelic: "Lewis Relic",
  furnace: "Stone Furnace",
  steeleaf: "Very Sharp Leaf",
  gtnh:"GTNH",
  // combatfortune:"Combat Fortune",
  // farmingfortune: "Farming Fortune",
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
  planksoak: "Oak Wood Planks",
  ironblock: "Block of Iron",
  ironingot: "Iron Ingot",
  smallbackpack: "Small Backpack",
  mediumbackpack: "Medium Backpack",
  largebackpack: "Large Backpack",
  beef: "Raw Beef Meat",
  rawchicken: "Raw Chicken Meat",
  cookedchicken: "Cooked Chicken Meat",
  magicfind: "Magic Find",
  emotionaldamage:"Emotional Damage",
  lewissaber: "LewisSaber",
  dreammaster: "DreamMasterXXL",
  // leatherhelmet: "Leather Helmet",
  // leatherchestplate: "Leather Chestplate",
  // leatherboots: "Leather Boots",
  // leatherleggings: "Leather leggings",
  steeleafhandle: "Steeleaf Handle",
  woodtoughrod: "Hardened Wooden Stick",
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
  tool: "Type",
  miningspeed: "Mining Speed",
  foragingfortune: "Foraging Fortune",
  miningfortune: "Mining Fortune",
  maxhealth: "Health",
  zombieheart: "Zombie Heart"
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
  "stoneslab",
  "leavesoak",
  "woolcoloredgreen",
  "grassPlant",
  "bedrock",
  "logoak",
  "treeoak",
  "sand",
  "dirt",
  "mob zombie",
  "mob cow",
  "mob chicken",
  "mob skeleton",
  "dandelion",
]

const hiddenstats = ["tool", "undeadbonus","totaldamage","naturalregeneration","totalDamageMultiplier","tooltier","health","zombiedefense","intimidationlevel","healthmultiplier"]
const armornames = [
  "ring1",
  "helmet",
  "ring2",
  "chestplate",
  "bracelet",
  "leggings",
  "belt",
  "boots",
]
const toSave = [
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
  "sellHistory",
  "version","armor"
]//.concat(armornames)

function toHex(numb) {
  if (numb <= 0) return "00"
  if (numb > 255) return "FF"
  return numb.toString(16).toUpperCase()
}

const slayerArmorMilestones = [0,50,300,1000,2000,3000,5000,7500,10000,15000,25000,50000,100000,200000,500000]
const slayerArmorMilestonesDefense = [0,20,50,90,120,150,180,200,220,240,260,280,300,310,315]

String.prototype.toUpperLetter = function() {
  return this[0].toUpperCase() + this.substring(1)
}
Number.prototype.blocks = function() {
  return this*blocksize

} 
Number.prototype.px = function(){
  return this + "px"
}
String.prototype.blocks = function() {
  return this*blocksize

} 
String.prototype.px = function(){
  return this + "px"
}
Number.prototype.fixed = function(val)
{
  return +this.toFixed(val)
}

  


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
  if(str == "") return true
  if(!str) return false
 
  const s = str.split(" ")
  const arr = this.split(" ")
  for (const key of s) {
    for(const key2 of arr){
      if(key == key2) return true
    }
    //  if (this.includes(key)) return true
    

  }
  return false
}

String.prototype.give = function(amount = 1){
  give(this,amount)
}
String.prototype.color = function (Color,weight){
  return color(this,Color,weight)
}
Number.prototype.color = function (Color,weight){
  return color(this,Color,weight)
}
Date.prototype.toString = function(){
  return this
}
Date.prototype.toMyFormat = function(){
return this.getDate().toDayDate() + "." + (this.getMonth()+1).toDayDate()+"."+this.getFullYear()
}
Number.prototype.toDayDate = function(){
  return ("0" + this).slice(-2)
}
String.prototype.tocolor = function(color){
  this.colored = color
  return this
}
String.prototype.center = function(color){
  this.textalign = "center"
  return this
}
String.prototype.assemble = function(type = "span"){

  return "<"+type+" style ='" +(this.colored?"color:"+this.colored+";":"") +(this.textalign?"text-align:"+this.textalign+";":"") +  "'>" + this + "</"+type +">"
}



function buildHotbar() {
  e.hotbar.style.display = "block"
}

function random100(r) {
  return Math.floor(Math.random() * 100) <= r
}

function buildArmorGui() {
  for(const key in steve.armor){
    e.armorgui.appendChild(steve.armor[key].getTag())
  }
  craftingTable.build()
}
function buildmachines() {
  for (let i = 0; i < 9; i++) {
    e.machines.appendChild(steve.machines[i].getTag())
  }
}
function buildBackpacks() {
  steve.backpacks.forEach(x=>{
    e.backpacks.appendChild(x.getTag())
  })

 }

function buildEnchantingBook() {
  for (let i = 0; i < 3; i++) {
    let tag = document.createElement("div")

    tag.setAttribute(
      "onmouseleave",
      "leaveElement()"    )
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
      "leaveElement()"    )
    e.collections.appendChild(holder)
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

// $.notify.addStyle('recipe', {
//   html: "<div><span data-notify-text/></div>",
//   classes: {
//     base: {
//       "white-space": "nowrap",
//       "background-color": "lightblue",
//       "padding": "5px"
//     },
//     superblue: {
//       "color": "white",
//       "background-color": "blue"
//     }
//   }
// });
