

classes.testItem = class extends classes.item {
  constructor(amount = 0) {
    super(amount);
    this.name = "testItem";
    this.stats = {
      speed: 10000,
      miningfortune: 2000,
    };
  }
};

classes.cobblestone = class extends classes.stonetype {
  constructor(amount = 0) {
    super(amount);
    this.name = "cobblestone";
    this.hardness = 2000;
  }
};

classes.stone = class extends classes.stonetype {
  constructor(amount = 0) {
    super(amount);
    this.name = "stone";
    this.hardness = 2200;
    this.restrictTool = true;
    this.xp = 1
  }
  generateDrop() {
    let drops = [];

   const amount0 = Math.floor(steve.getMiningFortune())
   if(steve.enchants.smeltingtouch)
   drops.push(
    new classes['stone'](amount0)
  );
   else
   drops.push(
     new classes['cobblestone'](amount0)
   );
   addCollectionItem('cobblestone',amount0)
    addSkillXP('mining',this.xp)
    return drops;
  }
};
classes.ironore = class extends classes.stonetype {
  constructor(amount = 0) {
    super(amount);
    this.hardness = 5000;
    this.xp = 5
    this.name = "ironore";
    this.tier = 1;
  }
  generateDrop(){
    let drops = []
  const amount0 = Math.floor(steve.getMiningFortune())
  if(steve.enchants.smeltingtouch)
  drops.push(
    new classes['ironingot'](amount0)
  );
  else
  drops.push(
    new classes['ironore'](amount0)
  );
  addCollectionItem('ironingot',amount0)
   addSkillXP('mining',this.xp)
    return drops
  }
};
classes.coalore = class extends classes.stonetype {
  constructor(amount = 0) {
    super(amount);
    this.hardness = 2300;
    this.xp = 5
    this.name = "coalore";
    this.tier = 0;
  }
  generateDrop(){
    addSkillXP("mining",this.xp)
    addCollectionItem("coal",Math.floor(steve.getMiningFortune()))
    return [new classes["coal"](Math.floor(steve.getMiningFortune()))]
  }
};
classes.bedrock = class extends classes.block {
  constructor(amount = 0) {
    super(amount);
    this.name = "bedrock";
    this.isBreakable = false;
  }
};

classes.woodpickaxe = class extends classes.tool {
  constructor(amount = 0) {
    super(amount);
    this.name = "woodpickaxe";
    this.stats = {
      tooltier: 0,
      tool: "pick",
      miningspeed: 100,
    };
  }
};
classes.ruslanshovel = class extends classes.tool {
  constructor(amount = 0) {
    super(amount);
    this.name = "ruslanshovel";
    this.stats = {
      tooltier: 10,
      tool: "pick axe shovel",
      miningspeed: 10000,
      miningfortune: 600,
    };
  }
};
classes.logoak = class extends classes.block {
  constructor(amount = 0) {
    super(amount);
    this.name = "logoak";
  }
};

classes.treeoak = class extends classes.tree {
  constructor(amount = 0) {
    super(amount);
    this.name = "treeoak";
    this.hardness = 10000;
    this.logs = 4
    this.xp = 30
  }
};
classes.planksoak = class extends classes.block {
  constructor(amount = 0) {
    super(amount);
    this.name = "planksoak";
  }
};
classes.stick = class extends classes.item {
  constructor(amount = 0) {
    super(amount);
    this.name = "stick";
    this.burnvalue = 200;
  }
};
classes.woodaxe = class extends classes.tool {
  constructor(amount = 0) {
    super(amount);
    this.name = "woodaxe";
    this.stats = {
      tool: "axe",
      tooltier: 0,
      miningspeed: 100,
    };
  }
};
classes.stoneaxe = class extends classes.tool {
  constructor(amount = 0) {
    super(amount);
    this.name = "stoneaxe";
    this.stats = {
      tool: "axe",
      tooltier: 1,
      miningspeed: 200,
      foragingfortune: 40,
    };
  }
};

classes.furnace = class extends classes.machine {
  constructor(amount = 0) {
    super(amount);
    this.name = "furnace";
    this.machinetype = "furnace"
    this.fuel = 0;

    this.inventory = {
      input: new classes.empty(),
      fuel: new classes.empty(),
      output: new classes.empty(),
    };
  }

  doRecipe() {
    this.recipe = furnacerecipes[this.inventory.input.name];
    if (this.recipe != undefined && this.recipetimer == -1) {
      if (this.checkvalidnes()) {
        if (this.inventoryslotid >= 0) {
          e.machines["slot" + this.inventoryslotid].className =
            "guiSlot furnaceactive";
        }
        this.recipetimer = setTimeout(
          this.doRecipeInternal.bind(this),
          this.recipe[3] * 20
        );
      }
    }
  }
  doRecipeInternal() {
    if (this.checkvalidnes()) {
      // console.log("recipe done")
      this.inventory.output = new classes[this.recipe[0]](
        this.inventory.output.amount + this.recipe[2]
      );
      this.inventory.input = reduceStack(this.inventory.input, this.recipe[1]);
      this.fuel -= this.recipe[3];
      if (this.inventoryslotid == thismachinei) {
        let iter = 0;
        for (const key in this.inventory) {
          putItemInslot(
            this.inventory[key],
            e[this.name]["slot" + iter],
            e[this.name]["slot" + iter + "amount"]
          );
          iter++;
        }
      }
      if (this.checkvalidnes()) {
        // console.log("starting recipe")
        this.recipetimer = setTimeout(
          this.doRecipeInternal.bind(this),
          this.recipe[3] * 20
        );
      } else this.stoprecipe();
    } else this.stoprecipe();
  }
  consumefuel() {
    if (this.inventory.fuel.burnvalue > 0) {
      this.fuel += this.inventory.fuel.burnvalue;
      this.inventory.fuel = reduceStack(this.inventory.fuel, 1);
      //console.log("Fuel reduced")
      return true;
    }
    return false;
  }
  checkvalidnes() {
    if (this.recipe != undefined) {
      if (
        furnacerecipes[this.inventory.input.name] != this.recipe ||
        this.inventory.input.amount < this.recipe[1]
      )
        return false;
      if (this.inventory.output.getEmpty() < this.recipe[2]) return false;
      if (this.fuel < this.recipe[3])
        while (this.consumefuel() && this.fuel < this.recipe[3]) {}
      if (this.fuel < this.recipe[3]) return false;
      return true;
    }
    return false;
  }
  stoprecipe() {
    clearInterval(this.recipetimer);
    this.recipetimer = -1;
    if (this.inventoryslotid >= 0) {
      e.machines["slot" + this.inventoryslotid].className = "guiSlot furnace";
    }
    console.log("Recipe stopped");
  }
};
classes.shears = class extends classes.tool {
  constructor(amount = 0) {
    super(amount);
    this.name = "shears";
    this.rarity = 1
    this.stats = {
      tooltier: 1,
      tool: "shears",
      miningspeed: "500",
    };
  }
};

classes.stonepickaxe = class extends classes.tool {
  constructor(amount = 0) {
    super(amount);
    this.name = "stonepickaxe";
    this.rarity = 1
    this.stats = {
      tooltier: 1,
      tool: "pick",
      miningspeed: 200,
      miningfortune: 10,
    };
  }
};



classes.ironingot = class extends classes.item {
  constructor(amount = 0) {
    super(amount);
    this.name = "ironingot";
  }
};
classes.ironblock = class extends classes.block {
  constructor(amount = 0) {
    super(amount);
    this.name = "ironblock";
  }
};
classes.anvil = class extends classes.machine {
  constructor(amount = 0) {
    super(amount);
    this.name = "anvil";
    this.machinetype = "anvil"
    // this.nametorename = ""
    this.inventory = {
      input: new classes.empty(),
      output: new classes.empty(),
    };
  }
  applyname() {
    //this.nametorename = e.anviltext.value
    this.inventory.output.Rname = e.anviltext.value;
  }
  doRecipe() {
    this.inventory.output = Object.assign(
      Object.create(Object.getPrototypeOf(this.inventory.input)),
      this.inventory.input
    );
    this.applyname()
    putItemInslot(
      this.inventory.output,
      e[this.name]["slot" + 1],
      e[this.name]["slot" + 1 + "amount"]
    );
  }
};
classes.smallbackpack = class extends classes.backpack {
  constructor(amount = 0) {
    super(amount);
    this.name = "smallbackpack";
    this.inventory = {};
    this.inventorySlots = 11;
    this.description = "Inventory Slots: " + this.inventorySlots;
    this.buildinventory();
  }
};
classes.mediumbackpack = class extends classes.backpack {
  constructor(amount = 0) {
    super(amount);
    this.name = "mediumbackpack";
    this.inventory = {};
    this.inventorySlots = 22;
    this.description = "Inventory Slots: " + this.inventorySlots;
    this.buildinventory();
  }
};
classes.largebackpack = class extends classes.backpack {
  constructor(amount = 0) {
    super(amount);
    this.name = "largebackpack";
    this.inventory = {};
    this.inventorySlots = 33;
    this.description = "Inventory Slots: " + this.inventorySlots;
    this.buildinventory();
  }
};
classes.forward = class extends classes.item{
  constructor(amount = 0){
    super(amount)
    this.name = "forward"
    this.description = "Начальника"
    this.type = "helmet"
    this.stats = {
      damage: 69,
      speed:420,
    }

    
  }
}



classes.zombie = class extends classes.mob{
  constructor(x,y,id) {
    super(x,y,id)
    this.lvl = 1;
    this.name = "zombie";
    this.mobtype = "undead"
    this.width = 4.5;
    this.height = 4.5;
    this.xp = 10
    this.stats = {
      health: 200,
      maxhealth: 200,
      damage: 20,
      speed: 50,
      range: 0.4,
      angerrange: 8,
    };
    this.respawntimer = 10000
    this.state = "passive";
    this.create()
    this.spawn()
  }
  generateDrop() {
    let drops = [];
    const amount0 = Math.floor(randomAmount(3,100)* steve.getCombatFortune())
    drops.push(
      new classes['rottenflesh'](amount0)
    );
    addCollectionItem('rottenflesh',amount0)
   const amount1 = Math.floor(randomAmount(1,5)* steve.getCombatFortune())
   drops.push(
     new classes['zombiefang'](amount1)
   );
    return drops;
  }
}
classes.rottenflesh = class extends classes.item{
  constructor(amount = 0){
    super(amount)
    this.name = "rottenflesh"
  }
}
classes.leather = class extends classes.item{
  constructor(amount = 0){
    super(amount)
    this.name = "leather"
  }
}
classes.woodsword = class extends classes.tool{
  constructor(amount = 0){
    super(amount)
    this.name = "woodsword"
    this.stats = {
      damage: 20,
      tool: "sword",
    }
  }
}
classes.cow = class extends classes.mob {
  constructor(x,y,id) {
    super(x,y,id)
    this.lvl = 1;
    this.type = "passive"
    this.name = "cow";
    this.width = 4.5;
    this.height = 4.5;
    this.xp = 3
    this.stats = {
      health: 50,
      maxhealth: 50,
    };
    this.respawntimer = 16000
    this.state = "passive";
    this.create()
    this.spawn()
  }
  generateDrop() {
    let drops = [];
    const amount = Math.floor(randomAmount(2,100)* steve.getCombatFortune())
    drops.push(
      new classes['leather'](amount)
    );
    addCollectionItem('leather',amount)
    addSkillXP('combat',this.xp)
   
    drops.push(
      new classes["beef"](Math.floor(((Math.random() * 1)+1)*steve.getCombatFortune()))
    );
    return drops;
  }
}
classes.carrot = class extends classes.consumable{
constructor(amount = 0){
  super(amount)
  this.name = "carrot"
  this.addedstats = {
    health:20,
    strength:10000,
  }
    this.effectLength = 200
}

}
classes.beef = class extends classes.consumable{
  constructor(amount = 0){
    super(amount)
    this.name = "beef"
    this.addedstats = {
      health: 30
    }
    this.effectLength = 0
  }
}
classes.steak = class extends classes.consumable{
  constructor(amount = 0){
    super(amount)
    this.name = "steak"
    this.addedstats = {
      health: 50,
      strength: 5,
    }
    this.effectLength = 120
  }
}
classes.feather = class extends classes.item{
  constructor(amount = 0){
    super(amount)
    this.name = "feather"
  }
}
classes.rawchicken = class extends classes.consumable{
  constructor(amount = 0){
    super(amount)
    this.name = "rawchicken"
    this.addedstats = {
      health: 20
    }

  }
}
classes.cookedchicken = class extends classes.consumable{
  constructor(amount = 0){
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
  constructor(x,y,id) {
    super(x,y,id)
    this.lvl = 1;
    this.type = "passive"
    this.name = "chicken";
    this.width = 2.2;
    this.height = 2.2;
    this.xp = 2
    this.stats = {
      health: 30,
      maxhealth: 30,
    };
    this.respawntimer = 12000
    this.state = "passive";
    this.create()
    this.spawn()
  }
  generateDrop() {
    let drops = [];
    drops.push(
      new classes["feather"](Math.floor(((Math.random() * 2)+1)*steve.getCombatFortune()))
    );
    drops.push(
      new classes["rawchicken"](Math.floor(((Math.random() * 1)+1)*steve.getCombatFortune()))
    );
    return drops;
  }
}

classes.coal = class extends classes.item{
  constructor(amount = 0){
    super(amount)
    this.name = "coal"
    this.burnvalue = "1000"
  }
}
classes.charcoal = class extends classes.item{
constructor(amount = 0){
 super(amount)
 this.name = 'charcoal'
 this.burnvalue = "1000"
}

}

classes.armorset = class extends classes.empty{
constructor(amount = 0){
  super(amount)
  this.maxStackSize = 1
}
checkSetParts(amount){

  if(steve.helmet.set == this.set) amount--
  if(steve.chestplate.set == this.set) amount--
  if(steve.leggins.set == this.set) amount--
  if(steve.boots.set == this.set) amount--
  return amount > 0 ? false : true
}
checkSetPartsAmount(){
let amount = 0
  if(steve.helmet.set == this.set) amount++
  if(steve.chestplate.set == this.set) amount++
  if(steve.leggins.set == this.set) amount++
  if(steve.boots.set == this.set) amount++
  return amount
}
Activate(){
  console.log("set Ability activated")
}
DeActivate(){
  console.log("set Ability deactivated")
}




}
classes.leatherset = class extends classes.armorset{
  constructor(amount = 0){
    super(amount)
    this.set = "leather"
    this.description = "<br><p style='color:lime'> Set Ability: </p><br><p style='color:lightgray'> + 20 Damage if 3 parts are present<br> </p>"
  }
  Activate(){
   
    if(this.checkSetPartsAmount() ==3){
      steve.stats.maxhealth += steve.skilllevels.combat
      steve.stats.damage += 20
    }
  }
  DeActivate(){

    if(this.checkSetPartsAmount() < 4){
      steve.stats.maxhealth -= steve.skilllevels.combat
      steve.stats.damage -= 20
    }
  }
}
classes.ironset = class extends classes.armorset{
  constructor(amount = 0){
    super(amount)
    this.set = "iron"
   
  }
  
}
classes.ironhelmet = class extends classes.ironset{
  constructor(amount = 0){
    super(amount)
    this.name = "ironhelmet"
    this.type = "helmet"
    this.stats = {
      maxhealth: 10,
      defence: 5,
    }
  }
}






classes.leatherhelmet = class extends classes.leatherset{
  constructor(amount = 0){
  super(amount)
  this.name = "leatherhelmet"
  this.type = "helmet"
  this.stats = {
    maxhealth: 10,
    defence: 5,
  }
}
}
classes.leatherchestplate = class extends classes.leatherset{
  constructor(amount = 0){
  super(amount)
  this.name = "leatherchestplate"
  this.type = "chestplate"
  this.stats = {
    maxhealth: 20,
    defence: 15,
  }
}
}
classes.leatherleggins = class extends classes.leatherset{
  constructor(amount = 0){
  super(amount)
  this.name = "leatherleggins"
  this.type = "leggins"
  this.stats = {
    maxhealth: 15,
    defence: 10,
  }
}
}
classes.leatherboots = class extends classes.leatherset{
  constructor(amount = 0){
  super(amount)
  this.name = "leatherboots"
  this.type = "boots"
  this.stats = {
    maxhealth: 8,
    defence: 5,
  }
}
}
classes.stonesword = class extends classes.tool{
  constructor(amount = 0){
    super(amount)
    this.name = "stonesword"
    this.stats = {
      damage: 25,
      tool: "sword",
    }
  }
}
classes.ironsword = class extends classes.tool{
  constructor(amount = 0){
    super(amount)
    this.name = "ironsword"
    this.stats = {
      damage: 30,
      tool: "sword",
    }
  }
}
classes.diamondsword = class extends classes.tool{
  constructor(amount = 0){
    super(amount)
    this.name = "diamondsword"
    this.stats = {
      damage: 35,
      tool: "sword",
    }
    this.rarity = 1
  }
}
classes.undeadsword = class extends classes.tool{
  constructor(amount = 0){
    super(amount)
    this.name = "undeadsword"
    this.stats = {
      damage: 30,
      tool: "sword",
      undeadbonus: 1,
    }
    this.description = br +"Deals " +color("+100%","lime") + " damage to Undead Mobs" + br
  }
}
classes.efficientaxe = class extends classes.tool{
  constructor(amount = 0){
    super(amount)
    this.name = "efficientaxe"
    this.stats = {
      miningspeed: 200,
      tool: "axe",
      
    }
    this.description = "Gives 5 planks instead of Log when cutting tree" + br
  }
}
classes.zombiehat = class extends classes.item{
  constructor(amount = 0){
    super(amount)
    this.name = "zombiehat"
    this.type = "helmet"
    this.stats = {
      maxhealth: 20,
      defence: 15,
    }
    this.rarity = 1
    this.description = "Gives "+ color("+20",getStatColor("defence")) + " defence for Each Undead Mob on Map"
  }
  Activate(){
    mobs.forEach(x=>{
      if(x.mobtype == "undead")
      steve.stats.defence += 20
    })

  }
  DeActivate(){
    mobs.forEach(x=>{
      if(x.mobtype == "undead")
      steve.stats.defence -= 20
    })
  }
 
}
classes.zombiefang = class extends classes.item{
  constructor(amount = 0){
    super(amount)
    this.name = "zombiefang"
    this.rarity = 1
  }
}
classes.bone = class extends classes.item{
constructor(amount = 0){
 super(amount)
 this.name = 'bone'
}}

classes.sand = class extends classes.block{
constructor(amount = 0){
 super(amount)
 this.name = 'sand'
this.tool='shovel'
this.hardness='1500'
}

}
classes.glass = class extends classes.block{
constructor(amount = 0){
 super(amount)
 this.name = 'glass'
this.tool='pick'
this.hardness='500'
}

}
classes.dirt = class extends classes.block{
constructor(amount = 0){
 super(amount)
 this.name = 'dirt'
this.tool='shovel'
this.hardness='1000'
}

}
classes.dandelion = class extends classes.block{
constructor(amount = 0){
 super(amount)
 this.name = 'dandelion'
this.tool='none'
this.hardness='100'
this.replacement = "air"
}

}
classes.string = class extends classes.item{
constructor(amount = 0){
 super(amount)
 this.name = 'string'
}

}
selectorblocks.push('mobmobmob brutezombie')
classes.brutezombie = class extends classes.mob{
  constructor(x,y,id) {
    super(x,y,id)
    this.lvl = 5;
    this.name = 'brutezombie'
    this.mobtype = 'undead'
    this.width = 4.5;
    this.height = 4.5;
    this.xp = 50
    this.stats = {
      health: 600,
      maxhealth: 600,
      damage: 50,
      speed: 45,
      range: 0.5,
      angerrange:   7,
    };
    this.respawntimer = 15000
    this.state = "passive";
    this.create()
    this.spawn()
  }
  generateDrop() {
    let drops = [];
   const amount0 = Math.floor(randomAmount(5,100)* steve.getCombatFortune())
   drops.push(
     new classes['rottenflesh'](amount0)
   );
   addCollectionItem('rottenflesh',amount0)
   const amount1 = Math.floor(randomAmount(1,40)* steve.getCombatFortune())
   drops.push(
     new classes['zombiefang'](amount1)
   );
    return drops;
  }
}
selectorblocks.push('netherrack')
classes.netherrack = class extends classes.block{
constructor(amount = 0){
 super(amount)
 this.name = 'netherrack'
this.tool='pick'
this.hardness='2000'
}

}

classes.enchantingpaste = class extends classes.item{
constructor(amount = 0){
 super(amount)
 this.name = 'enchantingpaste'
 this.enchants = {}
 this.maxStackSize =1
}

}
selectorblocks.push('sugarcane')
classes.sugarcane = class extends classes.block{
constructor(amount = 0){
 super(amount)
 this.name = 'sugarcane'
this.tool='none'
this.hardness='100'
this.xp = 3
this.replacement = "air"
}
generateDrop(){
  let drops = []
  const amount0 = Math.floor( steve.getFarmingFortune())
  drops.push(
    new classes['sugarcane'](amount0)
  );
  addSkillXP("farming",this.xp)
  addCollectionItem('sugarcane',amount0)
  return drops
}

}

classes.paper = class extends classes.item{
constructor(amount = 0){
 super(amount)
 this.name = 'paper'
}

}
classes.book = class extends classes.item{
constructor(amount = 0){
 super(amount)
 this.name = 'book'
}

}
classes.enchantingbook = class extends classes.machine {
  constructor(amount = 0) {
    super(amount);
    this.name = "enchantingbook";
    this.machinetype = "enchantingbook"
    this.description = "Use It to Apply Enchanting Pastes"


    this.inventory = {
      input: new classes.empty(),
      input2: new classes.empty(),
      output: new classes.empty(),
    };
  }

  doRecipe() {
    if(this.inventory.input2.name == "enchantingpaste" && this.inventory.input.name != "empty")
    {
      e.enchantingbookbutton.innerHTML = "Apply" + br + getEnchantCost(this.inventory.input2) + coin(3) 
    }
    else
    e.enchantingbookbutton.innerHTML = "Apply"
  }

  doRecipeInternal() {
    if(this.inventory.input2.name == "enchantingpaste" && this.inventory.input.name != "empty" && this.inventory.input.stats.tool != undefined)
    {
      if(steve.coins >=getEnchantCost(this.inventory.input2)){
        e.enchantingbookbutton.innerHTML = "Apply"
        steve.addCoins(getEnchantCost(this.inventory.input2) * -1)
        if(this.inventory.input.enchants == undefined) this.inventory.input.enchants = {}
        for(const key in this.inventory.input2.enchants ){
          if((!enchantsConflict(this.inventory.input,key) && Enchants[key].tool.match1word(this.inventory.input.stats.tool)) || this.inventory.input.name == "enchantingpaste")
          {
            if(this.inventory.input.enchants[key] == this.inventory.input2.enchants[key])
            {
              if(Enchants[key].maxlvl > this.inventory.input.enchants[key])
              { 
                this.inventory.input.enchants[key]++
                delete this.inventory.input2.enchants[key]
              }

            }
            else
            {
              this.inventory.input.enchants[key] = this.inventory.input2.enchants[key]
              delete this.inventory.input2.enchants[key]
            }
       
          }
          

        }
        this.inventory.output = Object.assign(
                      Object.create(Object.getPrototypeOf(this.inventory.input)),
                      this.inventory.input
                    )
        this.inventory.input = new classes.empty
        if(Object.keys(this.inventory.input2.enchants).length  == 0)
        this.inventory.input2 = new classes.empty
        let iter = 0;
        for (const key in this.inventory) {
          putItemInslot(
            this.inventory[key],
            e[this.name]["slot" + iter],
            e[this.name]["slot" + iter + "amount"]
          );
          iter++;
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
  //   console.log("Recipe stopped");
  // }
};

classes.glitchedcobblestone = class extends classes.item{
constructor(amount = 0){
 super(amount)
 this.name = 'glitchedcobblestone'
 this.rarity = 2
}

}

classes.glitchcompactor = class extends classes.machine {
  constructor(amount = 0) {
    super(amount);
    this.name = "glitchcompactor";
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
    };
  }
  doRecipe(){
    let candorecipe = true
    while(candorecipe)
    {

      this.recipe =[this.mostLeftItem(), glitchrecipes[this.mostLeftItem()]]
      if(this.recipe[1] == undefined){
        candorecipe = false
      } 
      else
      {
 
       
          if(this.countItem(this.recipe[0]) >this.recipe[1][1] ){
            if((this.inventory.output.name == this.recipe[1][0] ||
              this.inventory.output.name == "empty" ) && this.inventory.output.getEmpty() >= this.recipe[1][2])
              {
            this.removeFromInventory(this.recipe[0],this.recipe[1][1])
            if(this.inventory.output.name == "empty")
            {
              this.inventory.output = new classes[this.recipe[1][0]] (this.recipe[1][2])
            }
            else
            this.inventory.output.amount += this.recipe[1][2]
          putItemInslot(this.inventory.output, e.glitchcompactor.slot5,e.glitchcompactor.slot5amount)
          
            
           
          }
          else
          candorecipe = false
        }
          else
          candorecipe = false
        
      }
    }
  }
}

selectorblocks.push('cactus')
classes.cactus = class extends classes.block{
constructor(amount = 0){
 super(amount)
 this.name = 'cactus'
this.tool='shears'
this.hardness='500'
this.xp=5
}
generateDrop(){
  let drops = []
const amount0 = Math.floor(randomAmount(3,100)* steve.getFarmingFortune())
drops.push(
  new classes['cactus'](amount0)
);
addCollectionItem('cactus',amount0)
 addSkillXP('farming',this.xp)  
  return drops
}

}
classes.dyegreen = class extends classes.item{
constructor(amount = 0){
 super(amount)
 this.name = 'dyegreen'
 this.rarity = 1
}

}
classes.glitchedrottenflesh = class extends classes.item{
constructor(amount = 0){
 super(amount)
 this.name = 'glitchedrottenflesh'
this.rarity = 2
}

}
classes.greenbox = class extends classes.item{
constructor(amount = 0){
 super(amount)
 this.name = 'greenbox'
}

}
classes.redstone = class extends classes.item{
constructor(amount = 0){
 super(amount)
 this.name = 'redstone'
}

}
selectorblocks.push('redstoneblock')
classes.redstoneblock = class extends classes.block{
constructor(amount = 0){
 super(amount)
 this.name = 'redstoneblock'
this.tool='pick'
this.hardness='2000'
this.xp=0
}

}

classes.clayball = class extends classes.item{
constructor(amount = 0){
 super(amount)
 this.name = 'clayball'
 this.type = 'accessory'
}

}
classes.cobweb = class extends classes.item{
constructor(amount = 0){
 super(amount)
 this.name = 'cobweb'
}

}
classes.accessory = class extends classes.item{
constructor(amount = 0){
 super(amount)
 this.name = 'accessory'
 this.type = 'accessory'
 this.family = 'none'
 this.tier = 0
 this.maxStackSize = 1

}
activate(){}
deactivate(){}
}
classes.wolfpaw = class extends classes.accessory{
  constructor(amount = 0){
   super(amount)
   this.name = 'wolfpaw'
   this.type = 'accessory'
   this.family = 'wolfpaw'
   this.tier = 1
   this.rarity = 1
   this.stats = {
     speed:1
   }
  }
  
  }



  
  classes.village = class extends classes.accessory{
    constructor(amount = 0){
     super(amount)
     this.name = 'village'
     this.type = 'accessory'
     this.family = 'village'
     this.description2 = br +"Gives " + color("+10","white") + " Speed in Village"
     this.tier = 1
     this.rarity = 1
     this.stats = {
       speed:0
     }
    }
    activate(){
     if(currentBiome == "cave"){
       steve.addStats({stats:{speed:10}})
       console.log("Speed ",steve.stats.speed)
      }
     }
     deactivate(){
      if(currentBiome == "cave"){
        steve.removeStats({stats:{speed:10}})
        console.log("Speed ",steve.stats.speed)
       }
      }
    }
    

  classes.supercompactor = class extends classes.machine {
    constructor(amount = 0) {
      super(amount);
      this.name = "supercompactor";
      this.machinetype = "supercompactor"
      this.description = "Use It to Make Glitched Items Automaticly" + br + "Put Glitched Item Inside as Filter"
      this.rarity = 1
       this.inventorySlots = 1
       this.inventory = {}
       this.timer = 0 
       this.filter = []
       for(let i = 0; i < this.inventorySlots ; i++){
         this.inventory["input" + i] = new classes.empty()
       }
     
    }
    doRecipe(){
      this.filter = []
     for(const key in this.inventory){
       if(this.inventory[key].name.slice(0,8) == "glitched")
       this.filter.push(this.inventory[key].name.substr(8))
     }
     if(this.timer == 0 && this.filter.length > 0){
      this.timer = setInterval(this.doRecipeInternal.bind(this),1000)
     }
     if(this.timer != 0 && this.filter.length == 0)
     {
       this.stoprecipe()
     }
    }
    doRecipeInternal(){
      this.filter.forEach(x=>{
        const recipe = glitchrecipes[x]
        if(recipe != undefined)
        {
          let amount = steve.countItem(x) / recipe[1] >> 0
          steve.removeFromInventory(x,amount *recipe[1])
          give(recipe[0],amount * recipe[2])
 
        }
      })
    }
    stoprecipe()
      {
      
        clearInterval(this.timer)
        this.timer = 0
      }
    checkvalidnes(){
      return true
    }

    
  }
  classes.supercompactor4000 = class extends classes.supercompactor{
  constructor(amount = 0){
   super(amount)
   this.name = 'supercompactor4000'
   this.description += br + "Filter Slots: "+ color(this.inventorySlots,"lime")
   
   this.inventorySlots = 1
   for(let i = 0; i < this.inventorySlots ; i++){
    this.inventory["input" + i] = new classes.empty()
  }

  }
  }
  classes.supercompactor5000 = class extends classes.supercompactor{
    constructor(amount = 0){
     super(amount)
     this.name = 'supercompactor5000'
     this.inventorySlots = 2
     this.description += br + "Filter Slots: "+ color(this.inventorySlots,"lime")
     this.rarity = 2
     for(let i = 0; i < this.inventorySlots ; i++){
      this.inventory["input" + i] = new classes.empty()
    }
  
    }
    }
    classes.supercompactor6000 = class extends classes.supercompactor{
      constructor(amount = 0){
       super(amount)
       this.name = 'supercompactor6000'
       this.inventorySlots = 4
       this.description += br + "Filter Slots: "+ color(this.inventorySlots,"lime")
       this.rarity = 3
       for(let i = 0; i < this.inventorySlots ; i++){
        this.inventory["input" + i] = new classes.empty()
      }
    
      }
      }
      classes.supercompactor7000 = class extends classes.supercompactor{
        constructor(amount = 0){
         super(amount)
         this.name = 'supercompactor7000'
         this.inventorySlots = 6
         this.description += br + "Filter Slots: "+ color(this.inventorySlots,"lime")
         this.rarity = 4
         for(let i = 0; i < this.inventorySlots ; i++){
          this.inventory["input" + i] = new classes.empty()
        }
      
        }
        }
        classes.supercompactor8000 = class extends classes.supercompactor{
          constructor(amount = 0){
           super(amount)
           this.name = 'supercompactor8000'
           this.inventorySlots = 10
           this.description += br + "Filter Slots: "+ color(this.inventorySlots,"lime")
           this.rarity = 5
           for(let i = 0; i < this.inventorySlots ; i++){
            this.inventory["input" + i] = new classes.empty()
          }
        
          }
          }
          classes.supercompactor9000 = class extends classes.supercompactor{
            constructor(amount = 0){
             super(amount)
             this.name = 'supercompactor9000'
             this.inventorySlots = 16
             this.description += br + "Filter Slots: "+ color(this.inventorySlots,"lime")
             this.rarity = 6
             for(let i = 0; i < this.inventorySlots ; i++){
              this.inventory["input" + i] = new classes.empty()
            }
          
            }
            }



selectorblocks.push('mobmobmob villager')
classes.villager = class extends classes.mob{
  constructor(x,y,id,name) {
    super(x,y,id)
    this.lvl = 1;
    this.name = 'villager'
    this.mobtype = 'villager'
    this.type = "passive"
    this.villagerName = name 
    this.width = 4.5
    this.height = 4.5
    this.xp = 0
    this.stats = {
      health: 1e6,
      maxhealth: 1e6,
      damage: 0,
      speed: 50,
      range: 0.4,
      angerrange: 0,
    };
    this.respawntimer = 10000
    this.state = "passive";
    this.create()
    this.spawn()
  }
  generateDrop() {
    let drops = [];
    
    return drops;
  }
}
classes.steeleaf = class extends classes.item{
constructor(amount = 0){
 super(amount)
 this.name = 'steeleaf'
 this.rarity = 1
 this.description = br+"Use Shears on tree to Obitain"
 
}

}

