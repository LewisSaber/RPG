let shapedrecipes = []
let furnacerecipes = {}
let glitchrecipes = {}
/**
 * "empty"
 */
const empty = "empty"

let craftingTable = {
  /** @type {Slot[]} */
  inventory: [],
  /** @type {Slot} */
  output:undefined,

  build(){
    for (let i = 0; i < 9; i++) {
     this.inventory[i] = new Slot("",1,{position:"absolute",top:8 * ((i - (i % 3)) / 3) + 1 + "vh",left: 8 * (i % 3) + 1 + "vh"},{
      onPostClick: this.onInventoryAdd.bind(this)
     })
      e.craftingtable.appendChild(this.inventory[i].getTag())

    }

    this.output =  new Slot("",2,{position:"absolute",top:9+ "vh",left: 25 + "vh"},
    {
      canPutItems: false,
      isLclickSpecial: true,
      onPostClick: this.doRecipe.bind(this)
    })
    e.craftingtable.appendChild(this.output.getTag())
 
  },
  onInventoryAdd() {

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
            this.inventory[i].getItem().name == this.recipe.input[j] &&
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
      let Output = new classes[this.recipe.output](this.recipe.outputAmount)
      Output.withTag(this.recipe.outputtag)
      this.output.setVisualItem(Output)
     
    } 
    else this.output.removeVisualItem()
  },
  doRecipe() {
    if (this.recipe && this.checkValidness()) {
      let Out = new classes[this.recipe.output](this.recipe.outputAmount)
      Out.withTag(this.recipe.outputtag)
      
      Out.amount = 0
      if(( isShiftOn && steve.isEmptySlotInInventory()) ||(cursor.isEmpty() ||( cursor.getItem().name == Out.name &&cursor.getItem().getEmpty() >=this.recipe.outputAmount )))
      do {

        if (Out.getEmpty() >= this.recipe.outputAmount) {
          Out.amount += this.recipe.outputAmount
          for (let i = 0; i < this.shapedrecipeindexes.length; i++) {
            this.inventory[this.shapedrecipeindexes[i]].item = reduceStack(
              this.inventory[this.shapedrecipeindexes[i]].item,
              this.recipe.inputamount[i]
            )
          }
        }else
        break
       
      } while (this.checkValidness() && isShiftOn)
      
      if (!isEmpty(Out)) {
        if (isShiftOn) {
          steve.addToInventory(Out)
          
        } else 
        cursor.addItem(Out)
       
      }
      this.inventory.forEach(x=>{
        x.updateSlot()
      })
      this.setOutput()
      this.output.onToolTip()
    }
  },
  dumpTable() {
    dumbtoinventory(this.inventory)
    this.clear()
  
  },
  clear() {
    for (let i = 0; i < 9; i++) {
      this.inventory[i].clear()
    }
    this.output.removeVisualItem()
  },

  checkValidness() {
    if (this.recipe) {
      let state = true
      for (let i = 0; i < this.shapedrecipeindexes.length; i++) {
        if (
          state &&
          this.recipe.input[i] ==
            this.inventory[this.shapedrecipeindexes[i]].getItem().name &&
          this.recipe.inputamount[i] <=
            this.inventory[this.shapedrecipeindexes[i]].getItem().amount &&
          (this.recipe.inputtag[i] != undefined
            ? compareObjects(
                this.inventory[this.shapedrecipeindexes[i]].getItem(),
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
        return a.getItem().name > b.getItem().name ? 1 : -1
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
function addFurnaceRecipe(input, output, time, amount = 1, inputAmount = 1) {
  furnacerecipes[input] ={
    input:input,
    output:output,
    inputAmount:inputAmount,
    amount:amount,
    time:time
  }
  
  notification([
    "New Recipe Unlocked!<br>",
    (getName(output)).color("green"),
  ])
}
function addGlitchRecipe(input, inputamount = 160, amount = 1) {
  glitchrecipes[input] = 
  {
    input: input,
   output:  "glitched" + input,
   inputAmount: inputamount,
   amount: amount

  }
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
  addShapedRecipe(["tyrant","lewissaber","colen","repolainen","dreammaster","boubou","cinobi","runakai","alastor"],"gtnh")

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
  addFurnaceRecipe("cobblestone", "stone", 1, 1)
  addFurnaceRecipe("ironore", "ironingot", 8, 1)
  addFurnaceRecipe("rottenflesh", "leather", 16, 1, 4)
  addFurnaceRecipe("logoak", "charcoal", 8)
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
  addFurnaceRecipe("beef", "steak", 8)
  addFurnaceRecipe("rawchicken", "cookedchicken", 8)
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
    "woodsword"
  )

  addFurnaceRecipe("sand", "glass", 5)
  
}

function dumbtoinventory(Items) {
  
  let items = [...Items]
      
  for (let i = 0; i < items.length; i++) {
   if(items[i] instanceof Slot){
    items[i] = items[i].getItem()
   }
   if(!isEmpty(items[i]))
    while (items[i].getEmpty() <= 0) {
      let newitem = Object.assign(
        Object.create(Object.getPrototypeOf(items[i])),
        items[i]
      )
      newitem.onCopy()

      newitem.amount = newitem.maxStackSize
      console.log("amount",newitem.amount)
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
  let NewGueue = []
 

  shapedrecipes.forEach((x) => {
    if (x.input.includes(itemintooltip)) {
      x.special = "Shaped Recipe"
      x.type = "craftingTable"
      NewGueue.push(x)
    }
  })
  for (const key in furnacerecipes) {
    if (furnacerecipes[key].input == itemintooltip) {
      let furnace = new classes.furnace(1)
      furnace.special = "Time: " + (furnacerecipes[key].time).fixed(1) + " seconds"

      furnace.inventory.input.setVisualItem(new classes[key](furnacerecipes[key].inputAmount))
      furnace.inventory.output.setVisualItem(new classes[furnacerecipes[key].output](furnacerecipes[key].amount))
      NewGueue.push(furnace)
    }
  }
  for (const key in glitchrecipes) {
    if (glitchrecipes[key].input.includes( itemintooltip) ) {
      let glitch = new classes.glitchcompactor(1)
      let iter = 1
      let amount = glitchrecipes[key].inputAmount
      console.log(amount)
      while (amount > 0) {
        const batch = amount >= 64 ? 64 : amount

        amount -= batch
        glitch.inventory["input" + iter].setVisualItem(new classes[key](batch))
        iter++
      }
      
      glitch.inventory.output.setVisualItem(new classes[glitchrecipes[key].output](
        glitchrecipes[key].amount
      ))
      glitch.special = "Glitch Compactor 3000"
      
      NewGueue.push(glitch)
    }
  }
  if(NewGueue.length > 0){
    currentRecipeI = 0
    RecipeGueue = NewGueue
  }
}
function findCraftingRecipes() {
  let NewGueue = []

  shapedrecipes.forEach((x) => {
    if (x.output.match1word(itemintooltip)) {
      x.special = "Shaped Recipe"
      x.type = "craftingTable"
      NewGueue.push(x)
    }
  })
  for (const key in furnacerecipes) {
    if (furnacerecipes[key].output == itemintooltip) {
      let furnace = new classes.furnace(1)
      furnace.special = "Time: " + (furnacerecipes[key].time).fixed(1) + " seconds"

      furnace.inventory.input.setVisualItem(new classes[key](furnacerecipes[key].inputAmount))
      furnace.inventory.output.setVisualItem(new classes[furnacerecipes[key].output](furnacerecipes[key].amount))
      NewGueue.push(furnace)
    }
  }
  for (const key in glitchrecipes) {
    if (glitchrecipes[key].output == itemintooltip) {
      let glitch = new classes.glitchcompactor(1)
      let iter = 1
      let amount = glitchrecipes[key].inputAmount
      while (amount > 0) {
        const batch = amount >= 64 ? 64 : amount

        amount -= batch
        glitch.inventory["input" + iter].setVisualItem(new classes[key](batch))
        iter++
      }
      
      glitch.inventory.output.setVisualItem(new classes[glitchrecipes[key].output](
        glitchrecipes[key].amount
      ))
      glitch.special = "Glitch Compactor 3000"
      
      NewGueue.push(glitch)
    }
  }
  if(NewGueue.length > 0){
    currentRecipeI = 0
    RecipeGueue = NewGueue
  }
}
CurrentRecipeI = 0
const craftingTableGui = new Gui("neiTable",[$("#inventory")[0],$("#hotbar")[0],$("#craftingtable")[0]],undefined,{
  onclose: function(){ e.craftingtable.className = ""},
  onopen: function(){e.craftingtable.className = "craftingTableNei"
  }
})
let lastGui 
function ShowRecipe(n) {
if(!isNeiOpen){
lastGui = activeGui

}
  if(RecipeGueue.length > 0){
    
    if (n >= RecipeGueue.length) n = 0
    if (n < 0) n = RecipeGueue.length - 1
    isNeiOpen = true
    e.neiText.innerHTML =
    n + 1 + "/" + RecipeGueue.length + br + RecipeGueue[n].special
    
    if(RecipeGueue[n].type == "craftingTable"){
      craftingTable.dumpTable()
      craftingTable.inventory.forEach((x,i)=>{
        let item = new classes[RecipeGueue[n].input[i]](RecipeGueue[n].inputamount[i])
        item.withTag(RecipeGueue[n].inputtag[i])
       x.setVisualItem(item)
       
      })
      let output = new classes[RecipeGueue[n].output](RecipeGueue[n].outputAmount)
      output.withTag(RecipeGueue[n].outputtag)
      craftingTable.output.setVisualItem(output)
      craftingTableGui.open()
    }
    else
    RecipeGueue[n].openGui()
    CurrentRecipeI = n
  }


}
let currentRecipeI = 0
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
    arr.push(x.getItem().name)
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
