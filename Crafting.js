let shapelessrecipes = {};
let shapedrecipes = {};
let furnacerecipes = {};
function addShapelessRecipe(input, output, amount = 1, inputamount = []) {
  for (let i = input.length; i < 9; i++) {
    input.push("empty");
  }
  for (let i = inputamount.length; i < 9; i++) {
    inputamount.push(1);
  }
  shapelessrecipes[input.sort()] = [output, amount, inputamount];
}
function addShapedRecipe(input, output, amount = 1, inputamount = []) {
  for (let i = input.length; i < 9; i++) {
    input.push("empty");
  }
  for (let i = inputamount.length; i < 9; i++) {
    inputamount.push(1);
  }
  shapedrecipes[input] = [output, amount, inputamount];
}
function AddFurnaceRecipe(input, output, time, amount = 1, inputamount = 1) {
  furnacerecipes[input] = [output, inputamount, amount, time];
}

function loadrecipes() {
  addShapelessRecipe(["oaklog"], "oakplank", 4);
  addShapedRecipe(
    ["empty", "oakplank", "empty", "empty", "oakplank"],
    "stick",
    4
  );
  addShapedRecipe(
    [
      "oakplank",
      "oakplank",
      "oakplank",
      "empty",
      "stick",
      "empty",
      "empty",
      "stick",
    ],
    "woodenpickaxe"
  );
  //addShapedRecipe(["cobblestone","cobblestone","cobblestone","cobblestone","cobblestone"],"bedrock",3,[64,64,64,64,64])
  addShapedRecipe(
    [
      "oakplank",
      "oakplank",
      "empty",
      "oakplank",
      "stick",
      "empty",
      "empty",
      "stick",
    ],
    "woodenaxe"
  );
  addShapedRecipe(
    ['cobblestone', 'cobblestone', 'empty', 'cobblestone', 'stick', 'empty', 'empty', 'stick', 'empty'],"stoneaxe"
  )
  addShapedRecipe(['cobblestone', 'cobblestone', 'cobblestone', 'empty', 'stick', 'empty', 'empty', 'stick', 'empty'],"stonepickaxe")
  addShapedRecipe(['ironblock', 'ironblock', 'ironblock', 'empty', 'ironingot', 'empty', 'ironingot', 'ironingot', 'ironingot'],"anvil")
  addShapedRecipe(
    [
      "cobblestone",
      "cobblestone",
      "cobblestone",
      "cobblestone",
      "empty",
      "cobblestone",
      "cobblestone",
      "cobblestone",
      "cobblestone",
    ],
    "furnace",
    1,
    [16, 16, 16, 16, 1, 16, 16, 16, 16]
  );
  addShapelessRecipe(["ironingot","ironingot","ironingot","ironingot","ironingot","ironingot","ironingot","ironingot","ironingot"],"ironblock")
  AddFurnaceRecipe("cobblestone", "stone", 160, 1);
  AddFurnaceRecipe("ironore", "ironingot", 160, 1);
}
let craftingTableItems = [];
craftingTableItems.set(new classes.empty(), 9);
let craftingArray = [];
craftingArray.set("empty", 9);
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

  return ["empty", 0, [0, 0, 0, 0, 0, 0, 0, 0, 0]];
}
function setCraftingTableOutput() {
  let recipe = searchCraftingRecipe();
  recipeAmounts = recipe[2];
  craftingTableResult = new classes[recipe[0]](recipe[1]);

  putItemInslot(
    craftingTableResult,
    e.craftingtable["slot9"],
    e.craftingtable["slot9amount"]
  );
}
function doRecipe(input) {
  for (let i = 0; i < input.length; i++) {
    input[i].amount =
      input[i].name == "empty"
        ? input[i].amount
        : input[i].amount - recipeAmounts[i];
    craftingAmounts[i] = input[i].amount;
    if (input[i].amount == 0) {
      input[i] = new classes.empty();
      craftingArray[i] = "empty";
    }
  }

  return input;
}
function doCraftingRecipe() {
  if (!isNeiOpen)
    if (craftingTableResult.name != "empty") {
      if (AddItemInCursor(craftingTableResult)) {
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
