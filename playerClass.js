const spawnCoords = {
  x: 50,
  y: 56,
}

class player {
  constructor() {
    this.version = 1
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
    /** @type {Slot[]} */
    this.inventory = []
    /** @type {Slot[]} */
    this.machines = []

    for (let i = 0; i < 9; i++) {
      this.machines[i] = new Slot( (item)=>item.type == "machine", 2,undefined, {
        emptyClass: "machine",
        isRclickSpecial : true,
        isSpecialSlot:true,
        onRclick: function(item){

          if(!isEmpty(item)) item.openGui()
        }
      }) //filter here
    }
    
    /** @type {Slot[]} */
    this.backpacks = new Array()
    for (let i = 0; i < backPacksInGui; i++) {
      this.backpacks.push(new Slot(function (item){return item.type == "backpack" }, 2,undefined,{
        isRclickSpecial : true,
        isSpecialSlot:true,
        onRclick: function(item){

          if(!isEmpty(item)) item.openGui()
        }

      })) //filter here
    }
    this.accessorybag = new classes.accessorybag()
    
    this.skillstats = {
      totalDamageMultiplier: 0,
      combatfortune: 0,
      miningfortune: 0,
      accessorybagslots: 0,
      defense: 0,
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
    this.slots = []
    this.basicstats = Object.assign(
      Object.create(Object.getPrototypeOf(this.stats)),
      this.stats
    )
    this.kills = 0
    this.age = 0
    this.coins = 1000
    this.foodstats = {}
    /** @type {Slot[]} */
    this.armor = {}
    armornames.forEach((x) => {
      //(item) => item.type == x+"" 
      this.armor[x] = new Slot(function(item){return item.type == x},1, undefined, {
        emptyClass: x + "gui",
        isSpecialSlot: true,
      }) //filter here
    })
    
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
  loadAccessoryBagGui(){
    this.accessorybag.gui.slots =this.accessorybag.inventory.concat(this.inventory)
  }
  getItemInHand(){
    return steve.inventory[currentHotbarSlot].getItem()
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
      y: 0.1,
    }

    e.player.style.left = this.offset.x.blocks().px()
    e.player.style.top = this.offset.y.blocks().px()

    e.playertool.style.left = (
      this.offset.x.blocks() + toolOffset.x.blocks()
    ).px()
    e.playertool.style.top = (
      this.offset.y.blocks() + toolOffset.y.blocks()
    ).px()

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
    const inv = $("#inventory")[0]
    const hotbar = $("#hotbar")[0]

    for (let i = this.inventorySlots-1; i >=0; i--) {
      this.inventory[i] = new Slot("", 0)
      if (i >= 9) {
        inv.appendChild(this.inventory[i].getTag())
      } 
    }
    for(let i = 0; i < 9;i++){
       hotbar.appendChild(this.inventory[i].getTag())
    }
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
    } else {
      const speed = this.getSpeed()
      if (keys[0] != keys[2]) {
        if (keys[0]) this.y -= speed
        if (keys[2]) this.y += speed
      }

      this.y = +this.y.toFixed(3)
      //comsole.log("y before:",this.y)
      if (checkMapForBlock(this.y, this.x, this.width, this.height))
        this.y = oldcoords[0]
      if (keys[1] != keys[3]) {
        if (keys[1]) this.x -= speed
        if (keys[3]) this.x += speed
      }
      this.x = +this.x.toFixed(3)
      //comsole.log("x before",this.x)
      if (checkMapForBlock(this.y, this.x, this.width, this.height))
        this.x = oldcoords[1]

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
      if (this.inventory[i].getItem().name == item.name) itemSlots.push(i)
    }
    return itemSlots
  }
  searchForFirstEmpty(s, e) {
    for (let i = e - 1; i >= s; i--) {
      if (this.inventory[i].getItem().name == "empty") return i
    }
  }
  isEmptySlotInInventory(s = 0, e = 36) {
    for (let i = e - 1; i >= s; i--) {
      if (this.inventory[i].getItem().name == "empty") return true
    }
    return false
  }
  removeFromInventory(item, amount) {
    const items = this.searchForItemInInventory({ name: item })
    items.forEach((x) => {
      if (amount > 0) {
        if (this.inventory[x].getItem().amount >= amount) {
          this.inventory[x].reduceStack(amount)
          amount = 0
        } else {
          amount -= this.inventory[x].getItem().amount
          this.inventory[x].reduceStack(this.inventory[x].getItem().amount)
        }
      }
    })
  }
  countItem(filter) {
    let amount = 0
    this.inventory.forEach((x) => {
      if (x.getItem().name == filter) amount += x.getItem().amount
    })
    return amount
  }

  clearinventory(s = 0, end = this.inventorySlots - 1) {
    for (s; s <= end; s++) {
      this.inventory[s].clear()
    }
  }

  addToInventory(item, s = 0, end = 36) {
    let itemslots = this.searchForItemInInventory(item, s, end)

    if (itemslots != undefined)
      for (let i = 0; i < itemslots.length; i++) {
        if (item.amount <= this.inventory[itemslots[i]].getItem().getEmpty()) {
          this.inventory[itemslots[i]].item.amount += item.amount

          item = reduceStack(item, item.amount)
          // putItemInslot(
          //   this.inventory[itemslots[i]],
          //   e.inventory["slot" + itemslots[i]],
          //   e.inventory["slot" + itemslots[i] + "amount"]
          // )
          this.inventory[itemslots[i]].updateSlot()
          i = 10000
        } else {
          if (this.inventory[itemslots[i]].getItem().getEmpty() != 0) {
            item = reduceStack(
              item,
              this.inventory[itemslots[i]].getItem().getEmpty()
            )
            this.inventory[itemslots[i]].item.amount =
              this.inventory[itemslots[i]].item.maxStackSize
            this.inventory[itemslots[i]].updateSlot()
          }
        }

    
      }
    if (item.amount > 0) {
      let nextempty = this.searchForFirstEmpty(s, end)
      if (nextempty != undefined) {
        this.inventory[nextempty].putItem(
          Object.assign(Object.create(Object.getPrototypeOf(item)), item)
        )
        item = reduceStack(item, item.amount)
        this.inventory[nextempty].updateSlot()
      }
    }

    return item
  }

  getMiningSpeed() {
    return this.getStat("miningspeed") + steve.getEnchant("efficiency") * 25
  }
  getScavengerBonus(moblvl) {
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
      (target.x + 0.5 - (this.x + this.width / 2)) ** 2 +
        (target.y + 0.5 - (this.y + this.height / 2)) ** 2 <=
      (this.getStat("range") + 1) ** 2
    )
  }
  isMobInRange(target) {
    return (
      (target.x - (this.x + this.width / 2)) ** 2 +
        (target.y - (this.y + this.height / 2)) ** 2 <=
      (this.getStat("range") + 1) ** 2
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
    let itemArray = []
    for(let i = 9 ; i < 36;i++){
      const item = steve.inventory[i].getItem()
    if(!isEmpty(item)) itemArray.push(item)
    }
    
   
    
   
    // tempinventory.forEach(x =>{
    //   console.log(x.getItem().name)
    // })
    // console.log("after");
    itemArray.sort(function (a, b) {
      return isEmpty(a) ? -1 : 1
    })
    this.clearinventory(9) 
    // tempinventory.forEach(x =>{
    //   console.log(x.getItem().name)
    // })
   dumbtoinventory(itemArray)
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
        drawMapBlock(cblock.x, cblock.y)
        if (cblock.block.name.includes("tree")) {
          let tag = document.getElementById(
            cblock.block.name + " " + cblock.x + " " + cblock.y
          )
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

    return +(1 - defense / (defense + 100)).toFixed(2)
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
    e.coinstext.innerText = session.settings.KcoinsNotation
      ? this.coins.formate()
      : this.coins.formateComas()
  }
  naturalRegeneration() {
    this.addHealth(
      (this.getMaxHealth() * (this.getStat("naturalregeneration") / 100)) >> 0
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
      amount += this.food[key2].stats[key] >> 0
    }

    amount += this.getItemInHand().stats[key] >> 0
    amount += this.skillstats[key] || 0
    armornames.forEach((x) => {
      amount += this.armor[x].getItem().stats[key] >> 0
      amount += this.armor[x].getItem().additionalstats[key] >> 0
     
    })
    for (let i = 0; i < this.accessorybag.inventory.length; i++) {
      if (this.accessorybag.inventory[i].isEmpty()) i = 10000
      else if (this.accessorybag.inventory[i].getItem().wasActivated) {
        amount += this.accessorybag.inventory[i].getItem().stats[key] >> 0
        amount += this.accessorybag.inventory[i].getItem().additionalstats[key] >> 0
      }
    }

    return amount >> 0
  }
  getTool() {
    return this.getItemInHand().type || ""
  }
  getToolTier() {
    return this.getItemInHand().tier || 0
  }
  getEnchant(key) {
    let amount = 0

    amount += this.getItemInHand().enchants[key] >> 0

    armornames.forEach((x) => {
      amount += this.armor[x].getItem().enchants[key] >> 0
    })

    return amount
  }
  getCenterCoordsArray() {
    return [this.x + this.width / 2, this.y + this.height / 2]
  }
  tp(x, y) {
    if (!isUndefined(x)) this.x = x
    if (!isUndefined(y)) this.y = y

    centerMapOnPlayer()
  }
  getDefense() {
    return this.getStat("defense") + this.getEnchant("protection") * 3
  }
  getCriticalDamage() {
    return this.getStat("criticaldamage") + this.getEnchant("critical") * 10
  }
  getMaxHealth() {
    return this.getStat("maxhealth") + this.getEnchant("growth") * 15
  }
  getMagicFindMultiplier() {
    return this.getStat("magicfind") / 100 + 1
  }
  getMagicFindChance(chance) {
    return this.getMagicFindMultiplier() * chance
  }
}
