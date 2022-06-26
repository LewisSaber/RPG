const spawnCoords ={
  x: 50,
  y:56
}


class player {
  constructor() {
    this.width = 0.8
    this.height = this.width
    this.x = spawnCoords.x
    this.y = spawnCoords.y
    this.mapX = 0
    this.mapY = 0
    this.name = "steve"
    this.nick = "none"
    this.skin = "default"
    this.offset = {
      x: 15,
      y: 7,
    }
    this.diffrencex = +(1 - this.width).toFixed(2)
    this.diffrencey = +(1 - this.height).toFixed(2)
    this.inventorySlots = 36
    this.inventory = []
    this.machines = []
    this.machines.set(new classes.machine(), 9)
    this.backpacks = []
    this.backpacks.set(new classes.empty(), 24)
    this.accessorybag = new classes.accessorybag()
    this.skillstats = {
      totalDamageMultiplier: 0,
      combatfortune: 0,
      miningfortune: 0,
      accessorybagslots:0,
      defense:0
    }
    this.stats = {
      maxhealth: 100,
      health: 100,
      defense: 0,
      damage: 5,
      strength: 1,
      criticaldamage: 50,
      criticalchance: 25,
      speed: 100,
      miningspeed: 100,
      miningfortune: 0,
      farmingfortune: 0,
      combatfortune: 0,
      foragingfortune: 0,
      naturalregeneration: 3,
      totalDamageMultiplier: 1,
      undeadbonus: 1,
      zombiedefense: 0,
      intimidationlevel: 0,
      healthmultiplier: 1,

      range: 3,
      accessorybagslots: 2,
    }
    this.enchants = {
      smeltingtouch: 0,
    }
    this.basicstats = Object.assign(
      Object.create(Object.getPrototypeOf(this.stats)),
      this.stats
    )
    this.kills = 0
    this.age = 0
    this.coins = 1000
    this.foodstats = {}
    this.itemInHand = new classes.empty()
    this.helmet = new classes.empty()
    this.chestplate = new classes.empty()
    this.leggings = new classes.empty()
    this.boots = new classes.empty()
    this.ring1 = new classes.empty()
    this.ring2 = new classes.empty()
    this.bracelet = new classes.empty()
    this.belt = new classes.empty()
    this.skillxp = {}
    this.skilllevels = {}
    this.collectionitems = {}
    this.collectionlevels = {}
    this.food = {}
    this.makeSkills()
    this.makeCollections()
    this.loadInventory()
    this.sellHistory = []
    setInterval(this.reduceFoodSecond.bind(this), 1000)
    setInterval(this.naturalRegeneration.bind(this), 1000)
    setInterval(this.addAge.bind(this), 1000)
    this.sets = {}
  }
  addAge() {
    this.age++
  }
  createPlayer() {
    let tag = document.createElement("div")
    tag.setAttribute("id", "player")
    
    tag.style.width = this.width.blocks().px()
    tag.style.height = this.height.blocks().px()

    let tool = document.createElement("div")
    tool.setAttribute("id", "playertool")
   
    e["playertool"] = tool
    e["player"] = tag
  }
  reduceFoodSecond() {
    for (const key in this.food) {
      this.food[key].time -= 1000
      if (this.food[key].time <= 0) {
        delete this.food[key]
      }
    }
  }
  spawn() {
    const toolOffset = {
      x: 0.72,
      y: 0.1
      

    }

    e.player.style.left = this.offset.x.blocks().px()
    e.player.style.top = this.offset.y.blocks().px()
   
    e.playertool.style.left = (this.offset.x.blocks() + toolOffset.x.blocks()).px()
    e.playertool.style.top = (this.offset.y.blocks() + toolOffset.y.blocks()).px()

    e.body.appendChild(e.playertool)
    e.body.appendChild(e.player)

    this.applySkin()
   // centerMapOnPlayer()
  }
  addAllFood() {
    for (const key in this.food) {
      this.addStats(this.food[key])
    }
  }
  applySkin() {
    e.player.style.backgroundImage =
      "url(" +
      (this.skin.toLocaleLowerCase() == "default"
        ? "img/player.jfif"
        : this.skin) +
      ")"
    e.playerStats.style.backgroundImage =
      "url(" +
      (this.skin.toLocaleLowerCase() == "default"
        ? "img/player.jfif"
        : this.skin) +
      ")"
  }

  loadInventory() {
    this.inventory.set(new classes.empty(), 36)
  }
  makeSkills() {
    for (const key in skillnames) {
      this.skillxp[key] = 0
      this.skilllevels[key] = 0
    }
  }
  makeCollections() {
    for (const key in collections) {
      this.collectionitems[key] = 0
      this.collectionlevels[key] = 0
    }
  }
  move() {
  
    let movingright = true
    let oldcoords = [this.y, this.x]
    if (!keys.slice(0, 4).includes(1)) {
      clearInterval(movetimer)
      movetimer = 0
    }
    // else if (
    //   this.x < 0 ||
    //   this.y < 0 ||
    //   this.y > (mapH - 1) * 5 - 1 ||
    //   this.x > (mapW - 1) * 5 - 1
    // ) {
    //   // savemap();
    //   if (this.x < 0) {
    //     this.x = (mapW - 1.2) * 5
    //     mapX--
    //   }
    //   if (this.y < 0) {
    //     this.y = (mapH - 1.2) * 5
    //     mapY--
    //   }
    //   if (this.y > (mapH - 1) * 5 - 1) {
    //     this.y = 4
    //     mapY++
    //   }
    //   if (this.x > (mapW - 1) * 5 - 1) {
    //     this.x = 4
    //     mapX++
    //   }

    //   goToNextMap()
    // }
    else {
      const speed = this.getSpeed()
      if (keys[0] != keys[2]) {
        if (keys[0]) this.y -= speed
        if (keys[2]) this.y += speed
      }

      this.y = +this.y.toFixed(3)
      //comsole.log("y before:",this.y)
      if(checkMapForBlock(this.y,this.x,this.width,this.height)) this.y = oldcoords[0]
      //comsole.log("y after",this.y)
      // if (oldcoords[0] > this.y) {
      //   //move up
      //   if (this.x % 5 >> 0 <= this.diffrencex) {
      //     if (checkMapForBlock((this.y / 5) >> 0, (this.x / 5) >> 0))
      //       this.y = oldcoords[0]
      //   } else {
      //     if (
      //       checkMapForBlock((this.y / 5) >> 0, (this.x / 5) >> 0) ||
      //       checkMapForBlock((this.y / 5) >> 0, (this.x / 5 + 1) >> 0)
      //     )
      //       this.y = oldcoords[0]
      //   }
      // } else {
      //   // move down
      //   if (this.x % 5 >> 0 <= this.diffrencex) {
      //     if (
      //       checkMapForBlock(
      //         (this.y - 0.2 - this.diffrencey + 0.0001) / 5 + 1,
      //         (this.x / 5) >> 0
      //       )
      //     ) {
      //       this.y = oldcoords[0]
      //     }
      //   } else if (
      //     checkMapForBlock(
      //       ((this.y - 0.2 - this.diffrencey + 0.0001) / 5 + 1) >> 0,
      //       (this.x / 5 + 1) >> 0
      //     ) ||
      //     checkMapForBlock(
      //       ((this.y - 0.2 - this.diffrencey + 0.0001) / 5 + 1) >> 0,
      //       (this.x / 5) >> 0
      //     )
      //   )
      //     this.y = oldcoords[0]
      // }
      if (keys[1] != keys[3]) {
        if (keys[1]) this.x -= speed
        if (keys[3]) this.x += speed
      }
      this.x = +this.x.toFixed(3)
       //comsole.log("x before",this.x)
      if(checkMapForBlock(this.y,this.x,this.width,this.height)) this.x = oldcoords[1]
      //comsole.log("x after",this.x)
    

      //////
      // if (oldcoords[1] > this.x) {
      //   movingright = false
      //   //move left
      //   if (this.y % 5 >> 0 <= this.diffrencey) {
      //     if (checkMapForBlock((this.y / 5) >> 0, (this.x / 5) >> 0))
      //       this.x = oldcoords[1]
      //   } else {
      //     if (
      //       checkMapForBlock((this.y / 5) >> 0, (this.x / 5) >> 0) ||
      //       checkMapForBlock((this.y / 5 + 1) >> 0, (this.x / 5) >> 0)
      //     )
      //       this.x = oldcoords[1]
      //   }
      // } else {
      //   //move right
      //   movingright = true
      //   if (this.y % 5 >> 0 <= this.diffrencey) {
      //     if (
      //       checkMapForBlock(
      //         this.y / 5,
      //         (this.x - 0.2 - this.diffrencex + 0.01) / 5 + 1
      //       )
      //     )
      //       this.x = oldcoords[1]
      //   } else if (
      //     checkMapForBlock(
      //       this.y / 5,
      //       (this.x - 0.2 - this.diffrencex + 0.01) / 5 + 1
      //     ) ||
      //     checkMapForBlock(
      //       (this.y / 5 + 1) >> 0,
      //       (this.x - 0.2 - this.diffrencex + 0.01) / 5 + 1
      //     )
      //   ) {
      //     this.x = oldcoords[1]
      //   }
      // }

      // e.player.style.top = this.y + "vh"
      // e.player.style.left = this.x + "vh"
      // if (movingright) {
      //   e.playertool.style.transform = "scale(-1,1) rotate(-90deg)"
      //   e.playertool.style.left = this.x + 4 + "vh"
      // } else {
      //   e.playertool.style.left = this.x - 3.6 + "vh"

      //   e.playertool.style.transform = "scale(1,1) rotate(-90deg)"
      // }
      // e.playertool.style.top = this.y + 0.5 + "vh"
      centerMapOnPlayer()
      // delete oldcoords
      // delete speed
    }
  }

  getSpeed() {
    return this.getStat("speed") / 1000
  }
 
  searchForItemInInventory(item, s = 0, e = 36) {
    let itemSlots = []
    for (let i = e - 1; i >= s; i--) {
      if (this.inventory[i].name == item.name) itemSlots.push(i)
    }
    return itemSlots
  }
  searchForFirstEmpty(s, e) {
    for (let i = e - 1; i >= s; i--) {
      if (this.inventory[i].name == "empty") return i
    }
  }
  isEmptySlotInInventory(s = 0, e = 36) {
    for (let i = e - 1; i >= s; i--) {
      if (this.inventory[i].name == "empty") return true
    }
    return false
  }
  removeFromInventory(item, amount) {
    const items = this.searchForItemInInventory({ name: item })
    items.forEach((x) => {
      if (amount > 0) {
        if (this.inventory[x].amount >= amount) {
          this.inventory[x] = reduceStack(this.inventory[x], amount)
          amount = 0
        } else {
          amount -= this.inventory[x].amount
          this.inventory[x] = reduceStack(
            this.inventory[x],
            this.inventory[x].amount
          )
        }
        putItemInslot(
          this.inventory[x],
          e.inventory["slot" + x],
          e.inventory["slot" + x + "amount"]
        )
      }
    })
  }
  countItem(filter) {
    let amount = 0
    this.inventory.forEach((x) => {
      if (x.name == filter) amount += x.amount
    })
    return amount
  }

  clearinventory(s = 0, end = this.inventorySlots - 1) {
    for (s; s <= end; s++) {
      this.inventory[s] = new classes.empty()

      putItemInslot(
        this.inventory[s],
        e.inventory["slot" + s],
        e.inventory["slot" + s + "amount"]
      )
    }
  }

  addToInventory(item, s = 0, end = 36) {
    let itemslots = this.searchForItemInInventory(item, s, end)

    if (itemslots != undefined)
      for (let i = 0; i < itemslots.length; i++) {
        if (item.amount <= this.inventory[itemslots[i]].getEmpty()) {
          this.inventory[itemslots[i]].amount += item.amount
          item = reduceStack(item, item.amount)
          putItemInslot(
            this.inventory[itemslots[i]],
            e.inventory["slot" + itemslots[i]],
            e.inventory["slot" + itemslots[i] + "amount"]
          )

          i = 10000
        } else {
          item = reduceStack(item, this.inventory[itemslots[i]].getEmpty())
          this.inventory[itemslots[i]].amount =
            this.inventory[itemslots[i]].maxStackSize
          putItemInslot(
            this.inventory[itemslots[i]],
            e.inventory["slot" + itemslots[i]],
            e.inventory["slot" + itemslots[i] + "amount"]
          )
        }

        if (itemslots[i] == currentHotbarSlot) selectHotbarItem(itemslots[i])
      }
    if (item.amount > 0) {
      let nextempty = this.searchForFirstEmpty(s, end)
      if (nextempty != undefined) {
        this.inventory[nextempty] = Object.assign(
          Object.create(Object.getPrototypeOf(item)),
          item
        )
        item = reduceStack(item, item.amount)

        putItemInslot(
          this.inventory[nextempty],
          e.inventory["slot" + nextempty],
          e.inventory["slot" + nextempty + "amount"]
        )

        if (nextempty == currentHotbarSlot) selectHotbarItem(nextempty)
      }
    }

    return item
  }

  getMiningSpeed() {
    return (
      this.getStat("miningspeed")  + steve.getEnchant("efficiency") * 25
      
    )
  }
  getScavengerBonus(moblvl){
    return this.getEnchant("scavenger") * SCPMLPLOE * moblvl
  }
  fortunes = {
    combat: () => (this.getStat("combatfortune") + 100) / 100,
    farming: () => (this.getStat("farmingfortune") + 100) / 100,
    mining: () => (this.getStat("miningfortune") + 100) / 100,
    foraging: () => (this.getStat("foragingfortune") + 100) / 100,
    none: () => 1,
  }

  isInRange(target) {
    return (
      (target.x +0.5 - (this.x + this.width / 2)) ** 2 +
        (target.y +0.5 - (this.y + this.height / 2)) ** 2 <=
      ((this.getStat("range") + 1) ) ** 2
    )
  }
  isMobInRange(target) {
    return (
      (target.x - (this.x + this.width / 2)) ** 2 +
        (target.y - (this.y + this.height / 2)) ** 2 <=
      ((this.getStat("range") + 1) ) ** 2
    )
  }
  stopBreakingBlock() {
    clearInterval(breaktimer)
    breaktimer = 0
    e.progressbar.style.display = "none"
    e.progressbarInside.style.width = "100%"
    selectedBlock = new classes[selectedBlock.name]()
  }
  sortInventory() {
    let tempinventory = [...this.inventory]

    tempinventory = tempinventory.slice(9)
    tempinventory.sort(function (a, b) {
      return a.name > b.name ? 1 : -1
    })
    this.clearinventory(9)
    dumbtoinventory(tempinventory)
  }
  breakblock(cblock) {
    if (keys[5] == 0) {
      this.stopBreakingBlock(cblock)
      //comsole.log("stop breaking")
    } else {
      if (
        cblock.block.tool == "none" ||
        steve.getTool().match1word(cblock.block.tool)
      ) {
        cblock.block.hardness -= this.getMiningSpeed()
      } else {
        cblock.block.hardness -= 100
      }
      //comsole.log("hardenss: " + cblock.block.hardness)
      e.progressbarInside.style.width =
        (cblock.block.hardness / cblock.maxhardness) * 100 + "%"
      if (cblock.block.hardness <= 0) {
        e.progressbar.style.display = "none"
        e.progressbarInside.style.width = "100%"
        //comsole.log("block broken")
        clearInterval(breaktimer)
        breaktimer = 0
        dumbtoinventory(cblock.block.generateDrop())
        
        map.layout[cblock.y][cblock.x][cblock.layer] = cblock.block.replacement
        drawMapBlock(cblock.x,cblock.y)
        if(cblock.block.name.includes("tree"))
        {
          let tag = document.getElementById(cblock.block.name + " " + cblock.x + " " + cblock.y)
          tag.className = cblock.block.replacement + " mapblock"
        
        }
       
       
        selectedBlock = new classes.empty()
        setTimeout(
          blockreplacement,
          4000,
          cblock.y,
          cblock.x,
          cblock.layer,
          cblock.block.name
        )
      } else
        breaktimer = setTimeout(function () {
          steve.breakblock(currentblock)
        }, 100)
    }
  }
  getDamageReduction(mobName) {
    let defense = this.getStat("defense")
    if (isZombie(mobName)) defense += this.getStat("zombiedefense")

    return (
      +(1 - defense / (defense + 100)).toFixed(2) 
    )
  }

  getDamage(mob) {
    return (
      (this.getStat("damage") *
        (1 + this.getStat("strength") / 100) *
        (random100(this.getStat("criticalchance"))
          ? this.getStat("criticaldamage") / 100 + 1
          : 1) *
        (mob.mobtype == "undead" ? this.getStat("undeadbonus") : 1) *
        (1 + this.getEnchant("sharpness") * 0.1) *
        this.getStat("totalDamageMultiplier")) >>
      0
    )
  }
  getProjectileDamage(mob, initialDamage) {
    return initialDamage
  }
  dealDamageToMob(id, type = "hit", initialDamage = 0) {
    mobs[id].knockback()
    let damage = 0
    if (type == "hit") damage = this.getDamage(mobs[id])
    if (type == "projectile")
      damage = this.getProjectileDamage(mobs[id], initialDamage)

    mobs[id].stats.health -= damage
    //comsole.log(damage)

    if (mobs[id].stats.health <= 0) {
      mobs[id].die()
      e.progressbar.style.display = "none"
    } else {
      playMobHowl(mobs[id].name, "hurt")
      makeMonsterHotbar(id)
    }
  }
  damageMob(id) {
    if (this.isMobInRange(mobs[id]) && !isBlockBetween(this, mobs[id])) {
      if (mobs[id].name == "villager") {
        openMachineGui(mobs[id])
      } else {
        this.dealDamageToMob(id)
      }
    }
  }
  updateheathbar() {
    let maxhealth = this.getMaxHealth()
    e.healthbarinside.style.width = (this.stats.health / maxhealth) * 100 + "%"
    e.healthbartext.innerText = this.stats.health + " / " + maxhealth
  }
  addHealth(amount) {
    let maxhealth = this.getMaxHealth()
    let multiplier = this.getStat("healthmultiplier")
    this.stats.health =
      this.stats.health + amount * multiplier < maxhealth
        ? this.stats.health + amount * multiplier
        : maxhealth
    this.updateheathbar()
  }
  setHealth(amount) {
    this.stats.health = amount
    this.updateheathbar()
  }
  addCoins(amount) {
    this.coins += amount
    e.coinstext.innerText = session.settings.KcoinsNotation ? this.coins.formate() : this.coins.formateComas()
   
  }
  naturalRegeneration() {
    this.addHealth(
      (this.getMaxHealth() *
        (this.getStat("naturalregeneration") / 100)) >>
        0
    )
  }
  addSet(item) {
    if (item.set != undefined) {
      if (steve.sets[item.set] == undefined) {
        steve.sets[item.set] = {
          amount: 0,
          isActivated: false,
        }
      }
      steve.sets[item.set].amount++
    }
  }
  removeSet(item) {
    steve.sets[item.set].amount--
  }
  isSetActive(set) {
    return (true && steve.sets[set] && steve.sets[set].isActivated) || false
  }
  getStat(key) {
    let amount = 0
    amount += this.stats[key] >> 0

    for (const key2 in this.food) {
      amount += key2.stats[key] >> 0
    }

    amount += this.itemInHand.stats[key] >> 0
    amount += this.skillstats[key] || 0
    armornames.forEach((x) => {
      amount += this[x].stats[key] >> 0
      amount += this[x].additionalstats[key] >> 0
    })
    for (let i = 0; i < this.accessorybag.inventory.length; i++) {
      if (this.accessorybag.inventory[i].name == empty) i = 10000
      else if (this.accessorybag.inventory[i].wasActivated) {
        amount += this.accessorybag.inventory[i].stats[key] >> 0
        amount += this.accessorybag.inventory[i].additionalstats[key] >> 0
      }
    }

    return amount
  }
  getTool() {
    return this.itemInHand.type || ""
  }
  getToolTier() {
    return this.itemInHand.tier || 0
  }
  getEnchant(key) {
    let amount = 0

    amount += this.itemInHand.enchants[key] >> 0

    armornames.forEach((x) => {
      amount += this[x].enchants[key] >> 0
    })

    return amount
  }
  getCenterCoordsArray() {
    return [this.x + this.width / 2, this.y + this.height / 2]
  }
  tp(x,y){
    if(!isUndefined(x))
    this.x = x
    if(!isUndefined(y))
    this.y = y
    
    centerMapOnPlayer()

  }
  getDefense(){
    return this.getStat("defence") + this.getEnchant("protection") * 3
  }
  getCriticalDamage(){
    return this.getStat("criticaldamage") + this.getEnchant("critical") * 10
  }
  getMaxHealth(){
    return this.getStat("maxhealth") + this.getEnchant("growth") * 15
  }
  getMagicFindMultiplier(){
    return this.getStat("magicfind") /100 + 1
  }
  getMagicFindChance(chance){
    return this.getMagicFindMultiplier() * chance
  }

}
