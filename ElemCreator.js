let e = {}
function loadIDS(){
  var allElements = document.querySelectorAll("*[id]")
    for (let i = 0, n = allElements.length; i < n; i++) {
      e[allElements[i].id] = allElements[i]
    }
e.map.style.width = mapW*5 + "vh"
e.map.style.height = mapH*5 + "vh"
e.guihandler.style.width = window.innerWidth-100 + "px"
e.guihandler.style.height = window.innerHeight-50 + "px"
e.behindeveryone.style.width = window.innerWidth-10 + "px"
e.behindeveryone.style.height = window.innerHeight-130 + "px"
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
}
let blocknames = {
  woodenpickaxe : "Wooden Pick",
  woodenaxe: "Wooden Axe",
  stoneaxe: "Stone Axe",
  stonepickaxe: "Stone Pick",
  testItem: "Kekw",
  oaklog: "Oak Wood Log",
  oakplank: "Oak Wood Plank",
  ironblock: "Block of Iron",
  ironingot: "Iron Ingot",
}
let statsnames = {
  tooltier : "Tool tier",
  tool: "Type",
  miningspeed : "Mining Speed",
  foragingfortune: "Foraging Fortune",
  miningfortune: "Mining Fortune",

}
let armornames = ["ring1","helmet",'ring2',"chestplate",'bracelet',"leggins","belt","boots"]
let toload = ["machines","inventory","inventorySlots","backpacks"].concat(armornames)


Array.prototype.set = function(n,l){

  for(let i = 0; i < l; i++){
  this[i] = n
  }
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
      tag.setAttribute("onclick", "LclickOnSlot(" + i + ")");
      tag.setAttribute("onmouseenter", "makeToolTip(steve.inventory[" + i + "])");
      tag.setAttribute(
        "onmouseleave",
        "if(istooltip) e.tooltip.style.display ='none'"
      );
  
      e.inventory["slot" + i] = tag;
  
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
      tag.setAttribute("onclick", "LclickOnSlot(" + i + ")");
      tag.setAttribute("oncontextmenu", "RclickOnSlot(" + i + "); return false");
      tag.setAttribute("onmouseenter", "makeToolTip(steve.inventory[" + i + "])");
      tag.setAttribute(
        "onmouseleave",
        "if(istooltip) e.tooltip.style.display ='none'"
      );
  
      tag.setAttribute("class", "guiSlot");
      e.inventory["slot" + i] = tag;
  
      tag.appendChild(amount);
      e.inventory.appendChild(tag);
    }
  }
  function buildCraftingTable() {
    for (let i = 0; i < 9; i++) {
      let tag = document.createElement("div");
      let amount = document.createElement("div");
      amount.setAttribute("class", "itemamount");
      e.craftingtable["slot" + i + "amount"] = amount;
  
      tag.setAttribute("onclick", "LclickOnSlot(" + i + ",'craftingtable')");
      tag.setAttribute(
        "oncontextmenu",
        "RclickOnSlot(" + i + ",'craftingtable'); return false"
      );
      tag.setAttribute(
        "onmouseenter",
        "makeToolTip(craftingTableItems[" + i + "])"
      );
      tag.setAttribute(
        "onmouseleave",
        "if(istooltip) e.tooltip.style.display ='none'"
      );
      tag.style.position = "absolute";
      tag.style.top = 8 * ((i - (i % 3)) / 3) + 1 + "vh";
      tag.style.left = 8 * (i % 3) + 1 + "vh";
  
      tag.setAttribute("class", "guiSlot");
      e.craftingtable["slot" + i] = tag;
  
      tag.appendChild(amount);
      e.craftingtable.appendChild(tag);
    }
    let tag = document.createElement("div");
    let amount = document.createElement("div");
    amount.setAttribute("class", "itemamount");
    e.craftingtable["slot9amount"] = amount;
    tag.setAttribute("onclick", "doCraftingRecipe()");
    // tag.setAttribute("oncontextmenu", "RclickOnSlot(" + i + ",'craftingtable'); return false");
    tag.setAttribute("onmouseenter", "makeToolTip(craftingTableResult)");
    tag.setAttribute(
      "onmouseleave",
      "if(istooltip) e.tooltip.style.display ='none'"
    );
    tag.setAttribute("class", "guiSlot");
    e.craftingtable["slot9"] = tag;
    tag.style.position = "absolute";
    tag.style.top = 9 + "vh";
    tag.style.left = 25 + "vh";
    tag.appendChild(amount);
    e.craftingtable.appendChild(tag);
  }
  function buildArmorGui() {
    for (let i = 0; i < 8; i++) {
      let tag = document.createElement("div");
  
      tag.setAttribute(
        "onclick",
        "LclickOnSlot(" + i + ",'" + armornames[i] + "')"
      );
      tag.setAttribute("oncontextmenu", " return false");
      tag.setAttribute(
        "onmouseenter",
        "makeToolTip(steve['" + armornames[i] + "'])"
      );
      tag.setAttribute(
        "onmouseleave",
        "if(istooltip) e.tooltip.style.display ='none'"
      );
      tag.className = "guiSlot " + armornames[i] + "gui";
      e.armorgui[armornames[i]] = tag;
  
      e.armorgui.appendChild(tag);
    }
  }
  function buildmachines() {
    for (let i = 0; i < 9; i++) {
      let tag = document.createElement("div");
  
      tag.setAttribute("onclick", "LclickOnSlot(" + i + ",'machine')");
      tag.setAttribute(
        "oncontextmenu",
        "openMachineGui(steve.machines[" + i + "]," + i + "); return false"
      );
      tag.setAttribute("onmouseenter", "makeToolTip(steve.machines[" + i + "])");
      tag.setAttribute(
        "onmouseleave",
        "if(istooltip) e.tooltip.style.display ='none'"
      );
  
      tag.className = "guiSlot machine";
      e.machines["slot" + i] = tag;
  
      e.machines.appendChild(tag);
      putItemInslot(steve.machines[i], e.machines["slot" + i]);
      steve.machines[i].doRecipe();
    }
  }
  function buildBackpacks(){
    for (let i = 0; i < 24; i++) {
      let tag = document.createElement("div");
      tag.setAttribute("onmouseenter", "makeToolTip(steve.backpacks[" + i + "])");
      tag.setAttribute("onclick", "LclickOnSlot(" + i + ",'backpack')");
      tag.setAttribute(
        "onmouseleave",
        "if(istooltip) e.tooltip.style.display ='none'"
      );
      tag.setAttribute(
        "oncontextmenu",
        "openMachineGui(steve.backpacks[" + i + "]," + i + "); return false"
      );
    
      tag.className = "guiSlot";
      e.backpacks["slot" + i] = tag;
      e.backpacks.appendChild(tag);
      putItemInslot(steve.backpacks[i], e.backpacks["slot" + i]);
    }
  }
 function buildBackpacksGui(){
   for(let i = 0 ; i < maxbackpackslot; i++)
   {
  let tag = document.createElement("div");
 
  tag.setAttribute(
    "onmouseleave",
    "if(istooltip) e.tooltip.style.display ='none'"
  );
  let amount = document.createElement("div");
  amount.setAttribute("class", "itemamount");
  tag.className = "guiSlot empty";
  
  e.backpack["slot" + i] = tag;
  e.backpack["slot" + i + "amount"] = amount
  tag.appendChild(amount)
  e.backpack.appendChild(tag);

}
 }
  