class player {
  constructor() {
    this.width = 4.6;
    this.height = this.width;
    this.x = 50;
    this.y = 20;
    this.diffrencex = +(5 - this.width).toFixed(2);
    this.diffrencey = +(5 - this.height).toFixed(2);
    this.createPlayer();

    this.inventorySlots = 36;
    this.inventory = [];
    this.stats = {
      miningspeed: 100,
      speed: 100,
      miningFortune: 0,
      range: 2,
      tool: "none",
      tooltier: 0,
    };
    this.itemInHand = new classes.empty()
  

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
    let inv = JSON.parse(localStorage.getItem("RPGinventory"));
    if (inv != null) {
      for (let i = 0; i < inv.length; i++) {
        this.inventory.push(new classes[inv[i].name]());

        for (const key2 in inv[i]) {
          this.inventory[i][key2] = inv[i][key2];
        }
      }
    } else
      for (let i = 0; i < this.inventorySlots; i++) {
        this.inventory.push(new classes.empty());
      }
  }
  move() {
    let oldcoords = [this.y, this.x];
    if (!keys.slice(0,4).includes(1)) {
      clearInterval(movetimer)
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
  
      goToNextMap()
      
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
  searchForItemInInventory(item) {
    let itemSlots = [];
    for (let i = this.inventorySlots - 1; i >= 0; i--) {
      if (this.inventory[i].name == item.name) itemSlots.push(i);
    }
    return itemSlots;
  }
  searchForFirstEmpty() {
    for (let i = this.inventorySlots - 1; i >= 0; i--) {
      if (this.inventory[i].name == "empty") return i;
    }
  }
  equipItem(item1,item2 = this.itemInHand){
      this.removeStats(item2)
      this.addStats(item1)
  }
  removeStats(item){
    if(item.stats != undefined){
      for( const key in item.stats){
       if(typeof this.stats[key] == "string"){
        this.stats[key] = "none"
       }
       else
        this.stats[key] -= item.stats[key]
        if(key == "speed") {

          clearInterval(movetimer)
          movetimer = setInterval(function () {
            steve.move();
          }, Math.ceil(200 / steve.getSpeed()));
        }
      }
    }
  }
  addStats(item){
    if(item.stats != undefined){
      for( const key in item.stats){
        if(typeof this.stats[key] == "string"){
          this.stats[key] = item.stats[key]
         }
         else
        this.stats[key] += item.stats[key]
        if(key == "speed") {
          clearInterval(movetimer)
          movetimer = setInterval(function () {
            steve.move();
          }, Math.ceil(200 / steve.getSpeed()));
        }
      }
    }
  }
  clearinventory(s = 0, e = this.inventorySlots-1){
   for(s;s <= e; s++){
     this.inventory[s] = new classes.empty()
   }
  }
  

  addToInventory(item) {

    let itemslots = this.searchForItemInInventory(item);
    
    if (itemslots != undefined)
      for (let i = 0; i < itemslots.length; i++) {
        if (
          item.amount <=
          this.inventory[itemslots[i]].getEmpty()
        ) {

          this.inventory[itemslots[i]].amount += item.amount;
          item.amount = 0;

          if(itemslots[i] < 9){
            
            putItemInslot(
              this.inventory[itemslots[i]],
              e.inventory["slot" + itemslots[i]],
              e.inventory["slot" + itemslots[i] + "amount"]
            );
          
          }
          i = 10000;
          
           
        } else {
          item.amount -=
            this.inventory[itemslots[i]].maxStackSize -
            this.inventory[itemslots[i]].amount;
          this.inventory[itemslots[i]].amount =
            this.inventory[itemslots[i]].maxStackSize;
        }

       
      }
    if (item.amount > 0) {
      let nextempty = this.searchForFirstEmpty();
      this.inventory[nextempty] = item;
      if(nextempty < 9){
            
        putItemInslot(
          this.inventory[nextempty],
          e.inventory["slot" + nextempty],
          e.inventory["slot" + nextempty + "amount"]
        );
      
      }
    }

  }
  getMiningFortune() {
    return (this.stats.miningFortune + 100) / 100;
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
      clearInterval(breaktimer);
      progressbarwidth = -1;
    } else {
      cblock.block.hardness -= this.stats.miningspeed;

      if (cblock.block.hardness <= 0) {
        clearInterval(breaktimer);
        let drops = cblock.block.generateDrop();

        drops.forEach((x) => this.addToInventory(x));
        maphtml[cblock.y][cblock.x][cblock.layer].classList =
          (cblock.layer ? "blockfloor " : "block ") + cblock.block.replacement;
        currentmap[cblock.y][cblock.x][cblock.layer] = cblock.block.replacement;
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

let classes = {};
classes.empty = class {
  constructor(amount = 0) {
    this.name = "empty";
    this.localizedname = "empty";
    this.amount = amount;
    this.maxStackSize = 64;
    this.type = "none"
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
    this.restrictTool = false
    this.tier = 0
  }
  generateDrop() {
    let drops = [];
    drops.push(new classes[this.name](Math.floor(steve.getMiningFortune())));
    return drops;
  }

};

classes.item = class extends classes.empty {
  constructor(amount = 0){
    super(amount);
    this.stats = {}
  }
}
classes.testItem = class extends classes.item {
  constructor(amount = 0){
    super(amount);
    this.name = "testItem"
    this.Localizedname = "Test Item"
    this.stats  = {
      speed: 100
    }
  }
}






classes.stonetype = class extends classes.block {
  constructor(amount = 0) {
    super(amount);
    this.name = "stone";
    this.localizedname = "Stone";
    this.tool = "pickaxe";
    this.restrictTool = true
    this.replacement = "bedrock";
  }
};

classes.cobblestone = class extends classes.stonetype{
  constructor(amount = 0) {
    super(amount);
    this.name = "cobblestone";
    this.hardness = 2000;
    this.localizedname = "Cobbletone";
  }
}


classes.stone = class extends classes.stonetype {
  constructor(amount = 0) {
    super(amount);
    this.name = "stone";
    this.hardness = 2200;
    this.localizedname = "Stone";
  }
  generateDrop() {
    let drops = [];
    drops.push(new classes["cobblestone"](Math.floor(steve.getMiningFortune())));
    return drops;
  }

};
classes.ironOre = class extends classes.stonetype {
  constructor(amount = 0) {
    super(amount);
    this.hardness = 5000;
    this.restrictTool = true
    this.name = "ironOre";
    this.localizedname = "Iron Ore";
    this.tier = 1
  }
};
classes.bedrock = class extends classes.block {
  constructor(amount = 0) {
    super(amount);
    this.name = "bedrock";
    this.localizedname = "Bedrock";
    this.isBreakable = false;
  }
};
classes.tool = class extends classes.item{
  constructor(amount = 0){
    super(amount);
    this.name = "tool"
    this.maxStackSize = 1
    this.Localizedname = "Tool"
    this.stats  = {
      tooltier : 0
    }

  }
}

classes.woodenpickaxe = class extends classes.tool{
  constructor(amount = 0){
    super(amount);
    this.name = "woodenpickaxe"
    this.Localizedname = "Wooden Pickaxe"
    this.stats  = {
      tooltier : 0,
      tool: "pickaxe",
      miningspeed: 100
    }

  }

}
classes.ruslanshovel = class extends classes.tool{
  constructor(amount = 0){
    super(amount)
    this.name = "ruslanshovel"
    this.localizedname = "Ruslan Shovel X1000"
    this.stats = {
      tooltier : 10,
      tool: "pickaxe shovel",
      miningspeed: 100000,
      miningFortune: 600
      
    }
  }
}


