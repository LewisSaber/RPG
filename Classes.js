classes.testItem = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "testItem"
    this.stats = {
      speed: 10000,
      miningfortune: 2000,
    }
  }
}

classes.cobblestone = class extends classes.stonetype {
  constructor(amount = 0) {
    super(amount)
    this.name = "cobblestone"
    this.hardness = 2000
    this.sellValue = 1
  }
}

classes.stone = class extends classes.stonetype {
  constructor(amount = 0) {
    super(amount)
    this.name = "stone"
    this.hardness = 2200
    this.restrictTool = true
    this.xp = {
      amount: 1,
      type: "mining",
    }
  }
}

classes.ironore = class extends classes.stonetype {
  constructor(amount = 0) {
    super(amount)
    this.hardness = 5000
    this.xp = {
      amount: 10,
      type: "mining",
    }
    this.name = "ironore"
    this.tier = 1
  }
}
selectorblocks.push("redstoneore")
classes.redstoneore = class extends classes.stonetype {
  constructor(amount = 0) {
    super(amount)
    this.hardness = 7000
    this.xp = {
      amount: 50,
      type: "mining",
    }
    this.name = "redstoneore"
    this.tier = 2
  }
}
selectorblocks.push("diamondore")
classes.diamondore = class extends classes.stonetype {
  constructor(amount = 0) {
    super(amount)
    this.hardness = 10000
    this.xp = {
      amount: 100,
      type: "mining",
    }
    this.name = "diamondore"
    this.tier = 2
  }
}
classes.diamond = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "diamond"
    this.rarity = 1
    this.sellValue = 20
  }
}

classes.coalore = class extends classes.stonetype {
  constructor(amount = 0) {
    super(amount)
    this.hardness = 2300
    this.xp = {
      amount: 10,
      type: "mining",
    }
    this.name = "coalore"
    this.tier = 0
  }
}
classes.bedrock = class extends classes.block {
  constructor(amount = 0) {
    super(amount)
    this.name = "bedrock"
    this.isBreakable = false
  }
}

classes.woodpickaxe = class extends classes.tool {
  constructor(amount = 0) {
    super(amount)
    this.name = "woodpickaxe"
    this.tier = 0
    this.type = "pickaxe",
    this.stats = {
     
      miningspeed: 100,
    }
    this.sellValue = 50
  }
}

classes.logoak = class extends classes.block {
  constructor(amount = 0) {
    super(amount)
    this.name = "logoak"
    this.sellValue = 10
  }
}

classes.treeoak = class extends classes.tree {
  constructor(amount = 0) {
    super(amount)
    this.name = "treeoak"
    this.hardness = 10000
    this.logs = 4
    this.xp = {
      amount: 30,
      type: "foraging",
    }
  }
  generateDrop() {
    let drop = super.generateDrop()
    drop.forEach((x, i) => {
      if (x.name == "logoak" && steve.itemInHand.name == "efficientaxe") {
        drop[i] = new classes.planksoak(x.amount * 5)
      }
    })
    return drop
  }
}
classes.planksoak = class extends classes.block {
  constructor(amount = 0) {
    super(amount)
    this.name = "planksoak"
    this.sellValue = 3
  }
}
classes.stick = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "stick"
    this.burnvalue = 20
    this.sellValue = 1
  }
}
classes.woodaxe = class extends classes.tool {
  constructor(amount = 0) {
    super(amount)
    this.name = "woodaxe"
    this.sellValue = 50
    this.type = "axe"
    this.tier = 0
    this.stats = {
     
      miningspeed: 100,
    }
  }
}
classes.stoneaxe = class extends classes.tool {
  constructor(amount = 0) {
    super(amount)
    this.name = "stoneaxe"
    this.type = "axe"
    this.tier = 1
    this.stats = {
      miningspeed: 200,
      foragingfortune: 40,
    }
  }
}

classes.furnace = class extends classes.machine {
  constructor(amount = 0) {
    super(amount)
    this.name = "furnace"
    this.machinetype = "furnace"
    this.fuel = 0

    this.inventory = {
      input: new classes.empty(),
      fuel: new classes.empty(),
      output: new classes.empty(),
    }
  }

  doRecipe() {
    this.recipe = furnacerecipes[this.inventory.input.name]
    if (this.recipe != undefined && this.recipetimer == -1) {
      if (this.checkvalidnes()) {
        if (this.inventoryslotid >= 0) {
          e.machines["slot" + this.inventoryslotid].className =
            "guiSlot furnaceactive"
        }
        this.recipetimer = setTimeout(
          this.doRecipeInternal.bind(this),
          this.recipe[3] * 20
        )
      }
    }
  }
  doRecipeInternal() {
    if (this.checkvalidnes()) {
      // //comsole.log("recipe done")
      this.inventory.output = new classes[this.recipe[0]](
        this.inventory.output.amount + this.recipe[2]
      )
      this.inventory.input = reduceStack(this.inventory.input, this.recipe[1])
      this.fuel -= this.recipe[3]
      if (this.inventoryslotid == thismachinei) {
        let iter = 0
        for (const key in this.inventory) {
          putItemInslot(
            this.inventory[key],
            e[this.name]["slot" + iter],
            e[this.name]["slot" + iter + "amount"]
          )
          iter++
        }
      }
      if (this.checkvalidnes()) {
        // //comsole.log("starting recipe")
        this.recipetimer = setTimeout(
          this.doRecipeInternal.bind(this),
          this.recipe[3] * 20
        )
      } else this.stoprecipe()
    } else this.stoprecipe()
  }
  consumefuel() {
    if (this.inventory.fuel.burnvalue > 0) {
      this.fuel += this.inventory.fuel.burnvalue
      this.inventory.fuel = reduceStack(this.inventory.fuel, 1)
      ////comsole.log("Fuel reduced")
      return true
    }
    return false
  }
  checkvalidnes() {
    if (this.recipe != undefined) {
      if (
        furnacerecipes[this.inventory.input.name] != this.recipe ||
        this.inventory.input.amount < this.recipe[1]
      )
        return false
      if (this.inventory.output.getEmpty() < this.recipe[2]) return false
      if (this.fuel < this.recipe[3])
        while (this.consumefuel() && this.fuel < this.recipe[3]) {}
      if (this.fuel < this.recipe[3]) return false
      return true
    }
    return false
  }
  stoprecipe() {
    clearInterval(this.recipetimer)
    this.recipetimer = -1
    if (this.inventoryslotid >= 0) {
      e.machines["slot" + this.inventoryslotid].className = "guiSlot furnace"
    }
  }
}
classes.shears = class extends classes.tool {
  constructor(amount = 0) {
    super(amount)
    this.name = "shears"
    this.rarity = 1
    this.tier = 1,
    this.type = "shears",
    this.stats = {
      miningspeed: 500,
    }
  }
}

classes.stonepickaxe = class extends classes.tool {
  constructor(amount = 0) {
    super(amount)
    this.name = "stonepickaxe"
    this.rarity = 1
    this.type = "pickaxe"
    this.tier = 1
    this.stats = {
     
      miningspeed: 200,
      miningfortune: 10,
    }
  }
}

classes.ironingot = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "ironingot"
  }
}
classes.ironblock = class extends classes.block {
  constructor(amount = 0) {
    super(amount)
    this.name = "ironblock"
  }
}
classes.anvil = class extends classes.machine {
  constructor(amount = 0) {
    super(amount)
    this.name = "anvil"
    this.machinetype = "anvil"
    // this.nametorename = ""
    this.inventory = {
      input: new classes.empty(),
      output: new classes.empty(),
    }
  }
  applyname() {
    //this.nametorename = e.anviltext.value
    this.inventory.output.Rname = e.anviltext.value
  }
  applycolor() {
    anvilColorExample.style.backgroundColor = renamingColor.toHex()
    this.inventory.output.customcolor = renamingColor.toHex()
  }
  doRecipe() {
    this.inventory.output = Object.assign(
      Object.create(Object.getPrototypeOf(this.inventory.input)),
      this.inventory.input
    )
    if (this.inventory.input.name != "empty") {
      e.anviltext.value =
        this.inventory.input.Rname || getName(this.inventory.input.name)
      e.anvilred.value = parseInt(
        this.inventory.input.customcolor.slice(1, 3),
        16
      )
      e.anvilgreen.value = parseInt(
        this.inventory.input.customcolor.slice(3, 5),
        16
      )
      e.anvilblue.value = parseInt(
        this.inventory.input.customcolor.slice(5, 7),
        16
      )
      renamingColor.red = parseInt(
        this.inventory.input.customcolor.slice(1, 3),
        16
      )
      renamingColor.green = parseInt(
        this.inventory.input.customcolor.slice(3, 5),
        16
      )
      renamingColor.blue = parseInt(
        this.inventory.input.customcolor.slice(5, 7),
        16
      )

      anvilColorExample.style.backgroundColor = renamingColor.toHex()
    }
    this.applyname()
    putItemInslot(
      this.inventory.output,
      e[this.name]["slot" + 1],
      e[this.name]["slot" + 1 + "amount"]
    )
  }
}
classes.smallbackpack = class extends classes.backpack {
  constructor(amount = 0) {
    super(amount)
    this.name = "smallbackpack"
    this.inventory = {}
    this.inventorySlots = 11
    this.description = "Inventory Slots: " + this.inventorySlots
    this.buildinventory()
  }
}
classes.mediumbackpack = class extends classes.backpack {
  constructor(amount = 0) {
    super(amount)
    this.name = "mediumbackpack"
    this.inventory = {}
    this.inventorySlots = 22
    this.description = "Inventory Slots: " + this.inventorySlots
    this.buildinventory()
  }
}
classes.largebackpack = class extends classes.backpack {
  constructor(amount = 0) {
    super(amount)
    this.name = "largebackpack"
    this.inventory = {}
    this.inventorySlots = 33
    this.description = "Inventory Slots: " + this.inventorySlots
    this.buildinventory()
  }
}
classes.forward = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "forward"
    this.description = "Начальника"
    this.type = "helmet"
    this.stats = {
      damage: 69,
      speed: 420,
    }
  }
}

classes.zombie = class extends classes.mob {
  constructor(x, y, id) {
    super(x, y, id)
    this.lvl = 1
    this.name = "zombie"
    this.mobtype = "undead"
    this.width = 4.5
    this.height = 4.5
    this.xp = 10
    this.stats = {
      health: 200,
      maxhealth: 200,
      damage: 20,
      speed: 50,
      range: 0.4,
      angerrange: 8,
      attacktime: 1000
    }
    this.respawntimer = 10000
    this.state = "passive"
    this.create()
    this.spawn()
  }
}
classes.rottenflesh = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "rottenflesh"
  }
}

classes.leather = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "leather"
  }
}
classes.woodsword = class extends classes.tool {
  constructor(amount = 0) {
    super(amount)
    this.name = "woodsword"
    this.sellValue = 50
    this.stats = {
      damage: 20,
    
    }
    this.type = "sword"
  }
}
classes.cow = class extends classes.mob {
  constructor(x, y, id) {
    super(x, y, id)
    this.lvl = 1
    this.type = "passive"
    this.name = "cow"
    this.width = 4.5
    this.height = 4.5
    this.xp = 3
    this.stats = {
      health: 50,
      maxhealth: 50,
      speed: 50,
    }
    this.respawntimer = 16000
    this.state = "passive"
    this.create()
    this.spawn()
  }
}
classes.carrot = class extends classes.consumable {
  constructor(amount = 0) {
    super(amount)
    this.name = "carrot"
    this.addedstats = {
      health: 20,
      strength: 10000,
    }
    this.effectLength = 200
  }
}
classes.beef = class extends classes.consumable {
  constructor(amount = 0) {
    super(amount)
    this.name = "beef"
    this.addedstats = {
      health: 30,
    }
    this.effectLength = 0
  }
}
classes.steak = class extends classes.consumable {
  constructor(amount = 0) {
    super(amount)
    this.name = "steak"
    this.addedstats = {
      health: 50,
      strength: 5,
    }
    this.sellValue = 5
    this.effectLength = 120
  }
}
classes.feather = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "feather"
  }
}
classes.rawchicken = class extends classes.consumable {
  constructor(amount = 0) {
    super(amount)
    this.name = "rawchicken"
    this.addedstats = {
      health: 20,
    }
  }
}
classes.cookedchicken = class extends classes.consumable {
  constructor(amount = 0) {
    super(amount)
    this.name = "cookedchicken"
    this.addedstats = {
      health: 50,
      damage: 10,
    }
    this.effectLength = 90
  }
}
classes.chicken = class extends classes.mob {
  constructor(x, y, id) {
    super(x, y, id)
    this.lvl = 1
    this.type = "passive"
    this.name = "chicken"
    this.width = 2.2
    this.height = 2.2
    this.xp = 2
    this.stats = {
      health: 30,
      maxhealth: 30,
      speed: 40,
    }
    this.respawntimer = 12000
    this.state = "passive"
    this.create()
    this.spawn()
  }
}

classes.coal = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "coal"
    this.burnvalue = "1000"
  }
}
classes.charcoal = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "charcoal"
    this.burnvalue = "1000"
  }
}

classes.armor = class extends classes.empty {
  constructor(amount = 0) {
    super(amount)
   this.wasActivated = false
  }
  checkSetParts(amount) {
    if (steve.helmet.set == this.set) amount--
    if (steve.chestplate.set == this.set) amount--
    if (steve.leggings.set == this.set) amount--
    if (steve.boots.set == this.set) amount--
    return amount > 0 ? false : true
  }
  checkSetPartsAmount() {
    let amount = 0
    if (steve.helmet.set == this.set) amount++
    if (steve.chestplate.set == this.set) amount++
    if (steve.leggings.set == this.set) amount++
    if (steve.boots.set == this.set) amount++
    return amount
  }
  Activate() {
    steve.addSet(this)
    this.wasActivated = true
  }
  DeActivate() {
   
    steve.removeSet(this)
    this.wasActivated = false
  }
}

classes.ironhelmet = class extends classes.armor {
  constructor(amount = 0) {
    super(amount)
    this.name = "ironhelmet"
    this.type = "helmet"
    this.stats = {
      maxhealth: 10,
      defense: 5,
    }
  }
}

classes.leatherhelmet = class extends classes.armor {
  constructor(amount = 0) {
    super(amount)
    this.name = "leatherhelmet"
    this.type = "helmet"
    this.set = "leather"
    this.stats = {
      maxhealth: 10,
      defense: 5,
    }
  }
}
classes.leatherchestplate = class extends classes.armor {
  constructor(amount = 0) {
    super(amount)
    this.name = "leatherchestplate"
    this.type = "chestplate"
    this.set = "leather"
    this.stats = {
      maxhealth: 20,
      defense: 15,
      damage: 1,
    }
  }
}

classes.stonesword = class extends classes.tool {
  constructor(amount = 0) {
    super(amount)
    this.name = "stonesword"
    this.stats = {
      damage: 25,
     
    }
    this.type = "sword"
  }
}
classes.ironsword = class extends classes.tool {
  constructor(amount = 0) {
    super(amount)
    this.name = "ironsword"
    this.stats = {
      damage: 30,
     
    }
    this.type = "sword"
  }
}
classes.diamondsword = class extends classes.tool {
  constructor(amount = 0) {
    super(amount)
    this.name = "diamondsword"
    this.stats = {
      damage: 35,
     
    }
    this.rarity = 1
    this.type = "sword"
  }
}
classes.undeadsword = class extends classes.tool {
  constructor(amount = 0) {
    super(amount)
    this.name = "undeadsword"
    this.stats = {
      damage: 30,
     
      undeadbonus: 1,
    }
    this.type = "sword"
    this.description2 = "Ability: Undead Enemy".color("yellow") +
      br + "Deals " + color("+100%", "lime") + " damage to Undead Mobs" + br
  }
}
classes.efficientaxe = class extends classes.tool {
  constructor(amount = 0) {
    super(amount)
    this.name = "efficientaxe"
    this.stats = {
      miningspeed: 200,
     
    }
    this.type = "axe"
    this.description2 =
      "Ability: WoodSaw".color("yellow") +
      br +
      "When cutting tree, get " +
      "5".color("yellow") +
      " Planks instead of " +
      "1".color("yellow") +
      " Log" +
      br
  }
}
classes.zombiehat = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "zombiehat"
    this.type = "helmet"
    this.set = "zombiehat"
    this.stats = {
      maxhealth: 20,
      defense: 15,
    }
    this.rarity = 1
    this.temp = this.makeAbilityDescription.bind(this)
    document.addEventListener("ToolTipStart", this.temp)
  }
  makeAbilityDescription() {
   
    this.description2 =
      "Ability: One With Undead".color("yellow") +
      br +
      "Gives " +
      makeStatSpan(20, "defense") +
      "  per Undead Mob on Map" +
      br +
      "Current Bonus: " +
      makeStatSpan(this.additionalstats.defense>>0, "defense")
  }
  Activate() {
    mobs.forEach((x) => {
      if (x.mobtype == "undead")  this.additionalstats.defense = 20 +  (this.additionalstats.defense>>0)
    })
  }
  DeActivate() {
    this.additionalstats = { }
   
  }
}
classes.zombiefang = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "zombiefang"
    this.rarity = 1
  }
}
classes.bone = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "bone"
  }
}

classes.sand = class extends classes.block {
  constructor(amount = 0) {
    super(amount)
    this.name = "sand"
    this.tool = "shovel"
    this.hardness = "1500"
  }
}
classes.glass = class extends classes.block {
  constructor(amount = 0) {
    super(amount)
    this.name = "glass"
    this.tool = "pickaxe"
    this.hardness = "500"
  }
}
classes.dirt = class extends classes.block {
  constructor(amount = 0) {
    super(amount)
    this.name = "dirt"
    this.tool = "shovel"
    this.hardness = "1000"
  }
}
classes.dandelion = class extends classes.block {
  constructor(amount = 0) {
    super(amount)
    this.name = "dandelion"
    this.tool = "none"
    this.hardness = "100"
    this.replacement = "air"
  }
}
classes.string = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "string"
  }
}
selectorblocks.push("mobmobmob brutezombie")
classes.brutezombie = class extends classes.mob {
  constructor(x, y, id) {
    super(x, y, id)
    this.lvl = 5
    this.name = "brutezombie"
    this.mobtype = "undead"
    this.width = 4.5
    this.height = 4.5
    this.xp = 50
    this.stats = {
      health: 600,
      maxhealth: 600,
      damage: 50,
      speed: 45,
      range: 0.5,
      angerrange: 7,
      attacktime: 1000
    }
    this.respawntimer = 15000
    this.state = "passive"
    this.create()
    this.spawn()
  }
}
selectorblocks.push("netherrack")
classes.netherrack = class extends classes.block {
  constructor(amount = 0) {
    super(amount)
    this.name = "netherrack"
    this.tool = "pickaxe"
    this.hardness = "2000"
  }
}

classes.enchantingpaste = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "enchantingpaste"
    this.enchants = {}
    this.maxStackSize = 1
  }
}
selectorblocks.push("sugarcane")
classes.sugarcane = class extends classes.block {
  constructor(amount = 0) {
    super(amount)
    this.name = "sugarcane"
    this.tool = "none"
    this.hardness = "100"
    this.xp = {
      amount: 3,
      type: "farming",
    }
    this.replacement = "air"
  }
}

classes.paper = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "paper"
  }
}
classes.book = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "book"
  }
}
classes.enchantingbook = class extends classes.machine {
  constructor(amount = 0) {
    super(amount)
    this.name = "enchantingbook"
    this.machinetype = "enchantingbook"
    this.description = "Use It to Apply Enchanting Pastes"
    this.rarity = 1

    this.inventory = {
      input: new classes.empty(),
      input2: new classes.empty(),
      output: new classes.empty(),
    }
  }

  doRecipe() {
    if (
      this.inventory.input2.name == "enchantingpaste" &&
      this.inventory.input.name != "empty"
    ) {
      e.enchantingbookbutton.innerHTML =
        "Apply" + br + getEnchantCost(this.inventory.input2) + coin(3)
    } else e.enchantingbookbutton.innerHTML = "Apply"
  }

  doRecipeInternal() {
    //comsole.log(this)
    if (
      this.inventory.input2.name == "enchantingpaste" &&
      this.inventory.input.name != "empty"
    ) {
      if (steve.coins >= getEnchantCost(this.inventory.input2)) {
        e.enchantingbookbutton.innerHTML = "Apply"

        if (this.inventory.input.enchants == undefined)
          this.inventory.input.enchants = {}

        for (const key in this.inventory.input2.enchants) {
        
          if (
            (!enchantsConflict(this.inventory.input, key) &&
              Enchants[key].tool.match1word(this.inventory.input.type) ) ||
            this.inventory.input.name == "enchantingpaste"
          ) {
            steve.addCoins(getEnchantCost(this.inventory.input2) * -1)
            if (
              this.inventory.input.enchants[key] ==
              this.inventory.input2.enchants[key]
            ) {
              if (Enchants[key].maxlvl > this.inventory.input.enchants[key]) {
                this.inventory.input.enchants[key]++
                delete this.inventory.input2.enchants[key]
              }
            } else {
              this.inventory.input.enchants[key] =
                this.inventory.input2.enchants[key]
              delete this.inventory.input2.enchants[key]
            }
          }
        }
        this.inventory.output = Object.assign(
          Object.create(Object.getPrototypeOf(this.inventory.input)),
          this.inventory.input
        )
        this.inventory.input = new classes.empty()
        if (Object.keys(this.inventory.input2.enchants).length == 0)
          this.inventory.input2 = new classes.empty()
        let iter = 0
        for (const key in this.inventory) {
          putItemInslot(
            this.inventory[key],
            e[this.name]["slot" + iter],
            e[this.name]["slot" + iter + "amount"]
          )
          iter++
        }
      }
    }
  }
  // checkvalidnes() {
  //   if (this.recipe != undefined) {
  //     if (
  //       furnacerecipes[this.inventory.input.name] != this.recipe ||
  //       this.inventory.input.amount < this.recipe[1]
  //     )
  //       return false;
  //     if (this.inventory.output.getEmpty() < this.recipe[2]) return false;
  //     if (this.fuel < this.recipe[3])
  //       while (this.consumefuel() && this.fuel < this.recipe[3]) {}
  //     if (this.fuel < this.recipe[3]) return false;
  //     return true;
  //   }
  //   return false;
  // }
  // stoprecipe() {
  //   clearInterval(this.recipetimer);
  //   this.recipetimer = -1;
  //   if (this.inventoryslotid >= 0) {
  //     e.machines["slot" + this.inventoryslotid].className = "guiSlot furnace";
  //   }
  //   //comsole.log("Recipe stopped");
  // }
}

classes.glitchedcobblestone = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "glitchedcobblestone"
    this.rarity = 2
  }
}

classes.glitchcompactor = class extends classes.machine {
  constructor(amount = 0) {
    super(amount)
    this.name = "glitchcompactor"
    this.machinetype = "glitchcompactor"
    this.description = "Use It to Make Glitched Items"
    this.rarity = 1

    this.inventory = {
      input1: new classes.empty(),
      input2: new classes.empty(),
      input3: new classes.empty(),
      input4: new classes.empty(),
      input5: new classes.empty(),
      output: new classes.empty(),
    }
  }
  doRecipe() {
    let candorecipe = true
    while (candorecipe) {
      this.recipe = [this.mostLeftItem(), glitchrecipes[this.mostLeftItem()]]
      if (this.recipe[1] == undefined) {
        candorecipe = false
      } else {
        if (this.countItem(this.recipe[0]) > this.recipe[1][1]) {
          if (
            (this.inventory.output.name == this.recipe[1][0] ||
              this.inventory.output.name == "empty") &&
            this.inventory.output.getEmpty() >= this.recipe[1][2]
          ) {
            this.removeFromInventory(this.recipe[0], this.recipe[1][1])
            if (this.inventory.output.name == "empty") {
              this.inventory.output = new classes[this.recipe[1][0]](
                this.recipe[1][2]
              )
            } else this.inventory.output.amount += this.recipe[1][2]
            putItemInslot(
              this.inventory.output,
              e.glitchcompactor.slot5,
              e.glitchcompactor.slot5amount
            )
          } else candorecipe = false
        } else candorecipe = false
      }
    }
  }
}

selectorblocks.push("cactus")
classes.cactus = class extends classes.block {
  constructor(amount = 0) {
    super(amount)
    this.name = "cactus"
    this.tool = "shears"
    this.hardness = "500"
    this.xp = {
      amount: 5,
      type: "farming",
    }
  }
}
classes.dyegreen = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "dyegreen"
    this.rarity = 1
  }
}
classes.glitchedrottenflesh = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "glitchedrottenflesh"
    this.rarity = 2
  }
}
classes.greenbox = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "greenbox"
  }
}
classes.redstone = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "redstone"
  }
}
selectorblocks.push("redstoneblock")
classes.redstoneblock = class extends classes.block {
  constructor(amount = 0) {
    super(amount)
    this.name = "redstoneblock"
    this.tool = "pickaxe"
    this.hardness = "2000"
  }
}

classes.clayball = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "clayball"
    this.type = "accessory"
  }
}
classes.cobweb = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "cobweb"
  }
}
classes.accessory = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "accessory"
    this.type = "accessory"
    this.family = "none"
    this.wasActivated = false
    this.tier = 0
    this.maxStackSize = 1
  }
  activate() {
    this.wasActivated = true
  }
  deactivate() {
    this.wasActivated = false
  }
}
classes.wolfpaw = class extends classes.accessory {
  constructor(amount = 0) {
    super(amount)
    this.name = "wolfpaw"
    this.type = "accessory"
    this.family = "wolfpaw"
    this.tier = 1
    this.rarity = 1
    this.stats = {
      speed: 1,
    }
  }
}
classes.lewisrelic = class extends classes.accessory {
  constructor(amount = 0) {
    super(amount)
    this.name = "lewisrelic"
    this.type = "accessory"
    this.family = "lewis"

    this.tier = 4
    this.rarity = 5
    this.stats = {
      damage: 69400,
      speed: 300,
    }
  }
}
classes.phone = class extends classes.accessory {
  constructor(amount = 0) {
    super(amount)
    this.name = "phone"
    this.type = "accessory"
    this.family = "phone"
    this.tier = 1
    this.rarity = 6
    this.sellValue = 5000000
    this.stats = {
      damage: 20,
      defense: 50,
    }
  }
}

classes.villagetalisman = class extends classes.accessory {
  constructor(amount = 0) {
    super(amount)
    this.name = "villagetalisman"
    this.type = "accessory"
    this.family = "village"
    this.additionalspeed = 30
    this.description2 =
      "Ability: ".color("yellow") +
      br +
      "Gives " +
      makeStatSpan(this.additionalspeed, "speed") +
      " in Village"
    this.tier = 1
    this.rarity = 1
    this.stats = {
      speed: 5,
    }
  }

  activate() {
    super.activate()
    if (isInVillage()) {
     this.additionalstats.speed = this.additionalspeed
    }
  }
  deactivate() {
    super.deactivate()
    if (isInVillage()) {
      this.additionalstats.speed = 0
    
    }
  }
}
classes.villagecharm = class extends classes.villagetalisman {
  constructor(amount = 0) {
    super(amount)
    this.name = "villagecharm"
    this.additionalspeed = 60
    this.description2 =
      "Ability: ".color("yellow") +
      br +
      "Gives " +
      makeStatSpan(this.additionalspeed, "speed") +
      " in Village"
    this.tier = 2
    this.rarity = 2
    this.stats = {
      speed: 10,
    }
  }
}
classes.villageartifact = class extends classes.villagetalisman {
  constructor(amount = 0) {
    super(amount)
    this.name = "villageartifact"
    this.additionalspeed = 90
    this.description2 =
      "Ability: ".color("yellow") +
      br +
      "Gives " +
      makeStatSpan(this.additionalspeed, "speed") +
      " in Village"
    this.tier = 3
    this.rarity = 3
    this.stats = {
      speed: 15,
    }
  }
}
classes.villagerelic = class extends classes.villagetalisman {
  constructor(amount = 0) {
    super(amount)
    this.name = "villagerelic"
    this.additionalspeed = 120
    this.description2 =
      "Ability: ".color("yellow") +
      br +
      "Gives " +
      makeStatSpan(this.additionalspeed, "speed") +
      " in Village"
    this.tier = 4
    this.rarity = 5
    this.stats = {
      speed: 25,
    }
  }
}

classes.supercompactor = class extends classes.machine {
  constructor(amount = 0) {
    super(amount)
    this.name = "supercompactor"
    this.machinetype = "supercompactor"
    this.description =
      "Use It to Make Glitched Items Automaticly" +
      br +
      "Put Glitched Item Inside as Filter"
    this.rarity = 1
    this.inventorySlots = 1
    this.inventory = {}
    this.timer = 0
    this.filter = []
    for (let i = 0; i < this.inventorySlots; i++) {
      this.inventory["input" + i] = new classes.empty()
    }
  }
  doRecipe() {
    this.filter = []
    for (const key in this.inventory) {
      if (this.inventory[key].name.slice(0, 8) == "glitched")
        this.filter.push(this.inventory[key].name.substr(8))
    }
    if (this.timer == 0 && this.filter.length > 0) {
      this.timer = setInterval(this.doRecipeInternal.bind(this), 1000)
    }
    if (this.timer != 0 && this.filter.length == 0) {
      this.stoprecipe()
    }
  }
  doRecipeInternal() {
    this.filter.forEach((x) => {
      const recipe = glitchrecipes[x]
      if (recipe != undefined) {
        let amount = (steve.countItem(x) / recipe[1]) >> 0
        steve.removeFromInventory(x, amount * recipe[1])
        give(recipe[0], amount * recipe[2])
      }
    })
  }
  stoprecipe() {
    clearInterval(this.timer)
    this.timer = 0
  }
  checkvalidnes() {
    return true
  }
}
classes.supercompactor4000 = class extends classes.supercompactor {
  constructor(amount = 0) {
    super(amount)
    this.name = "supercompactor4000"
    this.description +=
      br + "Filter Slots: " + color(this.inventorySlots, "lime")

    this.inventorySlots = 1
    for (let i = 0; i < this.inventorySlots; i++) {
      this.inventory["input" + i] = new classes.empty()
    }
  }
}
classes.supercompactor5000 = class extends classes.supercompactor {
  constructor(amount = 0) {
    super(amount)
    this.name = "supercompactor5000"
    this.inventorySlots = 2
    this.description +=
      br + "Filter Slots: " + color(this.inventorySlots, "lime")
    this.rarity = 2
    for (let i = 0; i < this.inventorySlots; i++) {
      this.inventory["input" + i] = new classes.empty()
    }
  }
}
classes.supercompactor6000 = class extends classes.supercompactor {
  constructor(amount = 0) {
    super(amount)
    this.name = "supercompactor6000"
    this.inventorySlots = 4
    this.description +=
      br + "Filter Slots: " + color(this.inventorySlots, "lime")
    this.rarity = 3
    for (let i = 0; i < this.inventorySlots; i++) {
      this.inventory["input" + i] = new classes.empty()
    }
  }
}
classes.supercompactor7000 = class extends classes.supercompactor {
  constructor(amount = 0) {
    super(amount)
    this.name = "supercompactor7000"
    this.inventorySlots = 6
    this.description +=
      br + "Filter Slots: " + color(this.inventorySlots, "lime")
    this.rarity = 4
    for (let i = 0; i < this.inventorySlots; i++) {
      this.inventory["input" + i] = new classes.empty()
    }
  }
}
classes.supercompactor8000 = class extends classes.supercompactor {
  constructor(amount = 0) {
    super(amount)
    this.name = "supercompactor8000"
    this.inventorySlots = 10
    this.description +=
      br + "Filter Slots: " + color(this.inventorySlots, "lime")
    this.rarity = 5
    for (let i = 0; i < this.inventorySlots; i++) {
      this.inventory["input" + i] = new classes.empty()
    }
  }
}
classes.supercompactor9000 = class extends classes.supercompactor {
  constructor(amount = 0) {
    super(amount)
    this.name = "supercompactor9000"
    this.inventorySlots = 16
    this.description +=
      br + "Filter Slots: " + color(this.inventorySlots, "lime")
    this.rarity = 6
    for (let i = 0; i < this.inventorySlots; i++) {
      this.inventory["input" + i] = new classes.empty()
    }
  }
}

selectorblocks.push("mobmobmob villager")
classes.villager = class extends classes.mob {
  constructor(x, y, id, name) {
    super(x, y, id)
    this.lvl = 1
    this.name = "villager"
    this.mobtype = "villager"
    this.type = "passive"
    this.villagerName = name
    this.width = 4.5
    this.height = 4.5
    this.xp = 0
    this.stats = {
      health: 1e6,
      maxhealth: 1e6,
      damage: 0,
      speed: 20,
      range: 0.4,
      angerrange: 0,
    }
    this.respawntimer = 10000
    this.state = "passive"
    this.create()
    this.spawn()
  }
  generateDrop() {
    let drops = []

    return drops
  }
}
classes.steeleaf = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "steeleaf"
    this.rarity = 1
    this.description = br + "Use Shears on tree to Obitain"
  }
}

classes.revenantset = class extends classes.armor {
  constructor(amount = 0) {
    super(amount)
  }
  postloadConstructor() {
    this.slayerArmorLevelUp()
  }
  makeAbilityDescription() {
    this.description2 =
      "Full Set Bonus: Trolling The Reaper".color("yellow") +
      br +
      (steve.isSetActive("revenant")
        ? "(Set Bonus Activated)".color("lime") + br
        : "") +
      // Healing Wands are +50% more effective.
      "Gain " +
      makeStatSpan(100, "defense") +
      " against Zombies." +
      br +
      br +
      br +
      "Piece Bonus: Zombie Bulwark".color("yellow") +
      br +
      "Kill Zombies to accumulate<br> defense against them.<br>" +
      "Piece Bonus: " +
      makeStatSpan(this.additionalstats.zombiedefense >> 0, "defense") +
      br +
      "Next Upgrade: " +
      makeStatSpan(slayerArmorMilestonesDefense[this.lvl + 1], "defense") +
      " (" +
      this.kills.color(getStatColor("defense")) +
      "/" +
      slayerArmorMilestones[this.lvl + 1].color("red") +
      ")"
  }
  slayerArmorLevelUp() {
    while (slayerArmorMilestones[this.lvl + 1] <= this.kills) {
      this.lvl++

      this.additionalstats.zombiedefense = slayerArmorMilestonesDefense[this.lvl]
     
    }
  }

  Activate() {
    //  document.removeEventListener("mobdeath",this.temp)
    super.Activate()
    document.addEventListener("mobdeath", this.temp)

    if (steve.sets.revenant.amount == 3) {
      steve.sets.revenant.isActivated = true
      // steve.stats.zombiedefense += 100
    }
  }
  DeActivate() {
    super.DeActivate()
    document.removeEventListener("mobdeath", this.temp)

    if (
      steve.sets.revenant.amount <= 3 
    ) {
      steve.sets.revenant.isActivated = false
      
    }
  }
  addKills(evt) {
    if (isZombie(evt.detail.name)) {
      this.kills++
      this.slayerArmorLevelUp()
    }
  }
}
classes.revenantboots = class extends classes.revenantset {
  constructor(amount = 0) {
    super(amount)
    this.name = "revenantboots"
    this.set = "revenant"
    this.type = "boots"
    this.rarity = 3
    this.stats = {
      maxhealth: 100,
      defense: 30,

      zombiedefense: 0,
    }
    this.kills = 0
    this.lvl = 0

    this.temp = this.addKills.bind(this)
    this.temp2 = this.makeAbilityDescription.bind(this)
    document.addEventListener("ToolTipStart", this.temp2)
  }
}

classes.revenantchestplate = class extends classes.revenantset {
  constructor(amount = 0) {
    super(amount)
    this.name = "revenantchestplate"
    this.set = "revenant"
    this.type = "chestplate"
    this.rarity = 3
    this.stats = {
      maxhealth: 180,
      defense: 70,

      zombiedefense: 0,
    }
    this.kills = 0
    this.lvl = 0

    this.temp = this.addKills.bind(this)
    this.temp2 = this.makeAbilityDescription.bind(this)
    document.addEventListener("ToolTipStart", this.temp2)
  }
}
classes.revenantleggings = class extends classes.revenantset {
  constructor(amount = 0) {
    super(amount)
    this.name = "revenantleggings"
    this.set = "revenant"
    this.type = "leggings"
    this.rarity = 3
    this.stats = {
      maxhealth: 130,
      defense: 50,
      zombiedefense: 0,
    }
    this.kills = 0
    this.lvl = 0

    this.temp = this.addKills.bind(this)
    this.temp2 = this.makeAbilityDescription.bind(this)
    document.addEventListener("ToolTipStart", this.temp2)
  }
}
classes.intimidationtalisman = class extends classes.accessory {
  constructor(amount = 0) {
    super(amount)
    this.name = "intimidationtalisman"
    this.type = "accessory"
    this.family = "intimidation"

    this.tier = 1
    this.rarity = 1
    this.stats = {
      intimidationlevel: 5,
      criticaldamage: 1,
    }
    this.description2 =
      "Ability: SCARY".color("yellow") +
      br +
      "Monsters at or below level " +
      this.stats.intimidationlevel.color("lime") +
      br +
      "will no longer target you" +
      br
  }
}
classes.intimidationcharm = class extends classes.accessory {
  constructor(amount = 0) {
    super(amount)
    this.name = "intimidationcharm"
    this.type = "accessory"
    this.family = "intimidation"

    this.tier = 2
    this.rarity = 3
    this.stats = {
      intimidationlevel: 15,
      criticaldamage: 3,
    }
    this.description2 =
      "Ability: SCARY".color("yellow") +
      br +
      "Monsters at or below level " +
      this.stats.intimidationlevel.color("lime") +
      br +
      "will no longer target you" +
      br
  }
}
classes.intimidationartifact = class extends classes.accessory {
  constructor(amount = 0) {
    super(amount)
    this.name = "intimidationartifact"
    this.type = "accessory"
    this.family = "intimidation"

    this.tier = 3
    this.rarity = 4
    this.stats = {
      intimidationlevel: 30,
      criticaldamage: 5,
    }
    this.description2 =
      "Ability: SCARY".color("yellow") +
      br +
      "Monsters at or below level " +
      this.stats.intimidationlevel.color("lime") +
      br +
      "will no longer target you" +
      br
  }
}
classes.woodtoughrod = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "woodtoughrod"
    this.sellValue = 50
  }
}
classes.ironpickaxe = class extends classes.tool {
  constructor(amount = 0) {
    super(amount)
    this.name = "ironpickaxe"
    this.rarity = 1
    this.tier = 3
    this.type = "pickaxe"
    this.stats = {
      miningspeed: 500,
      miningfortune: 50,
    }
    this.sellValue = 500
  }
}
classes.glitchedredstone = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "glitchedredstone"
    this.rarity = 2
  }
}

classes.zombieheartline = class extends classes.armor {
  constructor(amount = 0) {
    super(amount)
    this.type = "helmet"
    this.set = "zombieheart"
  }

  makeAbilityDescription() {
    this.description2 =
      "Ability: Healing Boost".color("yellow") +
      br +
      ("x" + (this.stats.healthmultiplier + 1)).color(getStatColor("health")) +
      " ALL Healing"
    // Healing Wands are +50% more effective.
  }
}
classes.zombieheart = class extends classes.zombieheartline {
  constructor(amount = 0) {
    super(amount)
    this.name = "zombieheart"
    this.rarity = 2
    this.stats = {
      maxhealth: 50,
      healthmultiplier: 1,
    }
    this.makeAbilityDescription()
  }
}
classes.treetalisman = class extends classes.accessory {
  constructor(amount = 0) {
    super(amount)
    this.name = "treetalisman"
    this.family = "forest"
    this.rarity = 1
    this.sellValue = 3000
    this.stats = {
      miningspeed: 50,
      foragingfortune: 50,
    }
    this.description2 =
      "Ability: ".color("yellow") +
      br +
      "Gives " +
      makeStatSpan(40, "speed") +
      br +
      " In Forest Biomes"
  }
  activate() {
    super.activate()
    if (isInForest()) {
      this.additionalstats = { speed: 40 }
    }
  }
  deactivate() {
    super.deactivate()

    this.additionalstats = {}
  }
}
classes.steeleafhandle = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "steeleafhandle"
    this.rarity = 1
  }
}
classes.ironaxe = class extends classes.tool {
  constructor(amount = 0) {
    super(amount)
    this.name = "ironaxe"
    this.type = "axe"
    this.tier = 2
    this.stats = {
     
      miningspeed: 400,
      foragingfortune: 80,
    }
    this.rarity = 1
  }
}

classes.projectile = class{
  /**
   * 
   * @param {[x,y]} startCoords 
   * @param {[x,y]} endCoords 
   * @param {vh} size 
   * @param {*} speed 
   * @param {cssClass} className 
   * @param {mob} sender 
   */
  constructor(startCoords,endCoords,size,speed,className,sender,damage = 0){
    this.damage = damage
   this.speed = speed
   this.size = size
   this.x = startCoords[0] - this.size/2,
     this.y = startCoords[1] - this.size/2
   
   this.target = {
     x: endCoords[0],
     y: endCoords[1]
   }
   //comsole.log("target",this.target)
   this.sender = sender
   this.className = className
   this.destroyF = this.destroy.bind(this)
   document.addEventListener("mapChange",this.destroyF)
   this.create()
  }
  create(){
    this.tag = document.createElement("div")
    this.tag.style.width = this.size + "vh"
    this.tag.style.height = this.tag.style.width
    this.tag.style.left = this.x + "vh"
    this.tag.style.top = this.y + "vh"
    this.tag.className = this.className + " projectile"
    e.map.appendChild(this.tag)
    this.startMovingToTarget()
  }
  destroy(){
    document.removeEventListener("mapChange",this.destroyF)
    clearInterval(this.movetimer)
    this.tag.remove()

  }
  startMovingToTarget(){
    //comsole.log("distance y", (this.y + this.size/2 - this.target.y))
    let hipon = Math.sqrt((this.x + this.size/2 - this.target.x) ** 2 + (this.y + this.size/2 - this.target.y) ** 2)
    //comsole.log("hipon",hipon)
    let angleSin = Math.abs(this.x + this.size/2 - this.target.x) / hipon
    
    /**
     * speed [x,y]
     */
    let vectorspeed = [
      +(0.2 * angleSin).toFixed(3),
      +(0.2 * Math.cos(Math.asin(angleSin))).toFixed(3),
    ]
    if(this.x > this.target.x) vectorspeed[0] *= -1
    if(this.y > this.target.y) vectorspeed[1] *= -1

     //comsole.log(vectorspeed);
    this.movetimer =  setTimeout(this.move.bind(this), Math.ceil(2000 / this.speed), vectorspeed)
    
  
  }
  move(vectorspeed){
    this.x += vectorspeed[0]
    this.y += vectorspeed[1]
    let wasHit = false
    if(checkMapForBlock((this.y ) /5>>0,(this.x + this.size/2)/5>>0)){
      wasHit = true
        this.hit("wall")
      

    }else
    if(this.sender.name == "steve"){
       for(let i = 0 ; i < mobs.length;i++){     
           wasHit = distnaseBetweenTargets(this.getCenterCoords(),{x: mobs[i].x +mobs[i].width/ 2,y: mobs[i].y +mobs[i].height/ 2}) < 4 && mobs[i].isAlive
           if(wasHit){
             this.hit(i)
             i = 1000
           }   
       }
    }
    else{
       wasHit = distnaseBetweenTargets(this.getCenterCoords(),{x: steve.x +steve.width/ 2,y: steve.y +steve.height/ 2}) < 2
       if(wasHit){
         this.hit("steve")
       }

    }
    if(!wasHit){
      this.tag.style.left = this.x + "vh"
      this.tag.style.top = this.y + "vh"
     this.movetimer = setTimeout(this.move.bind(this), Math.ceil(2000 / this.speed), vectorspeed)
    }
  }
  hit(target){
    switch (target) {
      case "steve":
        this.sender.dealDamage()
        break;
      case "wall":
        break
      default:
        //comsole.log(target)
        steve.dealDamageToMob(target,"projectile",this.damage)
        break;
    }
  
    this.destroy()
  }
  getCenterCoords(){
    return {x: this.x + this.size/2, y : this.y + this.size/2}
  }

}
classes.bow = class extends classes.tool{
  constructor(amount = 0) {
    super(amount)
    this.name = "bow"
    this.tier = 4
    this.type = "bow",
    this.stats = {
     damage: 200
     
    }
    this.sellValue = 50
  }
  useAbility(evt){
    const coords = getCoords(evt)
    //comsole.log(coords)
    new classes.projectile(steve.getCenterCoordsArray(),[coords.x,coords.y],2,200,"redCircle",steve,25)
  }
}

classes.skeleton = class extends classes.mob {
  constructor(x, y, id) {
    super(x, y, id)
    this.lvl = 1
    this.name = "skeleton"
    this.mobtype = "undead"
    this.width = 4.5
    this.height = 4.5
    this.xp = 50
    this.stats = {
      health: 200,
      maxhealth: 200,
      damage: 200,
      speed: 50,
      range: 10,
      angerrange: 8,
      attacktime : 1000,
      shottime: 5000
    }
    this.respawntimer = 10000
    this.state = "passive"
    this.create()
    this.spawn()
    this.canshot = true
    
  }
  damagePlayer() {
if(this.canshot){
  new classes.projectile([this.x + this.width/2,this.y + this.height/2],steve.getCenterCoordsArray(),2,300,"whiteBall",this)
  this.canshot = false
 this.shottimer= setTimeout(this.allowToShot.bind(this),this.stats.shottime)
}
  
  }
  allowToShot(){
    this.canshot = true
  }
  
}