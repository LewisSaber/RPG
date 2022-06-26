let shapedrecipes = []
let furnacerecipes = {}
let glitchrecipes = {}
/**
 * "empty"
 */
const empty = "empty"

let craftingTable = {
  inventory: [].set(new classes.empty(1), 9),
  output: new classes.empty(),
  addToInventory(slot, clicktype) {
    if (clicktype == "emptyCursorLclick")
      if (isShiftOn) {
        this.inventory[slot] = steve.addToInventory(this.inventory[slot])
        putItemInslot(
          this.inventory[slot],
          e.craftingtable["slot" + slot],
          e.craftingtable["slot" + slot + "amount"]
        )

        makeToolTip(this.inventory[slot])
      } else {
        this.inventory[slot] = putInCursorFull(
          this.inventory[slot],
          e.craftingtable["slot" + slot],
          e.craftingtable["slot" + slot + "amount"]
        )
      }

    if (clicktype == "fullCursorLclick")
      if (isShiftOn) {
        this.inventory[slot] = steve.addToInventory(this.inventory[slot])
        putItemInslot(
          this.inventory[slot],
          e.craftingtable["slot" + slot],
          e.craftingtable["slot" + slot + "amount"]
        )
      } else {
        this.inventory[slot] = PutInSlotFull(
          this.inventory[slot],
          e.craftingtable["slot" + slot],
          e.craftingtable["slot" + slot + "amount"]
        )
      }
    if (clicktype == "emptyCursorRclick")
      this.inventory[slot] = putInCursorHalf(
        this.inventory[slot],
        e.craftingtable["slot" + slot],
        e.craftingtable["slot" + slot + "amount"]
      )
    if (clicktype == "fullCursorRclick")
      this.inventory[slot] = putInSlotOne(
        this.inventory[slot],
        e.craftingtable["slot" + slot],
        e.craftingtable["slot" + slot + "amount"]
      )
    this.searchRecipe()
    this.formIndexesArray()
    this.setOutput()
  },
  formIndexesArray() {
    this.shapedrecipeindexes = []
    if (this.recipe != undefined) {
      for (let i = 0; i < this.inventory.length; i++) {
        for (let j = 0; j < this.recipe.input.length; j++) {
          if (
            this.inventory[i].name == this.recipe.input[j] &&
            this.shapedrecipeindexes[j] == undefined
          ) {
            this.shapedrecipeindexes[j] = i
            j = 10
          }
        }
      }
    }
  },
  setOutput() {
    if (this.recipe && this.checkValidness()) {
      this.output = new classes[this.recipe.output](this.recipe.outputAmount)
      this.output.withTag(this.recipe.outputtag)
    } else this.output = new classes.empty()
    putItemInslot(
      this.output,
      e.craftingtable.slot9,
      e.craftingtable.slot9amount
    )
  },
  doRecipe() {
    if (this.recipe && this.checkValidness()) {
      let Out = Object.assign(
        Object.create(Object.getPrototypeOf(this.output)),
        this.output
      )
      Out.amount = 0
      if(isShiftOn ||(itemInCursor == "none" ||( itemInCursor.name == Out.name &&itemInCursor.getEmpty() >=this.recipe.outputAmount )))
      do {

        if (Out.getEmpty() >= this.recipe.outputAmount) {
          Out.amount += this.recipe.outputAmount
          for (let i = 0; i < this.shapedrecipeindexes.length; i++) {
            this.inventory[this.shapedrecipeindexes[i]] = reduceStack(
              this.inventory[this.shapedrecipeindexes[i]],
              this.recipe.inputamount[i]
            )
          }
        }else
        break
       
      } while (this.checkValidness() && isShiftOn)
      
      if (!isEmpty(Out)) {
        if (isShiftOn) {
          steve.addToInventory(Out)
          makeToolTip(new classes.empty())
        } else AddItemToCursor(Out)
      }
      for (let i = 0; i < 9; i++) {
        putItemInslot(
          this.inventory[i],
          e.craftingtable["slot" + i],
          e.craftingtable["slot" + i + "amount"]
        )
      }
      this.setOutput()
    }
  },
  dumpTable(ignore = false) {
    if (!isNeiOpen || ignore)
      for (let i = 0; i < 9; i++) {
        if (!isEmpty(this.inventory[i]))
          this.inventory[i] = steve.addToInventory(this.inventory[i])
        putItemInslot(
          this.inventory[i],
          e.craftingtable["slot" + i],
          e.craftingtable["slot" + i + "amount"]
        )
      }
  },
  clear() {
    for (let i = 0; i < 9; i++) {
      this.inventory[i] = new classes.empty()
      putItemInslot(
        this.inventory[i],
        e.craftingtable["slot" + i],
        e.craftingtable["slot" + i + "amount"]
      )
    }
    this.output = new classes.empty()
    putItemInslot(
      this.output,
      e.craftingtable["slot9"],
      e.craftingtable["slot9amount"]
    )
  },

  checkValidness() {
    if (this.recipe) {
      let state = true
      for (let i = 0; i < this.shapedrecipeindexes.length; i++) {
        if (
          state &&
          this.recipe.input[i] ==
            this.inventory[this.shapedrecipeindexes[i]].name &&
          this.recipe.inputamount[i] <=
            this.inventory[this.shapedrecipeindexes[i]].amount &&
          (this.recipe.inputtag[i] != undefined
            ? compareObjects(
                this.inventory[this.shapedrecipeindexes[i]],
                this.recipe.inputtag[i]
              )
            : true)
        ) {
          state = true
        } else state = false
      }
      return state
    }
    return false
  },

  shapedrecipeindexes: [],
  recipe: undefined,
  searchRecipe() {
    const sortedInventoryNames = [...this.inventory]
      .sort(function (a, b) {
        return a.name > b.name ? 1 : -1
      })
      .pushNames()
    this.recipe = undefined
    for (let i = 0; i < shapedrecipes.length; i++) {
      if (sortedInventoryNames.isEqual([...shapedrecipes[i].input].sort())) {
        if (
          this.inventory
            .pushNames()
            .recipeShapeToTopLeft()
            .isEqual(shapedrecipes[i].input.recipeShapeToTopLeft())
        ) {
          this.recipe = shapedrecipes[i]

          i = 10000
        }
      }
    }
    // if(this.recipe == undefined )
    // for (let i = 0; i < shapelessrecipes.length; i++) {

    //   if( sortedInventoryNames.isEqual(shapelessrecipes[i].input)){
    //     this.recipe = shapelessrecipes[i]
    //     i = 10000
    //   }
    // }

    // for(const key in shapedrecipes)
  },
}

// function addShapedRecipe(input, output, amount = 1, inputamount = [],tag = {},inputtags = []) {
//   for (let i = input.length; i < 9; i++) {
//     input.push(empty);
//   }
//   for (let i = inputamount.length; i < 9; i++) {
//     if(input[i] == "empty")
//     inputamount.push(0);
//     else
//     inputamount.push(1);
//   }
//   shapelessrecipes.push({
//     input: input.sort(),
//     output: output,
//     inputamount: inputamount,
//     outputtag: tag,
//     inputtag: inputtags,
//     outputAmount: amount,

//   })

// }
function addShapedRecipe(
  input,
  output,
  amount = 1,
  inputamount = [],
  tag = {},
  inputtags = []
) {
  for (let i = input.length; i < 9; i++) {
    input.push(empty)
  }
  for (let i = inputamount.length; i < 9; i++) {
    if (input[i] == "empty") inputamount.push(0)
    else inputamount.push(1)
  }
  shapedrecipes.push({
    input: input,
    output: output,
    inputamount: inputamount,
    outputtag: tag,
    inputtag: inputtags,
    outputAmount: amount,
  })
  notification([
    "New Recipe Unlocked!<br>",
    (getName(output)).color("green"),
  ])
}
function addFurnaceRecipe(input, output, time, amount = 1, inputamount = 1) {
  furnacerecipes[input] = [output, inputamount, amount, time]
  notification([
    "New Recipe Unlocked!<br>",
    (getName(output)).color("green"),
  ])
}
function addGlitchRecipe(input, inputamount = 160, amount = 1) {
  glitchrecipes[input] = ["glitched" + input, inputamount, amount]
  notification([
    "New Recipe Unlocked!<br>",
    (getName("glitched" + input)).color("green"),
  ])
}

function loadrecipes() {
  addShapedRecipe(
    [
      empty,
      "stick",
      "logoak",
      "stick",
      "logoak",
      "stick",
      "logoak",
      "stick",
      empty,
    ],
    "woodtoughrod"
  )
  addShapedRecipe(["logoak"], "planksoak", 4)
  addShapedRecipe([empty, "planksoak", empty, empty, "planksoak"], "stick", 4)
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
  )
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
  )
  addShapedRecipe(["cobblestone"], "enchantingpaste", 1, [1], {
    enchants: {
      sharpness: 5,
    },
  })
  addShapedRecipe(["netherrack"], "enchantingpaste", 1, [1], {
    enchants: {
      efficiency: 5,
    },
  })

  addShapedRecipe(
    [
      "ironblock",
      "ironblock",
      "ironblock",
      "empty",
      "ironingot",
      "empty",
      "ironingot",
      "ironingot",
      "ironingot",
    ],
    "anvil"
  )

  addShapedRecipe(["paper", "paper", empty, "paper", "leather"], "book", 1, [2])
  addShapedRecipe(
    [
      "ironingot",
      "ironingot",
      "ironingot",
      "ironingot",
      "ironingot",
      "ironingot",
      "ironingot",
      "ironingot",
      "ironingot",
    ],
    "ironblock"
  )
  addFurnaceRecipe("cobblestone", "stone", 160, 1)
  addFurnaceRecipe("ironore", "ironingot", 160, 1)
  addFurnaceRecipe("rottenflesh", "leather", 320, 1, 4)
  addShapedRecipe(
    [
      "leather",
      "ironingot",
      empty,
      "ironingot",
      empty,
      "ironingot",
      "string",
      "ironingot",
      "leather",
    ],
    "shears"
  )
  addShapedRecipe(["ironingot","ironingot","ironingot",empty,"steeleafhandle",empty,empty,"steeleafhandle",empty],"ironpickaxe",1,[4,4,4])
  addShapedRecipe(["ironingot","ironingot",empty,"ironingot","steeleafhandle",empty,empty,"steeleafhandle",empty],"ironaxe",1,[4,4,0,4])
  addFurnaceRecipe("beef", "steak", 100)
  addFurnaceRecipe("rawchicken", "cookedchicken", 80)
  addShapedRecipe(
    [
      empty,
      "planksoak",
      empty,
      empty,
      "planksoak",
      empty,
      empty,
      "stick",
      empty,
    ],
    "woodsword",
    1,
    [],
    {},
    [, { kills: 20 }]
  )

  addFurnaceRecipe("sand", "glass", 100)
  
}

function dumbtoinventory(items) {
  for (let i = 0; i < items.length; i++) {
    while (items[i].getEmpty() <= 0) {
      let newitem = Object.assign(
        Object.create(Object.getPrototypeOf(items[i])),
        items[i]
      )

      newitem.amount = newitem.maxStackSize
      steve.addToInventory(newitem)
      items[i].amount -= items[i].maxStackSize
    }
    items[i] = steve.addToInventory(items[i])
  }
  return items
}
let RecipeSpecial = []
let RecipeGueue = []
function findUsageRecipes() {
  RecipeGueue = []
  RecipeSpecial = []
  shapedrecipes.forEach((x) => {
    if (x.input.includes(itemintooltip)) {
      RecipeSpecial.push("")
      x.type = "craftingtable"
      RecipeGueue.push(x)
    }
  })
  // shapelessrecipes.forEach(x =>{
  //   if(x.input.includes(itemintooltip)){
  //     RecipeSpecial.push("Shapeless Recipe");
  //     x.type = "craftingtable"
  //     RecipeGueue.push(x);
  //   }
  //   })
  // // for (const key in shapedrecipes) {
  // //   if (key.includes(itemintooltip)) {
  // //     RecipeSpecial.push("Shaped Recipe");
  // //     RecipeGueue.push([key.split(","), shapedrecipes[key]]);
  // //   }
  // // }

  // for (const key in shapelessrecipes) {
  //   if (key.includes(itemintooltip)) {
  //     RecipeSpecial.push("Shapeless Recipe");
  //     RecipeGueue.push([key.split(","), shapelessrecipes[key]]);
  //   }
  // }
  for (const key in furnacerecipes) {
    if (key == itemintooltip) {
      RecipeSpecial.push("Time: " + furnacerecipes[key][3] + " ticks")
      let furnace = new classes.furnace(1)

      furnace.inventory.input = new classes[key](furnacerecipes[key][1])
      furnace.inventory.output = new classes[furnacerecipes[key][0]](
        furnacerecipes[key][2]
      )
      RecipeGueue.push(furnace)
    }
  }
  for (const key in glitchrecipes) {
    if (key == itemintooltip) {
      RecipeSpecial.push("Super Compactor 3000 ")
      let glitch = new classes.glitchcompactor(1)
      let iter = 1
      let amount = glitchrecipes[key][1]
      while (amount > 0) {
        const batch = amount >= 64 ? 64 : amount

        amount -= batch
        glitch.inventory["input" + iter] = new classes[key](batch)
        iter++
      }

      glitch.inventory.output = new classes[glitchrecipes[key][0]](
        glitchrecipes[key][2]
      )
      RecipeGueue.push(glitch)
    }
  }
}
function findCraftingRecipes() {
  RecipeGueue = []
  RecipeSpecial = []

  shapedrecipes.forEach((x) => {
    if (x.output.includes(itemintooltip)) {
      RecipeSpecial.push("Shaped Recipe")
      x.type = "craftingtable"
      RecipeGueue.push(x)
    }
  })

  // shapelessrecipes.forEach(x =>{
  //   if(x.output.includes(itemintooltip)){
  //     RecipeSpecial.push("Shapeless Recipe");
  //     x.type = "craftingtable"
  //     RecipeGueue.push(x);
  //   }
  //   })

  // for (const key in shapedrecipes) {
  //   if (shapedrecipes[key].includes(itemintooltip)) {
  //     RecipeSpecial.push("Shaped Recipe");
  //     RecipeGueue.push([key.split(","), shapedrecipes[key]]);
  //   }
  // }
  // for (const key in shapelessrecipes) {
  //   if (shapelessrecipes[key].includes(itemintooltip)) {
  //     RecipeSpecial.push("Shapeless Recipe");
  //     RecipeGueue.push([key.split(","), shapelessrecipes[key]]);
  //   }
  //}
  for (const key in furnacerecipes) {
    if (furnacerecipes[key][0] == itemintooltip) {
      RecipeSpecial.push("Time: " + furnacerecipes[key][3] + " ticks")
      let furnace = new classes.furnace(1)

      furnace.inventory.input = new classes[key](furnacerecipes[key][1])
      furnace.inventory.output = new classes[furnacerecipes[key][0]](
        furnacerecipes[key][2]
      )
      RecipeGueue.push(furnace)
    }
  }
  for (const key in glitchrecipes) {
    if (glitchrecipes[key][0] == itemintooltip) {
      RecipeSpecial.push("Super Compactor 3000 ")
      let glitch = new classes.glitchcompactor(1)
      let iter = 1
      let amount = glitchrecipes[key][1]
      while (amount > 0) {
        const batch = amount >= 64 ? 64 : amount

        amount -= batch
        glitch.inventory["input" + iter] = new classes[key](batch)
        iter++
      }

      glitch.inventory.output = new classes[glitchrecipes[key][0]](
        glitchrecipes[key][2]
      )
      RecipeGueue.push(glitch)
    }
  }
}
CurrentRecipeI = 0
function ShowCraftingRecipe(n) {
  craftingTable.clear()
  e.craftingtable.style.display = "block"
  if (lastmachine != undefined) e[lastmachine].style.display = "none"

  e.neiText.innerHTML =
    n + 1 + "/" + RecipeGueue.length + "<br>" + RecipeSpecial[n]
  for (let i = 0; i < 9; i++) {
    craftingTable.inventory[i] = new classes[RecipeGueue[n].input[i]](
      RecipeGueue[n].inputamount[i]
    )
    craftingTable.inventory[i].withTag(RecipeGueue[n].inputtag[i])

    putItemInslot(
      craftingTable.inventory[i],
      e.craftingtable["slot" + i],
      e.craftingtable["slot" + i + "amount"]
    )
  }
  craftingTable.output = new classes[RecipeGueue[n].output](
    RecipeGueue[n].outputAmount
  )
  craftingTable.output.withTag(RecipeGueue[n].outputtag)
  putItemInslot(
    craftingTable.output,
    e.craftingtable["slot9"],
    e.craftingtable["slot9amount"]
  )
}
function ShowRecipe(n) {
  if (n >= RecipeGueue.length) n = 0
  if (n < 0) n = RecipeGueue.length - 1
  e.neiText.innerHTML =
    n + 1 + "/" + RecipeGueue.length + "<br>" + RecipeSpecial[n]
  if (RecipeGueue[n].name != undefined) {
    openMachineGui(RecipeGueue[n], n)
  } else ShowCraftingRecipe(n)

  CurrentRecipeI = n
}
const numnames = ["K", "M", "B", "T"]
Number.prototype.formate = function (OM = 3, Rounding = 2) {
  if (this > 10 ** OM) {
    let OOM = (Math.log10(this) / 3 - 1) >> 0

    return (this / 1000 ** (OOM + 1)).toFixed(Rounding) + numnames[OOM]
  } else return this
}
Number.prototype.formateComas = function () {
  const num = this.toString()
  let str = ""
  for (let i = 1; i <= num.length; i++) {
    if (i % 3 == 1) str = "," + str
    str = num[num.length - i] + str
  }
  return str.slice(0, -1)
}
Array.prototype.pushNames = function () {
  let arr = []
  this.forEach((x) => {
    arr.push(x.name)
  })
  return arr
}
Array.prototype.isEqual = function (arr) {
  if (this.length != arr.length) return false
  for (let i = 0; i < this.length; i++) {
    if (arr[i] != this[i]) return false
  }
  return true
}
Array.prototype.shiftLeft = function () {
  let arr = []
  const size = Math.sqrt(this.length)
  for (let i = 1; i <= this.length; i++) {
    if (i % size == 0) arr.push(this[i - 3])
    else arr.push(this[i])
  }
  return arr
}
Array.prototype.shiftUp = function () {
  const size = Math.sqrt(this.length)
  return this.slice(size, this.length).concat(this.slice(0, size))
}
Array.prototype.firstRow = function () {
  const size = Math.sqrt(this.length)
  return this.slice(0, size)
}
Array.prototype.firstColumn = function () {
  let arr = []
  const size = Math.sqrt(this.length)
  for (let i = 0; i < this.length; i += size) {
    arr.push(this[i])
  }
  return arr
}
Array.prototype.recipeShapeToTopLeft = function () {
  let arr = [...this]
  while (arr.firstRow().isEqual(["empty", "empty", "empty"]))
    arr = arr.shiftUp()
  while (arr.firstColumn().isEqual(["empty", "empty", "empty"]))
    arr = arr.shiftLeft()
  return arr
}