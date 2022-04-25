class player {
  constructor() {
    let tag = document.createElement("p");
    tag.setAttribute("id", "player");

    e.map.appendChild(tag);
    e["player"] = tag;
    this.x = 50;
    this.y = 20;
    this.speed = 300;
    this.inventorySlots = 36;
    this.inventory = {}
    for(let i = 0; i < this.inventorySlots; i++)
    {
      this.inventory["slot" + i] = new classes.empty()
  
    }
    

    e.player.style.left = this.x + "vh";
    e.player.style.top = this.y + "vh";
  }
  move() {
    
    let oldcoords = [this.y, this.x];
    if (!keys.includes(1)) {
      clearInterval(movetimer);
      movetimer = 0;
    } else 
    if(this.x < 0 || this.y < 0 || this.y > (mapH - 1) * 5 -1 || this.x > (mapW - 1) * 5 -1 ){

        if(this.x < 0){ this.x = (mapW - 1.2) * 5; mapX--}
        if(this.y < 0){  this.y = (mapH - 1.2) * 5; mapY-- } 
        if(this.y > (mapH - 1) * 5 - 1) {this.y = 4; mapY++}
        if(this.x > (mapW - 1) * 5 -1 ) {this.x = 4; mapX++}
        goToNextMap()

    }
    else
    
    {
      if (keys[0] != keys[2]) {
        if (keys[0]) this.y = this.y -= 0.2;
        if (keys[2]) this.y = this.y += 0.2;
      }

      this.y = +this.y.toFixed(1);

      if (oldcoords[0] > this.y) {
        if (this.x % 5 == 0) {
          if ( !allowedblocks.includes(currentmap[(this.y / 5) >> 0][this.x / 5][0] ))
            this.y = oldcoords[0];
        } else {
          if (
            !allowedblocks.includes( currentmap[(this.y / 5) >> 0][(this.x / 5) >> 0][0] ) ||
            !allowedblocks.includes( currentmap[(this.y / 5) >> 0][(this.x / 5 + 1) >> 0][0] )
          )
            this.y = oldcoords[0];
        }
      } else {
        if (this.x % 5 == 0) {
          if ( !allowedblocks.includes(currentmap[((this.y - 0.2) / 5 + 1) >> 0][this.x / 5][0] ))
            this.y = oldcoords[0];
        } else if (
          !allowedblocks.includes(currentmap[((this.y - 0.2) / 5 + 1) >> 0][(this.x / 5) >> 0][0] ) ||
          !allowedblocks.includes( currentmap[((this.y - 0.2) / 5 + 1) >> 0][(this.x / 5 + 1) >> 0][0] )
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
        if (this.y % 5 == 0) {
          if (!allowedblocks.includes(currentmap[this.y / 5][(this.x / 5) >> 0][0] ))
            this.x = oldcoords[1];
        } else {
          if (
            !allowedblocks.includes(currentmap[(this.y / 5) >> 0][(this.x / 5) >> 0][0])||
            !allowedblocks.includes(currentmap[(this.y / 5 + 1) >> 0][(this.x / 5) >> 0][0])
          )
            this.x = oldcoords[1];
        }
      } else {
        if (this.y % 5 == 0) {
          if (!allowedblocks.includes( currentmap[this.y / 5][((this.x - 0.2) / 5 + 1) >> 0][0]))
            this.x = oldcoords[1];
        } else if (
          !allowedblocks.includes(currentmap[(this.y / 5) >> 0][((this.x - 0.2) / 5 + 1) >> 0][0]) ||
          !allowedblocks.includes(currentmap[(this.y / 5 + 1) >> 0][((this.x - 0.2) / 5 + 1) >> 0][0])
        )
          this.x = oldcoords[1];
      }

      e.player.style.top = this.y + "vh";
      e.player.style.left = this.x + "vh";

    }
  }
  
  

  getSpeed() {
    return this.speed / 10;
  }
  spawn(){
    e.map.appendChild(e.player)
    e.player.style.top = this.y + "vh";
    e.player.style.left = this.x + "vh";
  
  }
  searchForItemInInventory(item)
  {
    let itemSlots = []
    for(let i = this.inventorySlots -1; i >= 0;i--)
    {
      
      if(this.inventory["slot"+i].name == item.name) itemSlots.push(i)
      
    }
    return itemSlots
  }
  searchForFirstEmpty(){
    for(let i = this.inventorySlots -1; i >= 0;i--)
    {
      if(this.inventory["slot"+i].name == "empty") return i
    }
  }


  addToInventory(item){

    let itemslots = this.searchForItemInInventory(item)
    if(itemslots != undefined)
    for(let i = 0; i < itemslots.length;i++){
      if(item.amount <=this.inventory["slot"+itemslots[i]].maxStackSize -this.inventory["slot"+itemslots[i]].amount ){
        this.inventory["slot"+itemslots[i]].amount += item.amount
        item.amount = 0;
        i = 10000;
      }
      else{
        item.amount -= this.inventory["slot"+itemslots[i]].maxStackSize - this.inventory["slot"+itemslots[i]].amount
        this.inventory["slot"+itemslots[i]].amount =  this.inventory["slot"+itemslots[i]].maxStackSize
      }


    }
    if(item.amount > 0){
      let nextempty = this.searchForFirstEmpty()
      this.inventory["slot"+nextempty] = item

    }

    
  }
  
}


  let classes = {}
  classes.empty = class{
   constructor()
   {
     this.name = "empty"
     this.localizedname = "empty"
     this.amount = 0
     this.maxStackSize = 64
   }
  }
  classes.block = class extends classes.empty{
    constructor(){
      super()
      this.hardness = 20
      this.tool = "none"
    }
  }
  
    classes.stone = class extends classes.block{
      constructor() {
        super()
        this.name = "stone"
        this.localizedname = "Stone"
        this.amount = 1
        this.tool = "pickaxe"
      }
    }
  classes.ironOre = class extends classes.stone{
    constructor(){
     super()
     this.name = "ironOre"
     this.localizedname = "Iron Ore"
     this.amount = 5
    }
  }
  
  
  