let classes = {};
classes.empty = class {
  constructor(amount = 0) {
    this.name = "empty";
    this.amount = amount;
    this.maxStackSize = 64;
    this.type = "none";
    this.burnvalue = 0;
    this.Rname = ""
  }

  getEmpty() {
    return this.maxStackSize - this.amount;
  }
};
classes.block = class extends classes.empty {
  constructor(amount = 0) {
    super(amount);
    this.hardness = 500;
    this.isBreakable = true;
    this.tool = "none";
    
    this.restrictTool = false;
    this.tier = 0;
    this.replacement = "air";
  }
  generateDrop() {
    let drops = [];
    drops.push(new classes[this.name](1));
    return drops;
  }
};
classes.item = class extends classes.empty {
  constructor(amount = 0) {
    super(amount);
    this.stats = {};
  }
};
classes.stonetype = class extends classes.block {
  constructor(amount = 0) {
    super(amount);
    this.name = "stone";
    this.tool = "pick";
    this.restrictTool = false;
    this.replacement = "bedrock";
  }
  generateDrop() {
    let drops = [];
    drops.push(new classes[this.name](Math.round(steve.getMiningFortune())));
    return drops;
  }
};
classes.tool = class extends classes.item {
  constructor(amount = 0) {
    super(amount);
    this.name = "tool";
    this.maxStackSize = 1;
    this.stats = {
      tooltier: 0,
    };
  }
};
classes.tree = class extends classes.block {
  constructor(amount = 0) {
    super(amount);
    this.name = "tree";
    this.tool = "axe";
  }
  generateDrop() {
    let drops = [];
    if (steve.stats.tool.includes("shears")) {
      // drops.push(new classes["cobblestone"](Math.floor(steve.getMiningFortune())));
    } else
      drops.push(
        new classes[this.name.slice(4) + "log"](
            Math.floor( 3 * steve.getForagingFortune())
        )
      );
    return drops;
  }
};
classes.machine = class extends classes.empty {
  constructor(amount = 0) {
    super(amount);
    this.name = "machine";
    this.type = "machine";
    this.inventoryslotid = -1;
    this.maxStackSize = 1;
    this.recipetimer = -1;
    this.inventory = {};
  }
  doRecipe() {}
  stoprecipe(){}
  checkvalidnes(){}
  addToInventory(item) {
    let iter = 0;
    for (const key in this.inventory) {
      if (item.name != "empty")
        if (!key.includes("output")) {
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
        }
      if (thismachinei == this.inventoryslotid) {
        putItemInslot(
          this.inventory[key],
          e[this.name]["slot" + iter],
          e[this.name]["slot" + iter + "amount"]
        );
      }
      iter++;
    }

    return item;
  }
};