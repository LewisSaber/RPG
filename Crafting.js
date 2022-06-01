let shapelessrecipes = {};
let shapedrecipes = {};
let furnacerecipes = {};
let glitchrecipes = {};
/**
 * "empty"
 */
const empty = "empty"

function addShapelessRecipe(input, output, amount = 1, inputamount = [],tag = {}) {
  for (let i = input.length; i < 9; i++) {
    input.push(empty);
  }
  for (let i = inputamount.length; i < 9; i++) {
    inputamount.push(1);
  }
  shapelessrecipes[input.sort()] = [output, amount, inputamount,tag];
}
function addShapedRecipe(input, output, amount = 1, inputamount = [],tag = {}) {
  for (let i = input.length; i < 9; i++) {
    input.push(empty);
  }
  for (let i = inputamount.length; i < 9; i++) {
    inputamount.push(1);
  }
  shapedrecipes[input] = [output, amount, inputamount,tag];
}
function addFurnaceRecipe(input, output, time, amount = 1, inputamount = 1) {
  furnacerecipes[input] = [output, inputamount, amount, time];
}
function addGlitchRecipe(input,inputamount = 160,amount = 1){
  glitchrecipes[input] = ["glitched" +input, inputamount, amount];
}

function loadrecipes() {
  addShapelessRecipe(["logoak"], "planksoak", 4);
  addShapedRecipe(
    [empty, "planksoak", empty, empty, "planksoak"],
    "stick",
    4
  );
  addShapedRecipe(
    [
      "planksoak",
      "planksoak",
      "planksoak",
      empty,
      "stick",
      empty,
      empty,
      "stick",
    ],
    "woodpickaxe"
  );
  //addShapedRecipe(["cobblestone","cobblestone","cobblestone","cobblestone","cobblestone"],"bedrock",3,[64,64,64,64,64])
  addShapedRecipe(
    [
      "planksoak",
      "planksoak",
      empty,
      "planksoak",
      "stick",
      empty,
      empty,
      "stick",
    ],
    "woodaxe"
  );
  addShapedRecipe(["cobblestone"],'enchantingpaste',1,[1],{enchants : {
    sharpness : 5
  }})
  addShapedRecipe(["netherrack"],'enchantingpaste',1,[1],{enchants : {
    efficiency : 5
  }})
  addShapedRecipe(
    ['cobblestone', 'cobblestone', 'empty', 'cobblestone', 'stick', 'empty', 'empty', 'stick', 'empty'],"stoneaxe"
  )

  addShapedRecipe(['ironblock', 'ironblock', 'ironblock', 'empty', 'ironingot', 'empty', 'ironingot', 'ironingot', 'ironingot'],"anvil")
 
  addShapedRecipe(["paper","paper",empty,"paper","leather"],"book")
  addShapelessRecipe(["ironingot","ironingot","ironingot","ironingot","ironingot","ironingot","ironingot","ironingot","ironingot"],"ironblock")
  addFurnaceRecipe("cobblestone", "stone", 160, 1);
  addFurnaceRecipe("ironore", "ironingot", 160, 1);
  addFurnaceRecipe("rottenflesh","leather",320,1,4)
  addShapedRecipe(["leather","ironingot",empty,"ironingot",empty,"ironingot", "string","ironingot","leather"],"shears")
  addShapedRecipe(["ironblock","leather"],"forward",1,[64,64])
  addFurnaceRecipe("beef","steak",100)
  addFurnaceRecipe("rawchicken","cookedchicken",80)
  addShapedRecipe([empty,"planksoak",empty,empty,"planksoak",empty,empty,"stick",empty],"woodsword")
  addShapedRecipe([empty,"cobblestone",empty,empty,"cobblestone",empty,empty,"stick",empty],"stonesword",1,[].set(0,9),{stats : { maxhealth: 20}})
  addFurnaceRecipe("sand","glass",100)
  addGlitchRecipe("cobblestone")
  addGlitchRecipe("rottenflesh")
 
}

let craftingTableItems = [];
craftingTableItems.set(new classes.empty(), 9);
let craftingArray = [];
craftingArray.set(empty, 9);
let craftingAmounts = [];
craftingAmounts.set(0, 9);
let recipeAmounts = [];
let craftingTableResult = new classes.empty();
function checkinput(a, b) {
  for (const key in a) {
    if (a[key] != 1 && a[key] > b[key]) return false;
  }
  return true;
}
function searchCraftingRecipe() {
  let sortedarray = [...craftingArray].sort();
  if (
    shapedrecipes[craftingArray] != undefined &&
    checkinput(shapedrecipes[craftingArray][2], craftingAmounts)
  ) {
    return shapedrecipes[craftingArray];
  }
  if (
    shapelessrecipes[sortedarray] != undefined &&
    checkinput(shapelessrecipes[sortedarray][2], [...craftingAmounts].sort())
  ) {
    return shapelessrecipes[sortedarray];
  }

  return [empty, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0]];
}
function setCraftingTableOutput() {
  let recipe = searchCraftingRecipe();
  recipeAmounts = recipe[2];
  craftingTableResult = new classes[recipe[0]](recipe[1]);
  craftingTableResult.addTag(recipe[3])
  putItemInslot(
    craftingTableResult,
    e.craftingtable["slot9"],
    e.craftingtable["slot9amount"]
  );
}
function doRecipe(input) {
  for (let i = 0; i < input.length; i++) {
    input[i].amount =
      input[i].name == empty
        ? input[i].amount
        : input[i].amount - recipeAmounts[i];
    craftingAmounts[i] = input[i].amount;
    if (input[i].amount == 0) {
      input[i] = new classes.empty();
      craftingArray[i] = empty;
    }
  }

  return input;
}
function doCraftingRecipe() {
  if (!isNeiOpen)
    if (craftingTableResult.name != empty) {
      if (AddItemToCursor(craftingTableResult)) {
        craftingTableItems = doRecipe(craftingTableItems);
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

function dumbtoinventory(items) {
  for (let i = 0; i < items.length; i++) {
    items[i] = steve.addToInventory(items[i]);
  }
  return items;
}
let RecipeSpecial = [];
let RecipeGueue = [];
function findUsageRecipes() {
  RecipeGueue = [];
  RecipeSpecial = [];

  for (const key in shapedrecipes) {
    if (key.includes(itemintooltip)) {
      RecipeSpecial.push("Shaped Recipe");
      RecipeGueue.push([key.split(","), shapedrecipes[key]]);
    }
  }

  for (const key in shapelessrecipes) {
    if (key.includes(itemintooltip)) {
      RecipeSpecial.push("Shapeless Recipe");
      RecipeGueue.push([key.split(","), shapelessrecipes[key]]);
    }
  }
  for (const key in furnacerecipes) {
    if (key == itemintooltip) {
      RecipeSpecial.push("Time: " + furnacerecipes[key][3] + " ticks");
      let furnace = new classes.furnace(1);

      furnace.inventory.input = new classes[key](furnacerecipes[key][1]);
      furnace.inventory.output = new classes[furnacerecipes[key][0]](
        furnacerecipes[key][2]
      );
      RecipeGueue.push(furnace);
    }
  }
  for (const key in glitchrecipes) {
    if (key == itemintooltip ) {
      RecipeSpecial.push("Super Compactor 3000 ");
      let glitch = new classes.glitchcompactor(1);
      let iter = 1
      let amount = glitchrecipes[key][1]
      while(amount > 0){
        const batch = amount >=64 ? 64 :  amount
      
        amount -= batch
        glitch.inventory["input" + iter] = new classes[key](batch)
        iter++
        
      }
      
      glitch.inventory.output = new classes[glitchrecipes[key][0]](
        glitchrecipes[key][2]
      );
      RecipeGueue.push(glitch);
    }
  }

}
function findCraftingRecipes() {
  RecipeGueue = [];
  RecipeSpecial = [];
  for (const key in shapedrecipes) {
    if (shapedrecipes[key].includes(itemintooltip)) {
      RecipeSpecial.push("Shaped Recipe");
      RecipeGueue.push([key.split(","), shapedrecipes[key]]);
    }
  }
  for (const key in shapelessrecipes) {
    if (shapelessrecipes[key].includes(itemintooltip)) {
      RecipeSpecial.push("Shapeless Recipe");
      RecipeGueue.push([key.split(","), shapelessrecipes[key]]);
    }
  }
  for (const key in furnacerecipes) {
    if (furnacerecipes[key][0] == itemintooltip) {
      RecipeSpecial.push("Time: " + furnacerecipes[key][3] + " ticks");
      let furnace = new classes.furnace(1);

      furnace.inventory.input = new classes[key](furnacerecipes[key][1]);
      furnace.inventory.output = new classes[furnacerecipes[key][0]](
        furnacerecipes[key][2]
      );
      RecipeGueue.push(furnace);
    }
  }
  for (const key in glitchrecipes) {
    if (glitchrecipes[key][0] == itemintooltip) {
      RecipeSpecial.push("Super Compactor 3000 ");
      let glitch = new classes.glitchcompactor(1);
      let iter = 1
      let amount = glitchrecipes[key][1]
      while(amount > 0){
        const batch = amount >=64 ? 64 :  amount
       
        amount -= batch
        glitch.inventory["input" + iter] = new classes[key](batch)
        iter++
        
      }
      
      glitch.inventory.output = new classes[glitchrecipes[key][0]](
        glitchrecipes[key][2]
      );
      RecipeGueue.push(glitch);
    }
  }
}
CurrentRecipeI = 0;
function ShowCraftingRecipe(n) {
  e.craftingtable.style.display = "block";
  if (lastmachine != undefined) e[lastmachine].style.display = "none";

  e.neiText.innerHTML =
    n + 1 + "/" + RecipeGueue.length + "<br>" + RecipeSpecial[n];
  for (let i = 0; i < 9; i++) {
    craftingTableItems[i] = new classes[RecipeGueue[n][0][i]]();
    putItemInslot(
      craftingTableItems[i],
      e.craftingtable["slot" + i],
      e.craftingtable["slot" + i + "amount"]
    );
    e.craftingtable["slot" + i].className = "guiSlot " + RecipeGueue[n][0][i];
    e.craftingtable["slot" + i + "amount"].innerText =
      RecipeGueue[n][1][2][i] > 1 ? RecipeGueue[n][1][2][i] : "";
  }
  e.craftingtable["slot" + 9].className = "guiSlot " + RecipeGueue[n][1][0];
  e.craftingtable["slot" + 9 + "amount"].innerText =
    RecipeGueue[n][1][1] > 1 ? RecipeGueue[n][1][1] : "";
  craftingTableResult = new classes[RecipeGueue[n][1][0]]();
  craftingTableResult.addTag(RecipeGueue[n][1][3])
}
function ShowRecipe(n) {
  if (n >= RecipeGueue.length) n = 0;
  if (n < 0) n = RecipeGueue.length - 1;
  e.neiText.innerHTML =
    n + 1 + "/" + RecipeGueue.length + "<br>" + RecipeSpecial[n];
  if (RecipeGueue[n].name != undefined) {

    openMachineGui(RecipeGueue[n], n);
  } else ShowCraftingRecipe(n);

  CurrentRecipeI = n;
}
const numnames = ["K","M","B","T"]
Number.prototype.formate = function(OM = 3,Rounding = 2){
  if(this > 10**OM){
    let OOM = Math.log10(this)/3-1>>0

    return (this/1000**(OOM+1)).toFixed(Rounding) + numnames[OOM]
  }
  else
  return this
}

