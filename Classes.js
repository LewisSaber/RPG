class player {
  constructor() {
    this.width = 4.6;
    this.height = this.width;
    this.x = 50;
    this.y = 20;
    this.diffrencex = +(5 - this.width).toFixed(2);
    this.diffrencey = +(5 - this.height).toFixed(2);
    this.inventorySlots = 36;
    this.inventory = [];
    this.machines = [];
    this.machines.set(new classes.machine(), 9);
    this.backpacks = []
    this.backpacks.set(new classes.empty(), 24)
    this.stats = {
      miningspeed: 100,
      speed: 100,
      miningfortune: 0,
      foragingfortune: 0,

      range: 2,
      tool: "none",
      tooltier: 0,
    };
    this.itemInHand = new classes.empty();
    this.helmet = new classes.empty();
    this.chestplate = new classes.empty();
    this.leggins = new classes.empty();
    this.boots = new classes.empty();
    this.ring1 = new classes.empty();
    this.ring2 = new classes.empty();
    this.bracelet = new classes.empty();
    this.belt = new classes.empty();
    this.loadInventory();
  }
  createPlayer() {
    let tag = document.createElement("p");
    tag.setAttribute("id", "player");
    tag.style.left = this.x + "vh";
    tag.style.top = this.y + "vh";
    tag.style.width = this.width + "vh";
    tag.style.height = this.height + "vh";
    e.map.appendChild(tag);
    e["player"] = tag;
  }
  loadInventory() {
  
    this.inventory.set(new classes.empty(), 36);
  }
  move() {
    let oldcoords = [this.y, this.x];
    if (!keys.slice(0, 4).includes(1)) {
      clearInterval(movetimer);
      movetimer = 0;
    } else if (
      this.x < 0 ||
      this.y < 0 ||
      this.y > (mapH - 1) * 5 - 1 ||
      this.x > (mapW - 1) * 5 - 1
    ) {
      savemap();
      if (this.x < 0) {
        this.x = (mapW - 1.2) * 5;
        mapX--;
      }
      if (this.y < 0) {
        this.y = (mapH - 1.2) * 5;
        mapY--;
      }
      if (this.y > (mapH - 1) * 5 - 1) {
        this.y = 4;
        mapY++;
      }
      if (this.x > (mapW - 1) * 5 - 1) {
        this.x = 4;
        mapX++;
      }

      goToNextMap();
    } else {
      if (keys[0] != keys[2]) {
        if (keys[0]) this.y = this.y -= 0.2;
        if (keys[2]) this.y = this.y += 0.2;
      }

      this.y = +this.y.toFixed(1);

      if (oldcoords[0] > this.y) {
        //move up
        if (this.x % 5 >> 0 <= this.diffrencex) {
          if (
            !allowedblocks.includes(
              currentmap[(this.y / 5) >> 0][(this.x / 5) >> 0][0]
            )
          )
            this.y = oldcoords[0];
        } else {
          if (
            !allowedblocks.includes(
              currentmap[(this.y / 5) >> 0][(this.x / 5) >> 0][0]
            ) ||
            !allowedblocks.includes(
              currentmap[(this.y / 5) >> 0][(this.x / 5 + 1) >> 0][0]
            )
          )
            this.y = oldcoords[0];
        }
      } else {
        // move down
        if (this.x % 5 >> 0 <= this.diffrencex) {
          if (
            !allowedblocks.includes(
              currentmap[
                ((this.y - 0.2 - this.diffrencey + 0.0001) / 5 + 1) >> 0
              ][(this.x / 5) >> 0][0]
            )
          ) {
            this.y = oldcoords[0];
          }
        } else if (
          !allowedblocks.includes(
            currentmap[
              ((this.y - 0.2 - this.diffrencey + 0.0001) / 5 + 1) >> 0
            ][(this.x / 5) >> 0][0]
          ) ||
          !allowedblocks.includes(
            currentmap[
              ((this.y - 0.2 - this.diffrencey + 0.0001) / 5 + 1) >> 0
            ][(this.x / 5 + 1) >> 0][0]
          )
        )
          this.y = oldcoords[0];
      }
      if (keys[1] != keys[3]) {
        if (keys[1]) this.x -= 0.2;
        if (keys[3]) this.x += 0.2;
      }
      this.x = +this.x.toFixed(1);
      //////
      if (oldcoords[1] > this.x) {
        //move right
        if (this.y % 5 >> 0 <= this.diffrencey) {
          if (
            !allowedblocks.includes(
              currentmap[(this.y / 5) >> 0][(this.x / 5) >> 0][0]
            )
          )
            this.x = oldcoords[1];
        } else {
          if (
            !allowedblocks.includes(
              currentmap[(this.y / 5 + 0.0001) >> 0][
                (this.x / 5 + 0.0001) >> 0
              ][0]
            ) ||
            !allowedblocks.includes(
              currentmap[(this.y / 5 + 1 + 0.0001) >> 0][
                (this.x / 5 + 0.0001) >> 0
              ][0]
            )
          )
            this.x = oldcoords[1];
        }
      } else {
        //move left
        if (this.y % 5 >> 0 <= this.diffrencey) {
          if (
            !allowedblocks.includes(
              currentmap[(this.y / 5) >> 0][
                ((this.x - 0.2 - this.diffrencex + 0.0001) / 5 + 1) >> 0
              ][0]
            )
          )
            this.x = oldcoords[1];
        } else if (
          !allowedblocks.includes(
            currentmap[(this.y / 5) >> 0][
              ((this.x - 0.2 - this.diffrencex + 0.0001) / 5 + 1) >> 0
            ][0]
          ) ||
          !allowedblocks.includes(
            currentmap[(this.y / 5 + 1) >> 0][
              ((this.x - 0.2 - this.diffrencex + 0.0001) / 5 + 1) >> 0
            ][0]
          )
        )
          this.x = oldcoords[1];
      }

      e.player.style.top = this.y + "vh";
      e.player.style.left = this.x + "vh";
    }
  }

  getSpeed() {
    return this.stats.speed / 10;
  }
  spawn() {
    e.map.appendChild(e.player);
    e.player.style.top = this.y + "vh";
    e.player.style.left = this.x + "vh";
  }
  searchForItemInInventory(item, s, e) {
    let itemSlots = [];
    for (let i = e - 1; i >= s; i--) {
      if (this.inventory[i].name == item.name) itemSlots.push(i);
    }
    return itemSlots;
  }
  searchForFirstEmpty(s, e) {
    for (let i = e - 1; i >= s; i--) {
      if (this.inventory[i].name == "empty") return i;
    }
  }
  equipItem(item1, item2 = this.itemInHand) {
    this.removeStats(item2);
    this.addStats(item1);
  }
  removeStats(item) {
    if (item.stats != undefined) {
      for (const key in item.stats) {
        if (typeof this.stats[key] == "string") {
          this.stats[key] = "none";
        } else this.stats[key] -= item.stats[key];
        if (key == "speed") {
          clearInterval(movetimer);
          movetimer = setInterval(function () {
            steve.move();
          }, Math.ceil(200 / steve.getSpeed()));
        }
      }
    }
  }
  addStats(item) {
    if (item.stats != undefined) {
      for (const key in item.stats) {
        if (typeof this.stats[key] == "string") {
          this.stats[key] = item.stats[key];
        } else this.stats[key] += item.stats[key];
        if (key == "speed") {
          clearInterval(movetimer);
          movetimer = setInterval(function () {
            steve.move();
          }, Math.ceil(200 / steve.getSpeed()));
        }
      }
    }
  }
  clearinventory(s = 0, e = this.inventorySlots - 1) {
    for (s; s <= e; s++) {
      this.inventory[s] = new classes.empty();
    }
  }

  addToInventory(item, s = 0, end = 36) {
    let itemslots = this.searchForItemInInventory(item, s, end);

    if (itemslots != undefined)
      for (let i = 0; i < itemslots.length; i++) {
        if (item.amount <= this.inventory[itemslots[i]].getEmpty()) {
          this.inventory[itemslots[i]].amount += item.amount;
          item = reduceStack(item, item.amount);
          putItemInslot(
            this.inventory[itemslots[i]],
            e.inventory["slot" + itemslots[i]],
            e.inventory["slot" + itemslots[i] + "amount"]
          );

          i = 10000;
        } else {
          item = reduceStack(item, this.inventory[itemslots[i]].getEmpty());
          this.inventory[itemslots[i]].amount =
            this.inventory[itemslots[i]].maxStackSize;
          putItemInslot(
            this.inventory[itemslots[i]],
            e.inventory["slot" + itemslots[i]],
            e.inventory["slot" + itemslots[i] + "amount"]
          );
        }

        if (itemslots[i] == currentHotbarSlot) selectHotbarItem(itemslots[i]);
      }
    if (item.amount > 0) {
      let nextempty = this.searchForFirstEmpty(s, end);
      if (nextempty != undefined) {
        this.inventory[nextempty] = Object.assign(
          Object.create(Object.getPrototypeOf(item)),
          item
        );
        item = reduceStack(item, item.amount);

        putItemInslot(
          this.inventory[nextempty],
          e.inventory["slot" + nextempty],
          e.inventory["slot" + nextempty + "amount"]
        );

        if (nextempty == currentHotbarSlot) selectHotbarItem(nextempty);
      }
    }

    return item;
  }
  getMiningFortune() {
    return (this.stats.miningfortune + 100) / 100;
  }
  getForagingFortune() {
    return (this.stats.foragingfortune + 100) / 100;
  }
  isInRange(target) {
    return (
      (target.x * 5 + 2.5 - (this.x + this.width / 2)) ** 2 +
        (target.y * 5 + 2.5 - (this.y + this.height / 2)) ** 2 <=
      ((this.stats.range + 1) * 5) ** 2
    );
  }

  breakblock(cblock) {
    if (keys[5] == 0) {
      console.log("stop breaking")
      clearInterval(breaktimer);
      progressbarwidth = -1;
      e.progressbar.style.display = "none";
      selectedBlock = new classes[selectedBlock.name]();
    } else {
      if (
        cblock.block.tool == "none" ||
        steve.stats.tool.includes(cblock.block.tool)
      )
      {
        console.log("tool correct")
        
        cblock.block.hardness -= this.stats.miningspeed;
      }
      else
       {
        console.log("tool wrong")
        cblock.block.hardness -= 100;
       }
       console.log("hardenss: " + cblock.block.hardness)
  

      if (cblock.block.hardness <= 0) {
        e.progressbar.style.display = "none";
        console.log("block broken")
        clearInterval(breaktimer);
        let drops = cblock.block.generateDrop();

        drops.forEach((x) => this.addToInventory(x));
        maphtml[cblock.y][cblock.x][cblock.layer].classList =
          (cblock.layer ? "blockfloor " : "block ") + cblock.block.replacement;
        currentmap[cblock.y][cblock.x][cblock.layer] = cblock.block.replacement;
        selectedBlock = new classes.empty();
        setTimeout(
          blockreplacement,
          4000,
          mapY,
          mapX,
          cblock.y,
          cblock.x,
          cblock.block.name,
          cblock.layer
        );
      }
    }
  }
}

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
  }
  generateDrop() {
    let drops = [];
    drops.push(
      new classes["cobblestone"](Math.floor(steve.getMiningFortune()))
    );
    return drops;
  }
};
classes.ironore = class extends classes.stonetype {
  constructor(amount = 0) {
    super(amount);
    this.hardness = 5000;

    this.name = "ironore";
    this.tier = 1;
  }
};
classes.bedrock = class extends classes.block {
  constructor(amount = 0) {
    super(amount);
    this.name = "bedrock";
    this.isBreakable = false;
  }
};

classes.woodenpickaxe = class extends classes.tool {
  constructor(amount = 0) {
    super(amount);
    this.name = "woodenpickaxe";
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
classes.oaklog = class extends classes.block {
  constructor(amount = 0) {
    super(amount);
    this.name = "oaklog";
  }
};

classes.treeoak = class extends classes.tree {
  constructor(amount = 0) {
    super(amount);
    this.name = "treeoak";
    this.hardness = 10000;
  }
};
classes.oakplank = class extends classes.block {
  constructor(amount = 0) {
    super(amount);
    this.name = "oakplank";
  }
};
classes.stick = class extends classes.item {
  constructor(amount = 0) {
    super(amount);
    this.name = "stick";
    this.burnvalue = 200;
  }
};
classes.woodenaxe = class extends classes.tool {
  constructor(amount = 0) {
    super(amount);
    this.name = "woodenaxe";
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
      foragingfortune: 40
    };
  }
};


classes.furnace = class extends classes.machine {
  constructor(amount = 0) {
    super(amount);
    this.name = "furnace";
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
classes.stonepickaxe = class extends classes.tool {
  constructor(amount = 0) {
    super(amount);
    this.name = "stonepickaxe"
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
classes.anvil = class extends classes.machine{
  constructor(amount = 0){
    super(amount)
    this.name = "anvil"
   // this.nametorename = ""
    this.inventory = {
      input: new classes.empty(),
      output: new classes.empty(),
    };
  }
  applyname(){
    //this.nametorename = e.anviltext.value
    this.inventory.output.Rname = e.anviltext.value
  }
  doRecipe(){
    this.inventory.output = Object.assign(
      Object.create(Object.getPrototypeOf(this.inventory.input)),
      this.inventory.input
    );
    putItemInslot(
      this.inventory.output,
      e[this.name]["slot" + 1],
      e[this.name]["slot" + 1 + "amount"]
    );
  }
}
classes.backpack = class extends classes.empty{
  constructor(amount = 0){
    super(amount)
    this.name = "backpack"
    this.type = "backpack"
    this.maxStackSize = 1
    this.inventory = {}
    this.inventorySlots = 2
    this.buildinventory()
    
  }
  buildinventory(){
    for(let i = 0 ; i < this.inventorySlots;i++){
      this.inventory["slot"+i] = new classes.empty()
    }
  }
  addToInventory(item) {
    let iter = 0;
    for (const key in this.inventory) {
      if (item.name != "empty")
          if (this.inventory[key].name == item.name) {
            if (this.inventory[key].getEmpty() >= item.amount) {
              this.inventory[key].amount += item.amount;
              item = reduceStack(item, item.amount);
              // console.log("scenrio 1")
            } else {
              item = reduceStack(item, this.inventory[key].getEmpty());
              this.inventory[key].amount = this.inventory[key].maxStackSize;
              // console.log("scenrio 2")
            }
          } else if (this.inventory[key].name == "empty") {
            this.inventory[key] = Object.assign(
              Object.create(Object.getPrototypeOf(item)),
              item
            );
            item = reduceStack(item, item.amount);
            // console.log("scenrio 3")
          }
        
   
        putItemInslot(
          this.inventory[key],
          e.backpack["slot" + iter],
          e.backpack["slot" + iter + "amount"]
        );
      
      iter++;
    }

    return item;
  }


}
